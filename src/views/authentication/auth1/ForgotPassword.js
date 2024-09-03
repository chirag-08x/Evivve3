import React from "react";
import img1 from "src/assets/images/backgrounds/login.svg";
import Logo from "src/assets/images/logos/logo_login.svg";
import AuthForgotPassword from "../authForms/AuthForgotPassword";

import {
  Wrapper,
  GridContainer,
  GridItem1,
  GridItem2,
  AuthWrapper,
  GridImage,
} from "src/components/shared/AuthStyles";

const ForgotPassword = () => (
  <Wrapper>
    <GridContainer>
      <GridItem1>
        
        <GridImage src={Logo} alt="logo" />
       
        <AuthWrapper>
          <AuthForgotPassword
            title="Forgot Password"
            subtitle="Enter the email address associated with your account and we’ll send you a link to reset your password."
          />
        </AuthWrapper>
      </GridItem1>
    </GridContainer>
  </Wrapper>
);

export default ForgotPassword;
