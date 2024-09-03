import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { CustomizeLabel } from "src/views/pages/programs/components/customize/CustomizeStyles";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedProgram } from "src/store/apps/programs/ProgramSlice";
import { Tooltip } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

const TimeWrapper = styled("div")`
  width: 100%;
`;

const TimeInnerWrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #dfe5ef;
  color: black;
  padding: 0 4rem;
  height: 168px;
  border-radius: 7px;
  /* width: max-content; */
  /* width: 100%; */
  margin: 0 auto;
  margin-top: 0.5rem;
`;

const TimeValueWrapper = styled("div")`
  text-align: center;
  display: grid;
  align-items: center;
  position: relative;
`;

const TimeSecValue = styled("h1")`
  margin: 0;
  font-size: 6.6rem;
`;

const TimeBtns = styled("button")`
  background: none;
  cursor: pointer;
  border: none;
  outline: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  &:first-of-type {
    top: 0;
    transform: translate(-50%, -20%);
  }
  &:last-of-type {
    bottom: 0;
    transform: translate(-50%, 20%);
  }
  * {
    font-size: 2rem;
  }
`;

const TimerInput = ({ minutes, title, setNewTime, timeType, info, owner }) => {
  const [mins, setMins] = useState(minutes);

  // const owner = (useSelector(getSelectedProgram)).owner;

  useEffect(() => {
    setNewTime(mins, timeType);
  }, [mins]);

  const toggleTime = (e, nat) => {
    e.preventDefault();
    let newMins = mins;

    if (nat === "inc") {
      newMins += 1;
    } else {
      newMins -= 1;
    }

    if (newMins === 0 || newMins === 100) return;

    setMins(newMins);
  };

  return (
    <TimeWrapper>
      <span>
        <CustomizeLabel mb="0.5rem">{title}</CustomizeLabel>
        <Tooltip placement="right" title={info}><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray", marginBottom: "-4px"}}/></Tooltip>
      </span>
      <TimeInnerWrapper>
        <TimeValueWrapper>
        {owner && <TimeBtns onClick={(e) => toggleTime(e, "inc")}>
            <KeyboardArrowUpOutlinedIcon />
          </TimeBtns>}
          <TimeSecValue>{mins}</TimeSecValue>
          {owner && <TimeBtns onClick={(e) => toggleTime(e, "dec")}>
            <KeyboardArrowDownOutlinedIcon />
          </TimeBtns>}
        </TimeValueWrapper>
      </TimeInnerWrapper>
    </TimeWrapper>
  );
};

export default TimerInput;
