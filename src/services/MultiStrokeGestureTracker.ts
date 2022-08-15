import { Point } from "@/dollar/types";
import { Observable } from "@/utils/observable";
import * as DollarUtils from "@/dollar/utils";
import { Point2D } from "@/types/types";


//#region Configuration

/**
* Minimum number of points required for gesture estimation.
*/
const minPointsForGestureEstimation = 10; // avg 30 frames per second, a gesture input should take at least 0.8 seconds.

/**
* Time (seconds) between pinching gestures which still counts as one "big" gesture (multistroke gesture).
*/
const timeoutForContinueingGestureInSeconds = 1.5;
//#endregion

class MultiStrokeGestureTracker extends Observable<Point[]> {
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

  public constructor(){
    super("multi_stroke_gesture_tracker");
  }

  /**
   * Clear timeout for multi-stroke recognition.
   */
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
      // TODO: Interpolate points for each stroke and run the gesture recognition
      const interpolatedPoints = DollarUtils.interpolateArray(this.points, 10);
      this.notifyObservers(interpolatedPoints);
      this.reset();
    }, timeoutForContinueingGestureInSeconds * 1000);
  }

  /**
   * Add a new point to the current stroke.
   * @param point The point to add.
   */
  public addPoint(point: Point2D): void {
    this.startMultiStrokeGestureTimeout();
    this.points.push(new Point(point.x, point.y, this.currentStrokeIndex));
  }

  /**
   * Call this method to start a new stroke of the gesture.
   */
  public startNewStroke() {
    // Check that we don't start a new stroke if the currentStrokeIndex has not been used before.
    if (this.points.length > 0 && this.points[this.points.length - 1].strokeId !== this.currentStrokeIndex) {
      return;
    }
    this.currentStrokeIndex++;
  }
}

export default MultiStrokeGestureTracker;
