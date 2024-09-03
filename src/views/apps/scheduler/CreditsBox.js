import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons";

import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { useCreditsPayment } from "./PaymentsService";
import { toast } from "react-toastify";
import { SchedulerCallbacks } from "./SchedulerSlice";
import PaymentInfo from "./PaymentInfo";

const CreditBox = ({pack, currency, discount, cost, old_cost, credits, onPurchase}) => {
    const [iter, setIter] = useState(1);
    const creditsPayment = useCreditsPayment(({data}) => {
        if (SchedulerCallbacks['refetchPaymentInto'])
            SchedulerCallbacks['refetchPaymentInto']();
        toast.success("Credits purchased successfully");
        onPurchase();
    }, (err) => {
        console.dir(err);
        toast.error("Credits purchase failed. Please try again later.");
    });

    function initiatePayment () {
        creditsPayment.mutate({credits: !credits ? iter : credits, currency});
    }

    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
        >
            <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>{pack}</Typography>
                <Typography variant="body2">{discount}</Typography>
            </Box>

            {old_cost && <Stack direction="row" spacing={2}>
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: "1rem",
                        textDecoration: "line-through",
                        color: 'gray'
                    }}
                >
                    {currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                    {new Intl.NumberFormat(currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(old_cost)}
                </Typography>

                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                        {currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                        {new Intl.NumberFormat(currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(cost)}
                    </Typography>
                </Box>
            </Stack>}

            {!old_cost && <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                    {currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                    {new Intl.NumberFormat(currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(cost * iter)}
                </Typography>

                <Box
                    sx={{
                        border: "2px solid #D0D5DD",
                        borderRadius: 1,
                        paddingRight: "20px",
                        paddingLeft: "2px",
                        position: "relative",
                    }}
                >
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>{iter}</Typography>

                    <Button
                        onClick={() => setIter((prev) => prev + 1)}
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            minWidth: 0,
                            padding: 0,
                        }}
                    >
                        <IconChevronUp size="14px" color="#000" />
                    </Button>
                    <Button
                        onClick={() => setIter((prev) => (prev <= 1 ? 1 : prev - 1))}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            minWidth: 0,
                            padding: 0,
                        }}
                    >
                        <IconChevronDown size="14px" color="#000" />
                    </Button>
                </Box>
            </Stack>}

            <PrimaryBtn disabled={creditsPayment.isLoading} onClick={initiatePayment} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                { creditsPayment.isLoading ? <CircularProgress size={'18px'}/>  : "Buy" }
            </PrimaryBtn>
        </Stack>
    );
}

const CreditsSection = ({info, currency, children, onPurchase}) => {
    return (
        <Box sx={{ display: "grid", gap: "1rem" }}>
            <Typography variant="h6" fontWeight={700} mb={1} style={{display: 'flex', alignItems: 'center'}}>
                <div>Buy Credits</div>
                <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}>{children}</div>
            </Typography>
            {info.info.map(credit =>
                <CreditBox
                    key={credit.pack}
                    currency={currency || 'usd'}
                    pack={credit.pack}
                    discount={credit.discount}
                    cost={credit.cost}
                    old_cost={credit.old_cost}
                    credits={credit.credits}
                    onPurchase={onPurchase}
                />)
            }
        </Box>
    );
}

export default CreditsSection;
