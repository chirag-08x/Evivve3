import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axiosClient from "src/utils/axios";

export function usePaymentInfo () {
    const [plans, setPlans] = useState();
    const [currency, setCurrency] = useState('USD');
    const [isFetched, setFetched] = useState(false);
    const [credits, setCredits] = useState();

    const paymentInfoResp = useQuery('payment-default-info', async () => await axiosClient().get("/payments/info"), {
        onSuccess: ({data}) => {
            console.log("/payments/info");
            console.dir(data);
            setPlans(data.subscription_info.plans);
            setCredits(data.credits_info);
            setFetched(true);
        }
    });

    function refetch () {
        paymentInfoResp.refetch();
    }

    return {plans, credits, currency, setCurrency, refetch, isFetched};
}

export function useCreditInfo (paymentInfo) {
    const [count, setCount] = useState(1);
    const [info, setInfo] = useState([
        {pack: 'Single Credit', discount: '0% Discount', cost: 0, old_cost: null},
        {pack: 'Pack of 5', discount: '7.5% Discount', cost: 0, old_cost: 0, credits: 5},
        {pack: 'Pack of 10', discount: '12.5% Discount', cost: 0, old_cost: 0, credits: 10},
    ]);

    function getCreditAmount (currency, count) {
        const cost = paymentInfo.credits.credits_cost[currency];

        let final_cost = cost;
        paymentInfo.credits.credits_discount.sort((f, s) => s.credit_count - f.credit_count);
        for (let d of paymentInfo.credits.credits_discount) {
            if (count >= d.credit_count) {
                final_cost -= cost * (d.percentage_off/100);
                break;
            }
        }

        return final_cost * count;
    }

    useEffect(() => {
        if (paymentInfo.isFetched) {
            console.log("payment_info");
            console.dir(paymentInfo);
            const temp = [...info];
            const single_cost = getCreditAmount(paymentInfo.currency, 1);
            for (const o of temp) {
                o.cost = getCreditAmount(paymentInfo.currency, o.credits ? o.credits : count);
                o.old_cost = o.credits ? single_cost * o.credits : null;
            }
            setInfo(temp);
        }
    }, [paymentInfo.isFetched, paymentInfo.currency, count]);

    return {info, count, setCount}
}

export function usePlansInfo (paymentInfo) {
    const [period, setPeriod] = useState('monthly');
    const [plans, setPlans] = useState([
        {plan_id: null, plan: "Starter", benefit: "Gain 1 Credit / Month", old_cost: 0, cost: 0, credits: 1},
        {plan_id: null, plan: "Pro", benefit: "Credits gained: 3 / Month", old_cost: 0, cost: 0, credits: 3},
        {plan_id: null, plan: "Teams", benefit: "Credits gained: 5 / Month", old_cost: 0, cost: 0, credits: 5},
    ]);

    function getPlan (plans, period, currency, name) {
        if (!name)
            throw new Error("'name' is required to fetch a specific plan");

        console.dir({
            plans,
            period,
            currency,
            name
        });
        plans = plans.filter(o => o.currency.toLowerCase() == currency.toLowerCase() && o.period.toLowerCase() == period.toLowerCase());

        if (name.length < 3)
            throw new Error("'name' must atleast contain 4 characters");

        console.dir(plans);
        const temp_arr = plans.filter(o => o.name.toLowerCase().includes(name.toLowerCase()));
        if (temp_arr > 1)
            throw new Error("'name' is not unique enough to fetch a single plan");
        if (temp_arr <= 0)
            throw new Error("'name' is not found in plans");

        return temp_arr[0];
    }

    useEffect(() => {
        if (paymentInfo.isFetched) {
            const temp = [...plans];
            const cost = paymentInfo.credits.credits_cost[paymentInfo.currency];
            for (const o of temp) {
                const p = getPlan(paymentInfo.plans, period, paymentInfo.currency, o.plan);
                o.old_cost = o.credits * cost * (period.toLowerCase() == 'monthly' ? 1 : 12); //Showing what the cost would have been if they bought credits manually
                o.cost = p.amount/100;
                o.plan_id = p.planId;
            }
            setPlans(temp);
        }
    }, [paymentInfo.isFetched, paymentInfo.currency, period]);

    return {plans, period, setPeriod};
}
