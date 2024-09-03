import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogSubHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleProgramReadyDialog,
  togglePrsentModeDialog,
  getCurrentTemplate,
} from "src/store/apps/programs/ProgramSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";

const ProgramReadyDialog = () => {
  const open = useSelector((state) => state.programs.showPrgramReadyDialog);
  const dispatch = useDispatch();
  const currentTemplate = useSelector(getCurrentTemplate);

  const handleClose = () => {
    dispatch(toggleProgramReadyDialog(false));
  };

  const openPresentMode = () => {
    handleClose();
    dispatch(togglePrsentModeDialog(true));
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "496px",
          height: "280px",
        },
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogHeading>Your Program Is Ready!</DialogHeading>
      <DialogSubHeading>
      We've crafted a game-based learning program tailored to your preferences and objectives on{" "}
        {currentTemplate?.displayName}
      </DialogSubHeading>
      <DialogActions style={{ flexDirection: "column", gap: "20px" }}>
        <PrimaryBtn width="200px" onClick={openPresentMode}>
          Dry Run
        </PrimaryBtn>
        <SecondaryGrayBtn onClick={handleClose} width="188px">
          View Program
        </SecondaryGrayBtn>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramReadyDialog;
