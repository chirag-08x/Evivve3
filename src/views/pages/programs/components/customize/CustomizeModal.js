import CustomizeActivationModule from "./CustomizeActivationModule";
import CustomizeStrategyModule from "./CustomizeStrategyModule";
import CustomizeGameModule from "./CustomizeGameModule";
import CustomizeReflectionModule from "./CustomizeReflectionModule";
import CustomizeDebriefModule from "./CustomizeDebriefModule";
import { Dialog } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { useDispatch, useSelector } from "react-redux";
import { MODULE_TYPE } from "src/views/pages/present/constants";

import {
  getSelectedCustomizeModule,
  toggleUnsavedChangesDialog,
  toggleCustomizeDialog,
} from "src/store/apps/programs/ProgramSlice";

const DialogWrapperStyles = {
  padding: 0,
  boxSizing: "border-box",
  margin: 0,
};

const DialogStyles = {
  // padding: "1rem 1.5rem 2rem 1.5rem",
  paddingTop: 0,
  paddingBottom: 0,
  width: "90vw",
  maxWidth: "600px",
};

const CustomizeModal = ({ owner }) => {
  const dispatch = useDispatch();
  const customizeModal = useSelector(getSelectedCustomizeModule);
  const editFlag = useSelector((state) => state?.programs?.editFlag);

  const handleClose = () => {
    if (editFlag) {
      dispatch(toggleUnsavedChangesDialog(true));
    } else {
      dispatch(toggleCustomizeDialog(false));
    }
  };

  switch (customizeModal.type) {
    case MODULE_TYPE["learner/activation"]:
      return (
        <Dialog
          open={customizeModal.showDialog}
          onClose={handleClose}
          style={DialogWrapperStyles}
        >
          <DialogContent style={DialogStyles}>
            <CustomizeActivationModule owner={owner}/>
          </DialogContent>
        </Dialog>
      );

    case MODULE_TYPE["strategy&planning"]:
      return (
        <Dialog
          open={customizeModal.showDialog}
          onClose={handleClose}
          style={DialogWrapperStyles}
        >
          <DialogContent style={DialogStyles}>
            <CustomizeStrategyModule owner={owner}/>
          </DialogContent>
        </Dialog>
      );

    case MODULE_TYPE["evivve"]:
      return (
        <Dialog
          open={customizeModal.showDialog}
          onClose={handleClose}
          style={DialogWrapperStyles}
        >
          <DialogContent style={DialogStyles}>
            <CustomizeGameModule owner={owner}/>
          </DialogContent>
        </Dialog>
      );

    case MODULE_TYPE["reflection"]:
      return (
        <Dialog
          open={customizeModal.showDialog}
          onClose={handleClose}
          style={DialogWrapperStyles}
        >
          <DialogContent style={DialogStyles}>
            <CustomizeReflectionModule owner={owner}/>
          </DialogContent>
        </Dialog>
      );

    case MODULE_TYPE["debrief"]:
      return (
        <Dialog
          open={customizeModal.showDialog}
          onClose={handleClose}
          style={DialogWrapperStyles}
        >
          <DialogContent style={DialogStyles}>
            <CustomizeDebriefModule owner={owner}/>
          </DialogContent>
        </Dialog>
      );

    default:
      return null;
  }
};

export default CustomizeModal;
