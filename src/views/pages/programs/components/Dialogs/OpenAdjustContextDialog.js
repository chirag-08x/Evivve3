import {
  toggleUnsavedChangesDialog,
  toggleEditFlag,
  toggleCustomizeDialog,
  toggleAdjustContextDialog,
  getSelectedProgram,
} from "src/store/apps/programs/ProgramSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  FormField,
  CustomizeWrapper,
  CustomizeLabel,
  InfoCircle,
  ModuleInfoText,
  InfoIconContainer,
} from "../customize/CustomizeStyles";
import Header from "../customize/Header";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { BtnWrapper } from "src/components/shared/BtnWrapper";
import { useEffect, useState } from "react";
import { useGetContext, useUpdateContext } from "src/services/programs";
import { Dialog } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import styled from "@emotion/styled";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TextAreaInput from "src/components/shared/TextAreaInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useParams } from "react-router";

const DialogWrapperStyles = {
  padding: 0,
  boxSizing: "border-box",
  margin: 0,
};

const DialogStyles = {
  paddingTop: 0,
  paddingBottom: 0,
  width: "90vw",
  maxWidth: "600px",
};

const BackBtn = styled("button")`
  border: none;
  background: none;
  margin-top: 1rem;
  padding: 0;
  margin-bottom: 0;
  cursor: pointer;
`;


const OpenAdjustContextDialog = ({pid,owner}) => {
  let { id } = useParams() ;
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [pid])
  const dispatch = useDispatch();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  // const owner = (useSelector(getSelectedProgram)).owner;
  const updateContext = useUpdateContext();
  const isDialogOpen = useSelector(
    (state) => state?.programs?.showAdjustContextDialog
  );
  useGetContext(id)
  const moduleContext = useSelector((state) => state?.programs?.context);
  const [context, setContext] = useState({});

  useEffect(() => {
    setContext({
      program_context: moduleContext?.program_context || "",
      learner_context: moduleContext?.learner_context || "",
      usage_mode: moduleContext?.program_usage_mode || "",
    });
  }, [moduleContext, isDialogOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContext.mutate({
      id,
      ...context,
    });
  };

  const handleClose = () => {
    if (editFlag) {
      dispatch(toggleUnsavedChangesDialog(true));
    } else {
      dispatch(
        toggleAdjustContextDialog({
          showDialog: false,
          showBtn: false,
        })
      );
    }
  };

  const handleGoBack = () => {
    dispatch(
      toggleAdjustContextDialog({
        showDialog: false,
        showBtn: false,
      })
    );
    dispatch(toggleCustomizeDialog("Evivve"));
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }
    setContext({ ...context, [name]: value });
  };

  return (
    <Dialog
      open={isDialogOpen?.showDialog}
      onClose={handleClose}
      style={DialogWrapperStyles}
    >
      <DialogContent style={DialogStyles}>
        {isDialogOpen?.showBtn && (
          <BackBtn onClick={handleGoBack}>
            <KeyboardBackspaceIcon />
          </BackBtn>
        )}
        <CustomizeWrapper>
          <Header
            headerText="Adjust Context"
            headerIcon={true}
            subText="Your program and learner context influence the Evivve's game mechanics and design."
          />

          {/* Program Context */}
          <Form onSubmit={handleSubmit}>
            <FormField>
              <CustomizeLabel>
                Program Context{" "}
                <InfoCircle>
                  <InfoIconContainer>
                    <InfoOutlinedIcon />
                  </InfoIconContainer>
                  <ModuleInfoText>
                    This is a simulated gameplay guided by selected
                    competencies.
                  </ModuleInfoText>
                </InfoCircle>
              </CustomizeLabel>
              <TextAreaInput
                id="msg"
                name="program_context"
                rows={3}
                onChange={handleOnChange}
                value={context?.program_context}
                placeholder="Program Context"
                readOnly={!owner}
              />
            </FormField>

            {/* Learner Context */}
            <FormField>
              <CustomizeLabel>
                Learner Context
                <InfoCircle>
                  <InfoIconContainer>
                    <InfoOutlinedIcon />
                  </InfoIconContainer>
                  <ModuleInfoText>
                    Participants engage in interactive gameplay based on the
                    selected competencies.
                  </ModuleInfoText>
                </InfoCircle>
              </CustomizeLabel>
              <TextAreaInput
                id="msg"
                name="learner_context"
                rows={3}
                onChange={handleOnChange}
                value={context?.learner_context}
                placeholder="Learner Context"
                readOnly={!owner}
              />
            </FormField>

            {/* Program Mode */}
            <FormField>
              <CustomizeLabel>
                Program Usage Mode
                <InfoCircle>
                  <InfoIconContainer>
                    <InfoOutlinedIcon />
                  </InfoIconContainer>
                  <ModuleInfoText>
                    Program Usage Mode denotes how the program is going to be
                    presented, either in a virutal call or in a physical room
                  </ModuleInfoText>
                </InfoCircle>
              </CustomizeLabel>

              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="usage_mode"
                  value={context?.usage_mode}
                  sx={{
                    border: "1px solid #dfe5ef",
                    borderRadius: 2,
                    marginBottom: "10px",
                    fontFamily: "Inter",
                    "& svg": {
                      color: "rgb(204, 204, 204)",
                      fontSize: "2rem",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                  onChange={handleOnChange}
                  disabled={!owner}
                >
                  <MenuItem value="virtual">Virtual</MenuItem>
                  <MenuItem value="physical">Physical</MenuItem>
                </Select>
              </FormControl>
            </FormField>

            {owner && (
              <BtnWrapper>
                <PrimaryBtn
                  disabled={updateContext.isLoading}
                  style={{ justifySelf: "end" }}
                  mt="0.5rem"
                >
                  Save
                </PrimaryBtn>
              </BtnWrapper>
            )}
          </Form>
        </CustomizeWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAdjustContextDialog;

