import React from "react";

interface Props {
  readonly mp4StreamURL: string;
}

const VideoElementWrapper: React.FunctionComponent<Props> = ({mp4StreamURL: streamURL}: Props) => {
  return (
    <video width="100%" height="100%" controls>
      <source type="video/mp4" src={streamURL} />
    </video>
  )
}
export default VideoElementWrapper;
