import { useSelector } from "react-redux";
import axiosClient from "src/utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  setBusinessInfo,
  setCurrentPlan,
} from "src/store/apps/billing/BillingSlice";

export const useGetBillingInfo = () => {
  const dispatch = useDispatch();

  return useQuery(
    "billing-info",
    () => axiosClient().get(`/getE3BillingInfo`),
    {
      onSuccess: (res) => {
        dispatch(setBusinessInfo(res?.data?.data));
        return res?.data;
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

export const useUpdateBillingInfo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(`/updateE3BillingInfo`, data);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("billing-info");
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
};

export const useGetCurrentPlan = () => {
  const dispatch = useDispatch();

  return useQuery("plan-info", () => axiosClient().get(`/getE3UserPlan`), {
    onSuccess: (res) => {
      dispatch(setCurrentPlan(res?.data?.data));
      return res?.data;
    },
    onError: (err) => {
      console.log(err);
    },
    cacheTime: 0,
  });
};
