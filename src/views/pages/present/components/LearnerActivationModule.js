import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimerComponent from "src/components/shared/TimerComponent";
import TypingEffectText from "src/components/shared/TypingEffectText";
import {
  getPresentModeSetting,
  getPresentModules,
  getSelectedModule,
  setModuleProgress,
  setSelectedModule,
  setVideo,
  setAudio,
  toggleActivationScreens,
  toggleBriefingVideoPlay,
  setInitialVideo,
} from "src/store/apps/present/PresentSlice";
import {
  HeaderContainer,
  HeadingText,
  TimerText,
  SubText,
} from "./ModulesComponent";
import styled from "@emotion/styled";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useUpdateSession } from "src/services/present";
import DisappearingTextComponent from "src/components/shared/DisappearingTextComponent";
import LearningGuide from "./LearningGuide";
import { SecondaryBtn } from "src/components/shared/BtnStyles";
import IsMouseMoving from "../IsMouseMoving";
import { Box, Typography } from "@mui/material";
import AppLogo from "src/assets/images/present/menu_logo_active.png";
import QRCodeStyling from "qr-code-styling";
import { useParams } from "react-router";
import axiosClient from "../../../../utils/axios";

// components

const VideoBtns = styled("button")`
  display: grid;
  place-items: center;
  border-radius: 50%;
  padding: 0.5rem;
  background: rgb(52, 26, 90);
  border: 4px solid white;
  transition: all 1s linear;
  opacity: ${(props) => (props.showBtn ? 1 : 0)};

  * {
    color: white;
    font-size: 3.5rem;
  }
`;

let learnerActivationSessionCode = -1;

const LearnerActivationModule = () => {
  const module = useSelector(getSelectedModule);
  const { autoplay } = useSelector(getPresentModeSetting);
  const { step } = useSelector((state) => state?.present?.learnerActivation);
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(module);
  const briefingVideo = useSelector((state) => state?.present?.briefingVideo);
  const { isPlaying, showBtn } = useSelector((state) => state?.present?.video);
  const updateSession = useUpdateSession();
  const opacity = IsMouseMoving();
  const [lg1, setLg1] = useState(false);
  const [lg2, setLg2] = useState(false);
  const { id } = useParams();
  // let link = "https://evivve.app.link/?";
  // let link = "https://evivve-alternate.test-app.link/?";
  let link = `${process.env.REACT_APP_DEEPLINK_URL}/?`;

  const qrCodeRef = useRef(null);

  async function GenerateLearnerActivationCode() {
    let res = await axiosClient().post(`/learnerActivationCode`, { id });
    learnerActivationSessionCode = res.data.code;

    // Generate qr code for with deeplink
    // let link = "https://evivve.app.link/?";
    link += `version=3&mode=singlePlayer&code=${learnerActivationSessionCode}`;

    const qrCode = new QRCodeStyling({
      width: 175,
      height: 175,
      data: link,
      image: AppLogo,
      dotsOptions: {
        color: "#430f74",
        type: "rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5, //20
      },
      cornersDotOptions: {
        color: "#d11717",
      },
      cornersSquareOptions: {
        color: "#d11717",
        type: "extra-rounded",
      },
    });

    qrCode.append(qrCodeRef.current);

    console.log(link);
  }

  useEffect(() => {
    // generate unique learner activation code
    if (step === 4) {
      GenerateLearnerActivationCode();
    }

    // End learner activation code
    if (step === 5) {
      Update();

      async function Update() {
        const today = new Date();

        let endTime = `${today.getFullYear()}-${
          today.getUTCMonth() + 1
        }-${today.getUTCDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        await axiosClient().post(`/endLearnerActivationCode`, { id, endTime });
      }
    }
  }, [step, lg1, lg2]);

  useEffect(() => {
    const stepName =
      step === 1
        ? "WELCOME"
        : step === 2
        ? "AC_BRIEFING"
        : step === 3
        ? "AC_VIDEO"
        : step === 4
        ? "AC_INSTALL"
        : step === 5
        ? "AC_QNA"
        : "WELCOME";

    updateSession.mutate({
      programStep: stepName,
    });
  }, [step]);

  useEffect(() => {
    if (step === 3) {
      dispatch(setAudio());
    } else {
      dispatch(
        setAudio("https://d3cyxgc836sqrt.cloudfront.net/audios/activation.mp3")
      );
    }
  }, [step]);

  const handleNextClick = () => {
    // dispatch(toggleActivationScreens(6));
    if (autoplay) {
      dispatch(setSelectedModule(modules[curModuleIndex + 1]));
    }
  };

  const togglePlayState = () => {
    if (isPlaying) {
      dispatch(toggleBriefingVideoPlay(false));
    } else {
      dispatch(toggleBriefingVideoPlay(true));
    }
  };

  useEffect(() => {
    dispatch(
      setModuleProgress({
        type: module.name,
        value: parseInt(step * (100 / 6)),
      })
    );
  }, [step, dispatch, module]);

  const goToStep3 = () => {
    dispatch(toggleActivationScreens(3));
    dispatch(
      setVideo({
        ...briefingVideo,
      })
    );
  };

  useEffect(() => {
    if (step === 3) {
      goToStep3();
    } else if (step >= 4) {
      dispatch(setInitialVideo(2));
    } else if (step < 3) {
      dispatch(setInitialVideo());
    }
  }, [step]);

  return (
    <>
      {step === 1 && (
        <DisappearingTextComponent
          texts={module?.la_wms}
          // timer={3500}
          textTimer={2500}
          transitionTimer={1000}
          repeat={false}
          textStyle={{
            color: "#ffffff",
            width: "80%",
            marginTop: "30px",
            fontFamily: "Inter",
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: 700,
          }}
          goToNext={() => {
            setTimeout(() => {
              if (autoplay) dispatch(toggleActivationScreens(2));
            }, 1000);
          }}
        />
      )}
      {step === 2 && (
        <>
          <TypingEffectText
            text="Briefing Begins in"
            textStyle={`
                            color: #FFF;
                            text-align: center;
                            text-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
                            font-family: Inter;
                            font-size: 48px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: 56px;
                        `}
          />
          <TimerComponent
            textComponent={({ text }) => {
              return <TimerText>{text}</TimerText>;
            }}
            showAddTime={false}
            time={30}
            onTimerEnd={goToStep3}
          />
        </>
      )}
      {step === 3 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
          }}
          onClick={togglePlayState}
        >
          <VideoBtns showBtn={showBtn} onClick={togglePlayState}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </VideoBtns>
        </div>
      )}
      {step === 4 && (
        <>
          {lg1 ? (
            <Box sx={{ width: "90%" }}>
              <Typography
                color="#fff"
                variant="h5"
                sx={{
                  background: "rgba(20,94,119,0.5)",
                  border: "3px solid #2AC9FF",
                  width: "350px",
                  margin: "0 auto",
                }}
                borderRadius={2}
                py={1}
                textAlign="center"
              >
                LEARNING GUIDE
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 230px",
                  gap: "5rem",
                }}
                mt={3}
              >
                <Box>
                  <LearningGuide toggleGuide={setLg1} />
                </Box>

                <Box>
                  <Box
                    sx={{
                      background: "rgba(20,94,119,0.5)",
                      backgroundImage:
                        "radial-gradient(#9FDEF3 5%, transparent 5%)",
                      backgroundSize: "40px 40px",
                      backgroundBlendMode: "multiply",
                    }}
                    borderRadius={4}
                    textAlign="center"
                    px={2}
                    pb={1}
                  >
                    <TimerComponent
                      textComponent={({ text }) => {
                        return (
                          <TimerText style={{ fontSize: 48 }}>{text}</TimerText>
                        );
                      }}
                      showAddTime
                      time={module?.la_dur_min * 60}
                      onTimerEnd={() => {
                        if (autoplay) dispatch(toggleActivationScreens(5));
                      }}
                    />
                    <SubText style={{ fontSize: "20px" }}>
                      Learn to buy and harvest land, and to trade resources.
                    </SubText>
                  </Box>
                  <div
                    ref={qrCodeRef}
                    style={{ textAlign: "center", marginTop: "2rem" }}
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                background: "rgba(20,94,119,0.6)",
                width: "65%",
                display: "grid",
                gridTemplateColumns: "2fr auto 1fr",
                gap: "1rem",
                alignItems: "center",
                border: "3px solid #2AC9FF",
                backgroundImage: "radial-gradient(#9FDEF3 5%, transparent 5%)",
                backgroundSize: "40px 40px",
                backgroundBlendMode: "multiply",
                boxShadow: "0 0 15px #6098F0",
              }}
              p={5}
              borderRadius={2}
            >
              <Box
                sx={{
                  display: "grid",
                  alignItems: "center",
                }}
              >
                <SubText style={{ textAlign: "left", width: "100%" }}>
                  Please scan this QR code using your mobile devices to learn
                  how to use the ERM system.
                </SubText>
                <br />
                <br />
                <SubText style={{ textAlign: "left", width: "100%" }}>
                  In the guided tour, you'll learn how to buy and harvest lands
                  to generate resources, trade resources with tribe members or
                  with the Chief. And lastly, how to mine movilenniums.
                </SubText>
                <br />
                <br />
                <SubText style={{ textAlign: "left", width: "100%" }}>
                  In the next 7-10 minutes you'll learn how to play Evivve! Dive
                  in!
                </SubText>
              </Box>

              <Box
                sx={{ width: "2px", height: "100px", background: "#2AC9FF" }}
                borderRadius={1}
              ></Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <TimerComponent
                  textComponent={({ text }) => {
                    return (
                      <TimerText style={{ fontSize: 48 }}>{text}</TimerText>
                    );
                  }}
                  showAddTime
                  time={module?.la_dur_min * 60}
                  onTimerEnd={() => {
                    if (autoplay) dispatch(toggleActivationScreens(5));
                  }}
                />
                <div ref={qrCodeRef} style={{ textAlign: "center" }} />
                <SecondaryBtn
                  width="243px"
                  mt="0.5rem"
                  ml="auto"
                  mr="auto"
                  onClick={() => setLg1(true)}
                  // style={{ opacity: opacity ? 1 : 0, transition: "opacity 1s" }}
                  style={{
                    background: "rgba(20,94,119,0.6)",
                    border: "1px solid #2AC9FF",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Learning Guide
                </SecondaryBtn>
                <SecondaryBtn
                  width="243px"
                  mt="0.5rem"
                  ml="auto"
                  mr="auto"
                  // style={{ opacity: opacity ? 1 : 0, transition: "opacity 1s" }}
                  style={{
                    background: "rgba(20,94,119,0.6)",
                    border: "1px solid #2AC9FF",
                    color: "white",
                    fontWeight: "500",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      link +
                        `version=3&mode=singlePlayer&code=${learnerActivationSessionCode}`
                    );
                  }}
                >
                  Copy Link
                </SecondaryBtn>
              </Box>
            </Box>
          )}
        </>
      )}
      {step === 5 && (
        <>
          {lg2 && (
            <Typography
              color="#fff"
              variant="h5"
              sx={{
                background: "rgba(20,94,119,0.5)",
                border: "3px solid #2AC9FF",
                width: "350px",
                margin: "0 auto",
              }}
              borderRadius={2}
              py={1}
              textAlign="center"
            >
              LEARNING GUIDE
            </Typography>
          )}
          <Box
            sx={{
              display: `${lg2 && "grid"}`,
              gridTemplateColumns: "1fr 230px",
              gap: "3rem",

              alignItems: "center",
              px: 3,
              width: "90%",
              mt: 2,
            }}
          >
            {lg2 && (
              <Box>
                <LearningGuide toggleGuide={setLg2} />
              </Box>
            )}

            <Box display="flex" flexDirection="column" alignItems="center">
              <HeaderContainer style={{ width: "initial" }}>
                <HeadingText>Q&A</HeadingText>
              </HeaderContainer>
              <TimerComponent
                textComponent={({ text }) => {
                  return (
                    <TimerText style={{ fontSize: lg2 && 48 }}>
                      {text}
                    </TimerText>
                  );
                }}
                showAddTime
                time={module?.la_qad_min * 60}
                onTimerEnd={handleNextClick}
              />
              {!lg2 && (
                <SecondaryBtn
                  width="auto"
                  mt="1.5rem"
                  ml="auto"
                  mr="auto"
                  onClick={() => setLg2(true)}
                  style={{ opacity: opacity ? 1 : 0, transition: "opacity 1s" }}
                >
                  Learning Guide
                </SecondaryBtn>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default LearnerActivationModule;
