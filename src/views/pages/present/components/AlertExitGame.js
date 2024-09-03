import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogSubHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleGameAlert,
  toggleGameScreens,
  getSelectedModule,
  setSelectedModule,
  getPresentModules,
  resetGameLobbyPlayers,
} from "src/store/apps/present/PresentSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { MODULE_TYPE } from "../constants";
import GameAdmin from "./GameAdmin";
import GameShared from "./GameShared";
import { ChecklistActions } from "../DryRunChecklist";

const AlertExitGame = ({ heading, subheading, btn1Text, btn2Text }) => {
  const dispatch = useDispatch();
  const selectedModule = useSelector(getSelectedModule);
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(selectedModule);

  const handleClose = () => {
    dispatch(toggleGameAlert(false));
  };
  const goBackToFirstGameScreen = () => {
    if (selectedModule.name === MODULE_TYPE["evivve"]) {
      GameAdmin.Logout();
    }
    if (selectedModule.name === MODULE_TYPE["reflection"]) {
      dispatch(setSelectedModule(modules[curModuleIndex - 1]));
      ChecklistActions['openSectionByIndex'](curModuleIndex-1);
    }

    dispatch(resetGameLobbyPlayers());
    dispatch(toggleGameScreens(1));
    dispatch(toggleGameAlert(false));
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "480px",
          height: "250px",
          display: "grid",
          alignContent: "center",
        },
      }}
      onClose={handleClose}
      open={true}
    >
      <DialogHeading>{heading}</DialogHeading>
      <DialogSubHeading>{subheading}</DialogSubHeading>
      <DialogActions style={{ flexDirection: "column", gap: "20px" }}>
        <PrimaryBtn width="230px" onClick={goBackToFirstGameScreen}>
          {btn1Text}
        </PrimaryBtn>
        <SecondaryGrayBtn width="230px" onClick={handleClose}>
          {btn2Text}
        </SecondaryGrayBtn>
      </DialogActions>
    </Dialog>
  );
};

export default AlertExitGame;
