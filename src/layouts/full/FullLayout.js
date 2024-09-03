import { styled, Container, Box, ThemeProvider, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "./vertical/sidebar/Sidebar";
import { ThemeSettings } from "src/theme/Theme";
import { useUserInfo } from "src/services/user";
import Notifications from "src/layouts/full/vertical/header/Notifications";
import Cart from "src/layouts/full/vertical/header/Cart";
import Profile from "src/layouts/full/vertical/header/Profile";
import Language from "src/layouts/full/vertical/header/Language";

import './nav-styles.css';

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));

const FullLayout = ({ fullscreen }) => {
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  useUserInfo();

  const theme = ThemeSettings();

  return (
    <MainWrapper
      className={
        customizer.activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"
      }
      style={{
        backgroundColor: "#341A5A",
      }}
    >
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <ThemeProvider theme={theme}>
        {customizer.isHorizontal ? "" : <Sidebar />}
      </ThemeProvider>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
          position: "relative",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Header */}

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ position: "absolute", right: "1rem" }}
        >
          {/* <Language />
          <Cart />
          <Notifications /> */}
          <div className="nav-hover"
            onClick={() => window.location.href="/evivve2"}
            style={{
                background: '#CB9544',
                color: 'white',
                padding: '8px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '300',
                  cursor: 'pointer'
              }}>
            Switch to <b>Evivve 2</b>
          </div>
          <Profile />
        </Stack>
        {/* ------------------------------------------- */}
        {/* {customizer.isHorizontal ? <HorizontalHeader /> : <Header />} */}
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        {/* {customizer.isHorizontal ? <Navigation /> : ''} */}
        <Container
          sx={{
            maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
          }}
          style={{
            marginTop: fullscreen ? 0 : 50,
            borderTopLeftRadius: fullscreen ? 0 : 40,
            backgroundColor: "white",
            height: fullscreen ? "100vh" : "calc(100vh - 51px)",
            maxWidth: customizer.isCollapse
              ? `calc(100vw - ${customizer.MiniSidebarWidth}px)`
              : `calc(100vw - ${customizer.SidebarWidth}px)`,
            overflowY: "auto",
            paddingLeft: fullscreen && "0px",
            paddingRight: fullscreen && "0px",
            marginRight: "0px",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: fullscreen ? "100vh" : "calc(100vh - 84px)" }}>
            <Outlet />
          </Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
        {/* <Customizer /> */}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
