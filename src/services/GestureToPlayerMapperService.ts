import VideoPlayer from "@/components/VideoPlayer";
import { Observer } from "@/utils/observable";
import { Gesture, RecognizedGesture } from "../types/types";

enum PlaybackState {
  Playing = "play",
  Pausing = "pause",
  Unknown = "unknown"
}

const GestureResultToPlaybackState = {
  [Gesture.Play]: PlaybackState.Playing,
  [Gesture.Pause]: PlaybackState.Pausing,
  [Gesture.Unknown]: PlaybackState.Unknown,
};

const SERVICE_ID = "gesture_to_player_input_mapper_service";

class GestureToPlayerInputMapperService implements Observer<RecognizedGesture> {
  private player: VideoPlayer;
  private previous_state: PlaybackState = PlaybackState.Unknown;

  public constructor(player: VideoPlayer) {
    this.player = player
  }


  private setPlaybackState(state: PlaybackState) {
    if (state === this.previous_state) {
      return;
    }
    switch (state) {
      case PlaybackState.Pausing:
        this.player.pause();
        break;
      case PlaybackState.Playing:
        this.player.play();
        break;
      default:
        break;
    }
    this.previous_state = state;
  }

  public onData(data: RecognizedGesture): void {
    const playbackState = GestureResultToPlaybackState[data.gesture];
    this.setPlaybackState(playbackState);
  }

  public getId() {
    return SERVICE_ID;
  }

}

export default GestureToPlayerInputMapperService;
