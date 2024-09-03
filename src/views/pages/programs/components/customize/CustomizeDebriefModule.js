import Header from "./Header";
import { useState } from "react";
import { PrimaryBtn, AddNodeBtnStyles } from "src/components/shared/BtnStyles";
import {
  CustomizeLabel,
  FormField,
  InfoCircle,
  ModuleInfoText,
  InfoIconContainer,
} from "./CustomizeStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  getSelectedCustomizeModule,
  getSelectedProgram,
  toggleEditFlag,
} from "src/store/apps/programs/ProgramSlice";
import TimerInput from "src/components/shared/TimerInput";
import { CustomizeWrapper, Form } from "./CustomizeStyles";
import { BtnWrapper } from "src/components/shared/BtnWrapper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEditDebriefModule } from "src/services/programs";
import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  AccordionWrapper,
  AccordionExpandWrapper,
  Text,
  ExpandButton,
  AccordionInnerWrapper,
} from "./CustomizeStyles";
import TextInput from "src/components/shared/TextInput";
import { Button, Stack, TextField, Tooltip } from "@mui/material";
import { IconPlus } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { HelpOutline } from "@mui/icons-material";

const Container = styled("div")`
  resize: none;
  padding: 0 1rem;
  border-radius: 7px;
  font-size: 1rem;
  font-weight: 500;
`;

const List = styled("ul")`
  display: grid;
  gap: 0.5rem 0;
  padding-left: 1rem;
  margin-top: 0;
  cursor: default;
`;

const ListItem = styled("li")``;

const CustomizeDebriefModule = ({ owner }) => {
  const { selectedModule } = useSelector(getSelectedCustomizeModule);
  const editDebrief = useEditDebriefModule();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const dispatch = useDispatch();
  const [showAccordion, setShowAccordion] = useState(false);
  const [errIdx, setErrIdx] = useState(null);
  // const owner = useSelector(getSelectedProgram).owner;

  const [moduleValues, setModuleValues] = useState({
    de_id: selectedModule.id,
    de_dur_min: selectedModule.de_dur_min,
    de_ide: selectedModule.de_ide,
    de_ins: selectedModule.de_ins,
    de_pts: selectedModule.de_pts,
  });

  const handleTime = (newMins, type) => {
    if (moduleValues[type] != newMins && !editFlag) {
      dispatch(toggleEditFlag(true));
    }
    setModuleValues({ ...moduleValues, [type]: `${newMins}` });
  };

  const handleOnChange = (e, idx = "") => {
    const name = e.target.name;
    let value = e.target.value;
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    if (name === "de_pts") {
      if (errIdx != null && idx == errIdx) {
        setErrIdx(null);
      }
      const newValues = JSON.parse(JSON.stringify(moduleValues.de_pts));
      newValues[idx]["description"] = value;
      return setModuleValues({ ...moduleValues, [name]: newValues });
    }

    setModuleValues({
      ...moduleValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyValueIdx = moduleValues?.de_pts.reduce((acc, item, index) => {
      if (acc === -1 && (!item.title || !item.description)) {
        return index;
      }
      return acc;
    }, -1);
    setErrIdx(emptyValueIdx === -1 ? null : emptyValueIdx);
    if (emptyValueIdx !== -1) {
      return toast.warning("Please fill out the required fields.");
    }
    editDebrief.mutate(moduleValues);
  };

  const addTextNode = () => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.de_pts];
    newValues.push({ title: "", description: "" });
    return setModuleValues({ ...moduleValues, de_pts: newValues });
  };

  const deleteNode = (idx) => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.de_pts];
    newValues.splice(idx, 1);
    return setModuleValues({ ...moduleValues, de_pts: newValues });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    const reorderedItems = Array.from(moduleValues.de_pts);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModuleValues({ ...moduleValues, de_pts: reorderedItems });
  };

  return (
    <CustomizeWrapper>
      <Header headerText="Customize Debrief" />
      <Form onSubmit={handleSubmit}>
        {/* Debrief Timer */}
        <FormField>
          <TimerInput
            title="Duration (in minutes)"
            minutes={Number(moduleValues.de_dur_min)}
            setNewTime={handleTime}
            timeType="de_dur_min"
            info="Set the duration for the Debrief stage, providing sufficient time for comprehensive discussion and analysis of learning outcomes and game experiences."
          />
        </FormField>

        {/* Debrief Ideas */}
        <FormField>
          <CustomizeLabel htmlFor="msg">Debrief Ideas</CustomizeLabel>

          <AccordionWrapper open={showAccordion}>
            <AccordionExpandWrapper>
              <Text>
                Here are some debrief ideas to help you bring home the learning
                from Evivve
              </Text>
              <ExpandButton
                type="button"
                onClick={() => setShowAccordion(!showAccordion)}
              >
                {showAccordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ExpandButton>
            </AccordionExpandWrapper>
            {showAccordion && (
              <AccordionInnerWrapper>
                <Container>
                  <List>
                    {moduleValues?.de_ide.map((item, idx) => {
                      return <ListItem key={`${idx}123`}>{item}</ListItem>;
                    })}
                  </List>
                </Container>
              </AccordionInnerWrapper>
            )}
          </AccordionWrapper>
        </FormField>

        {/* Debrief Points */}
        <FormField>
          <CustomizeLabel htmlFor="msg">
            Debrief Points{"   "}
            <Tooltip
              placement="right"
              title="These points will appear on Present Mode one line at a time."
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
            {/* <InfoCircle>
              <InfoIconContainer>
                <InfoOutlinedIcon />
              </InfoIconContainer>
              <ModuleInfoText>
                These points will appear on Present Mode one line at a time.
              </ModuleInfoText>
            </InfoCircle> */}
          </CustomizeLabel>

          {owner ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {moduleValues?.de_pts?.map((item, idx) => (
                      <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              marginBottom: "20px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TextField
                              fullWidth
                              placeholder="Title"
                              value={item?.title}
                              onChange={(e) => {
                                if (errIdx != null && idx == errIdx) {
                                  setErrIdx(null);
                                }
                                if (e.target.value.length > 50) return;
                                const newValues = JSON.parse(
                                  JSON.stringify(moduleValues.de_pts)
                                );
                                newValues[idx]["title"] = e.target.value;
                                return setModuleValues({
                                  ...moduleValues,
                                  de_pts: newValues,
                                });
                              }}
                              name="de_pts"
                              sx={{
                                "& .MuiOutlinedInput-input": {
                                  padding: "3px 10px",
                                },
                                fontFamily: "Inter",
                                "& .MuiOutlinedInput-root": {
                                  "&.MuiInputBase-root fieldset": {
                                    border:
                                      errIdx == idx
                                        ? "1px solid red"
                                        : "1px solid #dfe5ef",
                                    borderBottom: "none",
                                    borderRadius: "7px",
                                    borderBottomRightRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  },
                                },
                              }}
                              InputProps={{
                                maxLength: 10,
                                sx: {
                                  fontSize: "14px",
                                  fontWeight: 700,
                                },
                              }}
                            />
                            <TextInput
                              name="de_pts"
                              onChange={handleOnChange}
                              text={item?.description}
                              key={idx}
                              idx={idx}
                              removeNode={deleteNode}
                              errIdx={errIdx}
                              placeholder="Enter the debrief points you wish to make after the reflection."
                              dragger={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            moduleValues?.de_pts?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Title"
                  value={item?.title}
                  
                  onChange={(e) => {
                    if (errIdx != null && idx == errIdx) {
                      setErrIdx(null);
                    }
                    if (e.target.value.length > 50) return;
                    const newValues = JSON.parse(
                      JSON.stringify(moduleValues.de_pts)
                    );
                    newValues[idx]["title"] = e.target.value;
                    return setModuleValues({
                      ...moduleValues,
                      de_pts: newValues,
                    });
                  }}
                  name="de_pts"
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      padding: "3px 10px",
                    },
                    fontFamily: "Inter",
                    "& .MuiOutlinedInput-root": {
                      "&.MuiInputBase-root fieldset": {
                        border:
                          errIdx == idx
                            ? "1px solid red"
                            : "1px solid #dfe5ef",
                        borderBottom: "none",
                        borderRadius: "7px",
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                    },
                  }}
                  InputProps={{
                    maxLength: 10,
                    sx: {
                      fontSize: "14px",
                      fontWeight: 700,
                    },
                    readOnly: true,
                  }}
                />
                <TextInput
                  name="de_pts"
                  onChange={handleOnChange}
                  text={item?.description}
                  key={idx}
                  idx={idx}
                  removeNode={deleteNode}
                  errIdx={errIdx}
                  placeholder="Enter the debrief points you wish to make after the reflection."
                />
              </div>
            ))
          )}
          {owner && (
            <Stack direction="row" justifyContent="center" alignItems="center">
            <Button sx={AddNodeBtnStyles} onClick={addTextNode}>
              <IconPlus size="16px" color="#fff" />
            </Button>
          </Stack>
          )}
        </FormField>
        {owner && (
          <BtnWrapper>
          <PrimaryBtn
            disabled={editDebrief.isLoading}
            style={{ justifySelf: "end" }}
          >
            Save
          </PrimaryBtn>
        </BtnWrapper>
        )}
      </Form>
    </CustomizeWrapper>
  );
};

export default CustomizeDebriefModule;
