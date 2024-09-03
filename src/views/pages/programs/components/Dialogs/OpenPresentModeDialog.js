import React, { useState,useEffect } from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogSubHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import { togglePrsentModeDialog } from "src/store/apps/programs/ProgramSlice";
import {
  getPresentModules,
  setSelectedModule,
} from "src/store/apps/present/PresentSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { useNavigate, useParams } from "react-router";
import axiosClient from "src/utils/axios";
import { toast } from "react-toastify";
import CustomDialog from "./CustomDialog";

function getReadableSessionStep (programStep) {
    const step = programStep || '-';
    const pair = {
        BEGIN: "Begin",
        WELCOME: "Welcome",
        AC_BRIEFING: "Learner Activation - Briefing",
        AC_VIDEO: "Learner Activation - Intro Video",
        AC_INSTALL: "Learner Activation - Install",
        AC_QNA: "Learner Activation - Q&A",
        STRATEGY_PLANNING: "Strategy & Planning",
        EV_LAUNCH: "Evivve Launch" ,
        EV_PLAYER_CONSOLE: "Evivve Player Console",
        EV_ADMIN_PANEL: "Evivve Dashboard",
        REFLECTION: "Reflection",
        DEBRIEF: "Debrief"
    }
    const readable = pair[step] || "-";
    return readable;
}

const OpenPresentModeDialog = ({pid}) => {
  const open = useSelector((state) => state.programs.showPrsentModeDialog);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [oldSession, setOldSession] = useState({});
  const modules = useSelector(getPresentModules);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams() ;
      
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [pid])
  

  const createNewSession = async (deleteOldSession = false) => {
    try {
      if (deleteOldSession) {
        await axiosClient().delete(`/program_session/dry_run/${id}`);
      }
      const { data } = await axiosClient().post(
        `/program_session/dry_run/${id}`
      );
      setOpenSessionDialog(false);
      const sessionId = data?.session?.id;
      navigate(`/programs/present/${sessionId}`);
    } catch (error) {
      toast.error("Error Conducting Dry Run. Please try again.");
    }
  };

  const getProgramSessions = async () => {
    try {
      const { data } = await axiosClient().get(
        `/program_session/dry_run/${id}`
      );
      if (Object.keys(data).length === 0) {
        dispatch(setSelectedModule(modules[0]));
        createNewSession();
      } else {
        setOldSession(data?.session);
        setOpenSessionDialog(true);
      }
      dispatch(togglePrsentModeDialog(false));
    } catch (error) {
      toast.error("Error Conducting Dry Run. Please try again.");
    }
  };

  const handleClose = () => {
    dispatch(togglePrsentModeDialog(false));
  };

  const openPresentMode = () => {
    getProgramSessions();
  };

  const redirectToOldSession = () => {
    setOpenSessionDialog(false);
    navigate(`/programs/present/${oldSession?.id}`);
  };

  return (
    <>
      <CustomDialog
        open={openSessionDialog}
        heading="Continue Session"
        subheading={`Your previous session is already running, currently at: "${getReadableSessionStep(oldSession?.programStep)}", would you like to continue it, or create a new one.`}
        btn1Text="Continue Dry Run"
        btn2Text="Start New"
        onConfirm={redirectToOldSession}
        discard={() => createNewSession(true)}
        onClose={() => setOpenSessionDialog(false)}
      />
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
        <DialogHeading>Entering Presentation Mode</DialogHeading>
        <DialogSubHeading>
          You are about to enter presentation mode. In this mode, your screen will expand to full, and sound and video will play.
        </DialogSubHeading>
        <DialogActions style={{ flexDirection: "column", gap: "20px" }}>
          <PrimaryBtn width="188px" onClick={openPresentMode}>
            Let’s Go!
          </PrimaryBtn>
          <SecondaryGrayBtn width="188px" onClick={handleClose}>
            Go Back
          </SecondaryGrayBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OpenPresentModeDialog;
