import { CssBaseline } from "@mui/material";
import { useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
import RTL from "./layouts/full/shared/customizer/RTL";
import ScrollToTop from "./components/shared/ScrollToTop";
import Router from "./routes/Router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./theme/scrollbar.css";
import {useEffect} from "react";
import { clarity } from 'react-microsoft-clarity';

function App() {
  const routing = useRoutes(Router);
  const customizer = useSelector((state) => state.customizer);

  useEffect(() =>
  {
      clarity.init("nex99fgs3o");
      clarity.consent();
  },[]);

  return (
    // <ThemeProvider theme={theme}>
    // <GoogleOAuthProvider clientId="755067706797-b3l09v9ttk2rckuq3qn3q0467qfgpkd5.apps.googleusercontent.com">
    <GoogleOAuthProvider clientId="86155783287-taskdn0upgrfv9pnqlkgdjbnkg980qog.apps.googleusercontent.com">
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
      </RTL>
    </GoogleOAuthProvider>
    // </ThemeProvider>
  );
}

export default App;
