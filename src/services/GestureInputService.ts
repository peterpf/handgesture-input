import VideoPlayer from "@/components/VideoPlayer";
import GestureProcessor from "@/gestures/types";
import PinchingGestureProcessor from "../gestures/PinchingGestureProcessor";

class GestureInputService {
  private player: VideoPlayer;
  private videoStream: HTMLVideoElement;
  private gestureProcessor: GestureProcessor;

  public constructor(player: VideoPlayer, videoStream: HTMLVideoElement) {
    this.player = player;
    this.videoStream = videoStream;
    // Replace the `gestureProcessor` with any instance implementing the GestureProcessor interface.
    this.gestureProcessor = new PinchingGestureProcessor();

    // TODO: notify the gestureProcessor once a hand is detected.
    //this.gestureProcessor.handleHands([]);
  }
}

export default GestureInputService;
