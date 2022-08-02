import { Hand } from "@tensorflow-models/hand-pose-detection";

export type HandInput = Hand;

interface GestureProcessor {
  handleHands(hands: HandInput[]): void;
}

export default GestureProcessor;
