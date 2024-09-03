import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import GameMenu from "./components/GameMenu";
import ModuleBody from "./components/ModuleBody";
import { ModuleFooter } from "./components/ModuleFooter";
import ModuleHeader from "./components/ModuleHeader";
import BackgroundComponent from "./components/BackgroundComponent";
import {
  getPresentModeSetting,
  getPresentModules,
  getSelectedModule,
  getSessionInfo,
  setSelectedModule,
  toggleVideoBtns,
} from "src/store/apps/present/PresentSlice";
import { MODULE_TYPE } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { useGetSessionInfo } from "src/services/present";
import { useParams } from "react-router";
import IsMouseMoving from "./IsMouseMoving";
import { useQuery } from "react-query";
import axiosClient from "src/utils/axios";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import OpenResetPresentModeDialog from "./components/OpenResetPresentModeDialog";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import moment from "moment";

import "./loader.css";
import DryRunChecklist from "./DryRunChecklist";
import CustomizeModal from "../programs/components/customize/CustomizeModal";
import DryRunMark from "./DryRunMark";

// components
const Container = styled("div")`
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const ModuleContainer = styled("div")`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  justify-content: center;
  align-items: center;
  position: realtive;
`;

const UnauthorizedSession = () => {
  const divStyle = {
    zIndex: 100,
    margin: "200px auto",
    width: "400px",
    padding: "30px",
    background: "rgba(255,255,255,1)",
    borderRadius: "10px",
    height: "fit-content",
  };

  return (
    <div style={divStyle}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Unauthorized Session
      </div>
      <div>You are not authorized to access this session.</div>
      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        Possible Issues:
      </div>
      <ol>
        <li>Wrong session link</li>
      </ol>
    </div>
  );
};

const InactiveSession = () => {
  const divStyle = {
    zIndex: 100,
    margin: "200px auto",
    width: "400px",
    padding: "30px",
    background: "rgba(255,255,255,1)",
    borderRadius: "10px",
    height: "fit-content",
  };

  return (
    <div style={divStyle}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Inactive Session
      </div>
      <div>
        This session is not active. Required action has to be taken to setup
        this session.
      </div>
      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        Possible Issues:
      </div>
      <ol>
        <li>Program has not been scheduled</li>
        <li>Program has not been purchased</li>
        <li>Facilitator hasn't accepted invite</li>
        <li>Facilitator not added</li>
      </ol>
    </div>
  );
};

const CompletedSession = () => {
  const divStyle = {
    zIndex: 100,
    margin: "200px auto",
    width: "400px",
    padding: "30px",
    background: "rgba(255,255,255,1)",
    borderRadius: "10px",
    height: "fit-content",
  };

  return (
    <div style={divStyle}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        This session has been ended
      </div>
    </div>
  );
};

const ScheduledSession = ({ programId }) => {
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const divStyle = {
    zIndex: 100,
    margin: "200px auto",
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
  };

  const scheduleResp = useQuery(
    "program-schedule",
    async () => await axiosClient().get(`/program/${programId}/schedule`),
    {
      onSuccess: ({ data }) => {
        setScheduleInfo(data.schedule);
      },
    }
  );

  if (scheduleInfo && !moment(scheduleInfo.startTime).isAfter(moment())) {
    return <></>;
  }

  return (
    <div style={divStyle}>
      {scheduleResp.isLoading && (
        <div>
          <div className="loader"></div>
        </div>
      )}
      {!scheduleResp.isLoading && (
        <>
          <div
            style={{
              color: "white",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Session starts in ...
          </div>
          <FlipClockCountdown
            to={moment(scheduleInfo?.startTime)}
            onComplete={() => setTimeout(() => window.location.reload(), 1000)}
            labelStyle={{ color: "white" }}
            digitBlockStyle={{
              background: "rgba(255,255,255,0.9)",
              color: "black",
            }}
          />
        </>
      )}
    </div>
  );
};

const Present = () => {
  const dispatch = useDispatch();
  const selectedModule = useSelector(getSelectedModule);
  const { step } = useSelector((state) => state?.present?.learnerActivation);
  const { fullScreen } = useSelector(getPresentModeSetting);
  const modules = useSelector(getPresentModules);
  const timeoutRef = useRef(null);
  const { id } = useParams();
  const isMouseMoving = IsMouseMoving();
  useGetSessionInfo(id);

  const sessionInfo = useSelector(getSessionInfo);

  const requestFullScreen = () => {
    const elem = document.body;
    if (document.fullscreenElement === elem) {
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    }
  };

  const exitFullScreen = () => {
    // document.webkitExitFullscreen();
    if (!document.fullscreenElement) return;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    }
  };

  useEffect(() => {
    if (fullScreen) {
      requestFullScreen();
    } else if (!fullScreen) {
      exitFullScreen();
    }
  }, [fullScreen]);

  const handleMouseMove = () => {
    clearTimeout(timeoutRef.current);
    if (
      selectedModule?.name === MODULE_TYPE["learner/activation"] &&
      step === 3
    ) {
      dispatch(toggleVideoBtns(true));
      timeoutRef.current = setTimeout(() => {
        dispatch(toggleVideoBtns(false));
      }, 1000);
    }
  };

  return (
    <Container
      id="fullscreen-present-mode"
      onMouseMove={handleMouseMove}
      ref={timeoutRef}
    >
      {sessionInfo.sessionType == "DRY_RUN" && <DryRunMark />}
      {false && sessionInfo.sessionType == "DRY_RUN" && <DryRunChecklist />}
      {sessionInfo.sessionState == "ONGOING" && <GameMenu />}
      <BackgroundComponent />
      {sessionInfo.sessionState == "UNAUTHORIZED" && <UnauthorizedSession />}
      {sessionInfo.sessionState == "INACTIVE" && <InactiveSession />}
      {sessionInfo.sessionState == "SCHEDULED" && (
        <ScheduledSession programId={sessionInfo.programId} />
      )}
      {sessionInfo.sessionState == "ONGOING" && <OpenResetPresentModeDialog />}
      {sessionInfo.sessionState == "ONGOING" && (
        <ModuleContainer>
          <ModuleHeader opacity={isMouseMoving} />
          <ModuleBody />
          <ModuleFooter opacity={isMouseMoving} />
        </ModuleContainer>
      )}
      {(sessionInfo.sessionState == "COMPLETED" ||
        sessionInfo.sessionState == "ABONDONED") && <CompletedSession />}
      <CustomizeModal />
    </Container>
  );
};

export default Present;
