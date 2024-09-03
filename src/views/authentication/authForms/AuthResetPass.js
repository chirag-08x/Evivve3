import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { TextInputField } from "src/components/shared/AuthStyles";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import { toast } from "react-toastify";
import { useResetPassword } from "src/services/authentication";

const AuthResetPass = ({ title, subtitle, subtext }) => {
  const [values, setValues] = useState({
    password: "",
    password1: "",
  });
  const [resetCode, setResetCode] = useState("");

  const resetPassword = useResetPassword();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setResetCode(code);
    }
  }, []);

  const onResetPassClick = () => {
    if (!values.password || !values.password1) {
      return toast.warn("Please fill out all the fields.");
    }
    if (values.password !== values.password1) {
      return toast.warn("Password does not match.");
    }

    resetPassword.mutate({
      resetCode,
      newPassword: values.password,
      confirmPassword: values.password1,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h4" mt={-15} textAlign={"center"}>
          {title}
        </Typography>
      ) : null}

      {subtitle && (
        <Typography
          mt={2}
          color="#000"
          fontSize={"18px"}
          fontWeight="400"
          variant="subtitle1"
          textAlign={"center"}
        >
          {subtitle}
        </Typography>
      )}

      <Stack width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Box pl={4.5} pr={4.5} width={"100%"} >
          <CustomFormLabel
            htmlFor="password"
            fontWeight={400}
            color="#000"
            fontSize={"1rem"}
          >
            Password*
          </CustomFormLabel>
          <TextInputField
            onChange={(e) => handleChange(e)}
            id="password"
            type="password"
            name="password"
            style={{width:"100%"}}
            value={values.password}
          />
        </Box>
        <Box pl={4.5} pr={4.5} width={"100%"}>
          <CustomFormLabel
            htmlFor="reset-password"
            fontWeight={400}
            color="#000"
            fontSize={"1rem"}
          >
            Reset Password*
          </CustomFormLabel>
          <TextInputField
            onChange={(e) => handleChange(e)}
            id="reset-password"
            type="password"
            name="password1"
            style={{width:"100%"}}
            value={values.password1}
          />
        </Box>
        <Box pl={4.5} pr={4.5} width={"100%"}>
        <PrimaryBtn
          onClick={onResetPassClick}
          type="submit"
          disabled={resetPassword.isLoading}
          mt={"1.25rem"}
          width="100%"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
        >
          RESET PASSWORD
        </PrimaryBtn>
      </Box>
      </Stack>
     
    </>
  );
};

export default AuthResetPass;
