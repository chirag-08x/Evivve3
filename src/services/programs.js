import axiosClient from "src/utils/axios";
import {
  setProgramList,
  setTemplates,
  setRoles,
  setProgramID,
  setProgramCards,
  toggleCustomizeDialog,
  setContext,
  setParticipants,
  toggleAdjustContextDialog,
  toggleParticipantsDialog,
  toggleSessionsDialog,
} from "src/store/apps/programs/ProgramSlice";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

export const useGetProgramsList = () => {
  const dispatch = useDispatch();

  return useQuery(
    "programs-list",
    () => axiosClient().get(`/getProgramsList`),
    {
      onSuccess: (res) => {
        dispatch(setProgramList(res.data));
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

//export const useGetFProgramsList = () => {
//  const dispatch = useDispatch();
//
//  return useQuery(
//    "facilitating-programs-list",
//    () => axiosClient().get(`/getFacilitatingProgramsList`),
//    {
//      onSuccess: (res) => {
//        dispatch(setFacilitatingProgramList(res.data));
//      },
//      onError: (err) => {
//        console.log(err);
//      },
//      cacheTime: 0,
//    }
//  );
//};

export const useGetProgramTemplates = () => {
  const dispatch = useDispatch();
  return useQuery(
    "programs-templates",
    () => axiosClient().get(`/programTemplate/fetch`),
    {
      onSuccess: (res) => {
        dispatch(setTemplates(res.data.programTemplates));
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

export const useGetRoles = () => {
  const dispatch = useDispatch();
  return useQuery("roles", () => axiosClient().get(`/role/fetch`), {
    onSuccess: (res) => {
      dispatch(setRoles(res.data.userRoles));
    },
    onError: (err) => {
      console.log(err);
    },
    cacheTime: 0,
  });
};

export const useCloneProgram = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const { program_id, ...restData } = data;
      const response = await axiosClient().post(
        `/program/${program_id}/clone`,
        restData
      );
      return response;
    },
    {
      onSuccess: (res) => {
        dispatch(setProgramID(res?.data?.result?.id));
        queryClient.invalidateQueries("programs-list");
        queryClient.invalidateQueries("facilitating-programs");
      },
      onError: (err) => {
        console.error("Error cloning program:", err);
        toast.error("Problem creating Program. Please try again.");
      },
    }
  );
};

export const useCreateProgram = () => {
  const dispatch = useDispatch();
  return useMutation((data) => axiosClient().post("/program", data), {
    onSuccess: (res) => {
      dispatch(setProgramID(res?.data?.result?.id));
    },
    onError: (err) => {
      console.log(err);
      toast.error("Problem creating Program. Please try again.");
      window.location.reload();
    },
  });
};

export const useGetProgramModule = (id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useQuery("program-module", () => axiosClient().get(`/module/${id}`), {
    onSuccess: (res) => {
      dispatch(setProgramCards(res.data));
    },
    onError: (err) => {
      console.log(err);
      navigate("/programs");
    },
    cacheTime: 0,
  });
};

export const useDeleteProgram=()=>{

  const navigate=useNavigate();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          "/program-delete",
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-list");
        navigate("/programs")
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error deleting program, Please try again.");
      },
    }
  );
}
export const useEditLearnerActivationModule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          "/module/edit/learningAct",
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
        dispatch(toggleCustomizeDialog());
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating module, Please try again.");
      },
    }
  );
};

export const useEditStrategyModule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          "/module/edit/strategy",
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
        dispatch(toggleCustomizeDialog());
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating module, Please try again.");
      },
    }
  );
};

export const useEditDebriefModule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post("/module/edit/debreif", data);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
        dispatch(toggleCustomizeDialog());
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating module, Please try again.");
      },
    }
  );
};

export const useEditReflectionModule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          "/module/edit/reflection",
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
        dispatch(toggleCustomizeDialog());
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating module, Please try again.");
      },
    }
  );
};

export const useEditGameModule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post("/module/edit/game", data);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
        dispatch(toggleCustomizeDialog());
      },
      onError: (err) => {
        console.log(err);
          if (err.error == "FREEMIUM_RESTRICTION")
            toast.error(err.message);
          else
            toast.error("Error updating module, Please try again.");
      },
    }
  );
};

export const useEditProgramHeading = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().put(`/program/${data.id}`, {
          name: data.name,
        });
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating Program Heading");
      },
    }
  );
};

export const useEditProgramSubheading = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().put(`/program/${data.id}`, {
          description: data.desc,
        });
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("program-module");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating Program Heading");
      },
    }
  );
};

export const useGetContext = (id) => {
  const dispatch = useDispatch();
  return useQuery(
    "context",
    () => axiosClient().get(`/program/${id}/context`),
    {
      onSuccess: (res) => {
        dispatch(setContext(res.data));
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

export const useUpdateContext = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const { id, ...body } = data;
      try {
        const response = await axiosClient().put(
          `/program/${id}/context`,
          body
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("context");
        dispatch(
          toggleAdjustContextDialog({
            showDialog: false,
            showBtn: false,
          })
        );
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating Context. Please try again");
      },
    }
  );
};

export const useGetParticipants = (id) => {
  const dispatch = useDispatch();
  return useQuery(
    "participants",
    () => axiosClient().get(`/program/${id}/getParticipants`),
    {
      onSuccess: (res) => {
        dispatch(setParticipants(res?.data));
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

export const useUpdateParticipants = (avoidClosingParticipantsDialog) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const { id, dontReset, ...body } = data;
      try {
        const response = await axiosClient().put(
          `/program/${id}/updateParticipants`,
          body
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        if (!avoidClosingParticipantsDialog) {
          queryClient.invalidateQueries("participants");
          dispatch(toggleParticipantsDialog(false));
        }
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating Participants. Please try again");
      },
    }
  );
};

export const useCreateSessions = (callback) => {
  const dispatch = useDispatch();
  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          `/program_session/auto_gen`,
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        if (callback) {
          callback();
        } else {
          dispatch(toggleParticipantsDialog(false));
          dispatch(toggleSessionsDialog(true));
        }
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error creating sessions. Please try again");
      },
    }
  );
};

export const useGetUpcomingProgram = () => {
  return useQuery(
    "upcoming-program",
    () => axiosClient().get(`/getUpcomingProgram`),
    {
      onSuccess: (res) => {
        console.log(res?.data);
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

export const useGetRecentProgram = () => {
  return useQuery(
    "recent-program",
    () => axiosClient().get(`/getRecentProgram`),
    {
      onSuccess: (res) => {
        console.log(res?.data);
      },
      onError: (err) => {
        console.log(err);
      },
      cacheTime: 0,
    }
  );
};

//export const useGetOrders = (offset) => {
//  return useQuery(
//    "get-orders",
//    () => axiosClient().get(`/transactions/orders?offset=${offset}`),
//    {
//      onSuccess: (res) => {
//        return res?.data;
//      },
//      onError: (err) => {
//        console.log(err);
//      },
//      cacheTime: 0,
//    }
//  );
//};

export const useGetTransactions = (txnType, {onSuccess, onError}) => {
    if (!["credits", "orders"].includes(txnType.toLowerCase()))
        throw new Error(`UNSUPPORTED_TXN_TYPE: ${txnType}`);

    return useMutation("transactions-"+txnType,
        data => axiosClient().get(`/transactions/${txnType}?offset=${data.offset}`),
        { onSuccess, onError }
    );
}
