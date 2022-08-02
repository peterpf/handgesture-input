import React from "react";

interface Props {
  readonly mp4StreamURL: string;
}

/**
 * VideoPlayer is a wrapper around the HTML video element.
 */
class VideoPlayer extends React.Component<Props> {
  private videoElementRef = React.createRef<HTMLVideoElement>();

  public play() {
    if (this.videoElementRef?.current != null) {
      this.videoElementRef.current.play();
    }
  }

  public pause() {
    if (this.videoElementRef?.current != null) {
      this.videoElementRef.current.pause();
    }
  }

  public render(): React.ReactNode {
    return (
      <video
        ref={this.videoElementRef} width="100%" height="100%" muted controls>
        <source type="video/mp4" src={this.props.mp4StreamURL} />
      </video>
    );
  }
}
export default VideoPlayer;
