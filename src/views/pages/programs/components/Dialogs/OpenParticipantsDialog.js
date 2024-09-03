import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleParticipantsDialog,
  toggleEditFlag,
  toggleUnsavedChangesDialog,
  getSelectedProgram,
} from "src/store/apps/programs/ProgramSlice";
import { Alert, Box, Button, Dialog, Typography } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import {
  CustomizeWrapper,
  CustomizeLabel,
  Form,
  FormField,
} from "../customize/CustomizeStyles";
import EmailChips from "src/components/shared/EmailChips";
import TextAreaInput from "src/components/shared/TextAreaInput";
import { BtnWrapper } from "src/components/shared/BtnWrapper";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import Header from "../customize/Header";
import CustomDialog from "./CustomDialog";
import { toast } from "react-toastify";
import {
  useCreateSessions,
  useGetParticipants,
  useUpdateParticipants,
} from "src/services/programs";
import { useParams } from "react-router";
import { useMutation, useQuery } from "react-query";
import axiosClient from "../../../../../utils/axios";
import QuillEditor from "src/views/forms/quill-editor/QuillEditor";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../../forms/quill-editor/Quill.css";

const DialogWrapperStyles = {
  padding: 0,
  boxSizing: "border-box",
  margin: 0,
};

const DialogStyles = {
  paddingTop: 0,
  paddingBottom: 0,
  width: "90vw",
  maxWidth: "600px",
};

const OpenParticipantsDialog = ({pid}) => {
  let { id } = useParams() ;
      
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [pid])
  useGetParticipants(id) ;
  const open = useSelector((state) => state?.programs?.showParticipantsDialog);
  const dispatch = useDispatch();
  const participants = useSelector((state) => state?.programs?.participants);
  const [moduleValues, setModuleValues] = useState({});
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  const updateParticipants = useUpdateParticipants();
  const updateParticipantsWithoutClosing = useUpdateParticipants(true);
  const createSessions = useCreateSessions();
  const owner = useSelector(getSelectedProgram).owner;
  // const session_count = (useSelector(getSelectedProgram)).session_count;
  const generalResponse = useQuery(
    "sessions_info",
    async () => await axiosClient().get(`/program/${id}/sessions_info`)
  );

  console.log(generalResponse);

  const [sessionsInfo, setSessionsInfo] = useState({});
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  useEffect(() => {
    if (!generalResponse.err && !generalResponse.loading) {
      setSessionsInfo(generalResponse.data?.data);
    }
  }, [generalResponse.data, generalResponse.loading, generalResponse.err]);

  useEffect(() => {
    setModuleValues({
      la_ead: participants?.la_ead || [],
      la_ebo: participants?.la_ebo || "",
    });
  }, [participants, open]);

  const handleClose = () => {
    if (editFlag) {
      dispatch(toggleUnsavedChangesDialog(true));
    } else {
      dispatch(toggleParticipantsDialog(false));
    }
  };

  const handleEmailDialogClose = () => {
    setOpenEmailDialog(false);
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    let emails = value
      .trim()
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    // console.log(emails);

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    if (name === "la_ead") {
      value = [...moduleValues.la_ead, ...emails];
    }

    setModuleValues({
      ...moduleValues,
      [name]: value,
    });
  };

  const handleEmailBodyChange = (value) => {
    setModuleValues({ ...moduleValues, la_ebo: value });
  };

  const handleSubmit = () => {
    dispatch(toggleParticipantsDialog(false));
  };

  const updateChips = (emailChips) => {
    setModuleValues({ ...moduleValues, la_ead: emailChips });
    dispatch(toggleEditFlag(true));
  };

  const closeDialog = (e) => {
    e.preventDefault();
    updateParticipants.mutate({
      id,
      ...moduleValues,
    });
  };

  // Open Create Session Dialog
  const openCreateSessionDialog = (e) => {
    e.preventDefault();
    setShowCreateSessionDialog(true);
    updateParticipantsWithoutClosing.mutate({
      id,
      dontReset: true,
      ...moduleValues,
    });
  };
  // Close create Session Dialog
  const closeCreateSessionDialog = (e) => {
    e.preventDefault();
    setShowCreateSessionDialog(false);
  };
  // Confirm create Session
  const confirmSessionCreate = () => {
    createSessions.mutate({
      programId: id,
    });
    setShowCreateSessionDialog(false);
  };

  const openEmailInviteDialog = (e) => {
    e.preventDefault();
    if (moduleValues?.la_ead?.length <= 0) {
      return toast.warning("Please enter at least one email address.");
    }
    if (!moduleValues?.la_ebo) {
      return toast.warning("Email body can't be empty.");
    }
    setShowEmailDialog(true);
  };

  const closeEmailInviteDialog = () => {
    setShowEmailDialog(false);
  };

  const inviteFacilitator = useMutation(
    async (data) =>
      await axiosClient().post(
        `/program/${data.programId}/sendParticipantMail`,
        { message: data.message }
      ),
    {
      onSuccess: () => {
        toast.success("Invite sent");
        generalResponse.refetch();
      },
      onError: () => {
        toast.error("Error inviting facilitator. Please try again");
        generalResponse.refetch();
      },
    }
  );

  const confirmEmailInvite = async () => {
    inviteFacilitator.mutate({ programId: id, message: moduleValues.la_ebo });
    setShowEmailSentDialog(true);
    setShowEmailDialog(false);
  };

  const getMaxParticipants = () => {
    let maxParticipants = 12;

    if (sessionsInfo?.usage_mode === "Physical") {
      maxParticipants = 20;
    }

    return maxParticipants;
  };

  return (
    <>
      <CustomDialog
        open={showEmailDialog}
        heading="Are you sure?"
        subheading={`An invitation email will be sent (marking you) to ${moduleValues?.la_ead?.length} participants. Please double check the email IDs and email messsage before confirming.`}
        btn1Text="Confirm"
        btn2Text="Cancel"
        onConfirm={confirmEmailInvite}
        discard={closeEmailInviteDialog}
      />
      <CustomDialog
        open={showEmailSentDialog}
        heading="Check your inbox!"
        subheading="A test email was sent to you"
        btn1Text="Okay"
        onConfirm={() => setShowEmailSentDialog(false)}
      />
      <CustomDialog
        open={showCreateSessionDialog}
        heading="Are you sure?"
        subheading={`You are about to split this program into ${Math.ceil(
          moduleValues?.la_ead?.length / getMaxParticipants()
        )} sessions.`}
        btn1Text="Confirm"
        btn2Text="Cancel"
        onConfirm={confirmSessionCreate}
        discard={closeCreateSessionDialog}
      />

      <Dialog
        open={openEmailDialog}
        onClose={handleEmailDialogClose}
        style={DialogWrapperStyles}
        maxWidth="920px"
      >
        <DialogContent
          style={{
            ...DialogStyles,
            maxWidth: "920px",
            height: "800px",
            maxHeight: "100%",
            display: "grid",
            gridTemplateRows: "1fr auto",
            // gap: "1rem",
            padding: "1rem 1.5rem",
          }}
        >
          <QuillEditor
            text={moduleValues?.la_ebo}
            onSave={handleEmailBodyChange}
            onClose={handleEmailDialogClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={handleClose} style={DialogWrapperStyles}>
        <DialogContent style={DialogStyles}>
          <CustomizeWrapper>
            <Header
              headerText="Manage Participants"
              headerIcon={true}
              subText={"Evivve supports up to 12 participants in Virtual mode."}
            />
            <Form onSubmit={handleSubmit}>
              <FormField>
                <CustomizeLabel htmlFor="email">
                  Email Address - ({moduleValues?.la_ead?.length})
                </CustomizeLabel>
                <EmailChips
                  id="email"
                  placeholder="Enter email addresses, and hit enter or space."
                  name="la_ead"
                  value={moduleValues?.la_ead}
                  onChange={handleOnChange}
                  updateChips={updateChips}
                  owner={owner}
                  style={
                    !owner
                      ? { pointerEvents: "none", backgroundColor: "#f0f0f0" }
                      : {}
                  }
                />
                {Math.ceil(
                  moduleValues?.la_ead?.length / sessionsInfo?.session_count
                ) > getMaxParticipants() && (
                  <Alert
                    severity="warning"
                    style={{ marginBottom: "20px" }}
                    action={
                      <Button
                        variant="inherit"
                        onClick={(e) => openCreateSessionDialog(e)}
                        style={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        Create Sessions
                      </Button>
                    }
                  >
                    We recommend splitting the Participants between{" "}
                    {Math.ceil(
                      moduleValues?.la_ead?.length / getMaxParticipants()
                    )}{" "}
                    sessions.
                  </Alert>
                )}

                {generalResponse?.data?.data?.make_ev3_free &&
                  moduleValues?.la_ead?.length > 5 && (
                    <Alert severity="warning" style={{ marginTop: "10px" }}>
                      You can only add 5 participants in free session.
                    </Alert>
                  )}
              </FormField>

              <FormField style={{ marginBottom: "10px" }}>
                <Box height={"4rem"} display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>

                <CustomizeLabel htmlFor="email">
                  Email Body
                </CustomizeLabel>
                <BtnWrapper>
                  <PrimaryBtn
                        style={{paddingLeft:'8px',paddingRight:'8px',height:"2rem",fontSize:'14px',color:'#5b105a',backgroundColor:'#FFF',}}
                          width="auto"
                           mr="auto"
                          ml="auto"
                          onClick={(e) => {
                            setOpenEmailDialog(true);
                            e.preventDefault();
                          }}
                          disabled={
                            generalResponse?.data?.data?.make_ev3_free &&
                            moduleValues?.la_ead?.length > 5
                          }
                        >
                          Preview/Edit Email
                        </PrimaryBtn>
                   </BtnWrapper>
                </Box>
                <ReactQuill
                  value={moduleValues?.la_ebo}
                  readOnly
                  modules={{
                    toolbar: false,
                  }}
                  placeholder="Email Body"
                  style={{
                    wordBreak: "break-word",
                    overflowY: "scroll",
                    border: "1px solid #dfe5ef",
                    borderRadius: "8px",
                    cursor: "default",
                  }}
                />
               
              </FormField>
              

            
              
            </Form>
           
             
          </CustomizeWrapper>
          {owner && (<>
                 
                   <BtnWrapper>
                      <PrimaryBtn
                      style={{width:'120px',color:'#5b105a',backgroundColor:'#FFF',paddingLeft:'5px',paddingRight:'5px',fontSize:'14px'}}
                        mr="auto"
                        ml="auto"
                        onClick={closeDialog}
                        disabled={
                          updateParticipants.isLoading ||
                          (generalResponse?.data?.data?.make_ev3_free &&
                            moduleValues?.la_ead?.length > 5)
                        }
                      >
                        Save
                      </PrimaryBtn>
                      <PrimaryBtn
                    style={{width:'120px',paddingLeft:'5px',paddingRight:'5px',fontSize:'14px'}}
                          onClick={(e) => openEmailInviteDialog(e)}
                          mr="auto"
                          ml="auto"
                          disabled={
                            generalResponse?.data?.data?.make_ev3_free &&
                            moduleValues?.la_ead?.length > 5
                          }
                        >
                          Send Email
                        </PrimaryBtn>
                      
                </BtnWrapper>
                </>
              )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenParticipantsDialog;
