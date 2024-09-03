import React, { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { Button } from "@mui/material";
import axios from "axios";

const AuthSocialButtons = ({ title, handleGoogleLogin }) => {
  const { clientId } = useGoogleOAuth();
  const [userInfo, setUserInfo] = useState({});
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem("google_access_token", tokenResponse?.access_token);
      // const userInfo = await axios
      //   .get('https://www.googleapis.com/oauth2/v3/userinfo', {
      //     headers: { Authorization: `Bearer ${tokenResponse?.access_token}` },
      //   })
      //   .then(res => res.data);

      // setUserInfo(userInfo);
      handleGoogleLogin({
        clientId: clientId,
        credential: tokenResponse?.access_token,
        select_by: "btn",
      });
    },
    onError: () => {
      alert("Failed to login");
    },
  });

  // useEffect(async () => {
  //   const token = localStorage.getItem("google_access_token");
  //   if(token){
  //     const userInfo = await axios
  //       .get('https://www.googleapis.com/oauth2/v3/userinfo', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then(res => res.data);

  //     setUserInfo(userInfo);
  //   }
  // }, [])

  return (
    <>
      <Stack mt={1.5}  textAlign={"center"}>
        <Button  onClick={() => login()}>
          <div style={{ height: "40px", width: "100%" }}>
            <div className="S9gUrf-YoZ4jf" style={{ position: "relative" }}>
              <div>
                <div
                  tabIndex="0"
                  role="button"
                  aria-labelledby="button-label"
                  className="nsm7Bb-HzV7m-LgbsSe  hJDwNd-SxQuSe i5vt6e-Ia7Qfc uaxL4e-RbRzK"
                >
                  <div className="nsm7Bb-HzV7m-LgbsSe-MJoBVe"></div>
                  <div
                    className="nsm7Bb-HzV7m-LgbsSe-bN97Pc-sM5MNb oXtfBe-l4eHX"
                    style={{
                      justifyContent: userInfo?.name
                        ? "space-between"
                        : "center",
                    }}
                  >
                    <div className="nsm7Bb-HzV7m-LgbsSe-Bz112c">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="LgbsSe-Bz112c"
                      >
                        <g>
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          ></path>
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          ></path>
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          ></path>
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          ></path>
                          <path fill="none" d="M0 0h48v48H0z"></path>
                        </g>
                      </svg>
                    </div>
                    {!!userInfo?.name ? (
                      <div
                        className="nsm7Bb-HzV7m-LgbsSe-BPrWId"
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className="ssJRIf"
                          style={{
                            fontSize: "12px",
                            textTransform: "initial",
                            fontWeight: "600",
                            lineHeight: "15px",
                          }}
                        >
                          Sign in as {userInfo?.name}
                        </div>
                        <div className="K4efff">
                          <div
                            className="fmcmS"
                            style={{
                              fontSize: "12px",
                              lineHeight: "14px",
                              textTransform: "initial",
                            }}
                          >
                            {userInfo?.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span
                        style={{
                          textTransform: "initial",
                        }}
                        className="nsm7Bb-HzV7m-LgbsSe-BPrWId"
                      >
                        {title}
                      </span>
                    )}
                    {!!userInfo?.picture && (
                      <img
                        className="n1UuX-DkfjY"
                        src={userInfo?.picture}
                        alt="Dhananjay's profile image"
                      ></img>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Button>
      </Stack>
    </>
  );
};

export default AuthSocialButtons;
