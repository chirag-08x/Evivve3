import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CardContent,
  Grid,
  IconButton,
  Typography,
  Tooltip,
  Button,
  Stack,
  Dialog,
  Tabs,
  Tab,
} from "@mui/material";
import { IconChevronRight, IconArrowLeft } from "@tabler/icons";
import InputAdornment from "@mui/material/InputAdornment";
import Logo from "src/assets/images/logos/logo_collapsed.svg";
import { TRANSACTIONS } from "src/views/pages/programs/constants";

// components
import BlankCard from "../../shared/BlankCard";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";
import { IconCreditCard, IconPencilMinus } from "@tabler/icons";
import { PrimaryBtn, PrimaryBtn2 } from "src/components/shared/BtnStyles";
import { CustomDialog } from "src/views/pages/programs/components/Dialogs";
import BuyCreditsDialog from "src/views/apps/scheduler/BuyCreditsDialog";
import { useSelector } from "react-redux";
import {
  useGetBillingInfo,
  useGetCurrentPlan,
  useUpdateBillingInfo,
} from "src/services/billing";
import countryData from "src/components/forms/form-elements/autoComplete/countrydata";
import { TimezoneSelect } from "src/components/shared/AuthStyles";
import moment from "moment";
import { DialogHeading } from "src/components/shared/DialogComponents";
import TransactionsDialog from "./TransactionsDialog";
import TransferCreditsDialog from "./TransferCreditsDialog";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import axiosClient from "src/utils/axios";

function useCancelSubscriptionMutation({ onSuccess, onError }) {
  return useMutation(
    async () => await axiosClient().post("/subscription/cancel"),
    {
      onSuccess,
      onError,
    }
  );
}

const BillsTab = () => {
  const [openDowngrade, setOpenDowngrade] = useState(false);
  const [openCancelPlan, setOpenCancelPlan] = useState(false);
  const [openBuyCredits, setOpenBuyCredits] = useState(false);
  const billing = useSelector((state) => state?.billing?.businessInfo);
  const plan = useSelector((state) => state?.billing?.currentPlan);
  const [billingInfo, setBillingInfo] = useState({});
  const [currentPlan, setCurrentPlan] = useState({});
  const { refetch: refetchBilling } = useGetBillingInfo();
  const { refetch: refetchPlan } = useGetCurrentPlan();
  const updateBillingInfo = useUpdateBillingInfo();
  const [openTransactionDialog, setOpenTransactionsDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  console.log("CP", currentPlan);

  const cancelSubscription = useCancelSubscriptionMutation({
    onSuccess: () => {
      refetchPlan();
      toast.success("Subscription cancelled successfully");
      setOpenCancelPlan(false);
    },
    onError: () => {
      toast.error(
        "Subscription cancelled failed. Please contact support@gamitar.com."
      );
    },
  });

  const cancelPlan = () => {
    cancelSubscription.mutate();
  };

  useEffect(() => {
    setBillingInfo(billing);
    setCurrentPlan(plan);
  }, [billing, plan]);

  const handleBuyCreditsClose = () => {
    refetchPlan();
    refetchBilling();
    setOpenBuyCredits(false);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const handleSubmit = () => {
    const { credits, ...rest } = billingInfo;
    updateBillingInfo.mutate(rest);
  };

  const handleReset = () => {
    setBillingInfo(billing);
    setCurrentPlan(plan);
  };

  const closeTransactionDialog = () => {
    refetchBilling();
    setOpenTransactionsDialog(false);
  };

  const closeTransferDialog = () => {
    refetchBilling();
    setOpenTransferDialog(false);
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={9}>
          <BlankCard>
            <CardContent>
              <Typography variant="h4" mb={2}>
                Billing Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bname">
                    Business Name*
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-bname"
                    name="businessName"
                    value={billingInfo?.businessName || ""}
                    variant="outlined"
                    placeholder="Business Name"
                    fullWidth
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bsector">
                    Business Sector*
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-bsector"
                    value={billingInfo?.businessSector || ""}
                    variant="outlined"
                    fullWidth
                    placeholder="Business Sector"
                    name="businessSector"
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-baddress">
                    Business Address*
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-baddress"
                    value={billingInfo?.businessAddress || ""}
                    variant="outlined"
                    placeholder="Business Address"
                    fullWidth
                    name="businessAddress"
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bcy">
                    Country*
                  </CustomFormLabel>
                  <TimezoneSelect
                    name="country"
                    value={billingInfo?.country}
                    style={{
                      border: "1px solid #DFE5EF",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      color: "inherit",
                      padding: "13px 14px",
                    }}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value={""}>Select a country</option>
                    {countryData?.map(({ label }, idx) => (
                      <option key={idx} value={label}>
                        {label}
                      </option>
                    ))}
                  </TimezoneSelect>
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bcy">
                    GST Number.*
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-gst"
                    value={billingInfo?.gstNumber || ""}
                    variant="outlined"
                    fullWidth
                    placeholder="GST Number"
                    name="gstNumber"
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bcy">
                    Transactions
                  </CustomFormLabel>
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: "space-between",
                      background: "#fff",
                      color: "#000",
                      border: "1px solid #D0D5DD",
                      "&:hover": {
                        backgroundColor: "inherit",
                        color: "inherit",
                      },
                    }}
                    onClick={() => setOpenTransactionsDialog(true)}
                    endIcon={<IconChevronRight />}
                  >
                    Transactions
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bcy">
                    Credits Available
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-gst"
                    value={`Credits Available : ${billingInfo?.credits}`}
                    variant="outlined"
                    readOnly
                    sx={{ input: { cursor: "default" } }}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PrimaryBtn
                            style={{
                              fontSize: "14px",
                              padding: "8px 5px",
                              marginRight: "10px",
                            }}
                            onClick={() => setOpenTransferDialog(true)}
                          >
                            Transfer Credits
                          </PrimaryBtn>
                          <PrimaryBtn
                            style={{ fontSize: "14px", padding: "8px 5px" }}
                            onClick={() => setOpenBuyCredits(true)}
                          >
                            Buy Credits
                          </PrimaryBtn>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-fname">
                                        First Name*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-fname" value="" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-lname">
                                        Last Name*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-lname" value="" variant="outlined" fullWidth />
                                </Grid> */}
              </Grid>
            </CardContent>
          </BlankCard>
        </Grid>

        {/* 2 */}
        <Grid item xs={12} lg={9}>
          <BlankCard>
            <CardContent>
              <Typography variant="h4" display="flex" mb={2}>
                Current Plan:
                <Typography
                  variant="h5"
                  component="div"
                  ml="8px"
                  color="#fff"
                  bgcolor="#5B105A"
                  px={1}
                  borderRadius={1}
                >
                  {currentPlan?.planType}
                </Typography>
              </Typography>
              {currentPlan?.planType?.toUpperCase() != "FREE" && (
                <Typography color="textSecondary">
                  {currentPlan?.status === "CANCELLED"
                    ? "Ends On:"
                    : "Next Charge:"}{" "}
                  {moment(currentPlan?.billingDate).format("Do MMM, YYYY")}
                  <br />
                  {!currentPlan?.status === "CANCELLED" && (
                    <Box component="span" fontWeight={700}>
                      for{" "}
                      {currentPlan?.currency?.toLowerCase() == "inr"
                        ? "\u20B9"
                        : "$"}
                      {new Intl.NumberFormat(
                        currentPlan?.currency?.toUpperCase() == "INR"
                          ? "en-IN"
                          : "en-US"
                      ).format(currentPlan?.price)}
                    </Box>
                  )}
                </Typography>
              )}

              {/* list 1 */}
              <Stack direction="row" spacing={2} mt={4} mb={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "grey.100",
                    color: "grey.500",
                    width: 48,
                    height: 48,
                  }}
                >
                  {/* <IconPackage size="22" /> */}
                  <img src={Logo} alt="" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Current Plan
                  </Typography>
                  {currentPlan?.status === "CANCELLED" ? (
                    <Typography
                      variant="body1"
                      color="#fff"
                      bgcolor="#e82113"
                      mb={1}
                      px={1.5}
                      borderRadius={1}
                    >
                      CANCELLED
                    </Typography>
                  ) : (
                    <Typography variant="h6" mb={1}>
                      {currentPlan?.currency?.toLowerCase() == "inr"
                        ? "\u20B9"
                        : "$"}
                      {new Intl.NumberFormat(
                        currentPlan?.currency?.toUpperCase() == "INR"
                          ? "en-IN"
                          : "en-US"
                      ).format(currentPlan?.price)}
                      /
                      {currentPlan?.period?.toLowerCase() == "yearly"
                        ? "year"
                        : "month"}
                    </Typography>
                  )}
                </Box>
                {/* <Box sx={{ ml: "auto !important" }}>
                  <Tooltip title="Add">
                    <IconButton>
                      <IconCirclePlus size="22" />
                    </IconButton>
                  </Tooltip>
                </Box> */}
              </Stack>

              <Stack
                direction="row"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Stack direction="row">
                  {currentPlan?.status !== "CANCELLED" && (
                    <PrimaryBtn
                      width="auto"
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      onClick={() => setOpenBuyCredits(true)}
                    >
                      Change Plan
                    </PrimaryBtn>
                  )}
                  {(currentPlan?.price !== 0 ||
                    currentPlan?.status !== "CANCELLED") && (
                    <PrimaryBtn2
                      width="auto"
                      style={{ fontWeight: 500, fontSize: "14px" }}
                      onClick={() => setOpenCancelPlan(true)}
                    >
                      Cancel Plan
                    </PrimaryBtn2>
                  )}
                </Stack>
                <div>
                  {!currentPlan?.planType?.toUpperCase().includes("FREE") && (
                    <PrimaryBtn2
                      width="auto"
                      style={{ fontWeight: 500, fontSize: "14px" }}
                      onClick={() => setOpenDowngrade(true)}
                    >
                      Downgrade
                    </PrimaryBtn2>
                  )}
                </div>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }} mt={3}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updateBillingInfo.isLoading}
        >
          Save
        </Button>
        <Button size="large" variant="text" color="error" onClick={handleReset}>
          Cancel
        </Button>
      </Stack>

      <CustomDialog
        open={openCancelPlan}
        heading="Are you sure?"
        subheading={`You are cancelling your plan, you will be able to use your plan-earned credits until 15th of July, 2024 (end of your current subscription). Unused plan-earned credits will expire after the 15th of July. You may choose to downgrade instead if you'd like to retain your plan-earned credits.`}
        btn1Text="Cancel My Plan"
        btn2Text="Keep My Plan"
        onConfirm={cancelPlan}
        discard={() => setOpenCancelPlan(false)}
        onClose={() => setOpenCancelPlan(false)}
      />

      <CustomDialog
        open={openDowngrade}
        heading="Contact support"
        subheading={
          <span>
            Please contact{" "}
            <a href="mailto:support@gamitar.com">support@gamitar.com</a> to
            downgrade your current plan.
          </span>
        }
        btn2Text="Close"
        discard={() => setOpenDowngrade(false)}
        onClose={() => setOpenDowngrade(false)}
      />

      <BuyCreditsDialog open={openBuyCredits} onClose={handleBuyCreditsClose} />

      <TransferCreditsDialog
        open={openTransferDialog}
        onClose={closeTransferDialog}
      />

      <TransactionsDialog
        open={openTransactionDialog}
        onClose={closeTransactionDialog}
      />
    </>
  );
};

export default BillsTab;
