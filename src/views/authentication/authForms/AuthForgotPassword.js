import React, { useState } from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { TextInputField } from "src/components/shared/AuthStyles";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import { useForgetPassword } from "src/services/authentication";

const AuthForgotPassword = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState("");
  const forgotPassword = useForgetPassword();

  const onForgotPassClick = () => {
    forgotPassword.mutate({
      email,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  return (
    <>
      {title ? (
       <div >
     

       <Typography fontWeight="700" variant="h4" mt={-12} textAlign={"center"}>
         {title}
       </Typography></div>
      ) : null}

      {subtitle && (
        <Typography width={"80%"}
          mt={-3}
          color="#000"
          fontSize={"18px"}
          fontWeight="400"
          variant="subtitle1"
          textAlign={"center"}
        >
          {subtitle}
        </Typography>
      )}

      <Stack display={"flex"} justifyContent={"center"} flexDirection={"column"}  width={"90%"}>
        <Box pl={2.5} width={"100%"}>
          <CustomFormLabel
            htmlFor="email"
            fontWeight={400}
            color="#000"
            fontSize={"1rem"}
          >
            Email*
          </CustomFormLabel>
          <TextInputField style={{width:"98%"}}
            onChange={(e) => handleChange(e)}
            id="email"
            type="text"
            name="email"
          />
        </Box>
      </Stack>
      <Box width={"80%"}>
        <PrimaryBtn
          onClick={onForgotPassClick}
          type="submit"
          disabled={forgotPassword.isLoading}
          mt={"1.25rem"}
          width="100%"
          style={{ paddingTop: "12px", paddingBottom: "12px",width:'100%' }}
        >
          CONTINUE
        </PrimaryBtn>
      </Box>

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

export default AuthForgotPassword;
