import React, { useEffect, useState } from "react";
import { CardContent, Typography, Box, Stack } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import PageContainer from "../../../components/container/PageContainer";
import BlankCard from "../../../components/shared/BlankCard";

import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentTemplate,
  toggleSchedulerDialog,
} from "src/store/apps/programs/ProgramSlice";
import { Alert, Button, Dialog } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { setDate } from "date-fns";
import { setScheduleInfo } from "./SchedulerSlice";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import axiosClient from "src/utils/axios";
import {
  IconSquareRoundedX,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons";



moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const DialogWrapperStyles = {
  padding: 0,
  boxSizing: "border-box",
  margin: 0,
};

const DialogStyles = {
  paddingTop: 0,
  paddingBottom: 0,
  padding: 0,
  width: "90vw",
  maxWidth: "900px",
};

function isSameDay(date1, date2) {
  const momentDate1 = moment(date1).startOf("day");
  const momentDate2 = moment(date2).startOf("day");
  return momentDate1.isSame(momentDate2);
}

const ScheduleCalendar = ({ open, onClose, openDialog }) => {
  const user = useSelector((state) => state?.user?.profile);

  const currentTemplate = useSelector(getCurrentTemplate) ;

  const dispatch = useDispatch();
  const userTimezone = useSelector((state) => state?.user?.profile?.timezone);

  const [programs, setPrograms] = useState([]);
  const scheduledProgramsResp = useQuery(
    "scheduled-programs",
    async () => await axiosClient().get(`/schedule`),
    {
      onSuccess: ({ data }) => {
        const programs = data.programs.map((obj) => ({
          title: obj.program.name,
          start: moment(obj.startTime),
          end: moment(obj.endTime),
          color: moment(obj.startTime).isBefore(moment()) ? "gray" : "default",
        }));
        setPrograms(programs);
      },
    }
  );

  useEffect(() => {
    if (open) {
      scheduledProgramsResp.refetch();
    }
  }, [open]);

  function handleSlotChange(slot) {
    let date = slot.start;

    if (isSameDay(date, moment()) && moment(date).isBefore(moment())) {
      date = moment();
    }

    if (moment(date).isBefore(moment())) {
      toast.error("Cannot select an earlier date");
      return;
    }

    dispatch(
      setScheduleInfo({
        date: moment(date).toISOString(),
        startTime: moment(date).toISOString(),
        endTime: moment(date).add(2, "hours").toISOString(),
        timezone: userTimezone,
      })
    );
    openDialog("schedule");
  }

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }
    return { className: `event-default` };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={DialogWrapperStyles}
      maxWidth="900"
    >
      <DialogContent style={DialogStyles}>
        <PageContainer description="this is Calendar page">
          <Box
            sx={{
              py: 1,
              px: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Select a Date
              </Typography>
              <Typography variant="subtitle2">
                For "{currentTemplate?.title}"
              </Typography>
            </Box>
            <Button sx={{ color: "#000",backgroundColor:'white',border:'1px solid #000'}} onClick={onClose}>
              <IconSquareRoundedX />
            </Button>
          </Box>
          <BlankCard variant="outlined">
            <CardContent>
              <Calendar

                selectable
                events={programs}
                defaultView="month"
                components={{ toolbar: CustomToolbar }}
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                localizer={localizer}
                
                onSelectEvent={() => {}}
                onSelectSlot={handleSlotChange}
                eventPropGetter={(event) => eventColors(event)}
              />
            </CardContent>
          </BlankCard>
        </PageContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCalendar;

const CustomToolbar = ({ onNavigate, label }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Button sx={{ color: "#615dff" }} onClick={() => onNavigate("PREV")}>
        <IconChevronsLeft />
      </Button>
      <Typography variant="h5" fontSize="18px">
        {label}
      </Typography>
      <Button sx={{ color: "#615dff" }} onClick={() => onNavigate("NEXT")}>
        <IconChevronsRight />
      </Button>
    </Stack>
  );
};
