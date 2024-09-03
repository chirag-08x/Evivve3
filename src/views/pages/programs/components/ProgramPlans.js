import styled from "@emotion/styled";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {PROGRAM_BTNS, FACILITATOR_PROGRAM_BTNS, FACILITATOR_INACTIVE_BTNS} from "../constants";
import { PrimaryBtn } from "../../../../components/shared/BtnStyles";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useDispatch } from "react-redux"
import delete_program from '../../../../assets/images/svgs/890.svg'
import manage_participants from '../../../../assets/images/svgs/924.svg'
import adjust_context from '../../../../assets/images/svgs/926.svg'
import view_itinerary from '../../../../assets/images/svgs/927.svg'
import delete_icon from '../../../../assets/images/svgs/890.svg'
import clone_program from '../../../../assets/images/svgs/942.svg'
import run_program from '../../../../assets/images/svgs/943.svg'
import dry_run from '../../../../assets/images/svgs/944.svg'
import schedule from '../../../../assets/images/svgs/928.svg'
import manage_sessions from '../../../../assets/images/svgs/925.svg'
import { Menu, Tooltip } from "@mui/material";
import {
  togglePrsentModeDialog,
  toggleAdjustContextDialog,
  toggleItineraryModeDialog,
  toggleParticipantsDialog,
  toggleSessionsDialog,
  toggleSchedulerDialog,
  toggleDeleteProgramDialog
} from "src/store/apps/programs/ProgramSlice";
import { useNavigate, useParams } from "react-router";
import axiosClient from "src/utils/axios";
import { toast } from "react-toastify";

const PlanContainer = styled("div")`
  color: black;
 
  margin-top: 1rem;

  width:100%;
  border-radius: 10px;
  align-items: center;
  padding: 0.2rem 0.2rem;
   border: 1px solid #eaecf0;
  background:linear-gradient(to right, rgba(119, 76, 159, 0.3), rgba(17, 36, 92, 0.3)) ;
 

   &::before {
  content: '';
  position: absolute;
  
  background:;
  border-radius: 8px;
  z-index: -1;
}
`;

const PlanInnerContainer=styled("div")`
  background:white;
 border-radius:5px;
 padding:0.7rem;
   display: flex;
  flex-direction:row;
  justify-content:space-between;
  padding-right:2rem;
  align-items:center;
`

const PlanText = styled("div")``;
const SubHeadingDiv = styled("div")`
  display:flex;
  gap:0.4rem;
  flex-direction:row;
  align-items:center;
`;

const Heading = styled("h1")`
  font-size: 36px;
`;

const SubHeading = styled("p")`
  color: #667085;
  span {
    color: #027a48;
  }
`;

const SubHeadingXs = styled("p")`
  display: flex;
  align-items: center;
  gap: 0 0.5rem;
  color: #2a3547;
  font-size: 14px;
`;
const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);
const StyledTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: '#5b105A',
  color: '#fff',
  border: '1px solid #dadde9',
  borderRadius:'15px',
  display:'flex',
  justifyContent:'center',
  alignItems:'center'
}));
const VerticalBtn = styled("button")`
  background: none;
  border: none;
  margin-top: 3px;
`;

const PlanStat = styled("div")``;
const ActionItems = styled("div")`
  display:flex;
  gap:2rem;
  flex-wrap:wrap;

`;
const ActionItemsMenu = styled("div")`
  display:flex;
  justify-content:center;
  flex-direction:row;
  
  align-items:center;
`;

const InnerContainer = styled("div")`
  position: relative;
  text-align: right;
`;

const BtnContainer = styled("div")`
  position: absolute;
  display: grid;
  gap: 0.5rem 0;
  right: 1.5rem;
  background-color: white;
  box-shadow: 0px 1px 2px 0px #1018280f;
  box-shadow: 0px 1px 3px 3px #1018281a;
  padding: 1rem 1rem;
  border-radius: 10px;
  z-index: 20;
`;

const ProgramPlans = ({ owner, programStatus }) => {
  const { id } = useParams();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

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

  const handleOnClickButtons = (type) => {
    console.log("Button clicked:", type);
    if (type === PROGRAM_BTNS[0].name) {
      console.log("Owner is: ", owner);
      dispatch(togglePrsentModeDialog(true));
    } else if (type === PROGRAM_BTNS[1].name) {
      dispatch(toggleItineraryModeDialog(true));
    } else if (type === PROGRAM_BTNS[2].name) {
      dispatch(toggleSchedulerDialog(true));
    } else if (type === PROGRAM_BTNS[3].name) {
      dispatch(toggleAdjustContextDialog({ showDialog: true }));
    } else if (type === PROGRAM_BTNS[4].name) {
      dispatch(toggleParticipantsDialog(true));
    } else if (type === PROGRAM_BTNS[5].name) {
      dispatch(toggleSessionsDialog(true));
    }
    setAnchorEl2(null);
  };

  const handleFacilitatorOnClickButtons = (type) => {
    if(programStatus !== "Active") {
    if (type === FACILITATOR_PROGRAM_BTNS[0].name) {
      dispatch(togglePrsentModeDialog(true));
    } else if (type === FACILITATOR_PROGRAM_BTNS[1].name) {
      dispatch(toggleItineraryModeDialog(true));
    }else if(type === FACILITATOR_PROGRAM_BTNS[2].name)
    {
      dispatch(toggleSchedulerDialog(true));
    } else if (type === FACILITATOR_PROGRAM_BTNS[3].name) {
      dispatch(toggleAdjustContextDialog({ showDialog: true }));
    } else if (type === FACILITATOR_PROGRAM_BTNS[4].name) {
      dispatch(toggleParticipantsDialog(true));
    }
    setAnchorEl2(null);
    } else {
      if (type === "Run Program") {
        getFinalRunSession();
    } else if (type === FACILITATOR_PROGRAM_BTNS[1].name) {
      dispatch(toggleItineraryModeDialog(true));
    }
      else if(type === FACILITATOR_PROGRAM_BTNS[2].name)
      {
        dispatch(toggleSchedulerDialog(true));
      }
      else if (type === FACILITATOR_PROGRAM_BTNS[3].name) {
      dispatch(toggleAdjustContextDialog({ showDialog: true }));
    } else if (type === FACILITATOR_PROGRAM_BTNS[4].name) {
      dispatch(toggleParticipantsDialog(true));
    }
    setAnchorEl2(null);
    }
  };

  return (
    <PlanContainer>
      <PlanInnerContainer>
      <PlanText>
        <Heading style={{color:'#0D2359'}}>Plan</Heading>
        <SubHeadingDiv>

        <SubHeading>
          <span>100%</span> complete  
        </SubHeading>
        <FiberManualRecordIcon style={{width:'10px'}} fontSize="small"/> 
        <SubHeadingXs style={{color:'#0D2359'}}>Runtime: 2hr 0m </SubHeadingXs>
        </SubHeadingDiv>
      </PlanText>

      <PlanStat>
        {/* <InnerContainer>
         
          <VerticalBtn onClick={handleClick2} aria-controls="plan-menu">
            <MoreVertIcon />
          </VerticalBtn>
        </InnerContainer> */}
        <ActionItemsMenu>
          <ActionItems>
            {programStatus === "Completed" ? (
             <>
               <StyledTooltip title="View Participants" placement="bottom">
                 <img onClick={() => dispatch(toggleParticipantsDialog(true))} src={manage_participants} />
               </StyledTooltip>
               <StyledTooltip title="View Context" placement="bottom">
                 <img onClick={() => dispatch(toggleAdjustContextDialog({ showDialog: true }))} src={adjust_context} />
               </StyledTooltip>
               <StyledTooltip title="View Itinerary" placement="bottom">
                 <img onClick={() => dispatch(toggleItineraryModeDialog(true))} src={view_itinerary} />
               </StyledTooltip>
               {owner &&  <StyledTooltip title="Delete Program" placement="bottom">
                 <img onClick={() => dispatch(toggleDeleteProgramDialog(true))} src={delete_icon} />
               </StyledTooltip>
                }
             </>
             ) : programStatus === "Active" ? (
             <>
               <StyledTooltip title="Run Program" placement="bottom">
                 <img onClick={() => getFinalRunSession()} src={run_program} />
               </StyledTooltip>
               <StyledTooltip title="Dry Run" placement="bottom">
                 <img onClick={() => dispatch(togglePrsentModeDialog(true))} src={dry_run} />
               </StyledTooltip>
               <StyledTooltip title="Schedule Program" placement="bottom">
                 <img onClick={() => dispatch(toggleSchedulerDialog(true))} src={schedule} />
               </StyledTooltip>
               <StyledTooltip title={owner ? "Manage Participants" : "View Participants"} placement="bottom">
                 <img onClick={() => dispatch(toggleParticipantsDialog(true))} src={manage_participants} />
               </StyledTooltip>
               {owner && <StyledTooltip title="Manage Sessions" placement="bottom">
                <img onClick={() => dispatch(toggleSessionsDialog(true))} src={manage_sessions} />
                </StyledTooltip>}
                {owner &&  <StyledTooltip title="Delete Program" placement="bottom">
                 <img onClick={() => dispatch(toggleDeleteProgramDialog(true))} src={delete_icon} />
               </StyledTooltip>
                }
             </>
            ) : <>
             <StyledTooltip title="Dry Run" placement="bottom">
                 <img onClick={() => dispatch(togglePrsentModeDialog(true))} src={dry_run} />
               </StyledTooltip>
               <StyledTooltip title="View Itinerary" placement="bottom">
                 <img onClick={() => dispatch(toggleItineraryModeDialog(true))} src={view_itinerary} />
               </StyledTooltip>
               <StyledTooltip title="Schedule Program" placement="bottom">
                 <img onClick={() => dispatch(toggleSchedulerDialog(true))} src={schedule} />
               </StyledTooltip>
               <StyledTooltip title={owner ? "Adjust Context" : "View Context"} placement="bottom">
                 <img onClick={() => dispatch(toggleAdjustContextDialog({ showDialog: true }))} src={adjust_context} />
               </StyledTooltip>
               <StyledTooltip title={owner ? "Manage Participants" : "View Participants"} placement="bottom">
                 <img onClick={() => dispatch(toggleParticipantsDialog(true))} src={manage_participants} />
               </StyledTooltip>
               {owner && <StyledTooltip title="Manage Sessions" placement="bottom">
                <img onClick={() => dispatch(toggleSessionsDialog(true))} src={manage_sessions} />
                </StyledTooltip>}
                {owner &&  <StyledTooltip title="Delete Program" placement="bottom">
                 <img onClick={() => dispatch(toggleDeleteProgramDialog(true))} src={delete_icon} />
               </StyledTooltip>
                }
             </>}
          </ActionItems>     
        </ActionItemsMenu>
      </PlanStat>
      </PlanInnerContainer>
     
    </PlanContainer>
  );
};

export default ProgramPlans;
