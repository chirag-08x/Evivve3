import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "react-redux";
import { getSelectedModule } from "src/store/apps/present/PresentSlice";
import SwitchModule from "./SwitchModule";

const Container = styled("div")`
  display: flex;
  padding: 60px 10px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ModuleBody = () => {
  const module = useSelector(getSelectedModule);

  return (
    <Container>
      {module?.name && <SwitchModule type={module?.name} />}
    </Container>
  );
};

export default ModuleBody;
