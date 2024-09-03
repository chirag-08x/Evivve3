import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PrimaryBtn ,PrimaryMenuBtn} from "src/components/shared/BtnStyles";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AdjustIcon from "@mui/icons-material/Adjust";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OnboardingLoader from "./OnboardingLoader";
import { useNavigate, useParams } from "react-router";
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
  toggleProgramReadyDialog,
  getProgramsList,
  getProgramId,
  toggleParticipantsDialog,
  toggleSessionsDialog,
  toggleSchedulerDialog,
  toggleAdjustContextDialog,
  toggleItineraryModeDialog,
  togglePrsentModeDialog,
} from "src/store/apps/programs/ProgramSlice";

import { useGetProgramsList } from "src/services/programs";

import { format } from "date-fns";
import ProgramPlans from "./ProgramPlans";
import { useGetProgramModule } from "src/services/programs";
import EditIcon from "@mui/icons-material/Edit";
import { convertToTimeZone } from "src/utils/timezones/convertToTimezone";
import { CopyAll, PlayCircle } from "@mui/icons-material";
import { CloneDialog } from "./Dialogs";
import { useQuery } from "react-query";
import axiosClient from "src/utils/axios";
import { toast } from "react-toastify";
import moment from "moment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import clone_program_icon from '../../../../assets/images/programs/clone_icon.svg'
import dry_run_icon from '../../../../assets/images/programs/dry_run_icon.svg'
import schedule_icon from '../../../../assets/images/programs/schedule_icon.svg'
import icon1 from '../../../../assets/images/programs/888.svg'
import icon2 from '../../../../assets/images/programs/910.svg'
import icon3 from '../../../../assets/images/programs/869.svg'
import icon4 from '../../../../assets/images/programs/903.svg'
import manageParticipants from '../../../../assets/images/programs/909.svg'
import icon5 from '../../../../assets/images/svgs/892.svg'
import {
  useGetE3UserInfo,
} from "src/services/user";

const Wrapper = styled("div")`
  * {
    font-family: Inter;
  }
`;

const InnerWrapper = styled("div")`
  padding: 2rem 0;
`;

const TypographyContainer = styled("div")`
  color: black;
  display: grid;
  gap: 0.5rem;
`;

const ActionsContainer = styled("div")`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const TableText = styled(Typography)`
  font-weight: 500;
  font-size: 13.5px;
  color:#0D2359;
`;

const SortContainer = styled("div")`
  display: grid;
  grid-template-columns: auto 155px;
  gap: 0 0.5rem;
  align-content: center;
  align-items: center;
`;

const ProgramTable = styled("table")`
  color: #000;
  margin-top: 2rem;
  width: 100%;
`;

const ActionBtn = styled("button")`
  background: transparent;
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  font-size: 17px;
`;

const TabsContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const ActionMenuBtn = styled(PrimaryMenuBtn)`
  padding: 10px 18px;
  width: 240px;
  background: white;
  color:#000;
  font-weight:300;
  &:hover {
    background: #EAEAEA;
  }
`;


const Evivve2ProgramAction = ({is_session_passed}) => {
    if (is_session_passed) {
        return <span></span>;
    }

    return <a href={`${process.env.REACT_APP_GAME_APP}/evivve2/my-programs`}>Edit on Evivve2</a>
}

const ProgramList = () => {
  useGetProgramsList();
  const {id}=useParams()

  const programs = useSelector(getProgramsList);
  const { data, refetch } = useGetE3UserInfo();
  const [userInfo, setUserInfo] = useState({});
  const [owner, setOwner] = useState(false);

  const [value, setValue] = useState("date");
  const [createProgram, setCreateProgram] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [cloneDialog, setCloneDialog] = useState(false);
  const [cloneName, setCloneName] = useState(null);
  const [selectProgramId, setProgramId] = useState(null);
  const [programListType, setProgramListType] = useState("owned");
  const [programStatuses, setProgramStatuses] = useState({});
  const [status, setStatus] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [timezoneState, setTimezoneState] = useState(false);

  const programId = useSelector(getProgramId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  console.log("sc", showCompleted);
  console.log("pgs", programStatuses);

  const [facilitatingList, setFacilitatingList] = useState([]);
  const facilitatingProgramsResponse = useQuery(
    "facilitating-programs",
    async () => await axiosClient().get(`/getFacilitatingProgramsList`),
    {
      onSuccess: (data) => {
        setFacilitatingList(data.data.allPrograms);
      },
    }
  );

  useEffect(() => {
    
 
    if (data) {
      setUserInfo(data?.data?.user);
    }
 
    const fetchProgramStatuses = async () => {
      if (programs?.allPrograms) {
        const programIds = programs.allPrograms.map((program) => program.id);

        try {
          const response = await axiosClient().post(
            "/programs/statusesAndActions",
            { programIds }
          );
          const statuses = {};
          const actions = {};

          response.data.forEach(({ id, status, action }) => {
            statuses[id] = status;
            actions[id] = action;
          });

          setProgramStatuses(statuses);
          setStatus(actions);
        } catch (error) {
          console.error(
            "Failed to fetch statuses and actions for programs",
            error
          );
        }
      }
    };

    fetchProgramStatuses();
  }, [programs?.allPrograms,data]);

  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const handleNextScreen = () => {
    dispatch(toggleProgramReadyDialog(true));
    navigate(`/programs/${programId}`);
  };

  const handleEdit = (id) => {
    navigate(`/programs/${id}`);
  };

  const handleClone = (id, name) => {
    setProgramId(id);
    setCloneName(name);
    setCloneDialog(true);
  };

  const handleAddParticipant = async (id) => {
    setProgramId(id)
    setTypeModal("Participants")
    dispatch(toggleParticipantsDialog(true));
  };

  const handleScheduleProgram = async (id) => {
    setProgramId(id)
    setTypeModal("Schedule")
    console.log(id);
    dispatch(toggleSchedulerDialog(true));
  };

  const handleConductDryrun = async(id) =>{
    setProgramId(id)
    setTypeModal("Present")
    dispatch(togglePrsentModeDialog(true));
  }
  const handleManageSessions = async(id) =>{
    setProgramId(id)
    setTypeModal("Sessions")

    dispatch(toggleSessionsDialog(true));
  }
  const handleItinerary = async(id) =>{
    setProgramId(id)
    setTypeModal("Itinerary")

    dispatch(toggleItineraryModeDialog(true));
  }
  const handleAdjustContext = async(id) =>{
    setProgramId(id)
    dispatch(
      toggleAdjustContextDialog({
        showDialog: true,
        showBtn: true,
      })
    );
  }

  // const handleRunProgram = async(id) =>{
  //   handleEdit(id);
  //   toast.success("FINAL RUN THE PROGRAM NOW!!!");
  // }
  const getFinalRunSession = async (id) =>
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


  const handleShowCompletedChange = (event) => {
    setShowCompleted(event.target.checked);
    console.log("Show Completed Programs:", event.target.checked);
  };

  const filterPrograms = (programs) => {
    return programs.filter((program) => {
      const status = programStatuses[program.id];
      return showCompleted || status !== "Completed";
    });
  };

  if (createProgram) {
    return <OnboardingLoader handleNextScreen={handleNextScreen} />;
  }

  const handleClick1 = (event,pid) => {
    event.preventDefault();
    setAnchorEl1(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  

  // const buttons = [
  //   {
  //     condition: status !== 'Completed',
  //     onClick: () => handleConductDryrun(id),
  //     label: "Launch Dry Run",
  //     icon: dry_run_icon,
  //   },
  //   {
  //     condition: status !== 'Completed',
  //     onClick: () => handleScheduleProgram(id),
  //     label: "Schedule Program",
  //     icon: schedule_icon,
  //   },
  //   {
  //     condition: status !== 'Completed',
  //     onClick: () => handleAddParticipant(id),
  //     label: "Manage Participants",
  //     icon: icon5,
  //   },
  //   {
  //     condition: status !== 'Completed',
  //     onClick: () => handleManageSessions(id),
  //     label: "Manage Sessions",
  //     icon: icon2,
  //   },
  //   {
  //     condition: status !== 'Completed',
  //     onClick: () => handleAdjustContext(id),
  //     label: "Adjust Context",
  //     icon: icon3,
  //   },
  //   {
  //     condition: true, // Always show this button
  //     onClick: () => handleItinerary(id),
  //     label: "View Itinerary",
  //     icon: icon4,
  //   },
  // ];
  
  // const filteredButtons = buttons.filter(button => button.condition);

  return (
    <Wrapper>
      <InnerWrapper>
        <CloneDialog
          open={cloneDialog}
          setOpen={setCloneDialog}
          programName={cloneName}
          programId={selectProgramId}
        />

      {typeModal==="Present"&& <OpenPresentModeDialog pid={selectProgramId} /> }  
      <OpenUnsavedChangesDialog  />
      {typeModal==="Sessions"&& <OpenManageSessions pid={selectProgramId}/>}
      {typeModal==="Participants"&& <OpenParticipantsDialog  pid={selectProgramId} />}
      {typeModal==="Itinerary"&& <OpenItineraryModeDialog  pid={selectProgramId} />}
      {typeModal==="Adjust"&& <OpenAdjustContextDialog  pid={selectProgramId} />}
      {typeModal==="Schedule"&& <OpenSchedulerDialog  pid={selectProgramId}/>}
        <TypographyContainer>
          <Typography style={{color:'#0D2359'}}>Home</Typography>
          <Typography style={{color:'#0D2359'}} variant="h4">PROGRAMS</Typography>
        </TypographyContainer>

        {/* <ActionsContainer></ActionsContainer> */}

        <TabsContainer>
          <Tabs
            value={programListType}
            onChange={(evt, newValue) => setProgramListType(newValue)}
          >
            <Tab value="owned" label="Owned" />
            <Tab value="facilitating" label="Facilitating" />
          </Tabs>

          <Stack direction="row" spacing={2}>
            <SortContainer>
              <Typography
                color="#000"
                variant="caption"
                fontWeight={500}
                fontSize="14px"
              >
                Sort By:
              </Typography>
              <FormControl>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  sx={{
                    border: "1px solid rgb(204, 204, 204)",
                    "& svg": { color: "rgb(204, 204, 204)", fontSize: "2rem" },
                    "& fieldset": {
                      border: "none",
                    },
                    "& .css-1v0lttz-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                      {
                        padding: "4px 12px",
                      },
                  }}
                  onChange={handleChange}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="program_name">Program Name</MenuItem>
                  <MenuItem value="access_type">Access Type</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </SortContainer>
            <PrimaryBtn
              style={{
                width: "auto",
                padding: "5px 12px",
                fontWeight: 500,
                background: "#341A5A",
              }}
              onClick={() => setCreateProgram(true)}
            >
              <AddIcon fontSize="12px" />
              Create Program
            </PrimaryBtn>
          </Stack>
        </TabsContainer>

        {programListType === "owned" && (
          <TableContainer>
            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead
                sx={{
                  background: "#341A5A",
                }}
              >
                <TableRow sx={{ "& th": { py: 1.25 } }}>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Program Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Focus Area
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Facilitator
                    </Typography>
                  </TableCell> */}
                    <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Created On
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                     Scheduled For
                    </Typography>
                  </TableCell>
                  <TableCell style={{display:'flex',justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                      
                    >
                      Time
                    </Typography>
                    <Typography>
                    <Tooltip
                     placement="bottom"
                    title={timezoneState?"Local Timezone":"UTC Timezone"}
                                >
                    <AccessTimeIcon onClick={()=>setTimezoneState(!timezoneState)} style={{paddingTop:'3.5px',color:'white',opacity:'0.6',cursor:"pointer"}} fontSize="small" />
                    </Tooltip>
                    </Typography>
                  </TableCell>
                
                  {/* <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Access
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              {programs?.allPrograms?.length > 0 && (
                <TableBody>
                  {programs?.allPrograms?.map(
                    (
                      {
                        id,
                        name,
                        created_at,
                        programType,
                        date,
                        game_access,
                        time,
                        is_evivve2,
                        is_session_passed,
                        startTime,
                        timezone,
                        actions: { programStatus },
                      },
                      idx
                    ) => {

                      const buttons = [
                        {
                          condition: status[id] === 'conduct_dryrun',
                          onClick: () => handleConductDryrun(id),
                          label: "Launch Dry Run",
                          icon: dry_run_icon,
                        },
                        {
                          condition: status[id] === 'schedule_program',
                          onClick: () => handleScheduleProgram(id),
                          label: "Schedule Program",
                          icon: schedule_icon,
                        },
                        {
                          condition: status[id] === 'add_participants',
                          onClick: () => handleAddParticipant(id),
                          label: "Manage Participants",
                          icon: manageParticipants,
                        },
                        {
                          condition: status[id] === 'run_program',
                          onClick: () => getFinalRunSession(id),
                          label: "Run Program",
                          icon: icon5,
                        },
                      ];
                  
                      const filteredButtons = buttons.filter(button => button.condition);
                      return (
                        <>
                          <TableRow
                            key={id}
                            sx={{
                              background: idx % 2 === 0 ? "#EEE3D3" : "#fff",
                              "& td": { py: 1.5 },
                            }}
                          >
                            <TableCell style={{cursor:'pointer'}}>
                              <TableText style={{fontWeight:'800'}} onClick={() => handleEdit(id)}>{name}</TableText>
                            </TableCell>
                            <TableCell>
                              <TableText>{programType?.replace('_',"  ")}</TableText>
                            </TableCell>
                            <TableCell>
                              <TableText>
                                {/* {convertToTimeZone(time, timezone) || "N/A"}{" "} */}
                                {/* {timezone?.split(" ")[0]} */}
                                {moment(created_at).format("DD MMMM, YYYY")}
                              </TableText>
                            </TableCell>
                            <TableCell>
                              <TableText>{startTime?moment(startTime).format("DD MMM, YYYY"):'Not Scheduled'}</TableText>
                            </TableCell>
                            <TableCell>
                              <TableText>  {startTime?timezoneState?convertToTimeZone(startTime, timezone) || "N/A":convertToTimeZone(startTime, userInfo.timezone) || "N/A":"Not Scheduled"}{" "}
                              {startTime?timezoneState?timezone?.split(" ")[0].replace('_',"  "):userInfo.timezone?.split(" ")[0].replace('_',"  "):""}</TableText>
                            </TableCell>
                          
                            {/* <TableCell>
                              <TableText>{game_access === 8 ? "FULL DAY" : "HALF DAY"}</TableText>
                            </TableCell> */}
                            {/* <TableCell>
                              <TableText>Placeholder</TableText>
                            </TableCell> */}
                            <TableCell>
                              <TableText>{programStatuses[id]}</TableText>
                            </TableCell>
                            <TableCell>
                              {is_evivve2 ? <Evivve2ProgramAction is_session_passed={is_session_passed} /> :
                                    <Stack direction="row">
                                        <Tooltip
                                            placement="bottom"
                                            title="Edit Program"
                                        >
                                            <ActionBtn onClick={() => handleEdit(id)}>
                                                <EditIcon fontSize="15px" />
                                            </ActionBtn>
                                        </Tooltip>
                                        <Tooltip placement="bottom" title="Clone Program">
                                            <ActionBtn
                                                onClick={()=>handleClone(id,name)}

                                                width="240px"
                                                style={{
                                                    padding: "10px 18px",
                                                }}
                                            >
                                                <img src={clone_program_icon}/>
                                            </ActionBtn>
                                        </Tooltip>
                                        {filteredButtons.map((button, index) => (
                                            <Tooltip placement="bottom" title={button.label}>
                                                <ActionBtn
                                                    key={index}
                                                    onClick={button.onClick}
                                                    width="240px"
                                                    style={{
                                                        padding: "10px 18px",
                                                    }}
                                                >
                                                    <img src={button.icon} alt={`${button.label} Icon`} />
                                                </ActionBtn>
                                            </Tooltip>
                                        ))}
                                        <Tooltip placement="bottom" title="More">
                                            {/* <ActionBtn
                                            onClick={(e)=>handleClick1(e,id)}
                                            aria-controls="action"
                                            >
                                            <MoreVertIcon />
                                            </ActionBtn> */}
                                        </Tooltip>
                                    </Stack>
                              }
                            </TableCell>
                          </TableRow>

                          <Menu
                            id="action"
                            anchorEl={anchorEl1}
                            keepMounted
                            open={Boolean(anchorEl1)}
                            onClose={handleClose1}
                            anchorOrigin={{
                              horizontal: "left",
                              vertical: "bottom",
                            }}
                            transformOrigin={{
                              horizontal: "right",
                              vertical: "top",
                            }}
                            sx={{
                              "& .MuiMenu-paper": {
                                p: "0.5rem 1rem",
                                borderRadius: "10px",
                              },
                              "& ul": {
                                display: "grid",
                                gap: "0.5rem",
                              },
                            }}
                          >
                            {/* <ActionMenuBtn
                            onClick={() => handleEdit(id)}
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              View / Edit Mode
                              <EditIcon fontSize="15px" />
                            </ActionMenuBtn> */}
                              {programStatuses[id]==="Active"?<ActionMenuBtn
                              onClick={()=>getFinalRunSession()}
                              width="240px"
                              style={{
                                padding: "10px 18px",color:'#5b105a'
                              }}
                            >
                              Run Program
                             {/* <img  src={run_program_icon}/> */}

                            </ActionMenuBtn>:""}
                            {<> {filteredButtons.map((button, index) => (
                              <ActionMenuBtn
                                key={index}
                                onClick={button.onClick}
                                width="240px"
                                style={{
                                  padding: "10px 18px",
                                }}
                              >
                                {button.label}
                                <img src={button.icon} alt={`${button.label} Icon`} />
                              </ActionMenuBtn>
                            ))}
                            </>}
                        
                            <ActionMenuBtn
                            onClick={()=>handleClone(id,name)}

                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              Clone Program
                              <img src={clone_program_icon}/>

                            </ActionMenuBtn>
                            {/* <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              DELETE
                            </ActionMenuBtn> */}
                          </Menu>
                        </>
                      );
                    }
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}

        {programListType === "facilitating" && (
          // <ProgramTable style={{ marginTop: "10px" }}>
          //   <TableHead>
          //     <tr>
          //       <th>Program Name</th>
          //       <th>Time</th>
          //       <th>Date</th>
          //       <th>Access</th>
          //       <th>Status</th>
          //       <th>Actions</th>
          //     </tr>
          //   </TableHead>

          //   {facilitatingList.length > 0 && (
          //     <TableBody>
          //       {filterPrograms(facilitatingList).map(
          //         ({
          //           id,
          //           name,
          //           time,
          //           timezone,
          //           created_at,
          //           game_access,
          //           actions: { programStatus },
          //         }) => {
          //           return (
          //             <tr key={id}>
          //               <td>{name || "N/A"}</td>
          //               <td>
          //                 {convertToTimeZone(time, timezone) || "N/A"}{" "}
          //                 {timezone?.split(" ")[0]}
          //               </td>
          //               <td>
          //                 {format(new Date(created_at), "dd-MMM-yyyy") || "N/A"}
          //               </td>
          //               <td>{game_access === 8 ? "FULL DAY" : "HALF DAY"}</td>
          //               <td>{programStatuses[id] || "N/A"}</td>
          //               <td
          //                 style={{
          //                   display: "flex",
          //                   flexDirection: "row",
          //                   color: "#373737",
          //                 }}
          //               >
          //                 <Tooltip placement="bottom" title="Edit Program">
          //                   <ActionBtn onClick={() => handleEdit(id)}>
          //                     <EditIcon fontSize="14px" />
          //                   </ActionBtn>
          //                 </Tooltip>
          //                 <Tooltip placement="bottom" title="Clone Program">
          //                   <IconButton
          //                     aria-label="clone"
          //                     onClick={() => handleClone(id, name)}
          //                   >
          //                     <CopyAll
          //                       style={{ color: "black", fontSize: "16px" }}
          //                     />
          //                   </IconButton>
          //                 </Tooltip>
          //               </td>
          //             </tr>
          //           );
          //         }
          //       )}
          //     </TableBody>
          //   )}
          // </ProgramTable>
    <TableContainer>
      <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead
                sx={{
                  background: "#341A5A",
                }}
              >
                <TableRow sx={{ "& th": { py: 1.25 } }}>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Program Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Focus Area
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Facilitator
                    </Typography>
                  </TableCell> */}
                    <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Created On
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                     Scheduled For
                    </Typography>
                  </TableCell>
                  <TableCell style={{display:'flex',justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                      
                    >
                      Time
                    </Typography>
                    <Typography>
                    <Tooltip
                     placement="bottom"
                    title={timezoneState?"Local Timezone":"UTC Timezone"}
                                >
                    <AccessTimeIcon onClick={()=>setTimezoneState(!timezoneState)} style={{paddingTop:'3.5px',color:'white',opacity:'0.6',cursor:"pointer"}} fontSize="small" />
                    </Tooltip>
                    </Typography>
                  </TableCell>
                
                  {/* <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Access
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="#fff"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
          <TableBody>
          {facilitatingList.length&&facilitatingList?.map(
            (
              {
                id,
                name,
                created_at,
                programType,
                date,
                game_access,
                time,
                startTime,
                timezone,
                actions: { programStatus },
              },
              idx
            ) => {

              const buttons = [
                {
                  condition: status[id] === 'conduct_dryrun',
                  onClick: () => handleConductDryrun(id),
                  label: "Launch Dry Run",
                  icon: dry_run_icon,
                },
                {
                  condition: status[id] === 'schedule_program',
                  onClick: () => handleScheduleProgram(id),
                  label: "Schedule Program",
                  icon: schedule_icon,
                },
                {
                  condition: status[id] === 'add_participants',
                  onClick: () => handleAddParticipant(id),
                  label: "Manage Participants",
                  icon: manageParticipants,
                },
                {
                  condition: status[id] === 'run_program',
                  onClick: () => getFinalRunSession(id),
                  label: "Run Program",
                  icon: icon5,
                },
              ];
          
              const filteredButtons = buttons.filter(button => button.condition);
              return (
                <>
                  <TableRow
                    key={id}
                    sx={{
                      background: idx % 2 === 0 ? "#EEE3D3" : "#fff",
                      "& td": { py: 1.5 },
                    }}
                  >
                    <TableCell style={{cursor:'pointer'}}>
                      <TableText style={{fontWeight:'800'}} onClick={() => handleEdit(id)}>{name}</TableText>
                    </TableCell>
                    <TableCell>
                      <TableText>{programType?.replace('_',"  ")}</TableText>
                    </TableCell>
                    <TableCell>
                      <TableText>
                        {/* {convertToTimeZone(time, timezone) || "N/A"}{" "} */}
                        {/* {timezone?.split(" ")[0]} */}
                        {moment(created_at).format("DD MMMM, YYYY")}
                      </TableText>
                    </TableCell>
                    <TableCell>
                      <TableText>{startTime?moment(startTime).format("DD MMM, YYYY"):'Not Scheduled'}</TableText>
                    </TableCell>
                    <TableCell>
                      <TableText>  {startTime?timezoneState?convertToTimeZone(startTime, timezone) || "N/A":convertToTimeZone(startTime, userInfo.timezone) || "N/A":"Not Scheduled"}{" "}
                      {startTime?timezoneState?timezone?.split(" ")[0].replace('_',"  "):userInfo.timezone?.split(" ")[0].replace('_',"  "):""}</TableText>
                    </TableCell>
                  
                    {/* <TableCell>
                      <TableText>{game_access === 8 ? "FULL DAY" : "HALF DAY"}</TableText>
                    </TableCell> */}
                    {/* <TableCell>
                      <TableText>Placeholder</TableText>
                    </TableCell> */}
                    <TableCell>
                      <TableText>{programStatuses[id]}</TableText>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <Tooltip
                          placement="bottom"
                          title="Edit Program"
                        >
                          <ActionBtn onClick={() => handleEdit(id)}>
                            <EditIcon fontSize="15px" />
                          </ActionBtn>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Clone Program">
                        <ActionBtn
                          onClick={()=>handleClone(id,name)}

                          width="240px"
                          style={{
                          padding: "10px 18px",
                        }}
                        >
                          <img src={clone_program_icon}/>

                        </ActionBtn>
                        </Tooltip>
                        {<> {filteredButtons.map((button, index) => (
                        <Tooltip placement="bottom" title={button.label}>

                      <ActionBtn
                        key={index}
                        onClick={button.onClick}
                        width="240px"
                        style={{
                          padding: "10px 18px",
                        }}
                      >
                       
                        <img src={button.icon} alt={`${button.label} Icon`} />
                      </ActionBtn>
                      </Tooltip>
                    ))}
                    </>}
                        <Tooltip placement="bottom" title="More">
                          {/* <ActionBtn
                            onClick={(e)=>handleClick1(e,id)}
                            aria-controls="action"
                          >
                            <MoreVertIcon />
                          </ActionBtn> */}
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  <Menu
                    id="action"
                    anchorEl={anchorEl1}
                    keepMounted
                    open={Boolean(anchorEl1)}
                    onClose={handleClose1}
                    anchorOrigin={{
                      horizontal: "left",
                      vertical: "bottom",
                    }}
                    transformOrigin={{
                      horizontal: "right",
                      vertical: "top",
                    }}
                    sx={{
                      "& .MuiMenu-paper": {
                        p: "0.5rem 1rem",
                        borderRadius: "10px",
                      },
                      "& ul": {
                        display: "grid",
                        gap: "0.5rem",
                      },
                    }}
                  >
                    {/* <ActionMenuBtn
                    onClick={() => handleEdit(id)}
                      width="240px"
                      style={{
                        padding: "10px 18px",
                      }}
                    >
                      View / Edit Mode
                      <EditIcon fontSize="15px" />
                    </ActionMenuBtn> */}
                      {programStatuses[id]==="Active"?<ActionMenuBtn
                      onClick={()=>getFinalRunSession()}
                      width="240px"
                      style={{
                        padding: "10px 18px",color:'#5b105a'
                      }}
                    >
                      Run Program
                     {/* <img  src={run_program_icon}/> */}

                    </ActionMenuBtn>:""}
                    {<> {filteredButtons.map((button, index) => (
                      <ActionMenuBtn
                        key={index}
                        onClick={button.onClick}
                        width="240px"
                        style={{
                          padding: "10px 18px",
                        }}
                      >
                        {button.label}
                        <img src={button.icon} alt={`${button.label} Icon`} />
                      </ActionMenuBtn>
                    ))}
                    </>}
                
                    <ActionMenuBtn
                    onClick={()=>handleClone(id,name)}

                      width="240px"
                      style={{
                        padding: "10px 18px",
                      }}
                    >
                      Clone Program
                      <img src={clone_program_icon}/>

                    </ActionMenuBtn>
                    {/* <ActionMenuBtn
                      width="240px"
                      style={{
                        padding: "10px 18px",
                      }}
                    >
                      DELETE
                    </ActionMenuBtn> */}
                  </Menu>
                </>
              );
            }
          )}
        </TableBody>
    </Table>
  </TableContainer> )}
                          {/* <Menu
                            id="action-menu"
                            anchorEl={anchorEl2}
                            keepMounted
                            open={Boolean(anchorEl2)}
                            onClose={handleClose2}
                            anchorOrigin={{
                              horizontal: "left",
                              vertical: "bottom",
                            }}
                            transformOrigin={{
                              horizontal: "right",
                              vertical: "top",
                            }}
                            sx={{
                              "& .MuiMenu-paper": {
                                p: "0.5rem 1rem",
                                borderRadius: "10px",
                              },
                              "& ul": {
                                display: "grid",
                                gap: "0.5rem",
                              },
                            }}
                          >
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              EDIT
                            </ActionMenuBtn>
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              DRY RUN
                            </ActionMenuBtn>
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              SCHEDULE
                            </ActionMenuBtn>
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              RUN
                            </ActionMenuBtn>
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              CLONE
                            </ActionMenuBtn>
                            <ActionMenuBtn
                              width="240px"
                              style={{
                                padding: "10px 18px",
                              }}
                            >
                              DELETE
                            </ActionMenuBtn>
                          </Menu> */}
                    
       

        {(programListType === "owned" && !programs?.allPrograms?.length) &&(
            <Typography variant="h5" mt={2} color="#000" align="center">
              No Available Programs!
            </Typography>
          )}
          {
          (programListType === "facilitating" && !facilitatingList.length) && (
            <Typography variant="h5" mt={2} color="#000" align="center">
              No Available Programs!
            </Typography>
          )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default ProgramList;

// <tr key={id}>
//   <td>{name || "N/A"}</td>
//   <td>
//     {convertToTimeZone(time, timezone) || "N/A"}{" "}
//     {timezone?.split(" ")[0]}
//   </td>
//   <td>
//     {format(new Date(created_at), "dd-MMM-yyyy") || "N/A"}
//   </td>
//   <td>{game_access === 8 ? "FULL DAY" : "HALF DAY"}</td>
//   <td>{programStatuses[id] || "N/A"}</td>
//   <td
//     style={{
//       display: "flex",
//       flexDirection: "row",
//       color: "#373737",
//     }}
//   >
//     <Tooltip placement="bottom" title="Edit Program">
//       <EditBtn onClick={() => handleEdit(id)}>
//         <EditIcon fontSize="14px" />
//       </EditBtn>
//     </Tooltip>
    // <Tooltip placement="bottom" title="Clone Program">
    //   <IconButton
    //     aria-label="clone"
    //     onClick={() => handleClone(id, name)}
    //   >
    //     <CopyAll
    //       style={{ color: "black", fontSize: "16px" }}
    //     />
    //   </IconButton>
    // </Tooltip>
    // <Tooltip placement="bottom" title="Add Participants">
    //   <IconButton
    //     aria-label="add participants"
    //     onClick={() => handleAddParticipant(id)}
    //   >
    //     <AddIcon
    //       style={{ color: "black", fontSize: "16px" }}
    //     />
    //   </IconButton>
    // </Tooltip>
    // {status[id] === "conduct_dryrun" ? (
    //   <Tooltip
    //     placement="bottom"
    //     title="Reschedule Program"
    //   >
    //     <IconButton
    //       aria-label="schedule program"
    //       onClick={() => handleScheduleProgram(id)}
    //     >
    //       <CalendarMonthIcon
    //         style={{
    //           color: "black",
    //           fontSize: "16px",
    //         }}
    //       />
    //     </IconButton>
    //   </Tooltip>
    // ) : (
    //   <Tooltip
    //     placement="bottom"
    //     title="Schedule Program"
    //   >
    //     <IconButton
    //       aria-label="schedule program"
    //       onClick={() => handleScheduleProgram(id)}
    //     >
    //       <CalendarMonthIcon
    //         style={{
    //           color: "black",
    //           fontSize: "16px",
    //         }}
    //       />
    //     </IconButton>
    //   </Tooltip>
    // )}
//   </td>
// </tr>
