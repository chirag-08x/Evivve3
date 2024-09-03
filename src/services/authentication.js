/* eslint-disable no-undef */
/* eslint-disable max-len */
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { clearToken, setToken } from "src/store/apps/auth/AuthSlice";
import { clearUser, setUser } from "src/store/apps/user/UserSlice";
import store from "src/store/Store";
// import ShowToast from '../components/ShowToast';
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

const storeUserToken = (res) => {
  store.dispatch(
    setToken({
      accessToken: res?.data?.accessToken,
      expiresIn: res?.data?.expiresIn,
    })
  );
  store.dispatch(setUser(res.data.user));
};

export const useForgetPassword = () => {
  return useMutation((data) => axiosClient().post("/forgetpassword", data), {
    onSuccess: (res) => {
      toast.success("Please check your email to update password!");
      //   ShowToast('Please check your email to update password!', 'success');
    },
    onError: (e) => {
      //   ShowToast(e.response.data.message, 'error');
      toast.error("Error resetting password, Please try again!");
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation(
    (data) => axiosClient().post(`/auth/reset-password`, data),
    {
      onSuccess: (res) => {
        toast.success("Password reset Successful.");
        navigate("/");
      },
      onError: (e) => {
        toast.error("Cannot reset Password. Please try again.");
      },
    }
  );
};

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  return useMutation(
    (data) => axiosClient().post("/google-session-login", data),
    {
      onSuccess: (res) => {
        localStorage.setItem("userId", res?.data?.user?.id);
        axiosClient(res?.data?.accessToken)
          .get(`/getProgramsList`)
          .then((response) => {
            storeUserToken(res);
            setTimeout(() => {
              navigate("/dashboard");
            }, 500);
          })
          .catch((err) => {
            storeUserToken(res);
            console.log(err);
          });
      },
    }
  );
};

export const useUserLogin = () => {
  const navigate = useNavigate();
  return useMutation(
    (data) => {
      return axiosClient().post("/login", data);
    },
    {
      onSuccess: (res) => {
        if (!res?.data) {
          console.log(res);
          return;
        }
        localStorage.setItem("userId", res?.data?.user?.id);
        axiosClient(res?.data?.accessToken)
          .get(`/getProgramsList`)
          .then((response) => {
            storeUserToken(res);
            toast.success("Successfully logged in.");
            navigate("/dashboard");
          })
          .catch((err) => {
            toast.error("Error Loggin In.");
            storeUserToken(res);
            console.log(err);
          });
      },
      onError: (err) => {
        toast.error(err.message);
        console.log(err);
      },
    }
  );
};

// export const useGoogleSignup = () => {
//   return useMutation((data) => axiosClient().post('/google-session-signup', data), {
//     onSuccess: (res) => {
//       storeUserToken(res);
//       localStorage.setItem('userId', res.data.user.id);
//     },
//   });
// };

export const useUserRegister = () => {
  const navigate = useNavigate();
  return useMutation((data) => axiosClient().post("/register", data), {
    onSuccess: (res) => {
      storeUserToken(res);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
      toast.success("Successfully signed up.");
    },
    onError: (err) => {
      toast.error("Error signing up");
      console.log(err);
    },
  });
};

// export const useUpdateUserCertify = () => {
//   const navigate = useNavigate();
//   return useMutation(
//     (data) => {
//       return axiosClient().post(`/changeUserCertification/${data.pageNumber}`, data);
//     },
//     {
//       onSuccess: (res) => {
//         useUsersStore.getState().setUsers(res.data.users);
//       },
//     }
//   );
// };

export const useSignout = (logout) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (logout) {
      store.dispatch(clearToken());
      store.dispatch(clearUser());
      navigate("/auth/login");
    }
  }, [navigate, logout]);
};

// export const useCertificationCodeVerification = () => {
//   return useMutation((data) => axiosClient().post('/verifyUserCertificationCode', data), {
//     onSuccess: (res) => {
//       useVerifyCertificateCode.getState().setCertificateDate(res.data.data);
//       useVerifyCertificateCode.getState().setIsExist(true);
//     },
//     onError: (error) => {
//       useVerifyCertificateCode.getState().setIsExist(false);
//     },
//   });
// };

export const useUpdateProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      try {
        const response = await axiosClient().post("/updateProfilePic", data);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("e3b-userinfo");
        queryClient.invalidateQueries("user-info");
        toast.success("Profile Picture updated.");
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
};

// export const useSaveUserCertificatImage = () => {
//   return useMutation((data) => {
//     const formData = new FormData();
//     formData.append('url', data.imageFile);
//     return axiosClient().post(`/saveUserCertificate/${data.userid}`, formData);
//   }, {});
// };

// export const useCheckProgramDate = () => {
//   const navigate = useNavigate();

//   return useMutation((data) => axiosClient().post('/checkProgramDate', data), {
//     onSuccess: (res) => {
//       useProgramDateCheckStore.getState().setCheck(res.data.result);
//       if (res.data.result) {
//         // ShowToast(
//         //   'You cannot create another program in the same timeframe as another program you are facilitating..',
//         //   'error'
//         // );
//       } else {
//         // navigate('/confirm');
//       }
//     },
//     cacheTime: 0,
//   });
// };

// export const useUpdateFacilitator = () => {
//   const navigate = useNavigate();
//   return useMutation((data) => axiosClient().post('/updateProgramFacilitator', data), {
//     onSuccess: (res) => {
//       ShowToast(res.data.message, 'success');
//       navigate('/my-programs');
//     },
//     onError: (err) => {
//       ShowToast('Error while updating facilitator', 'error');
//     },
//   });
// };

// export const useGetCertificationCode = () => {
//   const { data, status } = useQuery('certification-code', () =>
//     axiosClient().get(`/getLatestCode`)
//   );
//   // console.log("code :", data)
//   return data;
// };

// export const useGetGameConfigSetup = () => {
//   const { id } = store.getState().user.user;
//   return useQuery(
//     'game-config-setup',
//     () =>
//       axiosClient().get(
//         `${REACT_APP_EVIVVE_DOCKER_APP}:3000/api/setup?user_id=02126234-7a72-42b2-8144-538bf8fdb309`
//       ),
//     {
//       onSuccess: (res) => {
//         useGameConfigSetup.getState().setSetupList(res.data.data);
//       },
//       cacheTime: 0,
//     }
//   );
// };

// export const useGetGameConfigCalamity = () => {
//   const { id } = store.getState().user.user;
//   return useQuery(
//     'game-config-calamity',
//     () =>
//       axiosClient().get(
//         `${REACT_APP_EVIVVE_DOCKER_APP}:3000/api/calamity?user_id=02126234-7a72-42b2-8144-538bf8fdb309`
//       ),
//     {
//       onSuccess: (res) => {
//         useGameConfigCalamity.getState().setCalamityList(res.data.data);
//       },
//       cacheTime: 0,
//     }
//   );
// };

// export const useGetGameConfigSetting = () => {
//   // const { id } = store.getState().user.user;
//   const id = localStorage.getItem('userId');
//   return useQuery(
//     'game-config-calamity',
//     () => axiosClient().get(`/getUserCalamitySetupData/${id}`),
//     {
//       onSuccess: (res) => {
//         useGameConfigCalamity.getState().setCalamityList(res.data.data.calamity);
//         useGameConfigSetup.getState().setSetupList(res.data.data.setup);
//       },
//       cacheTime: 0,
//     }
//   );
// };

// export const useGetAllFacilitator = () => {
//   return useQuery('get-facilitator', () => axiosClient().get('/getAllfacilitators'), {
//     onSuccess: (res) => {
//       useFacilitatorStore.getState().setFacilitatorsList(res.data.facilitators);
//     },
//   });
// };

// export const useGetUserTransactions = () => {
//   return useQuery('get-transactions', () => axiosClient().get('/getUserTransactions'), {
//     onSuccess: (res) => {
//       useUserTransactions.getState().setTransactionList(res.data.transactions);
//     },
//     enabled: false,
//   });
// };

// const latest = () => {
//   axiosClient()
//     .get('/getUserCredits')
//     .then((res) => {
//       useCreditStore.getState().setCredits({ half: res.data.halfNet, full: res.data.fullNet });
//     });
// };

// export const useGetCreditsByUserId = () => {
//   // call api 2 times because useQuery not updating token imedietly
//   latest();
//   return useQuery('get-credits', () => axiosClient().get('/getUserCredits'), {
//     onSuccess: (res) => {
//       useCreditStore.getState().setCredits({ half: res.data.halfNet, full: res.data.fullNet });
//       useCreditStore.getState().setGSTCheck(res.data.GstUser.is_Gst);
//       useCreditStore.getState().setInvoiceType(res.data.GstUser.invoice_type);
//       useCreditStore.getState().setGSTDate(res.data.GstUser.gstFlagDate);
//     },
//     cacheTime: 0,
//     enabled: true,
//   });
// };

// const useUpdateRazorResponse = () => {
//   return useMutation((data) => axiosClient().post('/razorResponse', data), {
//     onSuccess: (res) => {
//       latest();
//     },
//     cacheTime: 0,
//   });
// };

// const useUpdateRegisterationFeePaid = () => {
//   return useMutation((data) => axiosClient().post('/regFeePaid', data), {
//     onSuccess: (res) => {
//       // setTimeout(() => {
//       store.getState().user.setUser(res.data.user);
//       // }, 3000);
//     },
//     cacheTime: 0,
//   });
// };

// export const useValidateReward = () => {
//   return useMutation((data) => axiosClient().post('/validateReward', data), {
//     onSuccess: (res) => {
//       useCertificationMessage.getState().setMessage(res.data.message);
//       useCertificationMessage.getState().setHeading(res.data.heading);
//       useCertificationMessage.getState().setCongModel(true);
//     },
//   });
// };

// export const useTransferCredits = () => {
//   return useMutation(
//     (data) => {
//       axiosClient().post('/transferCredits', data);
//     },
//     {
//       onSuccess: (res) => {
//         ShowToast('Credits Successfully Transfered!', 'success');
//         useCreditStore.getState().setCredits({ half: res.data.halfNet, full: res.data.fullNet });
//       },
//     }
//   );
// };

// export const useGetRegisterationFees = () => {
//   const updateStatus = useUpdateRegisterationFeePaid();

//   const { clearTokens } = useTokenStore();
//   const { clearUser } = useUserStore();
//   const navigate = useNavigate();

//   return useMutation(() => axiosClient().post('/registrationFees'), {
//     onSuccess: (res) => {
//       const options = {
//         key:
//           window.location.origin === 'https://app.evivve.com'
//             ? 'rzp_live_3Ydrfvjrq3k6Mm'
//             : 'rzp_test_C0QjGLddksP4ms',
//         amount: res.data.order.amount,
//         currency: res.data.order.currency,
//         order_id: res.data.order.id,
//         handler(response) {
//           const data = {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//           };
//           useCertificationMessage.getState().setRegModel(false);
//           // setTimeout(() => {
//           updateStatus.mutate(data);
//           // useCertificationMessage.getState().setRegModel(false);
//           // }, 1000);
//           window.open('https://share.hsforms.com/14Ym5JnGHTPaYtnN4c1Yp4A47ybq', '_self');
//         },
//         prefill: {
//           name: `${store.getState().user.user.first_name} ${
//             store.getState().user.user.last_name
//           }`,
//           email: store.getState().user.user.email,
//         },
//         theme: {
//           color: '#453054',
//         },
//         modal: {
//           escape: false,
//           ondismiss: async () => {
//             await axiosClient().post('/handleFailed', { r_order_id: res.data.order.id });
//             ShowToast(
//               'Please complete the payment in order to begin your certification program',
//               'info'
//             );
//           },
//         },
//       };
//       const rzp1 = new Razorpay(options);

//       rzp1.open();
//       rzp1.on('payment.failed', async (response) => {
//         await axiosClient()
//           .post('/handleFailed', { r_order_id: response.error.metadata.order_id })
//           .then((resp) => console.log('res from failed', resp))
//           .catch((err) => console.log('error from failed', err));
//       });
//     },
//   });
// };

// export const useBuyCredits = () => {
//   const update = useUpdateRazorResponse();

//   return useMutation((data) => axiosClient().post('/buyCredits', data), {
//     onSuccess: (res) => {
//       const options = {
//         key:
//           window.location.origin === 'https://app.evivve.com'
//             ? 'rzp_live_3Ydrfvjrq3k6Mm'
//             : 'rzp_test_C0QjGLddksP4ms',
//         amount: res.data.order.amount,
//         currency: res.data.order.currency,
//         order_id: res.data?.order?.id,
//         handler(response) {
//           const data = {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             credit_type: res.data.credit_type,
//             number_of_credit: res.data.number_of_credit,
//           };
//           update.mutate(data);
//         },
//         prefill: {
//           name: `${store.getState().user.user.first_name} ${
//             store.getState().user.user.last_name
//           }`,
//           email: store.getState().user.user.email,
//         },
//         theme: {
//           color: '#453054',
//         },
//         modal: {
//           escape: false,
//           ondismiss: async () => {
//             await axiosClient()
//               .post('/handleFailed', { r_order_id: res.data?.order?.id })
//               .then((resp) => console.log('res from failed', resp))
//               .catch((err) => console.log('error from failed', err));
//             ShowToast(
//               'Please complete the payment in order to begin your certification program',
//               'info'
//             );
//           },
//         },
//       };

//       const rzp1 = new Razorpay(options);
//       rzp1.open();
//       rzp1.on('payment.failed', async (response) => {
//         await axiosClient()
//           .post('/handleFailed', { r_order_id: response.error.metadata.order_id })
//           .then((resp) => console.log('res from failed', resp))
//           .catch((err) => console.log('error from failed', err));
//       });
//     },
//     cacheTime: 0,
//   });
// };
// export const GetGstDetails = () => {
//   return useMutation((data) => axiosClient().post('/setGstDetails', data), {
//     onSuccess: (res) => {
//       if (res.data.InvoiceType === 'gst') ShowToast('GST Number Recorded', 'success');
//     },
//   });
// };

// export const GetGameCount = () => {
//   return useMutation((data) => axiosClient().post('/getGameCount', data), {
//     onSuccess: (res) => {
//       if (res?.data.message === 'stacked') {
//         useGameConut.getState().setGameDemoData(res.data.data[0]);
//         useGameConut.getState().setGameData(res.data.data[1]);

//         res.data.data[2].map((x) => {
//           if (x.paid_count) {
//             useGameConut.getState().setPaidCount(x.paid_count);
//           } else if (x.demo_count) {
//             useGameConut.getState().setDemoCount(x.demo_count);
//           }
//           return true;
//         });
//         useGameConut.getState().setDemoUsers(res.data.data[3]);
//         useGameConut.getState().setPaidUsers(res.data.data[4]);
//       } else {
//         useGameConut.getState().setGameDemoData({});
//         if (res.data.data.both) {
//           useGameConut.getState().setGameData(res.data.data.both.gameCount);
//           useGameConut.getState().setTotalCount(res.data.data.both.result.length);
//           useGameConut.getState().setCombinedUsers(res.data.data.both.sortedUsers);
//         }
//         if (res.data.data.demo) {
//           if (!res.data.data.both)
//             useGameConut.getState().setGameData(res.data.data.demo.gameCount);
//           useGameConut.getState().setDemoCount(res.data.data.demo.result.length);
//           useGameConut.getState().setDemoUsers(res.data.data.demo.sortedUsers);
//         }
//         if (res.data.data.paid) {
//           if (!res.data.data.both)
//             useGameConut.getState().setGameData(res.data.data.paid.gameCount);
//           useGameConut.getState().setPaidCount(res.data.data.paid.result.length);
//           useGameConut.getState().setPaidUsers(res.data.data.paid.sortedUsers);
//         }

//         // if (res.data.data.both?.type === 'both') {
//         //   useGameConut.getState().setPaidCount(res.data.data.both.result.length);
//         // } else if (res.data.data.demo?.type === 'demo') {
//         //   useGameConut.getState().setDemoCount(res.data.data.demo.result.length);
//         // } else if (res.data.data.paid?.type === 'paid') {
//         //   console.log(' 1:', res.data.data.paid.result.length);
//         //   useGameConut.getState().setTotalCount(res.data.data.paid.result.length);
//         // }
//       }
//     },
//   });
// };
// export const GetCreditsStats = () => {
//   return useMutation((data) => axiosClient().post('/getCreditsStats', data), {
//     onSuccess: (res) => {
//       if (Object.keys(res.data.data).length) {
//         useCreditsConut.getState().setHalfDay(res.data.data.credits_c.half_c);
//         useCreditsConut.getState().setFullDay(res.data.data.credits_c.full_c);
//         useCreditsConut.getState().setTotalCredits(res.data.data.credits_c.combined_cred);
//         useCreditsConut.getState().setHalfCreditCount(res.data.data.count.count_h);
//         useCreditsConut.getState().setfullCreditCount(res.data.data.count.count_f);
//         useCreditsConut
//           .getState()
//           .setTotalCreditsCount(res.data.data.count.count_f + res.data.data.count.count_h);
//         useCreditsConut.getState().setFullUsers(res.data.data.user_c.full_users);
//         useCreditsConut.getState().setHalfUsers(res.data.data.user_c.half_users);
//         useCreditsConut.getState().setCombUsers(res.data.data.user_c.comb_users);
//       } else {
//         useCreditsConut.getState().setHalfDay({});
//         useCreditsConut.getState().setFullDay({});
//         useCreditsConut.getState().setTotalCredits({});
//         useCreditsConut.getState().setFullUsers({});
//         useCreditsConut.getState().setHalfUsers({});
//         useCreditsConut.getState().setCombUsers({});
//       }
//     },
//   });
// };

// export const useValidateReg = () => {
//   return useMutation((data) => axiosClient().post('/validateReg', data), {
//     onSuccess: (res) => {
//       store.getState().user.setUser(res.data.user);
//       useCertificationMessage.getState().setRegModel(false);
//     },
//   });
// };
