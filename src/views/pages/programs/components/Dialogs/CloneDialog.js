import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, InputLabel, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCloneProgram } from "src/services/programs";

const CloneDialog = ({ programName, programId, open, setOpen }) => {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState(`Clone of ${programName}`);
    const cloneProgram = useCloneProgram();

    useEffect(() => {
        if (open) {
            console.log(`${programId} => ${programName}`);
            setTitle(`Clone of ${programName}`);
            setId(programId);
        }
    }, [open, programId, programName]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = async () => {
        if (!id) return;
        try {
            await cloneProgram.mutateAsync({
                program_id: id,
                name: title
            });
            handleClose();
        } catch (error) {
            console.error('Error cloning program:', error);
        }
    };

    return (
      <Dialog PaperProps={{ sx: { width: "60vw", maxWidth: "400px" } }} onClose={handleClose} open={open}>
        <DialogContent>
          <Typography variant="h5" mb={3} fontWeight={700}>
              Clone Program
          </Typography>
          <InputLabel id="program-context" style={{ marginBottom: "5px", marginTop: "20px", display: "flex", alignItems: "center" }}>
              Program Title
          </InputLabel>
          <TextField
              value={title}
              margin="none"
              id="program-context"
              type="text"
              fullWidth
              size="medium"
              variant="outlined"
              onChange={evt => setTitle(evt.target.value)}
          />
        </DialogContent>
        <DialogActions>
            <Button variant="contained" style={{ backgroundColor: '#ffdbf9', color: '#5b105a' }} onClick={handleClose}>Cancel</Button>
            <LoadingButton
              loading={cloneProgram.isLoading}
              disabled={cloneProgram.isLoading}
              variant="contained"
              style={{ background: "#5b105a" }}
              loadingIndicator="Cloning..."
              onClick={handleClick}
            >
              Clone Program
            </LoadingButton>
        </DialogActions>
      </Dialog>
    );
};

export default CloneDialog;


