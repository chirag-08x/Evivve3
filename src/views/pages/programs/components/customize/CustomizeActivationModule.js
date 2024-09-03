import { BtnWrapper } from "src/components/shared/BtnWrapper";
import Header from "./Header";
import { PrimaryBtn, AddNodeBtnStyles } from "src/components/shared/BtnStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  getSelectedCustomizeModule,
  getSelectedProgram,
  toggleEditFlag,
} from "src/store/apps/programs/ProgramSlice";
import TimerInput from "src/components/shared/TimerInput";
import { useState } from "react";
import {
  CustomizeWrapper,
  CustomizeLabel,
  Form,
  FormField,
} from "./CustomizeStyles";
import { useEditLearnerActivationModule } from "src/services/programs";
import TextInput from "src/components/shared/TextInput";
import { Button, Stack, Tooltip } from "@mui/material";
import { IconPlus } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { HelpOutline } from "@mui/icons-material";

const CustomizeActivationModule = ({ owner }) => {
  const { selectedModule } = useSelector(getSelectedCustomizeModule);
  const editActivationModule = useEditLearnerActivationModule();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const dispatch = useDispatch();
  const [errIdx, setErrIdx] = useState(null);

  // const owner = useSelector(getSelectedProgram).owner;
  console.log("CustomizeActivationModule: " , owner);
  

  const [moduleValues, setModuleValues] = useState({
    la_id: selectedModule.id,
    la_wms: selectedModule.la_wms,
    la_dur_min: selectedModule.la_dur_min,
    la_qad_min: selectedModule.la_qad_min,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyValueIdx = moduleValues?.la_wms?.indexOf("");
    setErrIdx(emptyValueIdx === -1 ? null : emptyValueIdx);
    if (emptyValueIdx !== -1) {
      return toast.warning("Please fill out the required fields.");
    }
    editActivationModule.mutate({ ...moduleValues });
  };

  const handleOnChange = (e, idx = "") => {
    let name = e.target.name;
    let value = e.target.value;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    if (name === "la_wms" || !name) {
      if (errIdx != null && idx == errIdx) {
        setErrIdx(null);
      }
      const newValues = [...moduleValues.la_wms];
      newValues[idx] = value;
      return setModuleValues({ ...moduleValues, [name]: newValues });
    }

    setModuleValues({
      ...moduleValues,
      [name]: value,
    });
  };

  const handleTime = (newMins, type) => {
    if (moduleValues[type] != newMins && !editFlag) {
      dispatch(toggleEditFlag(true));
    }
    setModuleValues({ ...moduleValues, [type]: `${newMins}` });
  };

  const addTextNode = () => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.la_wms];
    newValues.push("");
    return setModuleValues({ ...moduleValues, la_wms: newValues });
  };

  const deleteNode = (idx) => {
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    const newValues = [...moduleValues.la_wms];
    newValues.splice(idx, 1);
    return setModuleValues({ ...moduleValues, la_wms: newValues });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    const reorderedItems = Array.from(moduleValues.la_wms);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModuleValues({ ...moduleValues, la_wms: reorderedItems });
  };

  return (
    <CustomizeWrapper>
      <Header headerText="Customize Learner Activation" />
      <Form onSubmit={handleSubmit}>
        <FormField>
          <TimerInput
            title="Activation Duration (in minutes)"
            minutes={Number(moduleValues.la_dur_min)}
            setNewTime={handleTime}
            timeType="la_dur_min"
            info="Specify the duration for the learner activation phase, setting the pace for engaging participants."
            owner={owner}
          />
        </FormField>

        <FormField>
          <TimerInput
            title="Q&A Duration (in minutes)"
            minutes={Number(moduleValues.la_qad_min)}
            setNewTime={handleTime}
            timeType="la_qad_min"
            info="Define the duration allocated for question-and-answer sessions, allowing participants to seek clarification and engage."
          />
        </FormField>

        <FormField>
          <span>
            <CustomizeLabel htmlFor="msg">Welcome Message</CustomizeLabel>
            <Tooltip
              placement="right"
              title="A warm greeting to initiate the session and welcome participants onboard."
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
          </span>
          {owner ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {moduleValues?.la_wms?.map((item, idx) => (
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
                              name="la_wms"
                              onChange={(e) => handleOnChange(e, idx)}
                              text={item}
                              key={idx}
                              errIdx={errIdx}
                              idx={idx}
                              removeNode={() => deleteNode(idx)}
                              placeholder="Draft your welcome message here."
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
            moduleValues?.la_wms?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <TextInput
                  name="la_wms"
                  onChange={(e) => handleOnChange(e, idx)}
                  text={item}
                  key={idx}
                  errIdx={errIdx}
                  idx={idx}
                  placeholder="Draft your welcome message here."
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
            <PrimaryBtn disabled={editActivationModule.isLoading}>
              Save
            </PrimaryBtn>
          </BtnWrapper>
        )}
      </Form>
    </CustomizeWrapper>
  );
};

export default CustomizeActivationModule;
