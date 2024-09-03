import React, { useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Switch,
  CircularProgress,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { useSubscriptionPayment } from "./PaymentsService";
import { toast } from "react-toastify";
import { SchedulerCallbacks } from "./SchedulerSlice";

const UpgradeBox = ({plan_id, currency, plan, benefit, old_cost, cost, onPurchase}) => {
    const subscriptionPayment = useSubscriptionPayment(() => {
        if (SchedulerCallbacks['refetchPaymentInto'])
            SchedulerCallbacks['refetchPaymentInto']();
        toast.success("Subscription purchased successfully");
        onPurchase();
    }, (obj) => {
        console.log("[Subscription Error]");
        console.dir(obj);

        switch (obj.error) {
            case "UPGRADE_RESTRICTED":
                toast.error("Subscription upgrade is restricted for now. Please contact support@gamitar.com");
                break;
            default:
                toast.error("Subscription purchase failed. Please try again later.");
        }
    });

    function initiatePayment (plan_id) {
        subscriptionPayment.mutate({plan_id, currency});
    }

    const isOverLimit = currency.toUpperCase() == 'INR' && cost > 300000 //500000
        || currency.toUpperCase() == 'USD' && cost > 3500; //5900

    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
        >
            <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>{plan}</Typography>
                <Typography variant="body2">{benefit}</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
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

                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                    {currency.toLowerCase() == 'inr' ? '\u20B9' : '$'}
                    {new Intl.NumberFormat(currency.toLowerCase() == 'inr' ? 'en-IN' : 'en-US').format(cost)}
                </Typography>
            </Stack>

            {isOverLimit ?
                <div style={{fontSize: '12px', width: '127px', border: '1px solid lightgray', padding: '10px', textAlign: 'center', borderRadius: '5px'}}><a href="mailto:support@gamitar.com">Contact support</a></div> :
                <PrimaryBtn disabled={subscriptionPayment.isLoading} style={{ paddingTop: "8px", paddingBottom: "8px" }} onClick={() => initiatePayment(plan_id)}>
                    { subscriptionPayment.isLoading ? <CircularProgress size={'18px'}/>  : "Upgrade" }
                </PrimaryBtn>
            }
        </Stack>
    );
}

const UpgradeSection = ({info, children, currency, plan, onPurchase}) => {
    const restrictions = {
        "FREE": ["STARTER", "PRO", "TEAMS"],
        "STARTER": ["PRO", "TEAMS"],
        "PRO": ["TEAMS"],
        "TEAMS": [],
    }
    return (
        <Box sx={{ display: "grid", gap: "1rem" }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6" fontWeight={700} mb={1} style={{display: 'flex', alignItems: 'center'}}>
                    <div>Upgrade</div>
                    <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}>{children}</div>
                </Typography>
                <div style={{display: "flex", alignItems: "center", fontSize: "14px"}}>
                    <div style={info.period == 'yearly' ? {color: "gray"} : {fontWeight: "bold", color: "black"}}>Monthly</div>
                    <div><Switch color="default" checked={info.period == 'yearly'} onChange={evt => info.setPeriod(evt.target.checked ? 'yearly' : 'monthly')}  /></div>
                    <div style={info.period != 'yearly' ? {color: "gray"} : {fontWeight: "bold", color: "black"}}>Yearly</div>
                </div>
            </div>
            {info.plans.filter(obj => restrictions[plan.toUpperCase()].includes(obj.plan.toUpperCase())).map(obj => <UpgradeBox key={obj.plan_id} plan_id={obj.plan_id} currency={currency} plan={obj.plan} benefit={obj.benefit} old_cost={obj.old_cost} cost={obj.cost} onPurchase={onPurchase} /> )}
        </Box>
    );
}

export default UpgradeSection;
