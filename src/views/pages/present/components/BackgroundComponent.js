import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import {
  getPresentModeSetting,
  toggleActivationScreens,
  setInitialVideo,
} from "src/store/apps/present/PresentSlice";
import DNAImage from "src/assets/images/present/dna-bg.png";
import { MODULE_TYPE } from "../constants";

const BackgroundContainer = styled("div")`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: black;
`;

const BackgroundComponent = () => {
  const { url, muted, loop, isPlaying, changeScreenOnVideoEnd } = useSelector(
    (state) => state?.present?.video
  );
  const { mute } = useSelector(getPresentModeSetting);
  const {
    url: audioUrl,
    muted: audioMuted,
    playAudio,
    loop: audioLoop,
  } = useSelector((state) => state?.present?.audio);
  const { autoplay } = useSelector(getPresentModeSetting);
  const { step } = useSelector((state) => state?.present?.learnerActivation);
  const [showStaticBg, setShowStaticBg] = useState(false);
  const { activeScreen } = useSelector((state) => state.present.game);
  const selectedModule = useSelector((state) => state.present.selectedModule);

  useEffect(() => {
    if (
      selectedModule?.name === MODULE_TYPE["learner/activation"] &&
      (step === 4 || step === 5)
    ) {
      setShowStaticBg(true);
    } else if (
      selectedModule?.name === MODULE_TYPE["evivve"] &&
      activeScreen === 4
    ) {
      setShowStaticBg(true);
    } else {
      setShowStaticBg(false);
    }
  }, [selectedModule, activeScreen, step]);

  const {
    src: bgSrc,
    insideGameLobby,
    loop: gameLobbyLoop,
    muted: gameLobbyMute,
  } = useSelector((state) => state?.present?.gameLobbyVideo);
  const videoRefContainer = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isPlaying !== undefined) {
      if (isPlaying) {
        videoRefContainer?.current?.play();
      } else {
        videoRefContainer?.current?.pause();
      }
    }
  }, [isPlaying]);

  const handleVideoEnd = () => {
    if (autoplay) {
      dispatch(toggleActivationScreens(4));
      dispatch(setInitialVideo());
    }
  };

  return (
    <BackgroundContainer>
      {showStaticBg ? (
        <img
          src={DNAImage}
          style={{ objectFit: "cover", width: "100%" }}
          alt=""
        />
      ) : insideGameLobby ? (
        <video
          loop={gameLobbyLoop}
          src={bgSrc}
          autoPlay={true}
          muted={gameLobbyMute || mute}
          style={{ width: "100%", height: "109vh", objectFit: "cover" }}
          onEnded={(e) => {
            e.target.src =
              "https://d3cyxgc836sqrt.cloudfront.net/videos/present_background.mp4";
            e.target.loop = true;
          }}
        ></video>
      ) : (
        <video
          loop={loop}
          src={url}
          onEnded={changeScreenOnVideoEnd && handleVideoEnd}
          autoPlay={true}
          muted={muted || mute}
          style={{
            width: "100%",
            height: "109vh",
            objectFit: "cover",
          }}
          ref={videoRefContainer}
        ></video>
      )}

      {/* {insideGameLobby ? (
        <video
          loop={gameLobbyLoop}
          src={bgSrc}
          autoPlay={true}
          muted={gameLobbyMute || mute}
          style={{ width: "100%", height: "109vh", objectFit: "cover" }}
          onEnded={(e) => {
            e.target.src =
              "https://d3cyxgc836sqrt.cloudfront.net/videos/present_background.mp4";
            e.target.loop = true;
          }}
        ></video>
      ) : (
        <video
          loop={loop}
          src={url}
          onEnded={changeScreenOnVideoEnd && handleVideoEnd}
          autoPlay={true}
          muted={muted || mute}
          style={{
            width: "100%",
            height: "109vh",
            objectFit: "cover",
          }}
          ref={videoRefContainer}
        ></video>
      )} */}

      {audioUrl && (
        <audio
          src={audioUrl}
          muted={audioMuted || mute}
          loop={audioLoop}
          autoPlay={true}
        />
      )}
    </BackgroundContainer>
  );
};

export default BackgroundComponent;
