import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Box,
  Stack,
  CircularProgress,
  DialogActions,
  Chip,
  Tooltip,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  getParticipants,
  getSelectedProgram,
  toggleItineraryModeDialog,
  toggleParticipantsDialog,
  togglePrsentModeDialog,
  toggleSessionsDialog,
} from "src/store/apps/programs/ProgramSlice";
import {
  SchedulerCallbacks,
  getScheduleInfo,
  setEvivveFreeCheck,
} from "./SchedulerSlice";
import moment from "moment-timezone";
import { useGetParticipants } from "src/services/programs";
import { useParams } from "react-router";
import axiosClient from "src/utils/axios";
import { useMutation, useQuery } from "react-query";
import {
  DialogHeading,
  DialogSubHeading,
} from "src/components/shared/DialogComponents";
import { toast } from "react-toastify";
import { useProgramPayment, usePurchaseProgram } from "./PaymentsService";
import BuyProgramDialog from "./BuyProgamDialog";
import queryClient from "src/utils/queryClient";

const PaymentBox = ({
  programId,
  openBuyProgamDialog,
  subscriptionPlan,
  creditsRequired,
  freeCredits,
  userCredits,
  openConfirmDialog,
  openDialog,
  isFree,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
        How would you like to pay?
      </Typography>

      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Box>
          <Typography fontSize={"14px"} mb={0} fontWeight={700}>
            Credits Required : {creditsRequired}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0,
              color: userCredits >= creditsRequired ? "green" : "red",
            }}
          >
            You have {userCredits || 0} unused session Credits
          </Typography>
        </Box>

        {(subscriptionPlan.toUpperCase() == "FREE" &&
          creditsRequired > userCredits) ||
        creditsRequired > userCredits ? (
          <Stack direction="row" gap={2}>
            <PrimaryBtn
              style={{ width: "auto" }}
              onClick={
                subscriptionPlan.toUpperCase() == "FREE"
                  ? () => openBuyProgamDialog()
                  : () => openDialog("credits")
              }
            >
              {subscriptionPlan.toUpperCase() == "FREE"
                ? "Buy Program"
                : "Buy Credits"}
            </PrimaryBtn>
            <PrimaryBtn onClick={() => openDialog("credits")}>
              Upgrade
            </PrimaryBtn>
          </Stack>
        ) : (
          <Stack direction="row" gap={2}>
            <PrimaryBtn
              style={{ width: "auto" }}
              onClick={() => openConfirmDialog("credits")}
            >
              Use Credits
            </PrimaryBtn>
          </Stack>
        )}
      </Stack>

      {freeCredits && freeCredits > 0 ? (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Box>
            <Typography fontSize={"14px"} mb={0} fontWeight={700}>
              Change settings and schedule for free
            </Typography>
            <Typography variant="caption" sx={{ mt: 0 }}>
              You have {freeCredits} unused free session Credits
            </Typography>
          </Box>

          {!isFree && (
            <PrimaryBtn
              style={{ width: "auto" }}
              onClick={() => openDialog("free")}
            >
              {subscriptionPlan.toUpperCase() == "FREE"
                ? "Change Settings"
                : "Make Evivve Free"}
            </PrimaryBtn>
          )}
          {isFree && (
            <PrimaryBtn
              style={{ width: "auto" }}
              onClick={() => openConfirmDialog("free")}
            >
              Use Free Credits
            </PrimaryBtn>
          )}
        </Stack>
      ) : (
        ""
      )}
    </Box>
  );
};

const NextStepBox = ({ onClose }) => {
  const dispatch = useDispatch();

  function openItinerary() {
    dispatch(toggleItineraryModeDialog(true));
    onClose();
  }

  function openManageSessions() {
    dispatch(toggleSessionsDialog(true));
    onClose();
  }

  function conductDryRun() {
    dispatch(togglePrsentModeDialog(true));
    onClose();
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
        What would you like to do next?
      </Typography>

      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Box>
          <Typography fontSize={"14px"} mb={0} fontWeight={700}>
            View/Download Program Itinerary
          </Typography>
        </Box>

        <PrimaryBtn
          style={{ width: "175px", fontSize: "15px" }}
          onClick={openItinerary}
        >
          View Itinerary
        </PrimaryBtn>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Box>
          <Typography fontSize={"14px"} mb={0} fontWeight={700}>
            Invite/Search Facilitators
          </Typography>
        </Box>

        <PrimaryBtn
          style={{ width: "175px", fontSize: "15px" }}
          onClick={openManageSessions}
        >
          Invite Facilitators
        </PrimaryBtn>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Box>
          <Typography fontSize={"14px"} mb={0} fontWeight={700}>
            Conduct Dry Run
          </Typography>
        </Box>

        <PrimaryBtn
          style={{ width: "175px", fontSize: "15px" }}
          onClick={conductDryRun}
        >
          Dry Run
        </PrimaryBtn>
      </Stack>
    </Box>
  );
};

const ConfirmDialog = ({
  open,
  confirmAction,
  credits,
  isFree,
  onConfirm,
  onClose,
}) => {
  const { id } = useParams();
  const callRazorpay = useProgramPayment(
    () => {
      SchedulerCallbacks["refetchPaymentInto"]();
      toast.success("Program purchased successfully.");
      onClose();
    },
    () => {
      toast.error("Program purchase failed. Please try again later.");
      onClose();
    }
  );

  const purchaseProgram = usePurchaseProgram({
    onSuccess: () => {
      SchedulerCallbacks["refetchPaymentInto"]();
      toast.success("Program purchased successfully.");
      onClose();
    },
    onError: (err) => {
      console.log("Error: ");
      console.dir(err);
      toast.error("Program purchase failed. Please try again later.");
      onClose();
    },
  });

  const onBuyProgram = () => {
    callRazorpay.mutate({ programId: id });
  };

  const onPurchaseProgram = (credit_type) => {
    console.log("USING CREDIT TYPE: " + credit_type);
    purchaseProgram.mutate({ programId: id, creditType: credit_type });
  };

  function onConfirm() {
    switch (confirmAction.toUpperCase()) {
      case "PROGRAM":
        onPurchaseProgram("credits");
        //onBuyProgram();
        break;
      case "CREDITS":
      case "FREE":
        onPurchaseProgram(confirmAction.toLowerCase());
        break;
      default:
        throw new Error("Please contact support!");
    }
  }

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
        Your {credits} {isFree && "free"} credit(s) will be used up for this
        program session. Don't worry, you can still make edits to the program.
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


const ReviewProgramDialog = ({ pid ,owner,programStatus, open, onClose, openDialog }) => {
  let { id } = useParams() ;
      
  if(!id)
      {
        id=pid
  }
  const [paymentInfo, setPaymentInfo] = useState({});
  const [buyProgamDialog, setBuyProgamDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const dispatch = useDispatch();

  useGetParticipants(id);



  const paymentInfoResp = useQuery(
    "payment-info",
    async () => await axiosClient().get(`/program/${id}/payment`),
    {
      onSuccess: (resp) => {
        const paymentInfoCopy = resp.data.paymentInfo;
        setPaymentInfo(resp.data.paymentInfo);
        dispatch(
          setEvivveFreeCheck({
            isProgramTimeOkay: paymentInfoCopy.isProgramTimeOkay,
            isParticipantsCountOkay: paymentInfoCopy.isParticipantsCountOkay,
            isSessionCountOkay: paymentInfoCopy.isSessionCountOkay,
            isGameSettingOkay: paymentInfoCopy.isGameSettingOkay,
          })
        );
      },
    }
  );

  const program = useSelector(getSelectedProgram);
  const participants = useSelector(getParticipants).la_ead?.length || 0;
  const schedule = useSelector(getScheduleInfo);

  const openConfirmDialog = (action) => {
    setConfirmAction(action);
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmAction(null);
    setConfirmDialog(false);
  };

  SchedulerCallbacks["refetchPaymentInto"] = () => {
    paymentInfoResp.refetch();
  };

  useEffect(() => {
    if (open) {
      paymentInfoResp.refetch();
    }
    queryClient.invalidateQueries('program-schedule')
  }, [open]);

  return (
    <>
      <BuyProgramDialog
        programId={id}
        open={buyProgamDialog}
        onClose={() => setBuyProgamDialog(false)}
        credits={paymentInfo.sessions - paymentInfo.paidSessions}
      />
      <ConfirmDialog
        open={confirmDialog}
        confirmAction={confirmAction}
        credits={paymentInfo.sessions - paymentInfo.paidSessions}
        onClose={closeConfirmDialog}
      />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" fontWeight={700} mb={3}>
            Review Your Program
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1.5rem",
              border: "2px solid #D0D5DD",
              borderRadius: 2,
              p: 1,
              position: "relative",
            }}
          >
            {(programStatus !== "Active" && owner) &&
              <Tooltip title="Edit Schedule" placement="bottom">
                 <Button
              sx={{
                position: "absolute",
                top: 1,
                right: 0,
                color: "#000",
                minWidth: 0,
              }}
              onClick={() => openDialog("schedule")}
            >
              <EditIcon style={{backgroundColor:'white',border:'1px solid grey',height:'1.8rem',width:'1.8rem',padding:'4px',borderRadius:'5px'}} fontSize="16px" />
            </Button>
              </Tooltip>
             
            }
              <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Program Name
              </Typography>
              <Typography variant="body2">
                {program?.currTemplate?.title}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Date and Time{" "}
                <span
                  style={{
                    color: "gray",
                    fontSize: "14px",
                    fontWeight: "normal",
                  }}
                >
                  ({schedule.timezone})
                </span>
              </Typography>
              <Typography variant="body2">
                {moment
                  .tz(schedule.date, schedule.timezone)
                  .format("Do MMM, YYYY")}{" "}
                From{" "}
                {moment
                  .tz(schedule.startTime, schedule.timezone)
                  .format("hh:mm A")}{" "}
                to{" "}
                {moment
                  .tz(schedule.endTime, schedule.timezone)
                  .format("hh:mm A")}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Participants and Sessions
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                Participants count : {participants}{" "}
                {programStatus !== "Active"&& owner &&
                  (<PrimaryBtn
                  style={{
                    fontSize: "12px",
                    padding: "1px 10px",
                  }}
                  width="auto"
                  onClick={() => dispatch(toggleParticipantsDialog(true))}
                >
                  Add Participants
                </PrimaryBtn>)
                }
              </Typography>
              {!participants && programStatus !== "Active" && (
                <Typography variant="caption" color="#d92f23">
                  *You're continuing without adding participants. Add
                  Participants using the above button.
                </Typography>
              )}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Type
              </Typography>
              <Typography variant="body2">
                {program?.usage?.charAt(0).toUpperCase() +
                  program?.usage?.slice(1)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Count*
              </Typography>
              <Typography variant="body2">
                {paymentInfo.sessions || 1}
              </Typography>
              <Typography variant="caption">
                *Indicates the number of game credits you will need for this
                program
              </Typography>
            </Box>
          </Box>

          {!paymentInfoResp.isLoading ? (
            paymentInfo.sessions - paymentInfo.paidSessions > 0 ? (
              <PaymentBox
                programId={id}
                openBuyProgamDialog={() => setBuyProgamDialog(true)}
                subscriptionPlan={paymentInfo.subscription || "FREE"}
                creditsRequired={
                  paymentInfo.sessions - paymentInfo.paidSessions
                }
                freeCredits={paymentInfo.freeCredits}
                userCredits={paymentInfo.userCredits}
                openConfirmDialog={openConfirmDialog}
                isFree={
                  schedule.isProgramTimeOkay &&
                  schedule.isParticipantsCountOkay &&
                  schedule.isSessionCountOkay &&
                  schedule.isGameSettingOkay
                }
                openDialog={openDialog}
              />
            ) : (
              <NextStepBox onClose={onClose} />
            )
          ) : (
            <div
              style={{
                display: "flex",
                padding: "40px 20px 20px 20px",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewProgramDialog;
