import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import { toggleDeleteProgramDialog, toggleItineraryModeDialog } from "src/store/apps/programs/ProgramSlice";
import { PrimaryBtn, SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { useParams } from "react-router";
import { useDeleteProgram } from "src/services/programs";
import Header from "../customize/Header";

const OpenDeleteProgramDialog = ({pid}) => {
  let { id } = useParams() ;
const deleteProgram=useDeleteProgram()
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [])
  const open = useSelector((state) => state.programs.showDeleteDialog);
  const dispatch = useDispatch();

  useEffect(() => {
    
  }, []);

  const handleClose = () => {
    dispatch(toggleDeleteProgramDialog(false));
  };
  const handleSubmit = () => {
   
    deleteProgram.mutate({id:id})
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          maxWidth: "60vw",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "20px",
          paddingTop:'0px'
        },
      }}
      onClose={handleClose}
      open={open}
    >
        <Header
              headerText="Confirm Delete"
              headerIcon={true}
              subText={"To restore deleted programs contact support team - support@gamitar.com"}
            />
      <div style={{ marginBottom: '20px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:"center" }}>
        <strong><i>This action will move your program to <span style={{color:'red'}}>delete</span>  bucket.</i></strong> 
      </div>
     
      <DialogActions style={{ gap:'2rem', display:'flex',flexDirection:'row',alignItems:'center',justifyContent:"space-between", marginTop: "20px" }}>
        <SecondaryGrayBtn onClick={handleClose}>Cancel</SecondaryGrayBtn>
        <PrimaryBtn style={{width:'100%',paddingLeft:'5px',paddingRight:'5px'}} onClick={handleSubmit}>Confirm Delete</PrimaryBtn>
      </DialogActions>
     
    </Dialog>
  );
};

export default OpenDeleteProgramDialog;
