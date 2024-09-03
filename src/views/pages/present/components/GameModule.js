import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SecondaryBtn } from "src/components/shared/BtnStyles";
import {
  getSelectedModule,
  setModuleProgress,
  toggleGameScreens,
  setGameLobby,
  resetGameLobbyPlayers,
  setInitialVideo,
  setAudio,
  getSessionInfo,
  toggleGameEndAlert,
  setSelectedModule,
  getPresentModules,
} from "src/store/apps/present/PresentSlice";
import Dashboard from "./Dashboard";
import styled from "@emotion/styled";
import GameLobby from "./GameLobby";
import { SubText } from "./ModulesComponent";
import DockerLogin from "./DockerLogin";
import { setQRCode } from "src/store/apps/present/PresentSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateSession } from "src/services/present";
import QRCodeStyling from "qr-code-styling";
import AppLogo from "../../../../assets/images/present/menu_logo_active.png";
import { CustomDialog } from "../../programs/components/Dialogs";
import { toast } from "react-toastify";

const TextField = styled("input")`
  width: 20rem;
  padding: 0.75rem;
  background-color: #fff;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  border: none;
  outline: none;
`;

const Form = styled("form")`
  display: grid;
  place-items: center;
`;

const GameModule = () => {
  const module = useSelector(getSelectedModule);
  const dispatch = useDispatch();
  const [teamName, setTeamName] = useState("");
  const { qrCode, activeScreen, players, showGameEndAlert } = useSelector(
    (state) => state?.present?.game
  );
  const [loading, setLoading] = useState(false);
  const updateSession = useUpdateSession();
  const sessionInfo = useSelector(getSessionInfo);
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(module);

  const qrCodeRef = useRef(null);
  // let link = "https://evivve.app.link/?";
  // let link = "https://evivve-alternate.test-app.link/?";
  let link = `${process.env.REACT_APP_DEEPLINK_URL}/?`;

  const handleDockerLogin = async () => {
    try {
      const data = await DockerLogin(sessionInfo.id, teamName);

      const { programCodedata, serverData } = data;

      dispatch(setQRCode(serverData?.data.data.st_code));

      dispatch(
        setModuleProgress({
          type: module.name,
          value: 10,
        })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (!qrCode) {
      return;
    }

    link += `version=3&mode=multiplayer&code=${qrCode}`;

    const generatedQrCode = new QRCodeStyling({
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

    generatedQrCode.append(qrCodeRef.current);
  }, [qrCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName) return;

    setLoading(true);
    dispatch(toggleGameScreens(2));
    handleDockerLogin();
  };

  useEffect(() => {
    const stepName =
      activeScreen === 1
        ? "EV_LAUNCH"
        : activeScreen === 2
        ? "EV_PLAYER_CONSOLE"
        : activeScreen === 3
        ? "EV_PLAYER_CONSOLE"
        : activeScreen === 4
        ? "EV_ADMIN_PANEL"
        : "EV_LAUNCH";

    updateSession.mutate({
      programStep: stepName,
    });
  }, [activeScreen]);

  useEffect(() => {
    if (activeScreen === 1) {
      dispatch(resetGameLobbyPlayers());
      setTeamName("");
    }
  }, [activeScreen]);

  useEffect(() => {
    dispatch(
      setModuleProgress({
        type: module.name,
        value: Math.ceil(activeScreen * (100 / 4)),
      })
    );
  }, [activeScreen]);

  useEffect(() => {
    dispatch(toggleGameScreens(activeScreen));
  }, [dispatch, module]);

  useEffect(() => {
    //Only switch the activeScreen to lobby if the game hasn't started
    if (players.length > 0 && activeScreen != 4) {
      dispatch(toggleGameScreens(3));
    }
  }, [players]);

  useEffect(() => {
    if (activeScreen === 2) {
      dispatch(setQRCode(""));
      // handleDockerLogin();
    }

    if (activeScreen == 3) {
      dispatch(setGameLobby(true));
      dispatch(setAudio());
    } else {
      dispatch(setGameLobby(false));
      dispatch(setInitialVideo(2));
      dispatch(
        setAudio("https://d3cyxgc836sqrt.cloudfront.net/audios/game.mp3")
      );
    }
  }, [activeScreen]);

  switch (activeScreen) {
    case 1:
      return (
        <Form action="" onSubmit={handleSubmit}>
          <TextField
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          ></TextField>
          <SecondaryBtn style={{ width: "180px" }} disabled={loading && true}>
            {loading ? (
              <CircularProgress
                color="inherit"
                style={{ width: "18px", height: "18px" }}
              />
            ) : (
              "LAUNCH GAME"
            )}
          </SecondaryBtn>
        </Form>
      );

    case 2:
      return (
        <>
          <SubText>
            Enter Code <br />
            <br />{" "}
            <strong style={{ color: "#e8c48f", fontSize: "3rem" }}>
              {!qrCode ? (
                <CircularProgress
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                qrCode
              )}
            </strong>{" "}
            <br />
            <br />
            <div ref={qrCodeRef} />
            <br />
            <SecondaryBtn
              onClick={() => {
                toast.success("Link Copied.");
                navigator.clipboard.writeText(
                  `${window.location.origin}/evivve3/game/index.html`
                );
              }}
              style={{
                margin: "0 auto",
              }}
            >
              Copy Link
            </SecondaryBtn>
          </SubText>
        </>
      );

    case 3:
      return <GameLobby />;
    case 4:
      return (
        <>
          <Dashboard />
          <CustomDialog
            open={showGameEndAlert}
            heading="Performing this action will end the game."
            subheading="Are you sure ?"
            btn1Text="Next"
            btn2Text="Stay Here"
            onConfirm={() => {
              dispatch(setSelectedModule(modules[curModuleIndex + 1]));
              dispatch(toggleGameEndAlert(false));
            }}
            discard={() => {
              dispatch(toggleGameEndAlert(false));
            }}
          />
        </>
      );
    default:
      return <></>;
  }
};

export default GameModule;
