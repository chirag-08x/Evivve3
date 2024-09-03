import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  getSelectedTemplate,
} from "src/store/apps/programs/ProgramSlice";
import { toast } from "react-toastify";
import { useCreateProgram } from "src/services/programs";
import { ArrowDropDown, HelpOutline } from "@mui/icons-material";
import { useQuery } from "react-query";
import axiosClient from "src/utils/axios";

const RoleSelectorDialog = ({ open, setOpen, goToNext }) => {
    const selectedTemplate = useSelector(getSelectedTemplate);
    const [templateContext, setTemplateContext] = useState(null);
    const [usageMode, setUsageMode] = useState("");
    const createProgram = useCreateProgram();
    const { data } = useQuery(`template-context`, () => axiosClient().get(`/program/template/context`), {
        onSuccess: (res) => {
        },
        onError: (err) => {
            toast.warning("Temaplate not found");
        },
        cacheTime: Infinity,
    });

    useEffect(() => {
        if (open) {
            console.dir(data.data);
            console.log("selectedTemplate: " + JSON.stringify(selectedTemplate, null, 3));
            console.log("data: " + data.data[selectedTemplate.name.toUpperCase()]);
            setTemplateContext(data.data[selectedTemplate.name.toUpperCase()]);
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        if (!usageMode) {
          return toast.warning("Please select a valid program usage mode.");
        }

        createProgram.mutate({
            programType: selectedTemplate?.name,
            programUsageMode: "virtual",
            programContext: templateContext.program_context,
            learnerContext: templateContext.learner_context,
        });

        goToNext();
    };

    const handleUsageModeSelect = (evt) => {
        setUsageMode(evt.target.value);
    }

    const handlePCXChange = (evt) => {
        const temp = templateContext;
        templateContext.program_context = evt.target.value;
        setTemplateContext({...templateContext});
    }

    const handleLCXChange = (evt) => {
        const temp = templateContext;
        templateContext.learner_context = evt.target.value;
        setTemplateContext({...templateContext});
    }

  return (
    <Dialog PaperProps={{sx: {width: "90vw"}}} onClose={handleClose} open={open}>
      <DialogContent>
        <Typography variant="h5" mb={3} fontWeight={700}>
            Program Template <span style={{color: 'gray', fontWeight: 'normal', fontSize:"16px"}}> - The <span style={{fontWeight:"bold", color:"black"}}>{selectedTemplate?.displayName}</span> template matches your desired learning objectives.</span>
        </Typography>
        <InputLabel id="program-context" style={{marginBottom: "5px", marginTop: "20px", display: "flex", alignItems: "center"}}>
            Program Context
            <Tooltip placement="right" title="Describes the specific scenarios and purposes for this program."><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray"}}/></Tooltip>
        </InputLabel>
        <TextField
            multiline
            rows={3}
            value={templateContext ? templateContext.program_context : ""}
            margin="none"
            id="program-context"
            type="text"
            fullWidth
            size="medium"
            variant="outlined"
            onChange={handlePCXChange}
            inputProps={{
                style: {
                    padding: 0
                }
            }}
          />
        <InputLabel id="learner-context" style={{marginBottom: "5px", marginTop: "20px", display: "flex", alignItems: "center"}}>
            Learner Context
            <Tooltip placement="right" title="Defines the background and role of the learners who will be participating."><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray"}}/></Tooltip>
        </InputLabel>
        <TextField
            multiline
            rows={3}
            value={templateContext ? templateContext.learner_context : ""}
            margin="none"
            id="learner-context"
            type="text"
            fullWidth
            size="medium"
            variant="outlined"
            style={{padding: 0}}
            onChange={handleLCXChange}
            inputProps={{
                style: {
                    padding: 0
                }
            }}
        />
        <InputLabel id="program-usage-mode" style={{marginBottom: "5px", marginTop: "20px", display: "flex", alignItems: "center"}}>
            Program Usage Mode
            <Tooltip placement="right" title="Select the mode of usage that aligns with your training environment and learner needs."><HelpOutline style={{fontSize: "16px", marginLeft: "5px", color: "gray"}}/></Tooltip>
        </InputLabel>
        <Select style={{width: "100%"}} labelId="program-usage-mode-label" id="program-usage-mode" value={usageMode} onChange={handleUsageModeSelect} IconComponent={() => <ArrowDropDown/>}>
            <MenuItem disabled value={""}>Select usage mode</MenuItem>
            <MenuItem value={"virtual"}>Virtual</MenuItem>
            <MenuItem value={"physical"}>Physical</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
          <Button variant="contained" style={{backgroundColor: '#ffdbf9', color: '#5b105a'}} onClick={handleClose}>Cancel</Button>
          <Button
            disabled={false}
            variant="contained"
            style={{background: "#5b105a"}}
            onClick={handleClick}
          >
            Create Program
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleSelectorDialog;
