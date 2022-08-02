import React, { useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: gray;
`;

interface Props {
  onLoaded?: (webcam: Webcam) => void;
}

const WebcamWrapper: React.FunctionComponent<Props> = ({ onLoaded }: Props) => {
  const webcamRef = React.useRef(null);
  useEffect(() => {
    if (webcamRef?.current != null && onLoaded != null) {
      onLoaded(webcamRef.current);
    }
  }, [onLoaded, webcamRef]);
  return (
    <StyledDiv>
      <Webcam width="100%" height="100%" ref={webcamRef} />
    </StyledDiv>
  );
};

export default WebcamWrapper;
