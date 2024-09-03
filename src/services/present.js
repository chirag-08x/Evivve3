import axiosClient from "src/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  setModules,
  setProgramSession,
  setSelectedModule,
  getPresentModules,
  getSessionInfo,
  toggleActivationScreens,
  toggleGameScreens,
} from "src/store/apps/present/PresentSlice";
import { MODULE_TYPE, PROGRAM_STEP } from "src/views/pages/present/constants";
import { useEffect } from "react";
import { toggleContinueSessionDialog } from "src/store/apps/programs/ProgramSlice";
import GameAdmin from "src/views/pages/present/components/GameAdmin";
import { isAuthDone } from "src/views/pages/present/components/DockerLogin";
import { setQRCode } from "src/store/apps/present/PresentSlice";

export const fetchPresentModules = async (id) => {
  try {
    const { data } = await axiosClient().get(`/module/${id}`);
    return data;
  } catch (error) {
    window.location.replace("/programs");
  }
};

export const fetchItinerary = async (userid) => {
  try {
    const { data } = await axiosClient().get(`/itinerary/${userid}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const useGetSessionInfo = (id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);
  const sessionInfo = useSelector(getSessionInfo);

  useEffect(() => {
    if (modules.length > 1) {
      const programStep = sessionInfo?.programStep;
      const currentModule = PROGRAM_STEP[programStep];
      dispatch(setSelectedModule(modules[currentModule.module]));

      localStorage.setItem("program_id", sessionInfo.programId);
      //If its not FINAL_RUN then dry_run check should be added
      //TODO: Use store instead of loaclStorage for any information required for present mode
      localStorage.setItem("is_dry_run", sessionInfo.sessionType ? sessionInfo.sessionType.toUpperCase() !== "FINAL_RUN" : true);

      if (currentModule.hasOwnProperty("screen")) {
        const { type, screen } = PROGRAM_STEP[programStep];
        if (type === MODULE_TYPE["learner/activation"]) {
          dispatch(toggleActivationScreens(screen));
        } else if (type === MODULE_TYPE["evivve"]) {
          dispatch(toggleGameScreens(screen));
          if (sessionInfo.game_info) {
              (async () => {
                  await GameAdmin.GameAdmin(sessionInfo.game_info.in_port);
                  dispatch(setQRCode(sessionInfo.game_info.st_code));
              })();
          } else {
              dispatch(toggleGameScreens(1));
          }

//          if (!isAuthDone && screen > 1) {
//            setTimeout(async function () {
//              const in_port = localStorage.getItem("in_port");
//              const st_code = localStorage.getItem("st_code");
//
//              if (!in_port) dispatch(toggleGameScreens(1));
//              await GameAdmin.GameAdmin(in_port);
//              await GameShared.GameShared(in_port);
//              dispatch(setQRCode(st_code));
//            }, 5000);
//          }
        }
      }
    }
  }, [modules, sessionInfo]);

  return useQuery(
    "session-info",
    () => axiosClient().get(`/program_session/${id}`),
    {
      onSuccess: async (res) => {
        const { programId } = res?.data?.session;
        dispatch(setProgramSession(res?.data?.session));
        const data = await fetchPresentModules(programId);
        dispatch(setModules(data?.modules));
      },
      onError: (err) => {
        console.log(err);
        navigate("/programs");
      },
      cacheTime: 0,
    }
  );
};

export const useUpdateSession = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().put(
          `/program_session/${id}`,
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {},
      onError: (err) => {
        console.log(err);
      },
    }
  );
};
