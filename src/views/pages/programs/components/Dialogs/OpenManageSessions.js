import {
  Dialog,
  Typography,
  DialogContent,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Paper,
  Button,
  IconButton,
  Popover,
  TextField,
  DialogActions,
  Alert,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setProgramSessionCount,
  toggleParticipantsDialog,
  toggleSchedulerDialog,
  toggleSessionsDialog,
} from "src/store/apps/programs/ProgramSlice";
import { useEffect, useState } from "react";
import MenuIcon from "../MenuIcon";
import { Check, Close, Edit, Face } from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";
import axiosClient from "src/utils/axios";
import { useParams } from "react-router";
import { LoadingButton } from "@mui/lab";
import { useCreateSessions } from "src/services/programs";
import { toast } from "react-toastify";

const SessionFuncHandler = {};

const SessionRecordName = ({ sessionId, name }) => {
  const [anchor, setAnchor] = useState(null);
  const [newName, setNewName] = useState(name);
  const handleClick = (event) => setAnchor(event.currentTarget);

  const handleSubmit = () => {
    SessionFuncHandler["updateSessionName"](sessionId, newName);
    setAnchor(null);
  };
  const handleClose = () => setAnchor(null);

  return (
    <>
      <div
        style={{
          display: "flex",
          opacity: Boolean(anchor) ? "0" : "1",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <span>{name}</span>
        <Edit fontSize="10px" style={{ color: "gray", marginLeft: "10px" }} />
      </div>
      <Popover
        id={"add-facilitator"}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div style={{ padding: "10px", display: "flex", alignItems: "center" }}>
          <TextField
            id="outlined-basic"
            label="Alias"
            variant="outlined"
            size="medium"
            InputProps={{ sx: { fontSize: "14px" } }}
            InputLabelProps={{
              sx: {
                fontSize: "14px",
                color: "#5b105a",
                "&.Mui-focused": { color: "#5b105a" },
              },
            }}
            value={newName}
            onChange={(evt) => setNewName(evt.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#5b105a",
                },
                "&:hover fieldset": {
                  borderColor: "#5b105a",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5b105a",
                },
              },
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "8px",
            }}
          >
            <IconButton color="success" size="small" onClick={handleSubmit}>
              <Check style={{ fontSize: "15px" }} />
            </IconButton>
            <IconButton color="error" size="small" onClick={handleClose}>
              <Close style={{ fontSize: "15px" }} />
            </IconButton>
          </div>
        </div>
      </Popover>
    </>
  );
};

const SessionRecordFacilitator = ({
  isFacilitatorAdded,
  isOwner,
  facilitatorEmail,
  sessionId,
}) => {
  const [anchor, setAnchor] = useState(null);
  const [email, setEmail] = useState("");
  const showAnchor = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleClick = (event) => {
    SessionFuncHandler["addFacilitator"](sessionId, email);
  };
  const handleClose = () => {
    setAnchor(null);
    setEmail("");
  };

  const confirmRemoveFacilitator = () => {
    SessionFuncHandler["rfDialogOpen"](sessionId);
  };

  return (
    <>
      <Chip
        label={!isFacilitatorAdded ? "Add Facilitator" : facilitatorEmail}
        variant={!isFacilitatorAdded ? "filled" : "outlined"}
        onClick={!isFacilitatorAdded ? showAnchor : () => {}}
        style={!isFacilitatorAdded ? { borderRadius: "5px" } : {}}
        onDelete={
          isOwner || !isFacilitatorAdded ? undefined : confirmRemoveFacilitator
        }
      />
      {!isFacilitatorAdded && (
        <Popover
          id={"add-facilitator"}
          open={Boolean(anchor)}
          anchorEl={anchor}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <div
            style={{ padding: "10px", display: "flex", alignItems: "center" }}
          >
            <TextField
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              size="medium"
              InputProps={{ sx: { fontSize: "14px" } }}
              InputLabelProps={{ sx: { fontSize: "14px" } }}
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "8px",
              }}
            >
              <IconButton color="success" size="small" onClick={handleClick}>
                <Check style={{ fontSize: "15px" }} />
              </IconButton>
              <IconButton color="error" size="small" onClick={handleClose}>
                <Close style={{ fontSize: "15px" }} />
              </IconButton>
            </div>
          </div>
        </Popover>
      )}
    </>
  );
};

const SessionRecordStatus = ({ status }) => {
  let style = {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    marginRight: "6px",
    background: "red",
  };
  switch (status.toLowerCase()) {
    case "facilitator required":
      style.background = "red";
      break;
    case "not invited":
      style.background = "orange";
      break;
    case "invited":
      style.background = "orange";
      break;
    case "accepted":
      style.background = "blue";
      break;
    case "declined":
        style.background = "red";
        break;
    case "dry run":
      style.background = "blue";
      break;
    case "ready":
      style.background = "green";
      break;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={style}></div>
      <div style={{ fontSize: "12px", lineHeight: "1.4" }}>{status}</div>
    </div>
  );
};

const SessionRecordAction = ({ isOwner, facilitatorState, sessionId }) => {
  if (isOwner)
    return (
      <span style={{ color: "gray", fontSize: "12px" }}>
        No action required
      </span>
    );

  let action = () => SessionFuncHandler["sfDialogOpen"](sessionId);
  let label = "Find Facilitator";
  switch (facilitatorState) {
    case "NOT_INVITED":
      label = "Invite";
      action = () => SessionFuncHandler["inviteFacilitator"](sessionId);
      break;
    case "INVITED":
      label = "Resend Invite";
      action = () => SessionFuncHandler["inviteFacilitator"](sessionId);
      break;
    case "DECLINED":
        label = "Invite";
        action = () => SessionFuncHandler["inviteFacilitator"](sessionId);
        break;
    case "ACCEPTED":
      return (
        <span style={{ color: "gray", fontSize: "12px" }}>
          No action required
        </span>
      );
  }

  return (
    <Chip label={label} style={{ borderRadius: "5px" }} onClick={action} />
  );
};

const SessionRecord = ({ number, session }) => {
  const confirmRemoveSession = () => {
    SessionFuncHandler["rsDialogOpen"](session.id);
    //alert(session.id);
  };
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell width={10}>{number + 1}</TableCell>
      <TableCell align="center">
        <SessionRecordName sessionId={session.id} name={session.name} />
      </TableCell>
      <TableCell align="center">
        <SessionRecordFacilitator
          sessionId={session.id}
          isFacilitatorAdded={session.facilitator}
          isOwner={session.facilitator?.state == "OWNER"}
          facilitatorEmail={session.facilitator?.email}
        />
      </TableCell>
      <TableCell align="center">
        <SessionRecordStatus status={session.status} />
      </TableCell>
      <TableCell align="center">
        <SessionRecordAction
          sessionId={session.id}
          isOwner={session.facilitator?.state == "OWNER"}
          facilitatorState={session.facilitator?.state}
        />
      </TableCell>
      <TableCell align="center">
        <MenuIcon
          isOwner={session.facilitator?.state == "OWNER"}
          onDelete={confirmRemoveSession}
          onCopy={() => {
            navigator.clipboard.writeText(
              `${process.env.REACT_APP_GAME_APP}/evivve3/programs/present/${session.id}`
            );
            toast.success("Link copied");
          }}
        />
      </TableCell>
    </TableRow>
  );
};

const OpenManageSessions = ({pid}) => {
  let { id } = useParams() ;
      
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [pid])
  
 
  const [showAlert, setShowAlert] = useState(false);
  const [showRemoveFacilitator, setShowRemoveFacilitator] = useState(false);
  const [showRemoveSession, setShowRemoveSession] = useState(false);
  const open = useSelector((state) => state?.programs?.showSessionsDialog);
  const dispatch = useDispatch();

  const [sessions, setSessions] = useState([]);
  const [sessionsInfo, setSessionsInfo] = useState({});
  const sessionsResponse = useQuery(
    "sessions",
    async () => await axiosClient().get(`/program_session?program_id=${id?id:pid}`)
  );
  const generalResponse = useQuery(
    "sessions_info",
    async () => await axiosClient().get(`/program/${id?id:pid}/sessions_info`)
  );
  const createSessions = useCreateSessions(() => {
    generalResponse.refetch();
    sessionsResponse.refetch();
  });

  // console.log(generalResponse?.data?.data)
  const isInvited = (id) => {
    const temp = [...(sessions || [])];
    const session = temp.find((o) => o.id == id);
    // console.log(session);

    if (
      session &&
      (session.status == "Not Invited" ||
        session.status == "Facilitator Required")
    ) {
      return false;
    }

    return true;
  };

  const isSessionPaid = (id) => {
    const temp = [...(sessions || [])];
    const session = temp.find((o) => o.id == id);

    // if(!session)
    // {
    //     return false;
    // }

    // console.log(session?.sessionState)

    if (session?.sessionState === "SCHEDULED") {
      return true;
    }

    return false;
  };

  const checkForUnpaidSessions = () => {
    let unpaidSessions = "";
    let notPaid = false;

    // console.log(sessionsResponse.data?.data?.sessions)

    for (let i = 0; i < sessionsResponse.data?.data?.sessions.length; i++) {
      if (
        sessionsResponse.data?.data?.sessions[i].sessionState === "INACTIVE"
      ) {
        // console.log(sessionsResponse.data?.data?.sessions[i])
        unpaidSessions +=
          '"' + sessionsResponse.data?.data?.sessions[i].name + '", ';

        notPaid = true;
      }
    }

    if (unpaidSessions.length > 0)
      unpaidSessions = unpaidSessions.slice(0, unpaidSessions.length - 2);
    return { notPaid, unpaidSessions };
  };

  const addFacilitator = useMutation(
    async (data) =>
      await axiosClient().put(`/program_session/${data.sess_id}/facilitator`, {
        facilitator_email: data.email,
      }),
    {
      onError: () => {
        toast.error("Error creating sessions. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const removeFacilitator = useMutation(
    async (data) =>
      await axiosClient().delete(
        `/program_session/${data.sess_id}/facilitator`
      ),
    {
      onSuccess: () => {
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error removing facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const removeSession = useMutation(
    async (data) =>
      await axiosClient().delete(`/program_session/${data.sess_id}`),
    {
      onSuccess: () => {
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error removing facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const notifyRemovedFacilitator = useMutation(
    async (data) =>
      await axiosClient().post(
        `/program_session/${data.sess_id}/mailRemovedFacilitator`
      ),
    {
      onSuccess: () => {
        toast.success("Invite sent");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error notifying facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const notifyRemovedSession = useMutation(
    async (data) =>
      await axiosClient().post(
        `/program_session/${data.sess_id}/mailDeletedSession`
      ),
    {
      onSuccess: () => {
        toast.success("Invite sent");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error notifying facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const updateSessionName = useMutation(
    async (data) =>
      await axiosClient().put(`/program_session/${data.sess_id}`, {
        name: data.name,
      }),
    {
      onSuccess: () => {
        sessionsResponse.refetch();
        generalResponse.refetch();
      },
      onError: () => {
        toast.error("Error updating name. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const inviteFacilitator = useMutation(
    async (data) =>
      await axiosClient().post(
        `/program_session/${data.sess_id}/mailInviteFacilitator`,
        { body: data.body }
      ),
    {
      onSuccess: () => {
        toast.success("Invite sent");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error inviting facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const sourceFacilitator = useMutation(
    async (data) =>
      await axiosClient().post(
        `/program_session/${data.sess_id}/mailSourceFacilitator`
      ),
    {
      onSuccess: () => {
        toast.success("Invite sent");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error("Error inviting facilitator. Please try again");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  const addNewSession = useMutation(
    async (data) =>
      await axiosClient().post(`/program_session`, { programId: id }),
    {
      onSuccess: () => {
        toast.success("New session added");
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
      onError: () => {
        toast.error(
          "Error adding new session. Max limit of sessions has been hit."
        );
        generalResponse.refetch();
        sessionsResponse.refetch();
      },
    }
  );

  useEffect(() => {
    if (open) {
      generalResponse.refetch();
      sessionsResponse.refetch();
    }
  }, [open]);

  useEffect(() => {
    if (!generalResponse.err && !generalResponse.loading) {
      setSessionsInfo(generalResponse.data?.data);
    }
  }, [generalResponse.data, generalResponse.loading, generalResponse.err]);

  useEffect(() => {
    if (!sessionsResponse.err && !sessionsResponse.loading) {
      dispatch(
        setProgramSessionCount(
          sessionsResponse.data?.data?.sessions?.length || 1
        )
      );
      setSessions(sessionsResponse.data?.data?.sessions);
    }
  }, [sessionsResponse.data, sessionsResponse.loading, sessionsResponse.err]);

  const handleClose = () => {
    dispatch(toggleSessionsDialog(false));
  };

  const closeDialog = () => {
    dispatch(toggleSessionsDialog(false));
  };

  const addSession = () => {
    addNewSession.mutate();
  };

  SessionFuncHandler["openAlert"] = () => {
    setShowAlert(true);
  };

  SessionFuncHandler["updateSessionName"] = (sessionId, name) => {
    // const temp = [...sessions];
    // const session = temp.find(o => o.id == sessionId);
    // session.name = name;
    // setSessions(temp);

    updateSessionName.mutate({ sess_id: sessionId, name });
  };

  SessionFuncHandler["addFacilitator"] = (sessionId, email) => {
    const temp = [...sessions];
    const session = temp.find((o) => o.id == sessionId);
    session.facilitator = {
      state: "NOT_INVITED",
      email,
    };
    session.status = "Not Invited";
    setSessions(temp);

    addFacilitator.mutate({ sess_id: sessionId, email });
  };

  SessionFuncHandler["confirmRemoveFacilitator"] = () => {
    setShowRemoveFacilitator(true);
  };

  SessionFuncHandler["removeFacilitator"] = (sessionId) => {
    const temp = [...sessions];
    const session = temp.find((o) => o.id == sessionId);
    session.facilitator = undefined;
    session.status = "Facilitator Required";
    setSessions(temp);
  };

  SessionFuncHandler["removeSession"] = () => {
    //        const temp = [...sessions];
    //        delete temp[1];
    //        setSessions(temp);
    setShowRemoveSession(true);
  };

  SessionFuncHandler["inviteFacilitator"] = (sessionId) => {
    if (!checkForUnpaidSessions().notPaid) {
      inviteFacilitator.mutate({ sess_id: sessionId, body: "Hello" });
    } else {
      toast.error(
        "Complete payment for all sessions before inviting facilitators."
      );
    }
  };

  const onCreateSessions = () => {
    createSessions.mutate({
      programId: id,
    });
    // sessionsResponse.refetch();
  };

  const [rfDialogInfo, setRFDialogInfo] = useState({
    mailCheck: false,
    sessionId: null,
  });
  const [rsDialogInfo, setRSDialogInfo] = useState({
    mailCheck: false,
    sessionId: null,
  });
  const [sfDialogInfo, setSFDialogInfo] = useState({ sessionId: null });

  SessionFuncHandler["rfDialogOpen"] = (sessionId) => {
    setRFDialogInfo({ mailCheck: false, sessionId });
    setShowRemoveFacilitator(true);
  };

  SessionFuncHandler["rsDialogOpen"] = (sessionId) => {
    setRSDialogInfo({ mailCheck: false, sessionId });
    setShowRemoveSession(true);
  };

  SessionFuncHandler["sfDialogOpen"] = (sessionId) => {
    if (!checkForUnpaidSessions().notPaid) {
      setSFDialogInfo({ sessionId });
      setShowAlert(true);
    } else {
      toast.error(
        "Complete payment for all sessions before finding facilitators."
      );
    }
  };

  // ============ //

  const rfDialogConfirm = () => {
    console.log(rfDialogInfo);

    if (rfDialogInfo.sessionId) {
      if (rfDialogInfo.mailCheck) {
        notifyRemovedFacilitator.mutate({ sess_id: rfDialogInfo.sessionId });
      }

      removeFacilitator.mutate({ sess_id: rfDialogInfo.sessionId });
    } else {
      toast.error("Something went wrong. Try again");
    }
    setShowRemoveFacilitator(false);
  };

  const rsDialogConfirm = () => {
    console.log(rsDialogInfo);
    if (rsDialogInfo.sessionId) {
      if (rsDialogInfo.mailCheck) {
        notifyRemovedSession.mutate({ sess_id: rsDialogInfo.sessionId });
      }

      removeSession.mutate({ sess_id: rsDialogInfo.sessionId });
    } else {
      toast.error("Something went wrong. Try again");
    }
    setShowRemoveSession(false);
  };

  const sfDialogConfirm = () => {
    if (sfDialogInfo.sessionId) {
      sourceFacilitator.mutate({ sess_id: sfDialogInfo.sessionId });
    } else {
      toast.error("Something went wrong. Try again");
    }
    setShowAlert(false);
  };

  const sfCompletePayment = () => {
    dispatch(toggleSchedulerDialog(true));
    dispatch(toggleSessionsDialog(false));
  };

  const notifyRemoveFacilitator = (event, sessionId) => {
    setRFDialogInfo({ mailCheck: event.target.checked, sessionId: sessionId });
  };

  const notifyRemoveSession = (event, sessionId) => {
    setRSDialogInfo({ mailCheck: event.target.checked, sessionId: sessionId });
  };

  const getMaxParticipants = () => {
    let maxParticipants = 12;

    console.log(sessionsInfo?.usage_mode);

    if (sessionsInfo?.usage_mode === "Physical") {
      maxParticipants = 20;
    }

    return maxParticipants;
  };

  return (
    <>
      <Dialog
        open={showRemoveSession}
        onClose={() => setShowRemoveSession(false)}
        PaperProps={{ style: { width: "400px" } }}
      >
        <DialogContent>
          <Typography variant="h5" mb={3} fontWeight={700} fontSize={20}>
            Are you sure?
          </Typography>
          <p>
            Removing the session will disregard any progress made by the
            facilitator.
          </p>
          {isSessionPaid(rsDialogInfo.sessionId) && (
            <p>1 credit will be reverted to your account</p>
          )}
          {!checkForUnpaidSessions().notPaid &&
            sessions &&
            isInvited(rsDialogInfo.sessionId) && (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(evt) =>
                      notifyRemoveSession(evt, rsDialogInfo.sessionId)
                    }
                  />
                }
                label="Inform facilitator through email, if any"
              />
            )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{ backgroundColor: "#ffdbf9", color: "#5b105a" }}
            onClick={() => setShowRemoveSession(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={false}
            disabled={false}
            variant="contained"
            style={{ background: "#5b105a" }}
            loadingIndicator="Cloning..."
            onClick={rsDialogConfirm}
            size="small"
          >
            Remove Session
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showRemoveFacilitator}
        onClose={() => setShowRemoveFacilitator(false)}
        PaperProps={{ style: { width: "400px" } }}
      >
        <DialogContent>
          <Typography variant="h5" mb={3} fontWeight={700} fontSize={20}>
            Are you sure?
          </Typography>
          <p>
            Removing the facilitator will reset any progress they made over the
            program.
          </p>
          {!checkForUnpaidSessions().notPaid &&
            isInvited(rfDialogInfo.sessionId) && (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(evt) =>
                      notifyRemoveFacilitator(evt, rfDialogInfo.sessionId)
                    }
                  />
                }
                label="Inform facilitator through email"
              />
            )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{ backgroundColor: "#ffdbf9", color: "#5b105a" }}
            onClick={() => setShowRemoveFacilitator(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={false}
            disabled={false}
            variant="contained"
            style={{ background: "#5b105a" }}
            loadingIndicator="Removing facilitator..."
            onClick={rfDialogConfirm}
            size="small"
          >
            Remove Facilitator
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showAlert}
        onClose={() => setShowAlert(false)}
        PaperProps={{ style: { width: "400px" } }}
      >
        {/* <DialogContent>
        <Typography variant="h5" mb={3} fontWeight={700} fontSize={20}>
          Confirmation
        </Typography>
        <p>We will be sending a request to our certified evivve facilitators through email.</p>
    </DialogContent> */}
        {/* <DialogActions>
        <Button variant="contained" size="small" style={{backgroundColor: '#ffdbf9', color: '#5b105a'}} onClick={() => setShowAlert(false)}>Cancel</Button>
        <LoadingButton
            loading={false}
            disabled={false}
            variant="contained"
            style={{background: "#5b105a"}}
            loadingIndicator="..."
            onClick={sfDialogConfirm}
            size="small"
        >
          Send Mail
        </LoadingButton>
    </DialogActions> */}

        <DialogContent>
          <Typography variant="h5" mb={3} fontWeight={700} fontSize={20}>
            Feature Coming Soon.
          </Typography>
          <p>
            This feature will be coming to Evivve soon. Thank you, for your
            Patience.
          </p>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{ background: "#5b105a" }}
            onClick={() => setShowAlert(false)}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose} maxWidth={"900px"}>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              Manage Sessions
            </div>
            <div>
              <IconButton onClick={closeDialog}>
                <Close />
              </IconButton>
            </div>
          </div>
          {false && (
            <Typography variant="h6" mb={3} fontWeight={700}>
              Manage Sessions
            </Typography>
          )}
          <div
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid lightgray",
              fontSize: "14px",
              maxWidth: "300px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Total Participants:</b>
              <div>{sessionsInfo ? sessionsInfo.participant_count : "-"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Program Type:</b>
              <div>{sessionsInfo ? sessionsInfo.usage_mode : "-"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Session Count:</b>
              <div>{sessionsInfo ? sessionsInfo.session_count : "-"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Avg. Participants per Session:</b>
              <div>
                {sessionsInfo
                  ? Math.round(
                      sessionsInfo.participant_count /
                        sessionsInfo.session_count
                    )
                  : "-"}
              </div>
            </div>
          </div>
          {
            //TODO: 12 if in person, 10 if virtual (sessions_info.usage_mode)

            sessionsInfo &&
              Math.ceil(
                sessionsInfo.participant_count / sessionsInfo.session_count
              ) > getMaxParticipants() && (
                <Alert
                  severity="warning"
                  style={{ marginBottom: "20px" }}
                  action={
                    <Button
                      variant="inherit"
                      onClick={onCreateSessions}
                      style={{ fontSize: "12px", fontWeight: "bold" }}
                    >
                      Create Sessions
                    </Button>
                  }
                >
                  We recommend splitting the Participants between{" "}
                  {Math.ceil(
                    sessionsInfo?.participant_count / getMaxParticipants()
                  )}{" "}
                  sessions.
                </Alert>
              )
          }
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead style={{ background: "rgb(91, 16, 90)" }}>
                <TableRow>
                  <TableCell
                    width={10}
                    style={{
                      color: "white",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  ></TableCell>
                  <TableCell
                    align="left"
                    style={{
                      color: "white",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    Alias
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      color: "white",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    Facilitator
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      color: "white",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      color: "white",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    Action
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions?.map((session, i) => (
                  <SessionRecord
                    key={session.id}
                    session={session}
                    number={i}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {checkForUnpaidSessions().notPaid && (
            <div style={{ marginTop: "20px" }}>
              <Alert
                severity="warning"
                style={{ marginBottom: "20px" }}
                action={
                  <Button
                    variant="inherit"
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                    onClick={sfCompletePayment}
                  >
                    Complete Payment
                  </Button>
                }
              >
                Additional Sessions need to be paid for{" "}
                <strong>{checkForUnpaidSessions().unpaidSessions}</strong>
              </Alert>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              marginTop: "20px",
            }}
          >
            {generalResponse?.data?.data?.make_ev3_free ? (
              <Tooltip title="Adding sessions is disabled for free Programs">
                <span>
                  <Button
                    variant="contained"
                    style={{ background: "#5b105a", fontSize: "12px" }}
                    onClick={addSession}
                    disabled={true}
                  >
                    Add Session
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="">
                <Button
                  variant="contained"
                  style={{ background: "#5b105a", fontSize: "12px" }}
                  onClick={addSession}
                  disabled={false}
                >
                  Add Session
                </Button>
              </Tooltip>
            )}
            <div style={{ marginRight: "10px" }}></div>
            <Button
              disabled={false}
              variant="contained"
              style={{ background: "#5b105a", fontSize: "12px" }}
              onClick={sfCompletePayment}
            >
              Schedule Program
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenManageSessions;
