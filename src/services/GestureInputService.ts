import VideoPlayer from "@/components/VideoPlayer";

class GestureInputService {
  private player: VideoPlayer;
  private videoStream: HTMLVideoElement;

  public constructor(player: VideoPlayer, videoStream: HTMLVideoElement) {
    this.player = player;
    this.videoStream = videoStream;
  }
}

export default GestureInputService;
