import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Box,
  Stack,
  DialogActions,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IconArrowLeft } from "@tabler/icons";

import { CheckCircle } from "@mui/icons-material";
import {
  DialogHeading,
  DialogSubHeading,
} from "src/components/shared/DialogComponents";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { useAutoFixFree } from "./PaymentsService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedProgram } from "src/store/apps/programs/ProgramSlice";
import { useParams } from "react-router";
import { getScheduleInfo, setEvivveFreeCheck } from "./SchedulerSlice";
import queryClient from "src/utils/queryClient";

const RequiredChangeBox = ({ name, description, isOkay, isAuto, onUpdate }) => {
  return (
    <div
      style={{
        border: `1px solid ${isOkay ? "lightgray" : "#D0312D"}`,
        color: isOkay ? "black" : "#D0312D",
        background: isOkay ? "transparent" : "#D0312D10",
        borderRadius: "4px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
        {name}
        <Box
          component="span"
          sx={{ display: "block", fontWeight: 400, fontSize: "14px" }}
        >
          {description}
        </Box>
      </Typography>
      <div style={{ display: "flex" }}>
        {isOkay ? (
          <CheckCircle style={{ color: "darkgreen" }} />
        ) : (
          <Button
            style={{
              textTransform: "capitalize",
              background: "#D0312D",
              border: "0px",
              color: "white",
              marginLeft: "5px",
            }}
            onClick={onUpdate}
          >
            Auto fix
          </Button>
        )}
        {isAuto && <></>}
      </div>
    </div>
  );
};

const ConfirmDialog = ({ open, credits, onConfirm, onClose }) => {
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
      onClose={onClose}
      open={open}
    >
      <DialogHeading>Use {credits} Credit(s)</DialogHeading>
      <DialogSubHeading>
        Your {credits} credit(s) will be used up for this program session. Don't
        worry, you can still make edits to the program.
      </DialogSubHeading>
      <DialogActions style={{ flexDirection: "column", gap: "20px" }}>
        <PrimaryBtn width="188px" onClick={onConfirm}>
          Confirm
        </PrimaryBtn>
        <SecondaryGrayBtn width="188px" onClick={onClose}>
          Go Back
        </SecondaryGrayBtn>
      </DialogActions>
    </Dialog>
  );
};

const MakeEvivveFreeDialog = ({ open, onClose }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const schedulerInfo = useSelector(getScheduleInfo);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [requiredChanges, setRequiredChanges] = useState([
    {
      name: "Participant Count",
      description: "Reduce the number of participants to 5 or less",
      isOkay: false,
      label: "participants_count",
    },
    {
      name: "Session Duration",
      description: "Reduce the duration of the session to 2 hours",
      isOkay: false,
      label: "session_duration",
    },
    {
      name: "Session Count",
      description: "Reduce the session count to 1",
      isOkay: false,
      label: "session_count",
    },
    {
      name: "Game Settings",
      description: "Edit the game settings to free",
      isOkay: false,
      label: "game_settings",
    },
  ]);

  useEffect(() => {
    const temp = [...requiredChanges];
    temp.find((o) => o.label == "participants_count").isOkay =
      schedulerInfo.isParticipantsCountOkay;
    temp.find((o) => o.label == "session_duration").isOkay =
      schedulerInfo.isProgramTimeOkay;
    temp.find((o) => o.label == "session_count").isOkay =
      schedulerInfo.isSessionCountOkay;
    temp.find((o) => o.label == "game_settings").isOkay =
      schedulerInfo.isGameSettingOkay;
    setRequiredChanges(temp);
  }, [schedulerInfo]);

  function labelToKey(label) {
    switch (label) {
      case "participants_count":
        return "isParticipantsCountOkay";
      case "session_duration":
        return "isProgramTimeOkay";
      case "session_count":
        return "isSessionCountOkay";
      case "game_settings":
        return "isGameSettingOkay";
      default:
        throw new Error("label doesn't exist");
    }
  }

  const autoFixFree = useAutoFixFree({
    onSuccess: () => {
      toast.success("Updated");
      const temp = [...requiredChanges];
      temp.find((o) => o.label == selectedAction).isOkay = true;
      dispatch(
        setEvivveFreeCheck({
          [labelToKey(selectedAction)]: true,
        })
      );
      setRequiredChanges(temp);
      onConfirmDialogClose();
      queryClient.invalidateQueries("program-module");
    },
    onError: () => {
      toast.error("Internal Server Error. Please contact support.");
      onConfirmDialogClose();
    },
  });

  function autoFix() {
    autoFixFree.mutate({ programId: id, action: selectedAction });
  }

  function openConfirmDialog(label) {
    setSelectedAction(label);
    setConfirmDialog(true);
  }

  function onConfirmDialogClose() {
    setConfirmDialog(false);
    setSelectedAction(null);
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Button sx={{ minWidth: 0, px: 0 }} onClick={onClose}>
            <IconArrowLeft color="#000" />
          </Button>

          <Typography variant="h6" fontWeight={700} mb={1}>
            Make Evivve Free
          </Typography>
          <Typography variant="body2">
            Make necessary changes to your program to use Evivve for free
          </Typography>

          <Stack mt={3} mb={3} gap={2}>
            {requiredChanges.map((obj) => (
              <RequiredChangeBox
                key={obj.label}
                name={obj.name}
                description={obj.description}
                isOkay={obj.isOkay}
                onUpdate={() => openConfirmDialog(obj.label)}
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirmDialog}
        onClose={onConfirmDialogClose}
        onConfirm={autoFix}
      />
    </>
  );
};

export default MakeEvivveFreeDialog;
