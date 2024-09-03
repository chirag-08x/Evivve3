import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { PrimaryBtn, PrimaryBtn2 } from "./BtnStyles";
import { useState } from "react";
import styled from "@emotion/styled";
import Slider from "@mui/material/Slider";
import InfoIcon from "@mui/icons-material/Info";
import {
  CONSEQUENCE_LABELS,
  PACE_LABELS,
  DIFFICULTY_LABELS,
} from "src/views/pages/programs/constants";
import {
  AccordionWrapper,
  AccordionExpandWrapper,
  Text,
  ExpandButton,
  AccordionInnerWrapper,
} from "src/views/pages/programs/components/customize/CustomizeStyles";
import { Tooltip } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

const RangeWrapper = styled("div")`
  border: 1px solid #dfe5ef;
  display: grid;
  width: 90%;
  gap: 2rem;
  padding: 1rem;
  border-radius: 8px;
`;

const RangeLabel = styled("label")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #000;
  font-size: 1rem;
  font-family: Inter;
`;

const IconWrapper = styled("span")`
  * {
    font-size: 1.6rem;
    color: #cd9f50;
  }
`;

const CustomSlider = styled(Slider)`
  color: #1e2757;
`;

const SliderWrapper = styled("div")`
  position: relative;
`;

const MinValue = styled("p")`
  position: absolute;
  bottom: 0.4rem;
  left: 0;
  color: #1e2757;
  font-weight: 500;
  font-family: Inter;
  z-index: 2;
`;

const MaxValue = styled("p")`
  position: absolute;
  bottom: 0.4rem;
  right: 0;
  color: #1e2757;
  font-weight: 500;
  font-family: Inter;
  z-index: 2;
`;

const FreeTier = styled("div")`
  background: #dfe5ef;
  position: absolute;
  width: ${(props) => props.w};
  right: ${(props) => (props.position === "r" ? 0 : "")};
  left: ${(props) => (props.left ? props.left : "")};
  height: 5rem;
  border-radius: 8px;
  top: 30%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-end;
`;

const FreeTierText = styled("p")`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const Accordion = ({
  type,
  text,
  duration,
  cronos,
  difficulty,
  consequence,
  pace,
  handleChange,
  disabled,
}) => {
  const [showAccordion, setShowAccordion] = useState(false);

  return (
    <AccordionWrapper open={showAccordion}>
      <AccordionExpandWrapper>
        <Text>{text}</Text>
        <ExpandButton
          type="button"
          onClick={() => setShowAccordion(!showAccordion)}
        >
          {showAccordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandButton>
      </AccordionExpandWrapper>
      {showAccordion && (
        <AccordionInnerWrapper>
          {type === "programContext" && (
            <>
              <PrimaryBtn type="button" width="11.75rem">
                Note Taker
              </PrimaryBtn>
              <PrimaryBtn2 type="button" width="11.75rem">
                Assistant
              </PrimaryBtn2>
            </>
          )}

          {type === "learnerContext" && (
            <>
              <PrimaryBtn type="button" width="11.75rem">
                Note Taker
              </PrimaryBtn>
              <PrimaryBtn2 type="button" width="11.75rem">
                Assistant
              </PrimaryBtn2>
            </>
          )}

          {type === "mechanicsInventory" && (
            <>
              <PrimaryBtn type="button" width="11.75rem">
                Note Taker
              </PrimaryBtn>
              <PrimaryBtn2 type="button" width="11.75rem">
                Assistant
              </PrimaryBtn2>
            </>
          )}

          {type === "game" && (
            <>
              <RangeWrapper>
                <RangeLabel htmlFor="duration">
                  Duration (in minutes)
                  <IconWrapper>
                    <Tooltip
                      placement="right"
                      title="Total time allotted for the game session."
                    >
                      <HelpOutline
                        style={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: "gray",
                          marginBottom: "-4px",
                        }}
                      />
                    </Tooltip>
                  </IconWrapper>
                </RangeLabel>
                <SliderWrapper>
                  <MinValue>{20}</MinValue>
                  <MaxValue>{60}</MaxValue>
                  <FreeTier w="25%">
                    <FreeTierText>FREE</FreeTierText>
                  </FreeTier>
                  <CustomSlider
                    id="duration"
                    name="ga_dur_min"
                    disabled={disabled}
                    marks={false}
                    max={60}
                    step={1}
                    min={20}
                    value={duration}
                    onChange={(e) => handleChange(e)}
                    size="medium"
                    valueLabelDisplay="on"
                  />
                </SliderWrapper>
              </RangeWrapper>

              {/* Head Start Cronos */}
              <RangeWrapper>
                <RangeLabel htmlFor="cronos">
                  Head Start (in Cronos){" "}
                  <IconWrapper>
                    {/* <InfoIcon /> */}
                    <Tooltip
                      placement="right"
                      title="The initial amount of cronos given to players at the start of the game."
                    >
                      <HelpOutline
                        style={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: "gray",
                          marginBottom: "-4px",
                        }}
                      />
                    </Tooltip>
                  </IconWrapper>
                </RangeLabel>
                <SliderWrapper>
                  <MinValue>{50}</MinValue>
                  <MaxValue>{500}</MaxValue>
                  <FreeTier w="23%" position="r">
                    <FreeTierText>FREE</FreeTierText>
                  </FreeTier>
                  <CustomSlider
                    id="cronos"
                    name="ga_hst"
                    disabled={disabled}
                    marks={false}
                    max={500}
                    step={1}
                    min={50}
                    value={cronos}
                    onChange={(e) => handleChange(e)}
                    size="medium"
                    valueLabelDisplay="on"
                  />
                </SliderWrapper>
              </RangeWrapper>

              {/* Consequence */}
              <RangeWrapper>
                <RangeLabel htmlFor="consequence">
                  Consequence (of decision)
                  <IconWrapper>
                    <Tooltip
                      placement="right"
                      title="Impact and repercussions of players if they fail to meet an offer."
                    >
                      <HelpOutline
                        style={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: "gray",
                          marginBottom: "-4px",
                        }}
                      />
                    </Tooltip>
                  </IconWrapper>
                </RangeLabel>
                <SliderWrapper>
                  <MinValue>relaxed</MinValue>
                  <MaxValue>strict</MaxValue>
                  <FreeTier w="25%" left="25%">
                    <FreeTierText>FREE</FreeTierText>
                  </FreeTier>
                  <CustomSlider
                    id="consequence"
                    name="ga_con"
                    disabled={disabled}
                    marks={false}
                    max={10}
                    step={2}
                    min={2}
                    value={consequence}
                    onChange={(e) => handleChange(e)}
                    size="medium"
                    valueLabelFormat={CONSEQUENCE_LABELS[consequence]}
                    valueLabelDisplay="on"
                  />
                </SliderWrapper>
              </RangeWrapper>

              {/* Pace */}
              <RangeWrapper>
                <RangeLabel htmlFor="pace">
                  Pace
                  <IconWrapper>
                    <Tooltip
                      placement="right"
                      title="The speed of the offer frequency."
                    >
                      <HelpOutline
                        style={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: "gray",
                          marginBottom: "-4px",
                        }}
                      />
                    </Tooltip>
                  </IconWrapper>
                </RangeLabel>
                <SliderWrapper>
                  <MinValue>slow</MinValue>
                  <MaxValue>fast</MaxValue>
                  <FreeTier w="25%">
                    <FreeTierText>FREE</FreeTierText>
                  </FreeTier>
                  <CustomSlider
                    id="pace"
                    name="ga_pac"
                    disabled={disabled}
                    marks={false}
                    max={7}
                    step={1}
                    min={3}
                    value={10 - pace}
                    onChange={(e) => handleChange(e)}
                    size="medium"
                    valueLabelFormat={PACE_LABELS[10 - pace]}
                    valueLabelDisplay="on"
                  />
                </SliderWrapper>
              </RangeWrapper>

              {/* Overall Difficulty */}
              <RangeWrapper>
                <RangeLabel htmlFor="difficulty">
                  Overall Difficulty
                  <IconWrapper>
                    <Tooltip
                      placement="right"
                      title="General complexity and challenge level of the game."
                    >
                      <HelpOutline
                        style={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: "gray",
                          marginBottom: "-4px",
                        }}
                      />
                    </Tooltip>
                  </IconWrapper>
                </RangeLabel>
                <SliderWrapper>
                  <MinValue>cake</MinValue>
                  <MaxValue>insane</MaxValue>
                  <FreeTier w="20%" left="15%">
                    <FreeTierText>FREE</FreeTierText>
                  </FreeTier>
                  <CustomSlider
                    id="difficulty"
                    name="ga_diff"
                    disabled={disabled}
                    marks={false}
                    max={4}
                    step={1}
                    min={0}
                    value={difficulty}
                    onChange={(e) => handleChange(e)}
                    size="medium"
                    valueLabelFormat={DIFFICULTY_LABELS[difficulty]}
                    valueLabelDisplay="on"
                  />
                </SliderWrapper>
              </RangeWrapper>
            </>
          )}
        </AccordionInnerWrapper>
      )}
    </AccordionWrapper>
  );
};

export default Accordion;
