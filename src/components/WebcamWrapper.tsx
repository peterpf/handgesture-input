import React from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: gray;
`;

const WebcamWrapper = React.forwardRef<Webcam>((props, ref) => {
  return (
    <StyledDiv>
      <Webcam width="100%" height="100%" ref={ref} mirrored={true}/>
    </StyledDiv>
  );
});

export default WebcamWrapper;
