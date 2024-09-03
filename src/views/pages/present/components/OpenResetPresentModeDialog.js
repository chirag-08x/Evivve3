import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogSubHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleGameScreens,
  getSelectedModule,
  setSelectedModule,
  getPresentModules,
  resetGameLobbyPlayers,
  toggleResetPresentDialog,
  setInitialVideo,
  toggleActivationScreens,
  setGameLobby,
} from "src/store/apps/present/PresentSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { MODULE_TYPE } from "../constants";
import GameAdmin from "./GameAdmin";

const OpenResetPresentModeDialog = () => {
  const dispatch = useDispatch();
  const selectedModule = useSelector(getSelectedModule);
  const modules = useSelector(getPresentModules);
  const open = useSelector((state) => state.present.showResetPresentDialog);
  const { activeScreen } = useSelector((state) => state.present.game);

  const handleClose = () => {
    dispatch(toggleResetPresentDialog(false));
  };

  const goBackToFirstGameScreen = () => {
    if (selectedModule.name === MODULE_TYPE["evivve"] && activeScreen > 1) {
      GameAdmin.Logout();
    }
    dispatch(setSelectedModule(modules[0]));
    dispatch(setInitialVideo());
    dispatch(toggleActivationScreens(1));
    dispatch(toggleGameScreens(1));
    dispatch(setGameLobby(false));
    dispatch(resetGameLobbyPlayers());
    handleClose();
  };

  const getSubheaderText = () => {
    if (selectedModule?.name === MODULE_TYPE["evivve"] && activeScreen > 1) {
      return "Performing this action will end this game and restart your program.";
    }
    return "Performing this action will restart your program.";
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
          height: "260px",
          display: "grid",
          alignContent: "center",
        },
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogHeading>Are you Sure?</DialogHeading>
      <DialogSubHeading>{getSubheaderText()}</DialogSubHeading>
      <DialogActions style={{ flexDirection: "column", gap: "12px" }}>
        <PrimaryBtn width="230px" onClick={goBackToFirstGameScreen}>
          Restart
        </PrimaryBtn>
        <SecondaryGrayBtn width="230px" onClick={handleClose}>
          Continue
        </SecondaryGrayBtn>
      </DialogActions>
    </Dialog>
  );
};

export default OpenResetPresentModeDialog;
