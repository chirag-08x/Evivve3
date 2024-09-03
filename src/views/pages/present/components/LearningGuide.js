import { Stack, Typography, Box } from "@mui/material";
import { SecondaryBtn } from "src/components/shared/BtnStyles";
import ReactPlayer from "react-player";
import { LEARNING_GUIDE_BTNS } from "../constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleSound } from "src/store/apps/present/PresentSlice";
import "../styles/player.css";

const LearningGuide = ({ toggleGuide }) => {
  const [selectedBtn, setSelectedBtn] = useState(LEARNING_GUIDE_BTNS[0]);
  const currentVideo = useSelector(
    (state) => state.present.learningGuideSrc[selectedBtn?.id]?.videos
  );
  const dispatch = useDispatch();
  const [videoIdx, setVideoIdx] = useState(0);

  useEffect(() => {
    setVideoIdx(0);
  }, [selectedBtn]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "2.2px solid #2AC9FF",
        }}
        pb={2}
      >
        {LEARNING_GUIDE_BTNS.map((item) => {
          return (
            <SecondaryBtn
              width="auto"
              key={item.id}
              onClick={() => {
                if (item.id === LEARNING_GUIDE_BTNS.length - 1) {
                  toggleGuide(false);
                }
                setSelectedBtn(item);
              }}
              style={{
                background: "rgba(20,94,119,0.6)",
                border: "1px solid #2AC9FF",
                color: "white",
                fontWeight: "500",
                fontSize: "14px",
                minWidth: "112px",
                padding: "8px 12px",
                outline: `${
                  selectedBtn?.id === item.id ? "2px solid #2AC9FF" : ""
                }`,
                outlineOffset: "6px",
              }}
            >
              {item.name}
            </SecondaryBtn>
          );
        })}
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem" }}
        mt={2}
      >
        <Box>
          <Box width={"270px"} sx={{ display: "grid", gap: "1.5rem" }}>
            {selectedBtn?.subBtns?.map((item, idx) => {
              return (
                <Stack
                  color="#fff"
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  borderRadius={2}
                  onClick={() => setVideoIdx(idx)}
                  sx={{
                    border: "1.5px solid #2AC9FF",
                    boxShadow: "0 0 9px #6098F0",
                    background: "rgba(20,94,119,0.6)",
                    backgroundImage:
                      "radial-gradient(#9FDEF3 5%, transparent 5%)",
                    backgroundSize: "22px 22px",
                    backgroundBlendMode: "multiply",
                    cursor: "pointer",
                  }}
                  p={2}
                >
                  <img src={item?.icon} alt="" width="50px" />
                  <Typography variant="h6">{item?.title}</Typography>
                </Stack>
              );
            })}
          </Box>
        </Box>
        <Box>
          <ReactPlayer
            controls
            playing
            width="100%"
            height="400px"
            objectFit="cover"
            className="video-container"
            onPlay={() => dispatch(toggleSound(true))}
            onError={(e) => console.log("Error loading video", e)}
            style={{
              width: "100%",
              border: "3px solid #2AC9FF",
              borderRadius: "6px",
              boxShadow: "0 0 12px #6098F0",
            }}
            light={
              <img
                src={currentVideo[videoIdx]?.thumbnail}
                alt="Thumbnail"
                width="100%"
                height="100%"
                style={{ borderRadius: "6px" }}
              />
            }
            url={currentVideo[videoIdx]?.src}
          />
          ;
        </Box>
      </Box>
    </Box>
  );
};

export default LearningGuide;
