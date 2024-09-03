import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import {
    getSelectedProgram,
  toggleAdjustContextDialog,
  toggleCustomizeDialog,
  toggleParticipantsDialog,
  toggleUnsavedChangesDialog,
} from "src/store/apps/programs/ProgramSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";

const OpenUnsavedChangesDialog = () => {
  const open = useSelector((state) => state.programs.showUnsavedChangesDialog);
  const dispatch = useDispatch();

  const owner = (useSelector(getSelectedProgram)).owner;

  const discardChanges = () => {
    dispatch(toggleUnsavedChangesDialog(false));
    dispatch(toggleCustomizeDialog(false));
    dispatch(toggleAdjustContextDialog({ showDialog: false, showBtn: false }));
    dispatch(toggleParticipantsDialog(false));
  };

  const ownerDiscardView = () => {
    dispatch(toggleUnsavedChangesDialog(false));
    dispatch(toggleCustomizeDialog(false));
  };

  const continueEditing = () => {
    dispatch(toggleUnsavedChangesDialog(false));
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "420px",
          height: "215px",
          display: "grid",
          placeContent: "center",
        },
      }}
      open={open}
    >
      { owner ? <>
      <DialogHeading>Unsaved Changes</DialogHeading>
      <DialogActions style={{ flexDirection: "column", gap: "15px" }}>
        <PrimaryBtn width="188px" onClick={continueEditing}>
          Continue Editing
        </PrimaryBtn>
        <SecondaryGrayBtn width="188px" onClick={discardChanges}>
          Discard Changes
        </SecondaryGrayBtn>
      </DialogActions>
    </> :
    <PrimaryBtn width="188px" onClick={ownerDiscardView}>
      Close
    </PrimaryBtn>}
    </Dialog>
  );
};

export default OpenUnsavedChangesDialog;
