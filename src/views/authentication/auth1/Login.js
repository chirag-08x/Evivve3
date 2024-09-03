import React from "react";
import img1 from "src/assets/images/backgrounds/login.svg";
import Logo from "src/assets/images/logos/logo_login.svg";
import AuthLogin from "../authForms/AuthLogin";
import {
  Wrapper,
  GridContainer,
  GridItem1,
  GridItem2,
  AuthWrapper,
  GridImage,
} from "src/components/shared/AuthStyles";
import { Divider } from "@mui/material";

const Login = () => (
  <Wrapper>
    <GridContainer>
      <GridItem1>
      <GridImage src={Logo} alt="logo" />

      
        <AuthWrapper>
          <AuthLogin title="Sign in" />
        </AuthWrapper>
      </GridItem1>
    </GridContainer>
  </Wrapper>
);

export default Login;
