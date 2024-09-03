import { Box, Button } from "@mui/material";
import { IconSquareX } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";

const CommunitySpace = () => {
  return (
    <Box position="relative" height="92vh" zIndex={10}>
      <iframe
        title="screen"
        scrolling="no"
        src="https://play.workadventu.re/_/4druupb1wng/evivve3.github.io/evivvecommunity/maps/map.json"
        width="100%"
        height={window.innerHeight}
        frameBorder="0"
        allow="camera; microphone; display-capture; autoplay; clipboard-write;"
        style={{
          zIndex: 10,
        }}
      />
      <Link
        to="/community"
        style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          color: "#fff",
        }}
      >
        <IconSquareX />
      </Link>
    </Box>
  );
};

export default CommunitySpace;
