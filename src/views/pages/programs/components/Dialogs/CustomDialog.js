import React from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogActions,
  DialogSubHeading,
} from "src/components/shared/DialogComponents";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";

const CustomDialog = ({
  open,
  heading = "",
  subheading = "",
  btn1Text = "",
  btn2Text = "",
  onConfirm = () => {},
  discard = () => {},
  onClose = () => {},
  img = null,
  w = "",
}) => {
  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "420px",
          display: "grid",
          placeContent: "center",
        },
      }}
      onClose={onClose}
      open={open}
    >
      {heading && <DialogHeading>{heading}</DialogHeading>}
      {subheading && <DialogSubHeading>{subheading}</DialogSubHeading>}
      {img && (
        <img
          src={img}
          alt="QR"
          width={w}
          style={{
            margin: "0 auto",
          }}
        />
      )}
      <DialogActions style={{ flexDirection: "column", gap: "15px" }}>
        {btn1Text && (
          <PrimaryBtn width="188px" onClick={onConfirm}>
            {btn1Text}
          </PrimaryBtn>
        )}
        {btn2Text && (
          <SecondaryGrayBtn width="188px" onClick={discard}>
            {btn2Text}
          </SecondaryGrayBtn>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
