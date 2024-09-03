import { useSelector } from "react-redux";
import store from "src/store/Store";
import axiosClient from "src/utils/axios";
import { useSignout } from "./authentication";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { setUser } from "src/store/apps/user/UserSlice";
import { accessTokenKey } from "src/store/apps/auth/AuthSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clarity } from 'react-microsoft-clarity';

// export const useGetUsersList = (data) => {
//     return useMutation(
//         'users-list',
//         (page) => {
//         return axiosClient().post(`/getAllUsers/${page.page}/${page.sort}`, { search: page.search });
//         },
//         {
//         onSuccess: (res) => {
//             useUsersStore.getState().setUsers(res.data.users);
//             useUsersStore.getState().setUsersLength(res.data.length);
//         },
//         }
//     );
// };

export const useUserInfo = () => {
  const hasToken =
    useSelector((s) => !!s.auth.accessToken) ||
    !!localStorage.getItem(accessTokenKey);

  const { isError } = useQuery(
    "user-info",
    () => axiosClient().get("/userInfo"),
    {
      onSuccess: (res) => {
        store.dispatch(setUser(res.data.user));
        // if (clarity.hasStarted) { clarity.identify('USER_ID', res.data.user.email); }

        if (clarity.hasStarted)
        {
          clarity.identify(res.data.user.email);
        }

        // await clarity.setTag("id", res.data.user.email);
      },
      enabled: hasToken,
    }
  );
  useSignout(!hasToken || isError);
};

export const useGetE3UserInfo = () => {
  return useQuery("e3b-userinfo", () => axiosClient().get(`getE3UserInfo`), {
    onSuccess: (res) => {
      return res?.data;
    },
    onError: (err) => {
      console.log(err);
    },
    cacheTime: 0,
  });
};

export const useUpdateE3UserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post("/updateE3UserInfo", data);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("e3b-userinfo");
        toast.success("Profile successfully updated.")
        
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating User Info");
      },
    }
  );
};

export const useUpdateE3UserPass = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post(
          "/resetPasswordWithOld",
          data
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        toast.success("Profile successfully updated.");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error updating User Password");
      },
    }
  );
};

// export const useUpdateUserProfile = () => {
//     const fromProgram = useSetTZProgram((s) => s.from_program);
//     const setTz = useSetTZProgram((s) => s.setTz);
//     const history = useHistory();

//     const { search } = useLocation();
//     const programpage = new URLSearchParams(search).get('programpage');
//     const programUpdateEdit = new URLSearchParams(search).get('edit');
//     return useMutation((data) => axiosClient().post('/updateUserProfile', data), {
//       onSuccess: (res) => {
//         useUserStore.getState().setUser(res.data.user);
//         ShowToast(res.data.message, 'success');
//         if (fromProgram) {
//           if (programUpdateEdit === 'true') {
//             history.push(`/schedule/edit/${programpage}`);
//             setTz(false);
//           } else if (programpage) {
//             history.push(`/schedule/add/${programpage}`);
//             setTz(false);
//           } else {
//             history.push('/my-programs');
//             setTz(false);
//           }
//         }
//       },
//     });
// };

// export const useUserSearch = (data, setUsers) => {
//     const [rq, setRq] = useState();
//     const queryClient = useQueryClient();

//     const query = useQuery(
//       ['user-search', rq],
//       () => axiosClient().get(`/searchUsers?search=${rq}`),
//       {
//         onSuccess: (res) => {
//           setUsers(res.data.result);
//         },
//         cacheTime: 0,
//         enabled: !!rq,
//       }
//     );

//     useEffect(() => {
//       if (data && data.length >= 3) {
//         setRq(data);
//       }
//     }, [data, query, queryClient, rq]);

//     return query;
// };

// export const useGetUserByEmail = () => {
//     return useMutation((data) => axiosClient().post('/getUserByEmail', data), {
//       onSuccess: (res) => {
//         useSelectedFacilitator.getState().setSelectedFacil({ ...res.data.user });
//         ShowToast(res.data.message, 'success');
//       },
//       onError: (err) => {
//         useSelectedFacilitator.getState().removeSelectedFacil();
//       },
//     });
// };
