import styled from "@emotion/styled";
import React, { useState } from "react";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import DisappearingTextComponent from "src/components/shared/DisappearingTextComponent";
import Loaderimage from "../../../../assets/images/programs/loader.gif";
import TemplateSelector from "./TemplateSelector";
import {
  getSelectedTemplate,
  getOnboarding,
} from "src/store/apps/programs/ProgramSlice";
import { useSelector } from "react-redux";
import ImageCycler from "./Loader";

// components
const TextComponent = styled("span")`
  color: #1e2757;
  text-align: center;
  font-family: Poppins;
  font-size: 42px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 4.3px;
`;

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Image = styled("img")`
  /* width: ${(props) =>
    props.step === 5 ? 65 : props.step > 1 ? 95 : 45}%; */
  width: ${(props) => (props.step === 5 ? "744px" : "680px")};
  margin-bottom: 20px;
  margin-top: 40px;
  opacity: ${(props) => (props.step > 2 && props.step < 5 ? 0 : 1)};
  transition: all 1s ease;
`;
const ImageLoader = styled("img")`
`;

const OnboardingLoader = ({ handleNextScreen = () => {} }) => {
  const onBoarding = useSelector(getOnboarding);
  const [step, setStep] = useState(onBoarding ? 4 : 1);
  const selectedTemplate = useSelector(getSelectedTemplate);
  if(!onBoarding)
  {
    setTimeout(() => {
      setTimeout(() => {
        window.localStorage.setItem("onboarding", "complete");
        setStep(5);
      }, 4000);
    }, 1000);
  }
  console.log(step,"STEP")
  return (
    <Container>
      {step ===1 && <ImageCycler/>}
      {step === 4 && (
        <TemplateSelector
          goToNext={() => {
            setStep(5);
          }}
        />
      )}
      {step === 5 && (
        <>
          <Image step={step} src={selectedTemplate?.image}></Image>
          <DisappearingTextComponent
            textStyle={{
              marginTop: "1.5rem",
              fontSize: "32px",
            }}
            textTimer={1000}
            transitionTimer={500}
            goToNext={() => {
              handleNextScreen();
            }}
            texts={[
              `Analyzing program details: ${selectedTemplate?.displayName}`,
              `Identifying and selecting ${selectedTemplate?.displayName} game mechanics`,
              `Composing Evivve game design for ${selectedTemplate?.displayName}`,
              `Finalizing Evivve`,
            ]}
          />
        </>
      )}
      {step === 6 && <TextComponent>step 6</TextComponent>}
      {/* {step === 3 && (
        <TextComponent >ready to create magic with Evivve...?</TextComponent>
      )} */}
      {/* {step < 2 && (
        <PrimaryBtn
          onClick={() => {
            setStep(step + 1);
            setTimeout(() => {
              setStep(3);
              // setTimeout(() => {
              //   window.localStorage.setItem("onboarding", "complete");
              //   setStep(4);
              // }, 4000);
            }, 1000);
          }}
          mt="20px"
        >
          Let's Go
        </PrimaryBtn>
      )} */}
    </Container>
  );
};

export default OnboardingLoader;
