import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import {
  DialogHeading,
  DialogActions,
} from "src/components/shared/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import { toggleItineraryModeDialog } from "src/store/apps/programs/ProgramSlice";
import { SecondaryGrayBtn } from "src/components/shared/BtnStyles";
import { useParams } from "react-router";
import { fetchItinerary } from "src/services/present";

const ShowItineraryModeDialog = ({pid}) => {
  let { id } = useParams() ;
      
  useEffect(() => {
    if(!id)
      {
            id=pid
      }
  }, [pid])
  const open = useSelector((state) => state.programs.showItineraryModeDialog);
  const dispatch = useDispatch();
  const [itineraryData, setItineraryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItinerary(id);
        setItineraryData(data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleClose = () => {
    dispatch(toggleItineraryModeDialog(false));
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    tableLayout: 'fixed'
  };

  const thStyle = {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'left',
    width: '25%'
  };

  const tdStyle = {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'left'
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
        },
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogHeading>Itinerary Details</DialogHeading>
      <div style={{ marginBottom: '20px' }}>
        <strong>Program Name:</strong> {itineraryData ? itineraryData.name : "Loading..."}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Start Time:</strong> {itineraryData ? itineraryData.startTime : "Loading..."}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>End Time:</strong> {itineraryData ? itineraryData.endTime : "Loading..."}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Total Duration:</strong> {itineraryData ? itineraryData.totalDuration : "Loading..."}
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Module</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {itineraryData && itineraryData.modules ? itineraryData.modules.map((module, index) => (
            <tr key={index}>
              <td style={tdStyle}>{module.name}</td>
              <td style={tdStyle}>{module.description}</td>
              <td style={tdStyle}>{module.time1} - {module.time2}</td>
              <td style={tdStyle}>{module.duration}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" style={tdStyle}>Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
      <DialogActions style={{ justifyContent: "flex-end", marginTop: "20px" }}>
        <SecondaryGrayBtn onClick={handleClose}>Go Back</SecondaryGrayBtn>
      </DialogActions>
    </Dialog>
  );
};

export default ShowItineraryModeDialog;
