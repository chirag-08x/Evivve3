import styled from "@emotion/styled";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPresentModeMenuVisible,
  getPresentModeSetting,
  getPresentModules,
  getSelectedModule,
  togglePresentModeMenu,
  toggleSound,
  toggleAutoplay,
  toggleFullScrren
} from "src/store/apps/present/PresentSlice";
import { ReactComponent as MenuLogo } from "src/assets/images/present/svgs/menu_logo.svg";
import ActiveMenuLogo from "src/assets/images/present/menu_logo_active.png";
import MenuItem from "./MenuItem";
import { Popover } from "@mui/material";
import SettingModule from "./SettingModule";
import ControlMenu from "./ControlMenu";
import HelpMenu from "./HelpMenu";
import useFloatingElement from "src/hooks/useFloatingElement";
import AlertPopup from "src/components/shared/AlertPopup";
import useExitPresentMode from "src/hooks/useExitPresentMode";
import IsMouseMoving from "../IsMouseMoving";
import {useMutation} from "react-query";
import axiosClient from "../../../../utils/axios";

const Container = styled("div")`
  width: ${(props) => (props.visible ? "243px" : "90px")};
  height: ${(props) => (props.visible ? "243px" : "90px")};
  flex-shrink: 0;
  z-index: 90000;
  position: absolute;
  cursor: ${(props) => (props.visible ? "unset" : "pointer")};
  transition: ${(props) => !props.isFloating && "all 0.5s ease"};
`;

const CustomLogoImage = styled("img")`
  width: 90px;
  height: 90px;
  border-radius: 80px;
  cursor: pointer;
`;

let resetTimer = null;

const GameMenu = () => {
  const module = useSelector(getSelectedModule);
  const [popupEnchorEl, setPopupAnchorEl] = useState(null);
  const [showCustomLogo, setShowCustomLogo] = useState(false);
  const [popUpData, setPopUpData] = useState({
    type: "",
  });
  const menuVisible = useSelector(getPresentModeMenuVisible);
  // const { right } = useSelector(getPresentModeSetting);
  const presentModeSettings = useSelector(getPresentModeSetting);
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(module);
  const { elementRef, handleFloatMouseDown, isFloating, pos, setPos } =
    useFloatingElement(true, {
      top: "50px",
      left: "50px",
    });
  const exitPresentMode = useExitPresentMode();
  const opacity = IsMouseMoving();

  useEffect(() =>
  {
    getPresentModeSettings.mutate();
  }, []);

  const getPresentModeSettings =
      useMutation((data) =>
          // axiosClient().get(`/getFloatingMenuSettings/${programId}`), {
        axiosClient().get(`/getFloatingMenuSettings`), {
        onSuccess: (res) =>
        {
          const { mute, autoplay, fullscreen } = res.data.status;

          dispatch(toggleSound(mute));
          dispatch(toggleAutoplay(autoplay));
          dispatch(toggleFullScrren(fullscreen));
        },
        onError: (e) =>
        {
            console.log(e);
          // toast.error("Error in fetching SETTINGS, Please try again!");
        },
      });

  const updatePresentModeSettings =
      useMutation((data) =>
          // axiosClient().post(`/updateFloatingMenuSettings/${programId}`, data), {
        axiosClient().post(`/updateFloatingMenuSettings`, data));

  const handlePopUpClose = () =>
  {
    setPopupAnchorEl(null);
    setPopUpData({
      type: "",
    });
    setTimeout(() => resetAutoClose(true), 400);

    updatePresentModeSettings.mutate({
          mute: presentModeSettings.mute,
          autoplay: presentModeSettings.autoplay,
          fullscreen: presentModeSettings.fullScreen,
        });
  };

  const resetAutoClose = (force = false) => {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    if (Boolean(popupEnchorEl) && !force) {
      return;
    }
    resetTimer = setTimeout(() => {
      dispatch(togglePresentModeMenu(false));
    }, 2000);
  };

  // if (curModuleIndex < 1 || modules.length < 2) {
  //   return null;
  // }

  return (
    <Container
      // right={right}
      visible={menuVisible}
      ref={elementRef}
      onMouseDown={handleFloatMouseDown}
      onClick={(e) => {
        dispatch(togglePresentModeMenu(true));
        e.stopPropagation();
      }}
      isFloating={isFloating}
      style={{
        left: pos.left,
        top: pos.top,
        opacity: menuVisible ? 1 : opacity ? 1 : 0,
      }}
      onMouseMove={() => resetAutoClose()}
      onMouseOver={() => {
        setShowCustomLogo(true);
        resetAutoClose();
      }}
      onMouseLeave={() => {
        setShowCustomLogo(false);
      }}
    >
      {menuVisible ? (
        <>
          <CustomLogoImage src={ActiveMenuLogo} alt="Menu Logo" />
          <MenuItem
            onMenuClick={(evt) => {
              setPopupAnchorEl(evt.currentTarget);
              setPopUpData({
                type: "close",
              });
            }}
            name="close"
            top={0}
            right={-20}
          />
          <MenuItem
            onMenuClick={(evt) => {
              setPopupAnchorEl(evt.currentTarget);
              setPopUpData({
                type: "setting",
              });
            }}
            name="setting"
            top={76}
            right={10}
          />
          <MenuItem
            onMenuClick={(evt) => {
              setPopupAnchorEl(evt.currentTarget);
              setPopUpData({
                type: "control",
              });
            }}
            name="control"
            top={146}
            right={65}
          />
          <MenuItem
            onMenuClick={(evt) => {
              setPopupAnchorEl(evt.currentTarget);
              setPopUpData({
                type: "help",
              });
            }}
            name="help"
            top={195}
            right={144}
          />
        </>
      ) : (
        <>
          {showCustomLogo ? (
            <CustomLogoImage src={ActiveMenuLogo} alt="Menu Logo" />
          ) : (
            <MenuLogo stroke="#E6E6E6" width="90px" height="90px" />
          )}
        </>
      )}
      <Popover
        id="pop-ups"
        anchorEl={popupEnchorEl}
        keepMounted
        open={Boolean(popupEnchorEl)}
        onClose={handlePopUpClose}
        anchorOrigin={{
          horizontal: presentModeSettings.right ? "left" : "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: presentModeSettings.right ? "right" : "left",
          vertical: "top",
        }}
        style={{
          zIndex: 99999,
          transition: "all 0.5s ease",
        }}
      >
        {popUpData?.type === "setting" && (
          <SettingModule onClose={handlePopUpClose} />
        )}
        {popUpData?.type === "control" && (
          <ControlMenu onClose={handlePopUpClose} />
        )}
        {popUpData?.type === "help" && <HelpMenu onClose={handlePopUpClose} />}
        {popUpData?.type === "close" && (
          <AlertPopup
            message="Are you sure you want to exit Presentation Mode?"
            headerText="Exit"
            headerDivider={true}
            onClose={handlePopUpClose}
            buttonConfig={{
              primary: {
                text: "Exit",
                onClick: (e) => {
                  e.stopPropagation();
                  exitPresentMode(e);
                },
              },
              secondary: {
                text: "Cancel",
                onClick: handlePopUpClose,
              },
            }}
          />
        )}
      </Popover>
    </Container>
  );
};

export default GameMenu;
