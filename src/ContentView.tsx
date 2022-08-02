import React, { useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import VideoPlayer from "./components/VideoPlayer";
import WebcamWrapper from "./components/WebcamWrapper";

const StyledAppDiv = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
`;

const BBBStreamURL = "https://archive.org/serve/BigBuckBunny_328/BigBuckBunny_512kb.mp4";

const ContentView: React.FunctionComponent = () => {
  const webcamRef = React.createRef<Webcam>();
  const videoPlayerRef = React.createRef<VideoPlayer>();

  useEffect(() => {
    if (webcamRef.current != null && videoPlayerRef.current != null) {
      const videoStream = webcamRef.current.video;
      const videoPlayer = videoPlayerRef.current;
      videoPlayer.play();
      // TODO: Feed video stream to pose detector
    }
  }, [webcamRef, videoPlayerRef]);

  return (
    <StyledAppDiv>
      <VideoPlayer ref={videoPlayerRef} mp4StreamURL={BBBStreamURL} />
      <WebcamWrapper ref={webcamRef} />
    </StyledAppDiv>
  );
};
export default ContentView;
