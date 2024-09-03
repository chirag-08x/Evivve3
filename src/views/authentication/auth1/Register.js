import React from "react";
import Logo from "src/assets/images/logos/logo_login.svg";
import img1 from "src/assets/images/backgrounds/signup.svg";

import {
  Wrapper,
  GridContainer,
  GridItem1,
  GridItem2,
  AuthWrapper,
  GridImage,
} from "src/components/shared/AuthStyles";

import AuthRegister from "../authForms/AuthRegister";

const Register = () => (
  <Wrapper>
    <GridContainer>
      <GridItem1>
      <GridImage style={{height:'3.6rem',marginTop:'-1rem'}} src={Logo} alt="logo" />
        <AuthWrapper>
          <AuthRegister title="Sign Up" />
        </AuthWrapper>
      </GridItem1>
    </GridContainer>
  </Wrapper>
);

export default Register;
