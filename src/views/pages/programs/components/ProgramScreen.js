import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ProgramHeader from "./ProgramHeader";
import ProgramCardsSlider from "./ProgramCardsSlider";
import ProgramPlans from "./ProgramPlans";
import CustomizeModal from "./customize/CustomizeModal";
import {useNavigate, useParams} from "react-router";
import { useGetProgramModule } from "src/services/programs";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { ReactComponent as NextIcon } from "src/assets/images/svgs/next.svg";
import {
  OpenPresentModeDialog,
  ShowItineraryModeDialog as OpenItineraryModeDialog,
  ProgramReadyDialog,
  OpenUnsavedChangesDialog,
  OpenAdjustContextDialog,
  OpenParticipantsDialog,
  OpenManageSessions,
} from "./Dialogs";
import OpenSchedulerDialog from "./Dialogs/OpenSchedulerDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePrsentModeDialog,
  toggleParticipantsDialog,
  toggleSchedulerDialog,
  getSelectedProgram,
} from "src/store/apps/programs/ProgramSlice";
import axiosClient from "src/utils/axios";
import {useGetBillingInfo} from "../../../../services/billing";
import {toast} from "react-toastify";
import OpenDeleteProgramDialog from "./Dialogs/OpenDeleteProgramDialog";

// components
const Container = styled("div")`
  width: 100%;
  height: 100%;
  padding: 1rem 0 2rem 0;

  *,
  ::before,
  ::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.5;
  }

  button {
    cursor: pointer;
  }
`;

const ProgramScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const showPrsentModeDialog = useSelector(
    (state) => state.programs.showPrsentModeDialog
  );
  const showSchedulerDialog = useSelector(
    (state) => state.programs.showSchedulerDialog
  );
  const showParticipantsDialog = useSelector(
    (state) => state.programs.showParticipantsDialog
  );
  const getBillingInfo = useGetBillingInfo();

  const { data: selectedProgram } = useGetProgramModule(id);
  const [owner, setOwner] = useState(false);
  const [status, setStatus] = useState("");
  const [programStatus, setProgramStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProgram) {
      setOwner(selectedProgram.data.owner);
    }
  }, [selectedProgram]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const programIds = Array.isArray(id) ? id : [id];
    
        const response = await axiosClient().post('/programs/statusesAndActions', { programIds });
    
        const data = Array.isArray(response.data) ? response.data : [response.data];
    
        if (data.length === 1) {
          const { status, action } = data[0];
          setProgramStatus(status);
          setStatus(action);
          if (status === "Completed" || status === "Active") {
            setOwner(false);
          }
        } else {
          const statuses = {};
          const actions = {};
    
          data.forEach(({ id, status, action }) => {
            statuses[id] = status;
            actions[id] = action;
          });
    
          setProgramStatus(statuses);
          setStatus(actions);
        }
      } catch (error) {
        console.error('Failed to fetch statuses and actions for programs', error);
      }
    };
    
    fetch();
    
  }, [showPrsentModeDialog, showSchedulerDialog, showParticipantsDialog, selectedProgram]);

  const getFinalRunSession = async () =>
  {
    try
    {
      const { data } = await axiosClient().get(`/getFinalRunSession/${id}`);

      const sessionId = data?.data.programSession?.id;
      console.log(sessionId);
      navigate(`/programs/present/${sessionId}`);
    }
    catch (error)
    {
      toast.error("Error Running Program. Please try again.");
    }
  };

  const handleButtonClick = () => {
    if (status === "add_participants") {
      dispatch(toggleParticipantsDialog(true));
    } else if (status === "schedule_program") {
      dispatch(toggleSchedulerDialog(true));
    } else if (status === "conduct_dryrun") {
      dispatch(togglePrsentModeDialog(true));
    } else if (status === "run_program")
    {
      getFinalRunSession();
    }
  };

  let buttonText;
  if (status === "run_program") {
    buttonText = "RUN PROGRAM";
  } else if (status === "add_participants") {
    buttonText = "Add Participants";
  } else if (status === "schedule_program") {
    buttonText = "Schedule Program";
  } else if (status === "conduct_dryrun") {
    buttonText = "CONDUCT DRY RUN";
  } else if (status === "run_program") {
    buttonText = "RUN PROGRAM";
  }

  return (
    <Container>
      <ProgramReadyDialog />
      <OpenPresentModeDialog />
      <OpenItineraryModeDialog />
      <OpenUnsavedChangesDialog />
      <OpenManageSessions />
      <OpenDeleteProgramDialog/>
      <OpenParticipantsDialog />
      <OpenAdjustContextDialog owner={owner}/>
      <OpenSchedulerDialog owner={owner} programStatus={programStatus}/>
      <ProgramHeader />
      <ProgramPlans owner={owner} programStatus={programStatus}/>
      <ProgramCardsSlider owner={owner}/>
      <CustomizeModal owner={owner}/>
      {buttonText && programStatus !== "Completed" && (
        <PrimaryBtn
          width="223px"
          ml="auto"
          mt="20px"
          onClick={handleButtonClick}
        >
          {buttonText} <NextIcon height="1rem" width="1rem" />
        </PrimaryBtn>
      )}
    </Container>
  );
};

export default ProgramScreen;
