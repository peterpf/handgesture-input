import React, { useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import VideoElementWrapper from "./components/VideoElementWrapper";
import WebcamWrapper from "./components/WebcamWrapper";

const StyledAppDiv = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
`;

const ContentView: React.FunctionComponent = () => {
  const webcamRef = React.createRef<Webcam>();
  useEffect(() => {
    if (webcamRef.current != null) {
      const videoStream = webcamRef.current.video;
      // TODO: Feed video stream to pose detector
    }
  }, [webcamRef]);

  return (
    <StyledAppDiv>
      <VideoElementWrapper mp4StreamURL="https://archive.org/serve/BigBuckBunny_328/BigBuckBunny_512kb.mp4" />
      <WebcamWrapper ref={webcamRef} />
    </StyledAppDiv>
  );
};
export default ContentView;
