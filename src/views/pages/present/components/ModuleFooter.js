import styled from "@emotion/styled";
import React from "react";
import { ReactComponent as NextIcon } from "src/assets/images/svgs/next.svg";
import { ReactComponent as PrevIcon } from "src/assets/images/svgs/prev.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getPresentModules,
  getSelectedModule,
  setInitialVideo,
  setSelectedModule,
  toggleGameScreens,
  toggleGameAlert,
  toggleActivationScreens,
  toggleResetPresentDialog,
  getSessionInfo,
  toggleGameEndAlert,
} from "src/store/apps/present/PresentSlice";
import {
  SecondaryBtn,
  SecondaryGrayBtn,
} from "src/components/shared/BtnStyles";
import { MODULE_TYPE } from "../constants";
import { useNavigate } from "react-router";
import GameAdmin from "./GameAdmin";
import useExitPresentMode from "src/hooks/useExitPresentMode";
import { Stack } from "@mui/material";
import { IconRotate, IconRotateClockwise } from "@tabler/icons";
import { setReviewChecklistPopup } from "../DryRunChecklistSlice";
import { ChecklistActions } from "../DryRunChecklist";

const Container = styled("div")`
  opacity: ${({ opacity }) => (opacity ? 1 : 0)};
  transition: opacity 1s;

  display: flex;
  padding: 5px;
  width: calc(100vw - 100px);
  position: absolute;
  height: 60px;
  bottom: 30px;
  left: 50px;
  justify-content: center;
  align-items: center;
`;

const NextPrevButtonContainer = styled("div")`
  display: flex;
  padding: 5px;
  width: 100%;
  height: 60px;
  /* justify-content: ${(props) =>
    props.sb ? "space-between" : "flex-end"}; */
  justify-content: space-between;
  align-items: center;
`;

let isSocket = false;

const ModuleFooter = (data) => {
  const modules = useSelector(getPresentModules);
  const sessionInfo = useSelector(getSessionInfo);
  const selectedModule = useSelector(getSelectedModule);
  const { activeScreen } = useSelector((state) => state.present.game);
  const { step } = useSelector((state) => state.present.learnerActivation);
  const dispatch = useDispatch();
  const curModuleIndex = modules.indexOf(selectedModule);
  const navigate = useNavigate();
  const exitPresentMode = useExitPresentMode();
  let opacity = data.opacity;

  const handleNextClick = (e, skipGameTest) => {
    if (skipGameTest) {
      dispatch(setSelectedModule(modules[curModuleIndex + 1]));
      ChecklistActions["openSectionByIndex"](curModuleIndex + 1);
      return;
    } else if (
      curModuleIndex >= modules.length - 1 ||
      selectedModule.name === MODULE_TYPE["debrief"]
    ) {
      exitPresentMode(e);
      return;
      //      if (sessionInfo.sessionType == 'FINAL_RUN')
      //        exitPresentMode(e);
      //      else
      //        dispatch(setReviewChecklistPopup(true));
      //      return;
    } else if (selectedModule.name === MODULE_TYPE["learner/activation"]) {
      if (step === 5) {
        return dispatch(setSelectedModule(modules[curModuleIndex + 1]));
      } else {
        return dispatch(toggleActivationScreens(step + 1));
      }
    } else if (selectedModule.name === MODULE_TYPE["evivve"]) {
      // Start Docker Game
      if (activeScreen === 3) {
        GameAdmin.CreateGame();
        console.log("START GAME");
        dispatch(toggleGameScreens(activeScreen ? activeScreen + 1 : 1));
      } else if (activeScreen === 4) {
        dispatch(toggleGameEndAlert(true));
      } else {
        dispatch(toggleGameScreens(activeScreen ? activeScreen + 1 : 1));
      }
      return;
    } else {
      dispatch(setSelectedModule(modules[curModuleIndex + 1]));
    }

    ChecklistActions["openSectionByIndex"](curModuleIndex + 1);
  };
  const handlePrevClick = () => {
    if (
      selectedModule.name === MODULE_TYPE["learner/activation"] &&
      step !== 1
    ) {
      // return dispatch(toggleActivationScreens(step - 1));
      dispatch(toggleActivationScreens(step - 1));
      ChecklistActions["openSectionByIndex"](curModuleIndex - 1);
      return;
    }
    if (selectedModule.name === MODULE_TYPE["evivve"] && activeScreen > 1) {
      dispatch(toggleGameAlert(true));
      // dispatch(toggleGameScreens(activeScreen ? activeScreen - 1 : 1));
    } else if (selectedModule.name === MODULE_TYPE["reflection"]) {
      dispatch(toggleGameAlert(true));
    } else {
      dispatch(setSelectedModule(modules[curModuleIndex - 1]));
      ChecklistActions["openSectionByIndex"](curModuleIndex - 1);
    }
  };

  const getNextButtonText = () => {
    if (selectedModule.name === MODULE_TYPE["evivve"] && activeScreen === 3) {
      return "Start Now";
    }
    if (selectedModule.name === MODULE_TYPE["evivve"] && activeScreen > 3) {
      return modules[curModuleIndex + 1].name;
    }
    if (selectedModule.name === MODULE_TYPE["reflection"]) {
      return modules[curModuleIndex + 1].name;
    }
    if (selectedModule.name === MODULE_TYPE["debrief"]) {
      return "Close";
    }

    return "Next";
  };

  const OpenPlayerConsole = (e) => {
    // console.log(window.location.origin);
    window.open(`/evivve3/game/index.html`, "_blank");
    isSocket = true;
    // e.stopPropagation();
  };

  if (!selectedModule || selectedModule?.hideFooter || modules.length < 2) {
    return null;
  }

  return (
    <Container opacity={opacity}>
      <NextPrevButtonContainer sb={curModuleIndex > 1}>
        <Stack direction="row" gap={1}>
          <SecondaryGrayBtn
            width="auto"
            color="#fff"
            onClick={() => dispatch(toggleResetPresentDialog(true))}
          >
            <IconRotate style={{ transform: "rotate(180deg)" }} />
          </SecondaryGrayBtn>

          <SecondaryGrayBtn color="#ffffff" onClick={handlePrevClick}>
            <PrevIcon height="1rem" width="1rem" />
            &nbsp;Back
          </SecondaryGrayBtn>
        </Stack>

        {sessionInfo.sessionType == "DRY_RUN" &&
          activeScreen === 1 &&
          selectedModule.name === MODULE_TYPE["evivve"] && (
            <SecondaryGrayBtn
              color="#ffffff"
              style={{ width: "initial" }}
              onClick={(e) => handleNextClick(e, true)}
            >
              Skip Game Test
            </SecondaryGrayBtn>
          )}

        {!(
          (activeScreen === 1 || activeScreen === 2) &&
          selectedModule.name === MODULE_TYPE["evivve"]
        ) && (
          <SecondaryBtn
            onClick={(e) => handleNextClick(e)}
            width={`${
              (getNextButtonText().length < 8
                ? 8
                : getNextButtonText().length) * 16
            }px`}
          >
            {getNextButtonText()}&nbsp;
            <NextIcon height="1rem" width="1rem" />
          </SecondaryBtn>
        )}

        {activeScreen === 2 &&
          selectedModule.name === MODULE_TYPE["evivve"] && (
            <SecondaryBtn onClick={(e) => OpenPlayerConsole(e)} width="200px">
              Player Console&nbsp;
              <NextIcon height="1rem" width="1rem" />
            </SecondaryBtn>
          )}
      </NextPrevButtonContainer>
    </Container>
  );
};

export { ModuleFooter, isSocket };
