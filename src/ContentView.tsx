import React from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { CanvasPainter } from "./components/CanvasPainter";
import VideoPlayer from "./components/VideoPlayer";
import WebcamWrapper from "./components/WebcamWrapper";
import GestureInputService from "./services/GestureInputService";
import GestureToPlayerInputMapperService from "./services/GestureToPlayerMapperService";

const StyledAppDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCanvas = styled.canvas`
  border: 1px solid gray;
`;

const StyledWebcamAndCanvasContainer = styled.div`
  display: flex;
  * {
    flex: 1;
  }
`;

const BBBStreamURL = "https://archive.org/serve/BigBuckBunny_328/BigBuckBunny_512kb.mp4";

const ContentView: React.FunctionComponent = () => {
  const webcamRef = React.createRef<Webcam>();
  const videoPlayerRef = React.createRef<VideoPlayer>();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const canvasPainterRef = React.useRef<CanvasPainter>();
  const gestureInputServiceRef = React.useRef<GestureInputService>();
  const gestureToPlayerInputMapperServiceRef = React.useRef<GestureToPlayerInputMapperService>();

  React.useEffect(() => {
    if (
      webcamRef.current?.video != null && // Webcam initialized
      videoPlayerRef.current != null && // Video player initialized
      canvasRef.current != null && // Canvas initialized
      gestureInputServiceRef.current == null
    ) {
      const videoStream = webcamRef.current.video;
      const videoPlayer = videoPlayerRef.current;

      // Instantiate components
      const gestureToPlayerInputMapperService = new GestureToPlayerInputMapperService(videoPlayer);
      const gestureInputService = new GestureInputService(videoStream);
      const canvasPainter = new CanvasPainter(canvasRef, videoPlayerRef);

      // Register observers
      gestureInputService.addObserver(gestureToPlayerInputMapperService);
      gestureInputService.addPinchingPointObserver(canvasPainter);

      // Update React references
      gestureToPlayerInputMapperServiceRef.current = gestureToPlayerInputMapperService
      gestureInputServiceRef.current = gestureInputService;
      canvasPainterRef.current = canvasPainter;
    }
  }, [webcamRef, videoPlayerRef]);

  return (
    <StyledAppDiv>
      <VideoPlayer ref={videoPlayerRef} mp4StreamURL={BBBStreamURL} width="500px" height="500px"/>
      <p>Issue player commands by pinching the index finger and thumb and draw a play or pause symbol.</p>
      <StyledWebcamAndCanvasContainer>
        <WebcamWrapper ref={webcamRef} />
        <StyledCanvas ref={canvasRef} />
      </StyledWebcamAndCanvasContainer>
    </StyledAppDiv>
  );
};
export default ContentView;
