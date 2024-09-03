import React, { useState } from "react";
import {
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  TextField,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import Events from "./EventData";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import PageContainer from "../../../components/container/PageContainer";
import {
  IconCheck,
  IconArrowLeft,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons";
import BlankCard from "../../../components/shared/BlankCard";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useSelector } from "react-redux";
import { getCurrentTemplate } from "src/store/apps/programs/ProgramSlice";
import { TimezoneSelect } from "src/components/shared/AuthStyles";
import { tzStrings } from "src/utils/timezones/timezonez";
import { v4 as uuid } from "uuid";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import EditIcon from "@mui/icons-material/Edit";

import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [calevents, setCalEvents] = useState(Events);
  const [open, setOpen] = React.useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openBuyCreditsDialog, setBuyCreditsDialog] = useState(false);
  const [openEvivveFreeDialog, setEvivveFreeDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [color, setColor] = useState("default");
  const [update, setUpdate] = useState();
  const [selectedTime, setSelectedTime] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [timezone, setTimezone] = useState("");
  const currentTemplate = useSelector(getCurrentTemplate);

  const handleTimeChange = (newTime, timeType) => {
    setSelectedTime({
      ...selectedTime,
      [timeType]: newTime,
    });
  };

  /* Event Colors*/
  const ColorVariation = [
    {
      id: 1,
      eColor: "#1a97f5",
      value: "default",
    },
    {
      id: 2,
      eColor: "#39b69a",
      value: "green",
    },
    {
      id: 3,
      eColor: "#fc4b6c",
      value: "red",
    },
    {
      id: 4,
      eColor: "#615dff",
      value: "azure",
    },
    {
      id: 5,
      eColor: "#fdd43f",
      value: "warning",
    },
  ];

  /* Add new Event Alert */
  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);
  };

  /* Edit Event */
  const editEvent = (event) => {
    setOpen(true);
    const newEditEvent = calevents.find((elem) => elem.title === event.title);
    setColor(event.color);
    setTitle(newEditEvent.title);
    setColor(newEditEvent.color);
    setStart(newEditEvent.start);
    setEnd(newEditEvent.end);
    setUpdate(event);
  };

  /* Update Event */
  const updateEvent = (e) => {
    e.preventDefault();
    setCalEvents(
      calevents.map((elem) => {
        if (elem.title === update.title) {
          return { ...elem, title, start, end, color };
        }
        return elem;
      })
    );
    setOpen(false);
    setTitle("");
    setColor("");
    setStart("");
    setEnd("");
    setUpdate(null);
  };
  const inputChangeHandler = (e) => setTitle(e.target.value);
  const selectinputChangeHandler = (id) => setColor(id);

  /* Submit Event Handler */
  const submitHandler = (e) => {
    e.preventDefault();
    const newEvents = calevents;
    newEvents.push({
      title,
      start,
      end,
      color,
    });
    setOpen(false);
    e.target.reset();
    setCalEvents(newEvents);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setOpenReviewDialog(true);
  };

  /* Delete Event */
  const deleteHandler = (event) => {
    const updatecalEvents = calevents.filter(
      (ind) => ind.title !== event.title
    );
    setCalEvents(updatecalEvents);
  };

  /* Close Event Dialog */
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setUpdate(null);
  };

  /* Close Review Program Dialog */
  const handleReviewDialogClose = () => {
    setOpenReviewDialog(false);
  };

  /* Close Buy Credits Dialog */
  const handleCreditsDialogClose = () => {
    setBuyCreditsDialog(false);
  };

  /* Close Make Evivve Free Dialog */
  const handleEvivveFreeDialogClose = () => {
    setEvivveFreeDialog(false);
  };

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }
    return { className: `event-default` };
  };

  const handleStartChange = (newValue) => {
    setStart(newValue);
    setEnd(newValue);
  };
  // const handleEndChange = (newValue) => {
  //   setEnd(newValue);
  // };

  return (
    <PageContainer description="this is Calendar page">
      {/* <Breadcrumb title="Calendar" subtitle="App" /> */}
      <Box sx={{ py: 1, px: 2 }}>
        <Typography variant="h4">Select a date</Typography>
        <Typography>For {currentTemplate?.title}</Typography>
      </Box>
      <BlankCard key={slot} variant="outlined">
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ cursor: "pointer" }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
          />
        </CardContent>
      </BlankCard>
      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={update ? updateEvent : submitHandler}>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              {update ? "Update Event" : "Add Event"}
            </Typography>
            <Typography mb={3} variant="subtitle2">
              {!update
                ? "To add Event kindly fillup the title and choose the event color and press the add button"
                : "To Edit/Update Event kindly change the title and choose the event color and press the update button"}
            </Typography>
            <TextField
              id="Event Title"
              placeholder="Enter Event Title"
              variant="outlined"
              fullWidth
              label="Event Title"
              value={title}
              sx={{ mb: 3 }}
              onChange={inputChangeHandler}
            />
            {/* ------------------------------------------- */}
            {/* Selection of Start and end date */}
            {/* ------------------------------------------- */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date"
                inputFormat="MM/dd/yyyy"
                value={start}
                onChange={handleStartChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ mb: 3 }} />
                )}
              />
              <TimePicker
                label="Start Time"
                value={selectedTime.start}
                name="start"
                onChange={(newValue) => handleTimeChange(newValue, "start")}
                renderInput={(params) => (
                  <TextField fullWidth sx={{ mb: 3 }} {...params} />
                )}
              />
              <TimePicker
                label="End Time"
                name="end"
                value={selectedTime.end}
                onChange={(newValue) => handleTimeChange(newValue, "end")}
                renderInput={(params) => (
                  <TextField fullWidth sx={{ mb: 3 }} {...params} />
                )}
              />
              <TimezoneSelect
                name="timezone"
                value={timezone}
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "6px",
                }}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="">Time Zone</option>
                {tzStrings.map(({ label, value }) => {
                  return (
                    <option key={uuid()} value={value}>
                      {label}
                    </option>
                  );
                })}
              </TimezoneSelect>
            </LocalizationProvider>

            {/* ------------------------------------------- */}
            {/* Calendar Event Color*/}
            {/* ------------------------------------------- */}
            <Typography variant="h6" fontWeight={600} my={2}>
              Select Event Color
            </Typography>
            {/* ------------------------------------------- */}
            {/* colors for event */}
            {/* ------------------------------------------- */}
            {ColorVariation.map((mcolor) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{
                    marginRight: "3px",
                    transition: "0.1s ease-in",
                    scale: mcolor.value === color ? "0.9" : "0.7",
                  }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <IconCheck width={16} /> : ""}
                </Fab>
              );
            })}
          </DialogContent>
          {/* ------------------------------------------- */}
          {/* Action for dialog */}
          {/* ------------------------------------------- */}
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>

            {update ? (
              <Button
                type="submit"
                color="error"
                variant="contained"
                onClick={() => deleteHandler(update)}
              >
                Delete
              </Button>
            ) : (
              ""
            )}
            <Button
              type="submit"
              disabled={!title || !timezone}
              variant="contained"
            >
              {update ? "Update Event" : "Add Event"}
            </Button>
          </DialogActions>
          {/* ------------------------------------------- */}
          {/* End Calendar */}
          {/* ------------------------------------------- */}
        </form>
      </Dialog>

      {/* ------------------------------------------- */}
      {/* Review Program Dialog */}
      {/* ------------------------------------------- */}
      <Dialog
        open={openReviewDialog}
        onClose={handleReviewDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Typography variant="h6" fontWeight={700} mb={3}>
            Review Your Program
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: "1.5rem",
              border: "2px solid #D0D5DD",
              borderRadius: 2,
              p: 1,
              position: "relative",
            }}
          >
            <Button
              sx={{
                position: "absolute",
                top: 1,
                right: 0,
                color: "#000",
                minWidth: 0,
              }}
            >
              <EditIcon fontSize="16px" />
            </Button>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Program Name
              </Typography>
              <Typography variant="body2">Program Description</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Date and Time
              </Typography>
              <Typography variant="body2">
                28 April, 2024 From 9:00 AM to 12:00PM
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Participants and Sessions
              </Typography>
              <Typography variant="body2">Participants count : 25</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Type
              </Typography>
              <Typography variant="body2">Virtual</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Count
              </Typography>
              <Typography variant="body2">3</Typography>
            </Box>
            <Typography variant="caption">
              *Indicates the number of game credits you will need for this
              program
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
              How would you like to pay?
            </Typography>

            <Stack
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Box>
                <Typography fontSize={"14px"} mb={0} fontWeight={700}>
                  Credits Required : 3
                </Typography>
                <Typography variant="caption" sx={{ mt: 0 }}>
                  You have 0 unused session Credits
                </Typography>
              </Box>

              <Stack direction="row" gap={2}>
                <PrimaryBtn
                  style={{ width: "auto" }}
                  onClick={() => setBuyCreditsDialog(true)}
                >
                  Buy Credits
                </PrimaryBtn>
                <PrimaryBtn>Upgrade</PrimaryBtn>
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Box>
                <Typography fontSize={"14px"} mb={0} fontWeight={700}>
                  Change settings and schedule for free
                </Typography>
                <Typography variant="caption" sx={{ mt: 0 }}>
                  You have 4 unused free session Credits
                </Typography>
              </Box>

              <PrimaryBtn
                style={{ width: "auto" }}
                onClick={() => setEvivveFreeDialog(true)}
              >
                Make Evivve Free
              </PrimaryBtn>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------- */}
      {/* Buy Credits Dialog */}
      {/* ------------------------------------------- */}
      <BuyCreditsDialog
        open={openBuyCreditsDialog}
        onClose={handleCreditsDialogClose}
      />
      {/* ------------------------------------------- */}
      {/* Buy Credits Dialog */}
      {/* ------------------------------------------- */}
      <EvivveFreeDialog
        open={openEvivveFreeDialog}
        onClose={handleEvivveFreeDialogClose}
      />
    </PageContainer>
  );
};

export default BigCalendar;

const BuyCreditsDialog = ({ open, onClose }) => {
  const [creditPrice, setCreditPrice] = useState(200);
  const [qty, setQty] = useState(1);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Button sx={{ minWidth: 0, px: 0 }} onClick={onClose}>
          <IconArrowLeft color="#000" />
        </Button>

        {/* Buy */}
        <Box sx={{ display: "grid", gap: "1rem" }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Buy Credits
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Single Credit
              </Typography>
              <Typography variant="body2">0% Discount</Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                ${creditPrice * qty}
              </Typography>

              <Box
                sx={{
                  border: "2px solid #D0D5DD",
                  borderRadius: 1,
                  paddingRight: "20px",
                  paddingLeft: "2px",
                  position: "relative",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  {qty}
                </Typography>

                <Button
                  onClick={() => setQty((prev) => prev + 1)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    minWidth: 0,
                    padding: 0,
                  }}
                >
                  <IconChevronUp size="14px" color="#000" />
                </Button>
                <Button
                  onClick={() => setQty((prev) => (prev <= 1 ? 1 : prev - 1))}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    minWidth: 0,
                    padding: 0,
                  }}
                >
                  <IconChevronDown size="14px" color="#000" />
                </Button>
              </Box>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Buy
            </PrimaryBtn>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Pack of 5
              </Typography>
              <Typography variant="body2">7.5% Discount</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "line-through",
                }}
              >
                $1000{" "}
              </Typography>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  $200
                </Typography>
              </Box>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Buy
            </PrimaryBtn>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Pack of 10
              </Typography>
              <Typography variant="body2">15% Discount</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "line-through",
                }}
              >
                $2000{" "}
              </Typography>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  $1700
                </Typography>
              </Box>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Buy
            </PrimaryBtn>
          </Stack>
        </Box>

        <Box
          my={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Box sx={{ backgroundColor: "#D0D5DD", height: "3px" }}></Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>Or</Typography>
          <Box sx={{ backgroundColor: "#D0D5DD", height: "3px" }}></Box>
        </Box>

        {/* Upgrade */}
        <Box sx={{ display: "grid", gap: "1rem" }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Upgrade
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Starter
              </Typography>
              <Typography variant="body2">Credits gained: 1</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "line-through",
                }}
              >
                $1000
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                $200
              </Typography>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Upgrade
            </PrimaryBtn>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Pro
              </Typography>
              <Typography variant="body2">Credits gained: 3</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "line-through",
                }}
              >
                $600
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                $495
              </Typography>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Upgrade
            </PrimaryBtn>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Teams
              </Typography>
              <Typography variant="body2">Credits gained: 5</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "line-through",
                }}
              >
                $1000
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                $750
              </Typography>
            </Stack>

            <PrimaryBtn style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              Upgrade
            </PrimaryBtn>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const EvivveFreeDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Button sx={{ minWidth: 0, px: 0 }} onClick={onClose}>
          <IconArrowLeft color="#000" />
        </Button>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Make Evivve Free
        </Typography>
        <Typography variant="body2">
          Make necessary changes to your program to use Evivve for free
        </Typography>

        <Stack mt={3} gap={2}>
          <Accordion
            sx={{
              boxShadow: "initial",
              border: "3px solid #D0D5DD",
              ":first-of-type": {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderRadius: 2,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon fontSize="large" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                borderTopLeftRadius: 0,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Participant Count
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: 400, fontSize: "14px" }}
                >
                  Reduce the number of participants to 5 or less
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              boxShadow: "initial",
              border: "3px solid #D0D5DD",
              borderRadius: 2,
              ":before": {
                content: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon fontSize="large" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Duration
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: 400, fontSize: "14px" }}
                >
                  Reduce the duration of the session to 2 hours
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              boxShadow: "initial",
              border: "3px solid #D0D5DD",
              borderRadius: 2,
              ":before": {
                content: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon fontSize="large" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Session Count
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: 400, fontSize: "14px" }}
                >
                  Reduce the session count to 1
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              boxShadow: "initial",
              border: "3px solid #D0D5DD",
              ":before": {
                content: "none",
              },
              ":last-of-type": {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderRadius: 2,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon fontSize="large" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Game Settings
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: 400, fontSize: "14px" }}
                >
                  Edit the game settings to free
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>

          <PrimaryBtn ml="auto" mt="2rem" onClick={onClose}>
            Save
          </PrimaryBtn>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
