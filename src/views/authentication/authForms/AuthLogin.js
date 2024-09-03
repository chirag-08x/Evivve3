import React, { useState } from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { TextInputField } from "src/components/shared/AuthStyles";

import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";

import AuthSocialButtons from "./AuthSocialButtons";
import { useGoogleLogin, useUserLogin } from "src/services/authentication";
import { toast } from "react-toastify";
import validator from "validator";

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useUserLogin();
  const googleLogin = useGoogleLogin();

  const onSignInClick = () => {
    if (!email || !validator.isEmail(email)) {
      return toast.warn("Please enter a valid email.");
    }
    if (!password) {
      return toast.warn("Please enter a valid password.");
    }
    login.mutate({
      email,
      password,
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleGoogleLogin = (cred) => {
    cred.timezone = Intl.DateTimeFormat()?.resolvedOptions()?.timeZone || "Asia/Calcutta";
    googleLogin.mutate(cred);
  };

  return (
    <>
      {title ? (<div>

        <Typography fontWeight="700" variant="h4" style={{marginTop:'-5rem'}} textAlign={"center"}>
          {title}
        </Typography></div>
      ) : null}

      <Stack gap={1.5} display="flex" flexDirection="column" alignItems="center" width="90%"  >
        <Box width="100%" pl={5.5} >
          <CustomFormLabel
            htmlFor="email"
            fontWeight={400}
            color="#000"
            fontSize={"1rem"}
          >
            Email*
          </CustomFormLabel>
          <TextInputField
            onChange={(e) => handleChange(e)}
            id="email"
            type="text"
            name="email"
          />
        </Box>
        <Box width="100%" pl={5.5}  >
          <CustomFormLabel
            fontWeight={400}
            fontSize={"1rem"}
            htmlFor="password"
            color="#000"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              
            }}
          >
            Password*
          </CustomFormLabel>
          <TextInputField
            id="password"
            type="password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <Typography
          fontSize={"1rem"}
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: "underline",
              color: "#000",
              display: "flex",
              justifyContent: "flex-end",
              paddingRight:'3.5rem',
              alignItems: "center",
            }}
          >
            Forgot your password?
          </Typography>
        </Box>
      </Stack>
      <Box pt={3} width="100%" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        <PrimaryBtn
          onClick={onSignInClick}
          type="submit"
          disabled={login.isLoading}
          mt={"1rem"}
           
          style={{ paddingTop: "12px", paddingBottom: "12px",fontSize:'1rem',width:'80%' }}
        >
          LOG IN
        </PrimaryBtn>
      </Box>
      <AuthSocialButtons 
        title="LOG IN WITH GOOGLE"
        handleGoogleLogin={handleGoogleLogin}
      />

      <Box mt={3} textAlign={"center"}>
        <Typography color="#000">
          Don't have an account?{" "}
          <Typography
            component={Link}
            to="/auth/sign-up"
            fontWeight="500"
            sx={{
              textDecoration: "underline",
              color: "#5B105A",
            }}
          >
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </>
  );
};

export default AuthLogin;
