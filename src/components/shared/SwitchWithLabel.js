import styled from "@emotion/styled";
import React from "react";

const SwitchBackground = styled("div")`
  display: flex;
  width: 30px;
  height: 16px;
  padding-right: 2px;
  padding-left: 2px;
  justify-content: ${(props) => (props.active ? "flex-end" : "flex-start")};
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: ${(props) => (props.active ? "#341A5A" : "#CACACA")};
  transition: all 0.5s ease;
`;

const SwitchButton = styled("div")`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 2px;
  background: #fff;
`;

export const Switch = ({ active = false, onChange = () => {} }) => {
  return (
    <SwitchBackground active={active} onClick={onChange}>
      <SwitchButton />
    </SwitchBackground>
  );
};

const SwitchContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const SwitchLabel = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
  overflo: hidden;
  text-overflow: ellipsis;
  color: #0e1e2f;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const SwitchWithLabel = ({
  value = false,
  onChange = () => {},
  label = "",
}) => {
  return (
    <SwitchContainer>
      <SwitchLabel>{label}</SwitchLabel>
      <Switch active={value} onChange={onChange} />
    </SwitchContainer>
  );
};

export default SwitchWithLabel;
