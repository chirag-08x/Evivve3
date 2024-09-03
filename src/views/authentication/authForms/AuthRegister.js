import React, { useState } from "react";
import { Box, Typography, Stack,Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from "react-router-dom";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import {
  TimezoneSelect,
  TextInputField,
} from "src/components/shared/AuthStyles";
import { tzStrings } from "src/utils/timezones/timezonez";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { validateSignupValues } from "../validation/validations";

import AuthSocialButtons from "./AuthSocialButtons";
import { useGoogleLogin, useUserRegister } from "src/services/authentication";

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    password1: "",
    timezone: "",
  });
  const register = useUserRegister();
  const googleLogin = useGoogleLogin();

  const onSignUpClick = () => {
    const { fname, lname, email, password, password1, timezone } = values;
    if (
      validateSignupValues(fname, lname, email, password, password1, timezone)
    ) {
      toast.dismiss();
      register.mutate({
        first_name: values.fname,
        last_name: values.lname,
        email: values.email,
        password: values.password,
        confirm_password: values.password1,
        timezone: values.timezone,
        is_blocked: false,
        user_type: "USER",
      });
    }
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleGoogleLogin = (cred) => {
    googleLogin.mutate(cred);
  };

  const validationCriteria = (
    <div>
      <p>Password must contain:</p>
      <ul>
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character (e.g., !@#$%^&*)</li>
      </ul>
    </div>
  );

  return (
    <>
      {title ? (
     
        <Typography fontWeight="700" variant="h4" mt={-7} textAlign={"center"}>
          {title}
        </Typography> 
      ) : null}

      <Stack gap={1.25} mt={2} pl={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Box width="80%">
          <TextInputField
            onChange={(e) => onChange(e)}
            id="fname"
            name="fname"
            type="text"
            value={values.fname}
            placeholder="First Name"
          />
        </Box>
        <Box width="80%">
          <TextInputField
            onChange={(e) => onChange(e)}
            id="lname"
            name="lname"
            type="text"
            value={values.lname}
            placeholder="Last Name"
          />
        </Box>
        <Box width="80%">
          <TextInputField
            onChange={(e) => onChange(e)}
            id="email"
            name="email"
            type="text"
            value={values.email}
            placeholder="Email"
          />
        </Box>
        <Box width="80%" >
          <TextInputField
            id="password"
            type="password"
            name="password"
            onChange={(e) => onChange(e)}
            value={values.password}
            placeholder="Password"
          />
            <Tooltip
        title={validationCriteria}
      sx={{
        position:'absolute',
        marginTop:'3px'
      }}
        placement="right"
        arrow
      >
        <IconButton>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
        </Box>
        <Box width="80%">
          <TextInputField
            id="password1"
            name="password1"
            type="password"
            onChange={(e) => onChange(e)}
            value={values.password1}
            placeholder="Retype Password"
          />
        </Box>
        <Box width="80%">
          <TimezoneSelect
            name="timezone"
            style={{width:"90%"}}
            value={values.timezone}
            onChange={(e) => onChange(e)}
          >
            <option value="">Time Zone</option>
            {tzStrings.map(({ label, value }) => {
              return (
                <option key={uuid()} value={value}>
                  {label}
                </option>
              );
            })}
          </TimezoneSelect>
        </Box>
      </Stack>
      <Box width="60%">
        <PrimaryBtn
          onClick={onSignUpClick}
          type="submit"
          disabled={register.isLoading}
          mt={"1.25rem"}
          width="100%"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
        >
          SIGN UP
        </PrimaryBtn>
      </Box>

      <hr style={{ margin: "1.5rem 0" }} />
      <Box mt={-5}>

      <AuthSocialButtons
        title="SIGN UP WITH GOOGLE"
        handleGoogleLogin={handleGoogleLogin}
      />

      <Box mt={2} textAlign={"center"}>
        <Typography color="#000">
          Already have an account?{" "}
          <Typography
            component={Link}
            to="/auth/login"
            fontWeight="500"
            sx={{
              textDecoration: "underline",
              color: "#5B105A",
            }}
          >
            Log In
          </Typography>
        </Typography>
      </Box>
      </Box>
    </>
  );
};

export default AuthLogin;
