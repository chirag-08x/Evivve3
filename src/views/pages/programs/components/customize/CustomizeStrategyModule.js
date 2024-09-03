import Header from "./Header";
import { useState } from "react";
import { PrimaryBtn, AddNodeBtnStyles } from "src/components/shared/BtnStyles";
import { CustomizeLabel, FormField } from "./CustomizeStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  getSelectedCustomizeModule,
  getSelectedProgram,
  toggleEditFlag,
} from "src/store/apps/programs/ProgramSlice";
import TimerInput from "src/components/shared/TimerInput";
import { CustomizeWrapper, Form } from "./CustomizeStyles";
import { BtnWrapper } from "src/components/shared/BtnWrapper";
import { useEditStrategyModule } from "src/services/programs";
import { IconPlus } from "@tabler/icons";
import TextInput from "src/components/shared/TextInput";
import { Button, Stack, Tooltip } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { HelpOutline } from "@mui/icons-material";

const CustomizeStrategyModule = ({ owner }) => {
  const { selectedModule } = useSelector(getSelectedCustomizeModule);
  const editStrategy = useEditStrategyModule();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const dispatch = useDispatch();
  const [errIdx, setErrIdx] = useState(null);
  // const owner = useSelector(getSelectedProgram).owner;

  const [moduleValues, setModuleValues] = useState({
    sp_id: selectedModule.id,
    sp_dur_min: selectedModule.sp_dur_min,
    sp_sms: selectedModule?.sp_sms,
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

    if (name === "sp_sms") {
      if (errIdx != null && idx == errIdx) {
        setErrIdx(null);
      }
      const newValues = [...moduleValues.sp_sms];
      newValues[Number(idx)] = value;
      return setModuleValues({ ...moduleValues, [name]: newValues });
    }

    setModuleValues({
      ...moduleValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyValueIdx = moduleValues?.sp_sms?.indexOf("");
    setErrIdx(emptyValueIdx === -1 ? null : emptyValueIdx);
    if (emptyValueIdx !== -1) {
      return toast.warning("Please fill out the required fields.");
    }
    editStrategy.mutate(moduleValues);
  };

  const addTextNode = () => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.sp_sms];
    newValues.push("");
    return setModuleValues({ ...moduleValues, sp_sms: newValues });
  };

  const deleteNode = (idx) => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.sp_sms];
    newValues.splice(idx, 1);
    return setModuleValues({ ...moduleValues, sp_sms: newValues });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    const reorderedItems = Array.from(moduleValues.sp_sms);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModuleValues({ ...moduleValues, sp_sms: reorderedItems });
  };

  return (
    <CustomizeWrapper>
      <Header headerText="Customize Strategy and Planning" />
      <Form onSubmit={handleSubmit}>
        <FormField>
          <TimerInput
            title="Duration (in minutes)"
            minutes={Number(moduleValues.sp_dur_min)}
            setNewTime={handleTime}
            timeType="sp_dur_min"
            info="Set the duration, allowing participants sufficient time to brainstorm, strategize, and outline their actions."
          />
        </FormField>

        <FormField>
          <span>
            <CustomizeLabel htmlFor="msg">Subliminal Messaging</CustomizeLabel>
            <Tooltip placement="right" title="Subtly convey strategic cues and reinforce critical objectives throughout the planning phase."><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray", marginBottom: "-4px"}}/></Tooltip>
          </span>
          {owner ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {moduleValues?.sp_sms?.map((item, idx) => (
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
                              name="sp_sms"
                              onChange={handleOnChange}
                              text={item}
                              key={idx}
                              idx={idx}
                              errIdx={errIdx}
                              removeNode={deleteNode}
                              placeholder="Enter your Subliminal Messaging here."
                              dragger={provided.dragHandleProps}
                              showRemoveIcon={owner}
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
            moduleValues?.sp_sms?.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <TextInput
                  name="sp_sms"
                  onChange={handleOnChange}
                  text={item}
                  key={idx}
                  idx={idx}
                  errIdx={errIdx}
                  placeholder="Enter your Subliminal Messaging here."
                  showRemoveIcon={owner}
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
            <PrimaryBtn disabled={editStrategy.isLoading}>Save</PrimaryBtn>
          </BtnWrapper>
          )}
      </Form>
    </CustomizeWrapper>
  );
};

export default CustomizeStrategyModule;
