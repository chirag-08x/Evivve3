import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

// components

const Container = styled("div")`
  display: flex;
  height: 116px;
  width: fit-content;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  padding: 10px;
  cursor: pointer;
  &:hover > div {
    display: ${(props) => props.showAddTime && "flex"};
  }
`;

const AddTimeContainer = styled("div")`
  display: none;
  padding: 10px;
  position: absolute;
  top: -10px;
  right: -190px;
  z-index: 10;
`;
export const AddButton = styled(Button)`
  z-index: 10;
  display: flex;
  width: 188px;
  height: 42px;
  padding: 11px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 7px;
  background: #341a5a;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26.25px;

  :hover {
    background-color: #341a5a;
  }
`;

// functions
const getTimeText = (time) => {
  let timeText = "";
  if (time > 60) {
    const min = parseInt(time / 60);
    const sec = parseInt(time % 60);
    timeText += min < 10 ? "0" + min : min;
    timeText += " : " + (sec < 10 ? "0" + sec : sec);
  } else {
    timeText = time.toString();
  }

  if (timeText <= 60) {
    if (timeText < 10) {
      return `00 : 0${timeText}`;
    } else {
      return `00 : ${timeText}`;
    }
  }

  return timeText;
};

const TimerComponent = ({
  showAddTime = false,
  onTimerEnd = () => {},
  time = 30,
  textComponent: TextComponent = ({ text }) => <span>{text}</span>,
  onTimerTick = () => {},
}) => {
  const [curTime, setCurTime] = useState(time);
  const [showAddTimeButton, setShowAddButton] = useState(false);

  useEffect(() => {
    if (curTime <= 0) {
      if (onTimerEnd) {
        onTimerEnd();
      }
    }
  }, [curTime, onTimerEnd]);

  useEffect(() => {
    if (curTime <= 0) {
      return;
    }
    const timeOut = setTimeout(() => {
      setCurTime(curTime - 1);
      onTimerTick(curTime - 1);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [curTime, onTimerTick]);

  return (
    <Container showAddTime={showAddTime}>
      <TextComponent text={getTimeText(curTime)} />
      <AddTimeContainer onClick={() => setCurTime(curTime + 60)}>
        <AddButton>+1 Minute</AddButton>
      </AddTimeContainer>
    </Container>
  );
};

export default TimerComponent;
