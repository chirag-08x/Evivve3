import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogContent,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  IconArrowLeft,
} from "@tabler/icons";

import { useSelector } from "react-redux";

import CreditsSection from "./CreditsBox";
import UpgradeSection from "./UpgradeBox";
import { useCreditInfo, usePaymentInfo, usePlansInfo } from "./PaymentInfo";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import {useUpdateBillingInfo} from "../../../services/billing";

const BuyCreditsDialog = ({ open, onClose }) => {
    const plan = useSelector(state => state.user?.profile?.plan);
    const billing = useSelector((state) => state?.billing?.businessInfo);

    const paymentInfo = usePaymentInfo();
    const creditsInfo = useCreditInfo(paymentInfo);
    const planInfo = usePlansInfo(paymentInfo);
    const updateBillingInfo = useUpdateBillingInfo();

    const [billingInfo, setBillingInfo] = useState({});

    useEffect(() =>
    {
        setBillingInfo(billing);
    }, [billing, plan]);

    const handleChange = (e) =>
    {
        const name = e.target.name;
        const value = e.target.value;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    const handleSubmit = () =>
    {
        const { credits, ...rest } = billingInfo;
        updateBillingInfo.mutate(rest);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <Button sx={{ minWidth: 0, px: 0 }} onClick={onClose}>
                    <IconArrowLeft color="#000" />
                </Button>

                <CreditsSection info={creditsInfo} currency={paymentInfo.currency} onPurchase={onClose} >
                    <select style={{borderRadius: '4px', padding: '3px'}} value={paymentInfo.currency} onChange={e => paymentInfo.setCurrency(e.target.value)}>
                        <option value='USD'>USD</option>
                        <option value='INR'>INR</option>
                    </select>
                </CreditsSection>

                {plan != 'TEAMS' &&
                    <Box
                        my={3}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <Box sx={{ backgroundColor: "#D0D5DD", height: "3px" }}></Box>
                        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>Or</Typography>
                        <Box sx={{ backgroundColor: "#D0D5DD", height: "3px" }}></Box>
                    </Box>
                }

                {plan != 'TEAMS' && <UpgradeSection info={planInfo} currency={paymentInfo.currency} plan={plan} onPurchase={onClose} >
                    <select style={{borderRadius: '4px', padding: '3px'}} value={paymentInfo.currency} onChange={e => paymentInfo.setCurrency(e.target.value)}>
                        <option value='USD'>USD</option>
                        <option value='INR'>INR</option>
                    </select>
                </UpgradeSection>}
                <br/>
                {paymentInfo.currency === 'INR' &&

                    <Alert severity="success" style={{ display: 'flex', fontSize: "16px", alignContent: "center" }}>
                        <Box sx={{fontWeight: "bold"}}>
                            Prices are inclusive of GST | GST Number
                        </Box>
                        <div style={{display: 'flex', gridTemplateColumns: "auto 1fr auto" }}>
                            <CustomTextField
                                inputProps={{ style: { fullWidth: true} }}
                                size="small"
                                style={{ paddingRight: "10px", fontWeight: "bold", fontSize: "12px" }}
                                id="text-gst"
                                value={billingInfo?.gstNumber || ""}
                                variant="outlined"
                                fullWidth
                                placeholder="GST Number"
                                name="gstNumber"
                                onChange={(e) => handleChange(e)}
                            />
                            <Button variant="contained" style={{ fontSize: "12px", fontWeight: "bold" }} onClick={handleSubmit}>
                                Save
                            </Button>
                        </div>
                    </Alert>
                }
            </DialogContent>
        </Dialog>
    );
};

export default BuyCreditsDialog;
