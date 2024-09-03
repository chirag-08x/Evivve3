import PageContainer from "src/components/container/PageContainer";
import {
  Grid,
  Box,
  Typography,
  Table,
  TableBody,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
} from "@mui/material";
import styled from "@emotion/styled";
import { PrimaryBtn, SecondaryBtn } from "src/components/shared/BtnStyles";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import GoldMedal from "src/assets/images/backgrounds/gold.png";
import BeigeBg from "src/assets/images/backgrounds/beige_bg.png";
import Community from "src/assets/images/programs/community.png";
import Book from "src/assets/images/programs/book.png";
import Support from "src/assets/images/programs/support.png";
import { useNavigate } from "react-router";
import QRCodeStyling from "qr-code-styling";
import moment from "moment";

import { IconAlarm } from "@tabler/icons";
import {
  useGetProgramsList,
  useGetRecentProgram,
  useGetUpcomingProgram,
} from "src/services/programs";
import { useSelector } from "react-redux";
import {
  getProgramId,
  getProgramsList,
  toggleParticipantsDialog,
  toggleProgramReadyDialog,
  togglePrsentModeDialog,
  toggleSchedulerDialog,
} from "src/store/apps/programs/ProgramSlice";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { CustomDialog } from "../programs/components/Dialogs";
import OnboardingLoader from "../programs/components/OnboardingLoader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "src/utils/axios";

const ActionCard = styled("div")`
  background: ${(props) => (props.variant === "light" ? "#E8C48F" : "#D3D3D3")};
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: 5px;
`;

const ActionBtn = styled(PrimaryBtn)`
  font-size: 14px;
`;

const SecondaryActionBtn = styled("button")`
  font-size: 14px;
  background-color:#5b105a;
  display:flex;
  justify-content:center;
  flex-direction:row;
  border:none;
  padding:3px;
  cursor:pointer;
  width:fit-content;
  border-radius:5px;
  margin-bottom:10px;

`;
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image: "https://img.icons8.com/?size=100&id=85088&format=png&color=000000",
  dotsOptions: {
    color: "#000",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 2,
  },
});

const Dashboard = () => {
  useGetProgramsList();
  const programs = useSelector(getProgramsList);
  const navigate = useNavigate();
  const [openCommunityDialog, setOpenCommunityDialog] = useState(false);
  const [url, setUrl] = useState(
    "https://chat.whatsapp.com/FV623VVuVy37PX5FXj1a0i"
  );
  const [qrImage, setQrImage] = useState("");
  const [createProgram, setCreateProgram] = useState(false);
  const programId = useSelector(getProgramId);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.profile);
  const { data: upcomingProgramData } = useGetUpcomingProgram();
  const { data: recentProgramData } = useGetRecentProgram();
  const [upcomingProgram, setUpcomingProgram] = useState(null);
  const [recentProgram, setRecentProgram] = useState(null);
  const [programStatuses, setProgramStatuses] = useState({});
  const [status, setStatus] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (upcomingProgramData) {
      setUpcomingProgram(upcomingProgramData?.data?.program);
    }
  }, [upcomingProgramData]);

  useEffect(() => {
    if (recentProgramData) {
      setRecentProgram(recentProgramData?.data?.program);
    }
  }, [recentProgramData]);

  useEffect(() => {
    qrCode.update({
      data: url,
    });
    generateQrCode();
  }, [url]);

  useEffect(() => {
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
  }, [programs?.allPrograms]);

  const generateQrCode = async () => {
    const dataUrl = await qrCode.getRawData("png");
    setQrImage(URL.createObjectURL(new Blob([dataUrl])));
  };

  const handleNextScreen = () => {
    dispatch(toggleProgramReadyDialog(true));
    navigate(`/programs/${programId}`);
  };

  const handleSupportClick = () => {
    window.open(
      "https://gamitar.freshdesk.com/support/home",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePlayEvivve = () => {
    window.open(
      "https://evivve.com/play-live/?utm_source=playevivve&utm_medium=website&utm_campaign=ctabutton",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleEvivveCertification = () => {
    window.open(
      "https://share.hsforms.com/1U5vreA8UTgWkYVCaSiHkEg47ybq",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const viewCertificates = async () => {
    try {
      await axiosClient().post(
        "https://app.evivve.com:4000/api/verifyUserCertificationCodee",
        {
          code: user?.certificateVerifyCode,
        }
      );
      window.open(
        `https://app.evivve.com/certification/${user?.certificateVerifyCode}`,
        "_blank",
        "noopener, noreferrer"
      );
    } catch (error) {
      toast.warning("You don't have any achievements for now.");
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

  // let buttonText;
  // if (programStatuses === "Active") {
  //   buttonText = "RUN PROGRAM";
  // } else if (status[id] === "add_participants") {
  //   buttonText = "Add Participants";
  // } else if (status[id] === "schedule_program") {
  //   buttonText = "Schedule Program";
  // } else if (status[id] === "conduct_dryrun") {
  //   buttonText = "CONDUCT DRY RUN";
  // } else if (status[id] === "run_program") {
  //   buttonText = "RUN PROGRAM";
  // }

  // const handleNextScreenChange = () => {
  //   console.log("Clicked " + status);
  //   if (status === "add_participants") {
  //     dispatch(toggleParticipantsDialog(true));
  //   } else if (status === "schedule_program") {
  //     dispatch(toggleSchedulerDialog(true));
  //   } else if (status === "conduct_dryrun") {
  //     dispatch(togglePrsentModeDialog(true));
  //   } else if (status === "run_program") {
  //     console.log("RUn Program");
  //   }
  // };

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
  if (createProgram) {
    return <OnboardingLoader handleNextScreen={handleNextScreen} />;
  }

  return (
    <>
      <CustomDialog
        open={openCommunityDialog}
        heading="SCAN THE QR"
        subheading={`Scan this QR code using the WhatsApp camera`}
        btn1Text="OKAY"
        onClose={() => setOpenCommunityDialog(false)}
        onConfirm={() => setOpenCommunityDialog(false)}
        img={qrImage}
        w="200px"
      />
      <PageContainer title="Dashboard" description="Evivve dashboard">
        <Typography variant="h5" pb={5} pt={3}>
          Dashboard
        </Typography>
        <Grid
          container
          spacing={11}
          maxWidth="lg"
          sx={{ marginLeft: "auto", marginRight: "auto" }}
          pb={4}
        >
          <Grid item xs={8}>
            <Typography variant="h5" fontWeight={700}>
              Welcome {user?.first_name}
            </Typography>
            <Typography variant="body1" mb={3}>
              Find important messages, tips, and links to helpful resources
              here:
            </Typography>

            <Box
              sx={{
                "& > :first-of-type": {
                  backgroundColor: "#e8c48f",
                },
              }}
            >
              {programs?.allPrograms?.length === 0 && (
                <ActionCard>
                  <Box>
                    <Typography fontWeight={700}>
                      Create your first Program
                    </Typography>
                    <Typography fontSize="13px">
                      Create your first Evivve Game and learn the ropes.
                    </Typography>
                  </Box>
                  <Box>
                    <ActionBtn onClick={() => setCreateProgram(true)}>
                      CREATE
                    </ActionBtn>
                  </Box>
                </ActionCard>
              )}

              {recentProgram && (
                <ActionCard>
                  <Box>
                    <Typography fontWeight={700}>Run your program</Typography>
                    <Typography fontSize="13px">
                      {recentProgram?.programName}
                      <br />
                      Schedule Status: Scheduled for{" "}
                      {moment(recentProgram?.scheduledAt).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                  <Box>
                    <ActionBtn
                      onClick={() =>
                        navigate(`/programs/${recentProgram?.programId}`)
                      }
                    >
                      DRY RUN
                    </ActionBtn>
                  </Box>
                </ActionCard>
              )}
              <ActionCard>
                <Box>
                  <Typography fontWeight={700}>
                    Join our WhatsApp Community
                  </Typography>
                  <Typography fontSize="13px">
                    Engage, collaborate, and connect with like-minded
                    facilitators worldwide, participate in interactive
                    discussions, get instant support, and expand your network.
                  </Typography>
                </Box>
                <Box>
                  <ActionBtn onClick={() => setOpenCommunityDialog(true)}>
                    JOIN
                  </ActionBtn>
                </Box>
              </ActionCard>
            </Box>

            {upcomingProgram && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  background: "#CFCBD9",
                  alignItems: "center",
                  padding: "1rem",
                  marginBottom: "4rem",
                }}
                borderRadius={1}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <IconAlarm size="5rem" color="#341A5B" />
                  <FlipClockCountdown
                    to={upcomingProgram?.scheduledAt || new Date()}
                    labels={["DAYS", "HOURS", "MINUTES"]}
                    labelStyle={{
                      fontSize: "14px",
                      color: "#341A5B",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                    digitBlockStyle={{
                      background: "#CFCBD9",
                      color: "#341A5B",
                      fontWeight: 700,
                      height: "60px",
                      marginTop: "1rem",
                      border: "none",
                      boxShadow: "none",
                      width: "30px",
                    }}
                    dividerStyle={{ color: "#000", height: 0 }}
                    // separatorStyle={{ color: "red", size: "6px" }}
                    showSeparators={false}
                    duration={0.5}
                  ></FlipClockCountdown>
                </Box>
                <Box color="#341A5B">
                  <Typography variant="h6" fontWeight={700} align="center">
                    TIME REMAINING
                  </Typography>
                  <Typography align="center" fontSize="14.5px">
                    for the upcoming program
                  </Typography>
                  <Typography align="center" fontSize="14.5px" fontWeight={600}>
                    {upcomingProgram?.programName}
                  </Typography>
                  <SecondaryBtn
                    style={{
                      width: "auto",
                      fontSize: "14px",
                      margin: "0 auto",
                      marginTop: "5px",
                    }}
                    onClick={() =>
                      navigate(`/programs/${upcomingProgram?.programId}`)
                    }
                  >
                    VIEW PROGRAM
                  </SecondaryBtn>
                </Box>
              </Box>
            )}
            <Box>
              <Box display="flex" justifyContent="space-between" flexDirection="row" alignItems="center">
              <Typography variant="h5" fontWeight={700} mb={1}>
                Your programs at a glance
              </Typography>
              <Tooltip placement="bottom" title="Create Program" >

              <SecondaryActionBtn  onClick={() => setCreateProgram(true)}>
                     <AddIcon style={{color:"white"}}/>
              </SecondaryActionBtn>
              </Tooltip>
                 
              </Box>
              <TableContainer
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                }}
              >
                <Table aria-label="programs table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Program Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Creator
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Focus Area
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Action
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {programs?.allPrograms?.length > 0 && (
                    <TableBody>
                      {filterPrograms(programs.allPrograms)
                        .filter(({ is_evivve2 }) => !is_evivve2)
                        .map(
                          ({
                            id,
                            name,
                            programType,
                            actions: { programStatus },
                          }) => (
                            <TableRow key={id}>
                              <TableCell>
                                <Stack direction="row" spacing={2}>
                                <Box 
                                  onClick={()=>navigate(`/programs/${id}`)}
                                  style={{cursor:'pointer'}} >
                                    <Typography
                                      variant="subtitle2"
                                    fontWeight={600}
                                      color="#000"
                                    >
                                      {name}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="#000"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  Placeholder
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="#000"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                   {programType?.replace("_"," ")}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="#000">
                                  {programStatuses[id] || "Unknown"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <PrimaryBtn
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    padding: "6px",
                                  }}
                                  onClick={() => {
                                    switch (status[id]) {
                                      case "add_participants":
                                        navigate(`/programs/${id}`);
                                        dispatch(
                                          toggleParticipantsDialog(true)
                                        );
                                        break;
                                      case "schedule_program":
                                        navigate(`/programs/${id}`);
                                        dispatch(toggleSchedulerDialog(true));
                                        break;
                                      case "conduct_dryrun":
                                        navigate(`/programs/${id}`);
                                        dispatch(togglePrsentModeDialog(true));
                                        break;
                                      case "run_program":
                                        getFinalRunSession(id)
                                        break;
                                      default:
                                        return "Unknown Action";
                                    }
                                  }}
                                >
                                  {(() => {
                                    switch (status[id]) {
                                      case "add_participants":
                                        return "Add Participants";
                                      case "schedule_program":
                                        return "Schedule Program";
                                      case "conduct_dryrun":
                                        return "CONDUCT DRY RUN";
                                      case "run_program":
                                        return "RUN PROGRAM";
                                      default:
                                        return "Unknown Action";
                                    }
                                  })()}
                                </PrimaryBtn>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
             {
              programs?.allPrograms?.length > 0 ? <></> :<Box m={8} mt={3} boxShadow={"0px 0px 2px  rgb(0,0,0.2,0.4)"} borderRadius={'5px'} display={"flex"} flexDirection={"column"}  justifyContent={"center"} alignItems={"center"}>
                    <h3>Let's Evolve! 🧬</h3>
                    <h4 style={{marginTop:'-0.5rem'}}>go ahead and <span style={{textDecoration:'underline',cursor:'pointer'}} onClick={() => setCreateProgram(true)}> create your program </span></h4> 
              </Box>
              }
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              mt={4}
              sx={{ background: "#341A5B" }}
              p={2}
              borderRadius={1}
              textAlign="center"
            >
              <Box color="#341A5B">
                <Grid
                  container
                  sx={{ background: "#fff" }}
                  borderRadius={1}
                  height="120px"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <img src={Community} alt="" width="51px" />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6" fontWeight={600}>
                      Practice through Play!
                    </Typography>
                    <Typography>Our next live demo game!</Typography>
                  </Grid>
                </Grid>
                <SecondaryBtn
                  width="100%"
                  mt="0.5rem"
                  onClick={handlePlayEvivve}
                >
                  Play Evivve
                </SecondaryBtn>
              </Box>

              <Box color="#341A5B" mt={3}>
                <Grid
                  container
                  sx={{ background: "#fff" }}
                  borderRadius={1}
                  height="120px"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <img src={Book} alt="" width="51px" />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6" fontWeight={600}>
                      Evivve Certification
                    </Typography>
                  </Grid>
                </Grid>
                <SecondaryBtn width="100%" mt="0.5rem" onClick={handleEvivveCertification}>
                  ENROLL NOW
                </SecondaryBtn>
              </Box>
            </Box>

            <Box container mt={4}>
              <PrimaryBtn width="100%" mt="0.5rem" onClick={handleSupportClick}>
                GET SUPPORT
              </PrimaryBtn>
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default Dashboard;
