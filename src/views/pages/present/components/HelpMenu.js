import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as Close } from "src/assets/images/svgs/cross.svg";
import qrImg from "../../../../assets/images/present/helpqr.png";

const Container = styled("div")`
  display: flex;
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
  border-bottom: ${(props) => (props.hideBorder ? "0" : "1")}px solid #ebeef1;
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

const QrImg = styled("img")`
  width: 200px;
`;

const HelpMenu = ({ onClose }) => {
  return (
    <Container>
      <CrossButtonContainer onClick={onClose}>
        <Close stroke="#000000" />
      </CrossButtonContainer>
      <RowContainer>
        <Heading>Scan for Help</Heading>
      </RowContainer>
      <RowContainer>
        <QrImg src={qrImg} alt="" />
      </RowContainer>
    </Container>
  );
};

export default HelpMenu;
