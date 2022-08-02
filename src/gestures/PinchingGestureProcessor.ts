import GestureProcessor, { HandInput } from "./types";

class PinchingGestureProcessor implements GestureProcessor {
  public handleHands(hands: HandInput[]): void {
    throw new Error("Method not implemented.");
  }
}

export default PinchingGestureProcessor;

