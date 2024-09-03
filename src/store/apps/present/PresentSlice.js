import { createSlice } from "@reduxjs/toolkit";
import { MODULE_TYPE } from "src/views/pages/present/constants";
import ActiveQRImage from "src/assets/images/present/evivveqr.png";
import QrCodeImg from "../../../assets/images/present/evivveqr.png";
import Thumbnail from "src/assets/images/present/learning-guide/Thumbnail.png";

const MODULES = [
  {
    id: "loading_module",
    name: MODULE_TYPE["loading_module"],
    hideHeader: true,
    hideFooter: true,
  },
];

const initialState = {
  modules: MODULES,
  selectedModule: null,
  video: {
    url: "https://d3cyxgc836sqrt.cloudfront.net/videos/present_mode_bgvideo.mp4",
    muted: true,
    loop: true,
  },
  audio: {
    url: "",
    muted: false,
    loop: true,
    playAudio: true,
  },
  gameLobbyVideo: {
    src: "https://d3cyxgc836sqrt.cloudfront.net/videos/Evivve3_Intro.mp4",
    insideGameLobby: false,
    muted: false,
    loop: false,
  },
  briefingVideo: {
    url: "https://d3cyxgc836sqrt.cloudfront.net/videos/Present_mode_Briefing.mp4",
    muted: false,
    loop: false,
    isPlaying: true,
    showBtn: false,
    changeScreenOnVideoEnd: true,
  },
  moduleProgress: {},
  menuVisible: false,
  setting: {
    mute: false,
    autoplay: false,
    right: false,
    fullScreen: false,
  },
  learnerActivation: {
    step: 1,
  },
  game: {
    qrCode: "",
    qrCodeImg: QrCodeImg,
    activeScreen: 1,
    players: [],
    showAlert: false,
    showGameEndAlert: false,
  },
  session: {},
  learningGuideSrc: [
    // Videos should be aligned with the index of the buttons under constants.js
    {
      name: "overview",
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/overview.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Overview/overview.mp4",
        },
      ],
    },
    {
      name: "buy",
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/buy-land.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Buy/buying-land.mp4",
        },
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/buying-tip.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Buy/buying-tips.mp4",
        },
      ],
    },
    {
      name: "harvest",
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/harvest-land.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Harvest/harvesting-lands.mp4",
        },
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/harvest-tip.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Harvest/harvesting-tip.mp4",
        },
      ],
    },
    {
      name: "trade",
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/trade-with-chief.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Trade/trade-with-chief.mp4",
        },
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/trade-with-tribe.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Trade/trade-with-tribe.mp4",
        },
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/trading-tip.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Trade/trading-tip.mp4",
        },
      ],
    },
    {
      name: "mine",
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/mine-mov.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Mine/mine-mv.mp4",
        },
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/mining-tip.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Mine/mining-tip.mp4",
        },
      ],
    },
    {
      name: "conclusion",
      thumbnail: Thumbnail,
      videos: [
        {
          thumbnail:
            "https://d3cyxgc836sqrt.cloudfront.net/images/learning-guide/conclusion.png",
          src: "https://d3cyxgc836sqrt.cloudfront.net/videos/learning-guide/Conclusion/conclusion.mp4",
        },
      ],
    },
  ],
  showResetPresentDialog: false,
};

export const PresentSlice = createSlice({
  name: "present",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    toggleSound: (state, action) => {
      state.setting.mute = action.payload;
    },
    toggleAutoplay: (state, action) => {
      state.setting.autoplay = action.payload;
    },
    toggleFullScrren: (state, action) => {
      state.setting.fullScreen = action.payload;
    },
    pinMenuRight: (state, action) => {
      state.setting.right = action.payload;
    },
    togglePresentModeMenu: (state, action) => {
      state.menuVisible = action.payload;
    },
    setInitialVideo: (state, action) => {
      if (action.payload) {
        state.video = {
          url: "https://d3cyxgc836sqrt.cloudfront.net/videos/present_background.mp4",
          muted: true,
          loop: true,
        };
      } else {
        state.video = initialState.video;
      }
    },
    setAudio: (state, action) => {
      if (action.payload) {
        state.audio.url = action.payload;
      } else {
        state.audio.url = "";
      }
    },
    setGameLobby: (state, action) => {
      state.gameLobbyVideo.insideGameLobby = action.payload;
    },
    setGameLobbyPlayers: (state, action) => {
      state.game.players = Object.values(action.payload);
    },
    resetGameLobbyPlayers: (state, action) => {
      state.game.players = [];
    },
    toggleGameAlert: (state, action) => {
      state.game.showAlert = action.payload;
    },
    toggleGameEndAlert: (state, action) => {
      state.game.showGameEndAlert = action.payload;
    },
    setInitialAudio: (state) => {
      state.audio = initialState.audio;
    },
    setQRCode: (state, action) => {
      state.game.qrCode = action.payload;
    },
    setProgramSession: (state, action) => {
      state.session = action.payload;
    },
    toggleGameScreens: (state, action) => {
      state.game.activeScreen = action.payload;
    },
    toggleActivationScreens: (state, action) => {
      state.learnerActivation.step = action.payload;
    },
    toggleBriefingVideoPlay: (state, action) => {
      state.video.isPlaying = action.payload;
    },
    toggleVideoBtns: (state, action) => {
      state.video.showBtn = action.payload;
    },
    toggleResetPresentDialog: (state, action) => {
      state.showResetPresentDialog = action.payload;
    },
    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
      const moduleProgress = {};
      state.modules?.forEach((mod) => {
        moduleProgress[mod.type] = 0; // it will be from 1 - 100
      });
      state.moduleProgress = moduleProgress;
    },
    setModuleProgress: (state, action) => {
      const moduleProgress = { ...state.moduleProgress };
      moduleProgress[action.payload.type] = action.payload.value; // it will be from 1 - 100
      state.moduleProgress = moduleProgress;
    },
    setModules: (state, action) => {
      state.modules = [...state.modules, ...action.payload];
    },
    resetPresentMode: () => initialState,
  },
});

export const getSelectedModule = (state) => state?.present?.selectedModule;
export const getPresentModules = (state) => state?.present?.modules;
export const getPresentAudio = (state) => state?.present?.audio;
export const getPresentVideo = (state) => state?.present?.video;
export const getPresentModeSetting = (state) => state?.present?.setting;
export const getPresentModeMenuVisible = (state) => state?.present?.menuVisible;
export const getModuleProgress = (state) =>
  state?.present?.moduleProgress?.[state?.present?.selectedModule?.name];
export const getSessionInfo = (state) => state?.present?.session;

export const {
  setVideo,
  setAudio,
  setInitialAudio,
  setInitialVideo,
  setSelectedModule,
  setModules,
  setProgramSession,
  clearPresentMode,
  setModuleProgress,
  toggleAutoplay,
  toggleSound,
  pinMenuRight,
  togglePresentModeMenu,
  toggleBriefingVideoPlay,
  toggleVideoBtns,
  toggleFullScrren,
  toggleGameScreens,
  toggleGameAlert,
  toggleGameEndAlert,
  toggleResetPresentDialog,
  setGameLobby,
  setGameLobbyPlayers,
  setQRCode,
  resetGameLobbyPlayers,
  toggleActivationScreens,
  resetPresentMode,
} = PresentSlice.actions;

export default PresentSlice.reducer;
