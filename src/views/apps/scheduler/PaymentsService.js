import axiosClient from "src/utils/axios";

const { useMutation } = require("react-query");
const { toast } = require("react-toastify");

const onSuccess = (confirmPayment, isSubscription) => ({data}) => {
    const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID_TEST,
        currency: data.currency,
        amount: data.amount,
        name: data.name,
        description: data.description,
        handler: (response) => {
            console.log("RESPONSExcxxx: ");
            console.dir(response);
            confirmPayment.mutate(response);
        },
        prefill: data.prefill
    };

    options[isSubscription ? 'subscription_id' : 'order_id'] = data.id;

    console.log("Razorpay:");
    console.dir(options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}

const onRpayError = () => {
    toast.error("Error with payment gateway. Please contact support");
}

export const useConfirmPayment = (onCallback, onError) => {
    return useMutation(
        async (data) =>
            await axiosClient()
                .put(`/payments/confirm`, {
                    rpay_order_id: typeof(data.razorpay_subscription_id) === 'string' ? data.razorpay_subscription_id : data.razorpay_order_id,
                    rpay_payment_id: data.razorpay_payment_id,
                    rpay_signature: data.razorpay_signature
            }
        ),{
            onSuccess: onCallback,
            onError: onError
        }
    );
}

export const useProgramPayment = (onCallback, onError) => {
    const confirmPayment = useConfirmPayment(onCallback, onError);
    return useMutation(
        async (data) => await axiosClient()
        .post(`/payments/program`, {currency: data.currency, programId: data.programId}),
        {
            onSuccess: onSuccess(confirmPayment),
            onError: onRpayError
        }
    );
}

export const useCreditsPayment = (onCallback, onError) => {
    const confirmPayment = useConfirmPayment(onCallback, onError);
    return useMutation(
        async (data) => await axiosClient()
        .post(`/payments/credits`, {currency: data.currency, credits: data.credits}),
        {
            onSuccess: onSuccess(confirmPayment, false),
            onError: onRpayError
        }
    );
}

export const useSubscriptionPayment = (onCallback, onError) => {
    const confirmPayment = useConfirmPayment(onCallback, onError);
    return useMutation(
        async (data) => await axiosClient()
        .post(`/payments/subscribe`, {plan_id: data.plan_id, currency: data.currency}),
        {
            onSuccess: onSuccess(confirmPayment, true),
            onError
        }
    );
}

export const usePurchaseProgram = (callback) => {
    return useMutation(
        async (data) => await axiosClient()
        .post(`/program/${data.programId}/purchase/${data.creditType}`),
        {
            onSuccess: callback.onSuccess,
            onError: callback.onError
        }
    );
}

export const useAutoFixFree = (callback) => {
    return useMutation(
        async (data) => await axiosClient()
        .put(`/program/${data.programId}/auto_fix/${data.action}`),
        {
            onSuccess: callback.onSuccess,
            onError: callback.onError
        }
    );
}
