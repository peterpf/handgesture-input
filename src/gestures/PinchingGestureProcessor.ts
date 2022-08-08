import Recognizer from "@/dollar/recognizer";
import { Point } from "@/dollar/types";
import { GestureProcessor, RecognizedGesture } from "@/types/types";
import { Observable } from "@/utils/observable";

const PROCESSOR_ID = "pinching_gesture_processor";

class PinchingGestureProcessor extends Observable<RecognizedGesture> implements GestureProcessor {
  private recognizer: Recognizer = new Recognizer();

  public constructor() {
    super(PROCESSOR_ID)
  }

  public onData(points: Point[]): void {
  }

  public getId() {
    return PROCESSOR_ID;
  }
}

export default PinchingGestureProcessor;

