import { Point } from "@/dollar/types";
import { Observer } from "@/utils/observable";
import { Hand } from "@tensorflow-models/hand-pose-detection";

export enum Gesture {
  Play = 'play',
  Pause = 'pause',
  Unknown = 'unknown'
}

export interface RecognizedGesture {
  readonly gesture: Gesture;
  /**
   * A number between 0 (unsure) to 1 (very sure) for the given gesture indicating the estimation's confidence.
   */
  readonly confidenceScore: number;
}

export interface GestureHandler {
  onGesture(data: RecognizedGesture): void;
}

export type HandInput = Array<Hand>;

export type GestureProcessor = Observer<Point[]>
