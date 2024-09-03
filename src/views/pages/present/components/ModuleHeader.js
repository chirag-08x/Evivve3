import React, { useState } from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import {
  getModuleProgress,
  getPresentModules,
  getSelectedModule,
} from "src/store/apps/present/PresentSlice";
import { MODULE_TYPE } from "../constants";
import ProgressBar from "src/components/shared/ProgressBar";

// components

const Container = styled("div")`

  opacity: ${({ opacity }) => (opacity ? 1 : 0)};
  transition: opacity 1s;
  
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  padding: 8px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ModuleGroupContainer = styled("div")`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModuleNameContainer = styled("div")`
  display: flex;
  width: ${(props) => props.width || "286px"};
  min-width: 286px;
  height: 31px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 24.5px;
  margin-bottom: 10px;
`;

const ModuleHeader = (data) => {
  const [isHover, setIsHover] = useState(false);
  const modules = useSelector(getPresentModules);
  const module = useSelector(getSelectedModule);
  const moduleProgress = useSelector(getModuleProgress);
  let opacity = data.opacity;

  const getHeaderMessageToShow = () => {
    if (module.name === MODULE_TYPE["learner/activation"]) {
      return "Activation";
    } else if (module.name === MODULE_TYPE["evivve"]) {
      return "Evivve";
    }
    return module?.name;
  };

  const handleMouseEnter = () => {
    if (modules?.length >= 2) setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const getCurrentProgressValue = () => {
    const curModuleIndex = modules.indexOf(module);
    const modProgress = 100 / (modules.length - 1);
    const additionalProgress = moduleProgress * (modProgress / 100);

    return (curModuleIndex - 1) * modProgress + additionalProgress;
  };

  if (!module || module?.hideHeader) {
    return null;
  }

  return (
    <Container onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} opacity={opacity}>
      {isHover ? (
        <>
          <ModuleGroupContainer>
            {modules?.length &&
              modules
                .filter((mod) => mod.name !== MODULE_TYPE["loading_module"])
                ?.map(({ name, type }) => {
                  let updatedName = "";
                  if (name === MODULE_TYPE["learner/activation"]) {
                    updatedName = "Activation";
                  } else if (name === MODULE_TYPE["evivve"]) {
                    updatedName = "Evivve";
                  }
                  return (
                    <ModuleNameContainer
                      width={100 / (modules?.length - 1) + "vw"}
                      key={name}
                    >
                      {updatedName || name}
                    </ModuleNameContainer>
                  );
                })}
          </ModuleGroupContainer>
          <ProgressBar width="100vw" value={getCurrentProgressValue()} />
        </>
      ) : (
        <>
          <ModuleNameContainer>{getHeaderMessageToShow()}</ModuleNameContainer>
          <ProgressBar width="80vh" value={moduleProgress} />
        </>
      )}
    </Container>
  );
};

export default ModuleHeader;
