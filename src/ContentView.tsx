import styled from "styled-components";
import VideoElementWrapper from "./components/VideoElementWrapper";
import WebcamWrapper from "./components/WebcamWrapper";

const StyledAppDiv = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
`;

const ContentView: React.FunctionComponent = () => {
  return (
    <StyledAppDiv>
      <VideoElementWrapper mp4StreamURL="https://archive.org/serve/BigBuckBunny_328/BigBuckBunny_512kb.mp4" />
      <WebcamWrapper />
    </StyledAppDiv>
  );
}
export default ContentView;
