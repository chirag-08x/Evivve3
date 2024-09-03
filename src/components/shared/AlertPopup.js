import React from "react";
import styled from "@emotion/styled";
import { PrimaryBtn, PrimaryBtn2 } from "./BtnStyles";
import { ReactComponent as Close } from "src/assets/images/svgs/cross.svg";

const Container = styled("div")`
  display: flex;
  max-width: 440px;
  min-width: 300px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: relative;
`;
const RowContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  align-self: stretch;
  width: 100%;
  gap: 20px;
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
const Divider = styled("div")`
  display: flex;
  width: 100%;
  height: 1px;
  background: #ebeef1;
  margin: 10px 0px 10px 0px;
  align-self: stretch;
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
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Message = styled("span")`
  color: #667085;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

const AlertPopup = ({
  message = "",
  headerText = "Alert",
  headerDivider = false,
  buttonConfig = {
    primary: {
      text: "Confirm",
      onClick: null, // optional if you want get call back
    },
    secondary: {
      text: "Cancel",
      onClick: null, // optional if you want get call back
    },
  },
  onClose,
}) => {
  return (
    <Container>
      <CrossButtonContainer onClick={onClose}>
        <Close stroke="#000000" />
      </CrossButtonContainer>
      <RowContainer>
        <Heading>{headerText}</Heading>
      </RowContainer>
      {headerDivider && <Divider />}
      <RowContainer>
        <Message>{message}</Message>
      </RowContainer>
      <RowContainer>
        <PrimaryBtn2
          width="134px"
          onClick={() => {
            if (buttonConfig?.secondary?.onClick) {
              buttonConfig.secondary.onClick();
            }
          }}
        >
          {buttonConfig?.secondary?.text || "Cancel"}
        </PrimaryBtn2>
        <PrimaryBtn
          width="134px"
          onClick={(e) => {
            if (buttonConfig?.primary?.onClick) {
              buttonConfig.primary.onClick(e);
            }
          }}
        >
          {buttonConfig?.primary?.text || "Confirm"}
        </PrimaryBtn>
      </RowContainer>
    </Container>
  );
};

export default AlertPopup;
