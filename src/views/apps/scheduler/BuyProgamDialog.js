import { toast } from "react-toastify";
import { usePaymentInfo } from "./PaymentInfo";
import { useProgramPayment } from "./PaymentsService";
import { SchedulerCallbacks } from "./SchedulerSlice";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useUpdateBillingInfo} from "../../../services/billing";
import {Box} from "@mui/material";

const { Dialog, DialogContent, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, DialogActions, Button, Alert } = require("@mui/material");

const BuyProgramDialog = ({programId, open, onClose, credits}) => {
    const billing = useSelector((state) => state?.billing?.businessInfo);
    const paymentInfo = usePaymentInfo();
    const updateBillingInfo = useUpdateBillingInfo();

    const [billingInfo, setBillingInfo] = useState({});

    useEffect(() =>
    {
        setBillingInfo(billing);
    }, [billing]);

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

    const programPayment = useProgramPayment(() => {
        SchedulerCallbacks['refetchPaymentInto']();
        toast.success("Program purchased successfully");
        onClose();
    }, () => {
        toast.error("Program purchase failed. Please try again later.");
    });

    return (
    <Dialog
        PaperProps={{
            style: {
                borderRadius: "8px",
                background: "#FFF",
                boxShadow:
                "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
                width: "496px",
            },
        }}
        onClose={onClose}
        open={open}
    >
        <DialogContent>
            <Typography variant="h6" fontWeight={700} mb={3}>Buy Program</Typography>
            <div style={{display: 'flex', flexDirection: 'row-reverse', marginBottom: '20px'}}>
                <select style={{borderRadius: '4px', padding: '3px'}} value={paymentInfo.currency} onChange={e => paymentInfo.setCurrency(e.target.value)}>
                    <option value='USD'>USD</option>
                    <option value='INR'>INR</option>
                </select>
                <div style={{marginRight: '10px', fontSize: '14px'}}>Currency: </div>
            </div>
            <TableContainer style={{marginBottom: '20px'}}  component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{background: '#ddd'}}>
                            <TableCell style={{fontWeight: '600', paddingTop: '8px', paddingBottom: '8px'}}>Desc.</TableCell>
                            <TableCell align="center" style={{fontWeight: '600', paddingTop: '8px', paddingBottom: '8px'}}>Qty</TableCell>
                            <TableCell align="center" style={{fontWeight: '600', paddingTop: '8px', paddingBottom: '8px'}}>Price</TableCell>
                            <TableCell align="center" style={{fontWeight: '600', paddingTop: '8px', paddingBottom: '8px'}}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': { border: 0 }}}>
                            <TableCell>Session</TableCell>
                            <TableCell align="center">{credits}</TableCell>
                            <TableCell align="center">
                                {paymentInfo.currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                                {new Intl.NumberFormat(paymentInfo.currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(paymentInfo?.credits?.credits_cost[paymentInfo.currency])}
                            </TableCell>
                            <TableCell align="center">
                                {paymentInfo.currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                                {new Intl.NumberFormat(paymentInfo.currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(paymentInfo?.credits?.credits_cost[paymentInfo.currency] * credits)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {/*<Alert severity="warning" style={{marginBottom: "20px"}}>*/}
            {/*    You cannot add participants or sessions after the purchase. You will still be able to edit the program.*/}
            {/*</Alert>*/}
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
                            SAVE
                        </Button>
                    </div>
                </Alert>
            }
            <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                <Button
                    disabled={false}
                    variant="contained"
                    style={{background: "#5b105a", fontSize: '12px'}}
                    onClick={() => programPayment.mutate({programId, currency: paymentInfo.currency})}
                >
                    Purchase
                </Button>
                <Button
                    disabled={false}
                    variant="contained"
                    style={{background: 'rgb(255, 219, 249)', color: "rgb(91, 16, 90)", fontSize: '12px', marginRight: '10px'}}
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    );
}

export default BuyProgramDialog;
