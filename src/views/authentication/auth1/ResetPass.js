import React from "react";
import img1 from "src/assets/images/backgrounds/login.svg";
import Logo from "src/assets/images/logos/logo_login.svg";
import AuthResetPass from "../authForms/AuthResetPass";

import {
  Wrapper,
  GridContainer,
  GridItem1,
  GridItem2,
  AuthWrapper,
} from "src/components/shared/AuthStyles";

const ForgotPassword = () => (
  <Wrapper>
    <GridContainer>
      <GridItem1>
        <img style={{ padding: "0 3.5rem",height:'3.5rem' }} src={Logo} alt="logo" />
        
        <AuthWrapper>
          <AuthResetPass title="Reset Password" />
        </AuthWrapper>
      </GridItem1>

      <GridItem2 bg={img1}></GridItem2>
    </GridContainer>
  </Wrapper>
);

export default ForgotPassword;
