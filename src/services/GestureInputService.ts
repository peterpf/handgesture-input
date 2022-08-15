import { Observable } from "@/utils/observable";
import { HandInput, RecognizedGesture } from "../types/types";
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as DollarUtils from "@/dollar/utils";
import { Point } from "@/dollar/types";
import { Hand } from "@tensorflow-models/hand-pose-detection";
import Recognizer from "@/dollar/recognizer";
import { mapPredefinedGestureToGesture, predefinedGestures } from "./PredefinedGestures";
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';

//#region Utils
const euclideanDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
//#endregion

//#region Configuration
/**
* Distance between the tips of the index finger and thumb to count as pinching gesture.
*/
const thresholdForPinchingGesture = 20;

/**
* Minimum number of points required for gesture estimation.
*/
const minPointsForGestureEstimation = 10; // avg 30 frames per second, a gesture input should take at least 0.8 seconds.

/**
* Time (seconds) between pinching gestures which still counts as one "big" gesture (multistroke gesture).
*/
const timeoutForContinueingGestureInSeconds = 1.5;
//#endregion

/**
 * Service responsible for processing the webcam feed
 * and recognizing the given gestures (defined by the gestureProcessors).
 */
class GestureInputService extends Observable<RecognizedGesture> {
  /**
   * The video stream source.
   */
  private videoStream: HTMLVideoElement;
  /**
   * The gesture recognizer which matches incoming point clouds to pre-defined gesture point-clouds.
   */
  private recognizer: Recognizer;
  /**
   * Hand detection algorithm which extracts hand poses from the webcam feed.
   */
  private detector: handPoseDetection.HandDetector | undefined;
  /**
   * A gesture may consist of multiple strokes, where each stroke has its own ID.
   * This variable keeps track of the current stroke ID.
   */
  private currentStrokeIndex = 0;
  /**
   * Points of the currently tracked gesture.
   */
  private points: Point[] = [];
  /**
   * Timeout to detect when a gesture ends.
   */
  private multiStrokeGestureTimeoutId: ReturnType<typeof setTimeout> | undefined;
  /**
   * Helper variable to detect mutliple strokes for a single gesture.
   */
  private hasAddedStrokeInPreviousCall: boolean = false;

  public constructor(videoStream: HTMLVideoElement) {
    super("gesture_input_service");
    this.videoStream = videoStream;
    this.recognizer = new Recognizer(predefinedGestures);
    this.init();
  }

  /**
   * Continuously listen to new webcam data and run the hand detection algorithm.
   * Then forward the hand positions to the gesture processors.
   * This method recursively calls itself.
   */
  private async listenToWebcamFeed() {
    const hands = await this.detector!.estimateHands(this.videoStream, { flipHorizontal: true });
    this.onHandGesture(hands);
    // Recursively call the method to continuously predict the image content
    window.requestAnimationFrame(() => { this.listenToWebcamFeed() });
  }

  /**
   * Load required files and initialize the hand detection model.
   */
  public async init() {
    const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'base/node_modules/@mediapipe/pose',
      maxHands: 1
    };
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    this.detector = await handPoseDetection.createDetector(model, detectorConfig);

    // Start listening to the webcam feed
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    this.videoStream.srcObject = stream;
    this.videoStream.addEventListener('loadeddata', () => {
      this.listenToWebcamFeed();
    });
  }

  private clearMultiStrokeGestureTimeout() {
    if (this.multiStrokeGestureTimeoutId != null) {
      clearTimeout(this.multiStrokeGestureTimeoutId);
      this.multiStrokeGestureTimeoutId = undefined;
    }
  }

  /**
   * Reset variables for the multi-stroke recognition.
   */
  private reset() {
    this.currentStrokeIndex = 0;
    this.hasAddedStrokeInPreviousCall = false;
    this.points = [];
    this.clearMultiStrokeGestureTimeout();
  }

  /**
   * Start a timeout to allow a brief pause between strokes.
   * If the pause is not used for starting another draw, the points are reset.
   */
  private async startMultiStrokeGestureTimeout() {
    this.clearMultiStrokeGestureTimeout();

    this.multiStrokeGestureTimeoutId = setTimeout(() => {
      if (this.points.length < minPointsForGestureEstimation) {
        // Not enough points to make a meaningful estimation.
        return;
      }
      // Interpolate points for each stroke and run the gesture recognition
      const interpolatedPoints = DollarUtils.interpolateArray(this.points, 10);
      const gestureResult = this.recognizer.recognize(interpolatedPoints);
      this.notifyObservers({ confidenceScore: gestureResult.score, gesture: mapPredefinedGestureToGesture(gestureResult.name) });
      this.reset();
    }, timeoutForContinueingGestureInSeconds * 1000);
  }

  /**
   * Checks for a pinching gesture and if applicable returns the center point.
   * @param hand The hand to check pinching.
   * @param strokeId For multi-stroke gestures this id indicates the current stroke.
   * @returns The center point of the pinching gesture, otherwise undefined.
   */
  private checkPinchingGesture(hand: Hand, strokeId: number): Point | undefined {
    const indexFingerKeypoint = hand.keypoints[4];
    const thumbKeypoint = hand.keypoints[8];

    const distance = euclideanDistance(indexFingerKeypoint, thumbKeypoint);
    if (distance <= thresholdForPinchingGesture) {
      const x = (indexFingerKeypoint.x + thumbKeypoint.x) / 2;
      const y = (indexFingerKeypoint.y + thumbKeypoint.y) / 2;
      return new Point(x, y, strokeId);
    }
    return undefined;
  }


  private onHandGesture(hands: HandInput) {
    // Find the right-hand for checking gestures.
    const primaryHand = hands.find(h => h.handedness === 'Right');

    // There are no points to add if there is no hand.
    if (primaryHand == null) {
      this.hasAddedStrokeInPreviousCall = false;
      return;
    }

    // Restart the gesture timeout.
    this.startMultiStrokeGestureTimeout();

    const pinchingPoint = this.checkPinchingGesture(primaryHand, this.currentStrokeIndex);
    if (pinchingPoint == null) {
      // We are not pinching anymore, this could mean:
      // 1. we want to add another stroke,
      // 2. or the gesture is complete.
      if (this.hasAddedStrokeInPreviousCall) {
        this.hasAddedStrokeInPreviousCall = false;
        this.currentStrokeIndex++;
      }
    } else {
      this.points.push(pinchingPoint);
      this.hasAddedStrokeInPreviousCall = true;
    }
  }
}

export default GestureInputService;
