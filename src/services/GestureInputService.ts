import { Observable, Observer } from "@/utils/observable";
import { HandInput, Point2D, RecognizedGesture } from "../types/types";
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { Point } from "@/dollar/types";
import { Hand } from "@tensorflow-models/hand-pose-detection";
import Recognizer from "@/dollar/recognizer";
import { mapPredefinedGestureToGesture, predefinedGestures } from "./PredefinedGestures";
import MultiStrokeGestureTracker from "./MultiStrokeGestureTracker";
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
//#endregion

/**
 * Service responsible for processing the webcam feed
 * and recognizing the given gestures (defined by the gestureProcessors).
 */
class GestureInputService extends Observable<RecognizedGesture> implements Observer<Point[]> {
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

  private multiStrokeGestureTracker: MultiStrokeGestureTracker;

  private pinchingPointsObservers: Array<Observer<Point2D> & { reset: () => void }>;

  public constructor(videoStream: HTMLVideoElement) {
    super("gesture_input_service");
    this.videoStream = videoStream;
    this.recognizer = new Recognizer(predefinedGestures);
    this.pinchingPointsObservers = [];
    this.multiStrokeGestureTracker = new MultiStrokeGestureTracker();
    this.multiStrokeGestureTracker.addObserver(this);
    this.initHandDetection();
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
  private async initHandDetection() {
    const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: '/', // ensure that 'base/node_modules/@mediapipe/hands' is defined as Vite's public folder
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

  /**
   * Register a new pinching-point observer.
   * @param obs The observer to add.
   */
  public addPinchingPointObserver(obs: Observer<Point2D> & { reset: () => void }) {
    this.pinchingPointsObservers.push(obs);
  }

  /**
   * Checks for a pinching gesture and if applicable returns the center point.
   * @param hand The hand to check pinching.
   * @param strokeId For multi-stroke gestures this id indicates the current stroke.
   * @returns The center point of the pinching gesture, otherwise undefined.
   */
  private checkPinchingPoint(hand?: Hand): Point2D | undefined {
    if (hand == null) {
      return undefined;
    }
    const indexFingerKeypoint = hand.keypoints[4];
    const thumbKeypoint = hand.keypoints[8];

    const distance = euclideanDistance(indexFingerKeypoint, thumbKeypoint);
    if (distance <= thresholdForPinchingGesture) {
      const x = (indexFingerKeypoint.x + thumbKeypoint.x) / 2;
      const y = (indexFingerKeypoint.y + thumbKeypoint.y) / 2;
      return { x, y };
    }
    return undefined;
  }

  /**
   * Notify pinchingPoint observers about a new data point.
   * @param point Point to track.
   */
  private notifyPinchingPointObservers(point: Point2D) {
    for (let obs of this.pinchingPointsObservers) {
      obs.onData(point);
    }
  }

  /**
   * Notify pinching point observers about a gesture-reset, meaning
   * - the timeout ran out
   * - a gesture has been found
   */
  private notifyPinchingPointObserversAboutReset() {
    for (let obs of this.pinchingPointsObservers) {
      obs.reset();
    }
  }

  /**
   * Callback method to handle hand-pose updates.
   * Checks for a pinching-gesture (thumb and index finger are touching) of the right hand and forwards this to the multi-stroke-gesture recognizer.
   * When the `multiStrokeGestureTimeout` runs out, reset the multi-stroke-gesture tracker.
   * @param hands The hands object which contains the detected hands (or none).
   */
  private onHandGesture(hands: HandInput): void {
    // Find the right-hand for checking gestures.
    const primaryHand = hands.find(h => h.handedness === 'Right');

    if (primaryHand == null) {
      return;
    }

    const pinchingPoint = this.checkPinchingPoint(primaryHand);
    if (pinchingPoint == null) {
      this.multiStrokeGestureTracker.startNewStroke();
    } else {
      this.multiStrokeGestureTracker.addPoint(pinchingPoint);
      this.notifyPinchingPointObservers(pinchingPoint);
    }
  }

  /**
   * Callback function of the MultiStrokeGestureTracker when a gesture is seen as "completed".
   * Notifies the gesture observers about new results.
   * @param points Interpolated points.
   */
  public onData(points: Point[]): void {
    const result = this.recognizer.recognize(points);
    const recognizedGesture: RecognizedGesture = {
      confidenceScore: result.score,
      gesture: mapPredefinedGestureToGesture(result.name)
    };
    this.notifyObservers(recognizedGesture);
    this.notifyPinchingPointObserversAboutReset();
  }
}

export default GestureInputService;
