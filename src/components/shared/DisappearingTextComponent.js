import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Container = styled("div")`
  ${(props) =>
    props.fadeIn
      ? css`
          animation: ${fadeIn} ${props.timer}ms forwards;
        `
      : css`
          animation: ${fadeOut} ${props.timer}ms forwards;
        `}
  transition: opacity 3s ease-in-out;
  color: #1e2757;
  text-align: center;
  font-family: Inter;
  font-size: 42px;
  font-style: normal;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 4.3px;
`;

const DisappearingTextComponent = ({
  texts = [],
  repeat = true,
  goToNext,
  textStyle = {},
  textTimer,
  transitionTimer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (!repeat && currentIndex === texts.length - 1) return;

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          repeat
            ? (prevIndex + 1) % texts.length
            : Math.min(prevIndex + 1, texts.length - 1)
        );
        setFadeIn(true);
      }, transitionTimer); // Duration of fade-out transition
    }, transitionTimer + textTimer); // Duration of the text to display

    return () => clearInterval(interval);
  }, [texts.length, repeat, textTimer, transitionTimer, currentIndex]);

  useEffect(() => {
    if (currentIndex === texts.length - 1 && goToNext) {
      const timeout = setTimeout(() => {
        goToNext();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, texts.length, goToNext]);

  return (
    <Container timer={transitionTimer} style={{ ...textStyle }} fadeIn={fadeIn}>
      {texts[currentIndex]}
    </Container>
  );
};

export default DisappearingTextComponent;
