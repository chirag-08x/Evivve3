import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import img1 from "src/assets/images/profile/user-1.jpg";
import { IconLogout } from "@tabler/icons";
import { useSignout } from "src/services/authentication";

export const Profile = () => {
  const [logout, setLogout] = useState(false);
  const customizer = useSelector((state) => state.customizer);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const user = useSelector((state) => state?.user?.profile);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";
  useSignout(logout);

  if (customizer.isCollapse) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #475467",
            padding: "15px 0",
            marginLeft: "14px",
            marginRight: "14px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          <Avatar alt="Remy Sharp" src={user?.avatar_url || img1} />
        </Box>

        <Box
          sx={{
            position: "fixed",
            zIndex: 4,
            bottom: !showLogoutPopup ? "-5rem" : "5rem",
            left: "1.9rem",
            right: "1.9rem",
            transition: "all 0.2s linear",
          }}
        >
          <Tooltip title="Logout" placement="top">
            <IconButton
              color="primary"
              onClick={() => {
                setLogout(true);
              }}
              aria-label="logout"
              size="small"
            >
              <IconLogout size="20" style={{ color: "#98A2B3" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    );
  }

  return (
    <Box
      display={"flex"}
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      sx={{ mx: 2, my: 1, py: 2, bgcolor: "#341A5A" }}
      style={{
        borderTop: hideMenu ? "0px solid transparent" : "1px solid #475467",
        borderRadius: "unset",
      }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={user?.avatar_url || img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">
              {user?.first_name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.email?.slice(0, 17)}...
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                onClick={() => {
                  setLogout(true);
                }}
                aria-label="logout"
                size="small"
              >
                <IconLogout size="20" style={{ color: "#98A2B3" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
