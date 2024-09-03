import React from "react";
import styled from "@emotion/styled";
import SwitchWithLabel from "src/components/shared/SwitchWithLabel";
import { useDispatch, useSelector } from "react-redux";
import {
  getPresentModeSetting,
  toggleAutoplay,
  toggleSound,
  toggleFullScrren,
} from "src/store/apps/present/PresentSlice";
import { ReactComponent as Close } from "src/assets/images/svgs/cross.svg";

const Container = styled("div")`
  display: flex;
  width: 317px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: relative;
`;
const RowContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  align-self: stretch;
  border-bottom: 1px solid #ebeef1;
`;

const Heading = styled("div")`
  color: #0e1e2f;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: flex;
  width: 212px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const CrossButtonContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  padding: 5px;
`;

const SettingModule = ({ onClose }) => {
  const { mute, autoplay, fullScreen } = useSelector(getPresentModeSetting);
  const dispatch = useDispatch();

  return (
    <Container>
      <CrossButtonContainer onClick={onClose}>
        <Close stroke="#000000" />
      </CrossButtonContainer>
      <RowContainer>
        <Heading>Settings</Heading>
      </RowContainer>
      <RowContainer>
        <SwitchWithLabel
          value={mute}
          onChange={() => {
            dispatch(toggleSound(!mute));
          }}
          label="Mute"
        />
      </RowContainer>
      <RowContainer>
        <SwitchWithLabel
          value={autoplay}
          onChange={() => {
            dispatch(toggleAutoplay(!autoplay));
          }}
          label="Autoplay"
        />
      </RowContainer>
      <RowContainer>
        <SwitchWithLabel
          value={fullScreen}
          onChange={() => {
            dispatch(toggleFullScrren(!fullScreen));
          }}
          label="Fullscreen"
        />
      </RowContainer>
    </Container>
  );
};

export default SettingModule;
