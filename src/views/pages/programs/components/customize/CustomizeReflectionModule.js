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
import { useEditReflectionModule } from "src/services/programs";
import TextInput from "src/components/shared/TextInput";
import { Button, Stack, Tooltip } from "@mui/material";
import { IconPlus } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { HelpOutline } from "@mui/icons-material";

const CustomizeReflectionModule = ({ owner }) => {
  const { selectedModule } = useSelector(getSelectedCustomizeModule);
  const editReflection = useEditReflectionModule();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const dispatch = useDispatch();
  const [errIdx, setErrIdx] = useState(null);
  // const owner = useSelector(getSelectedProgram).owner;

  const [moduleValues, setModuleValues] = useState({
    re_id: selectedModule.id,
    re_dur_min: selectedModule.re_dur_min,
    re_que: selectedModule.re_que,
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

    if (name === "re_que") {
      if (errIdx != null && idx == errIdx) {
        setErrIdx(null);
      }
      const newValues = [...moduleValues.re_que];
      newValues[idx] = value;
      return setModuleValues({ ...moduleValues, [name]: newValues });
    }

    setModuleValues({
      ...moduleValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyValueIdx = moduleValues?.re_que?.indexOf("");
    setErrIdx(emptyValueIdx === -1 ? null : emptyValueIdx);
    if (emptyValueIdx !== -1) {
      return toast.warning("Please fill out the required fields.");
    }
    editReflection.mutate(moduleValues);
  };

  const addTextNode = () => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.re_que];
    newValues.push("");
    return setModuleValues({ ...moduleValues, re_que: newValues });
  };

  const deleteNode = (idx) => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.re_que];
    newValues.splice(idx, 1);
    return setModuleValues({ ...moduleValues, re_que: newValues });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    const reorderedItems = Array.from(moduleValues.re_que);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModuleValues({ ...moduleValues, re_que: reorderedItems });
  };

  return (
    <CustomizeWrapper>
      <Header headerText="Customize Reflection" />
      <Form onSubmit={handleSubmit}>
        <FormField>
          <TimerInput
            title="Duration (in minutes)"
            minutes={Number(moduleValues.re_dur_min)}
            setNewTime={handleTime}
            timeType="re_dur_min"
            info="Specify the duration for the Reflection stage, allowing participants ample time to engage in introspection and articulate their thoughts and reflections."
          />
        </FormField>

        <FormField>
          <CustomizeLabel htmlFor="msg">
            Reflection Questions{"   "}
            <Tooltip placement="right" title="Subtly convey strategic cues and reinforce critical objectives throughout the planning phase."><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray", marginBottom: "-4px"}}/></Tooltip>
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
                    {moduleValues?.re_que?.map((item, idx) => (
                      <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TextInput
                              name="re_que"
                              onChange={handleOnChange}
                              text={item}
                              key={idx}
                              idx={idx}
                              errIdx={errIdx}
                              removeNode={deleteNode}
                              placeholder="Enter the reflection questions to ask learners after the game."
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
            moduleValues?.re_que?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <TextInput
                  name="re_que"
                  onChange={handleOnChange}
                  text={item}
                  key={idx}
                  idx={idx}
                  errIdx={errIdx}
                  removeNode={deleteNode}
                  placeholder="Enter the reflection questions to ask learners after the game."
                  dragger={{}}
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
            disabled={editReflection.isLoading}
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

export default CustomizeReflectionModule;
