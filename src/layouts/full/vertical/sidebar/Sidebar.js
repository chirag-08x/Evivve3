import {
  useMediaQuery,
  Box,
  Drawer,
  useTheme,
  IconButton,
} from "@mui/material";
import SidebarItems from "./SidebarItems";
import Logo from "../../shared/logo/Logo";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "src/store/customizer/CustomizerSlice";
import Scrollbar from "src/components/custom-scroll/Scrollbar";
import { Profile } from "./SidebarProfile/Profile";
import SegmentIcon from "@mui/icons-material/Segment";
import { useEffect } from "react";

const Sidebar = () => {
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if (mdUp && !customizer.isCollapse) {
      dispatch(toggleSidebar());
    }
  }, [mdUp]);

  return (
    <Box
      sx={{
        width: toggleWidth,
        flexShrink: 0,
        ...(customizer.isCollapse && {
          position: "absolute",
        }),
      }}
    >
      {/* ------------------------------------------- */}
      {/* Sidebar for desktop */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="left"
        open
        variant="permanent"
        PaperProps={{
          sx: {
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.shortest,
            }),
            width: toggleWidth,
            boxSizing: "border-box",
            border: "0 !important",
            backgroundColor: "#341A5A !important",
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar Box */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            backgroundColor: "#341A5A",
            color: customizer.activeSidebarBg === "#ffffff" ? "" : "white",
            height: "100%",
            display: "grid",
            gap: `${customizer.isCollapse ? "2rem" : "4rem"} 0`,
            gridTemplateRows: "auto 1fr auto",
            alignContent: "space-between",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Logo */}
          {/* ------------------------------------------- */}
          <Box
            px={2.5}
            sx={{
              display: customizer.isCollapse ? "block" : "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Logo />

            <IconButton
              onClick={() => dispatch(toggleSidebar())}
              sx={{ padding: 0 }}
            >
              <SegmentIcon
                style={{
                  marginTop: customizer.isCollapse ? "1rem" : "2rem",
                  transform: `rotate(${
                    !customizer.isCollapse ? "90deg" : "0"
                  })`,
                  fontSize: "2rem",
                }}
              />
            </IconButton>
          </Box>
          <Scrollbar>
            {/* ------------------------------------------- */}
            {/* Sidebar Items */}
            {/* ------------------------------------------- */}
            <SidebarItems />
          </Scrollbar>
          <Profile />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
