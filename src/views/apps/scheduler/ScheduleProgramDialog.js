import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { momentLocalizer } from "react-big-calendar";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TimezoneSelect } from "src/components/shared/AuthStyles";
import { tzStrings } from "src/utils/timezones/timezonez";
import { v4 as uuid } from "uuid";

import "./Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getScheduleInfo,
  setDate,
  setStartTime,
  setEndTime,
  setTimezone,
  setScheduleInfo,
} from "./SchedulerSlice";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {useMutation} from "react-query";
import axiosClient from "src/utils/axios";
import { getCurrentTemplate,setProgramList } from "src/store/apps/programs/ProgramSlice";



moment.locale("en-GB");
function getLocaleTimeButActuallyItsTheTimeZoneTime(dt) {
  return dt.format("YYYY-MM-DDTHH:mm:ss");
}
function getActualTimeZoneFromFakeLocalTime(dt, timezone) {
  //DOESNT WORK
  const m = moment(dt);
  const offset = moment.tz(new Date(), timezone).format("Z");
  return moment.tz(m.format("YYYY-MM-DDTHH:mm:ss" + offset));
}

async function fetchItinerary(userid)
{
  try
  {
    const { data } = await axiosClient().get(`/itinerary/${userid}`);
    return data;
  }
  catch (error)
  {
    throw new Error(error);
  }
}

const localizer = momentLocalizer(moment);
const ScheduleProgramDialog = ({pid,isScheduled, open, onClose, openDialog }) => {
  let { id } = useParams() ;
    useEffect(() => {
        if(!id)
          {
                id=pid
          }
      }, [])

  const scheduleInfo = useSelector(getScheduleInfo);
  const userTimezone = useSelector((state) => state?.user?.profile?.timezone);
  const [date, setDate] = useState(scheduleInfo.date);
  const [startTime, setStartTime] = useState(scheduleInfo.startTime);
  const [endTime, setEndTime] = useState(scheduleInfo.endTime);
  const [dateError, setDateError] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [timezone, setTimezone] = useState(
    scheduleInfo.timezone || userTimezone
  );
  const [totalDuration, setTotalDuration] = useState(120);
  const dispatch = useDispatch();
  const currentTemplate = useSelector(getCurrentTemplate);

  const sessionsResponse = async () => await axiosClient().get(`/program_session?program_id=${id}`);

  useEffect(() => {
    if (open) {
      fetchItinerary(id).then((data) =>
      {
        const durationInMinutes = parseInt(data.totalDuration.match(/\d+/)[0],10);
        setTotalDuration(durationInMinutes);

        if (scheduleInfo.date) {
          const m = moment.tz(scheduleInfo.date, scheduleInfo.timezone);
          setDate(new Date(m));
        }
        let m_st = "";
        if (scheduleInfo.startTime) {
          m_st = new Date(
            getLocaleTimeButActuallyItsTheTimeZoneTime(
              moment.tz(scheduleInfo.startTime, timezone)
            )
          );
          setStartTime(m_st);
        }
        let m_et = "";
        if (scheduleInfo.endTime) {
          m_et = new Date(
            getLocaleTimeButActuallyItsTheTimeZoneTime(
              moment.tz(scheduleInfo.startTime, timezone).add(durationInMinutes, "minutes")
            )
          );
          setEndTime(m_et);
        }
        if (!validateTimeRange(m_st, m_et)) {
          setDateError(true);
          setDateErrorMessage(
            "End time must be within the same day as start time."
          );
        } else {
          setDateError(false);
          setDateErrorMessage("");
        }
        // if (scheduleInfo.timezone) setTimezone(scheduleInfo.timezone);
      });
    }
  }, [open, scheduleInfo, timezone]);

  useEffect(() => {
    setTimezone(scheduleInfo.timezone);
  }, [scheduleInfo.timezone]);

  const scheduleProgramReq = useMutation(
    async (data) =>
      await axiosClient().put(`/program/${id}/schedule`, {
        date: moment(data.date).format("YYYY-MM-D").toString(),
        timezone: data.timezone,
        startTime: moment(data.startTime).format("HH:mm").toString(),
        endTime: moment(data.endTime).format("HH:mm").toString(),
      }),
    {
      onSuccess: () => {
        toast.success("Program Scheduled");
        if (isScheduled) {
          //                    TODO: Doesnt work becuase the is locale timezone but its actually the selected timezone, need some parsing
          //                    const _date = getActualTimeZoneFromFakeLocalTime(date, timezone);
          //                    const _startTime = getActualTimeZoneFromFakeLocalTime(startTime, timezone);
          //                    const _endTime = getActualTimeZoneFromFakeLocalTime(endTime, timezone);
          //                    dispatch(setScheduleInfo({
          //                        date: _date,
          //                        startTime: _startTime,
          //                        endTime: _endTime,
          //                        timezone
          //                    }));
          //                    console.log("IS SCHEDULED");
          openDialog("review");
          onClose();
        } else {
          openDialog("review", true);
        }
      },
      onError: () => {
        toast.error("Error while scheduling program. Try again later.");
      },
    }
  );

  const onDateChange = (datetime) => {
    setDate(moment(datetime).toISOString());
  };

  const validateTimeRange = (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);

    // Check if end time is within the same day
    if (startMoment.isSame(endMoment, "day")) {
      return true;
    }

    // Check for PM to AM transition
    const startHour = startMoment.hour();
    const endHour = endMoment.hour();
    if (
      (startHour >= 12 && endHour < 12) ||
      (startHour < 12 && endHour >= 12)
    ) {
      return false;
    }

    return false;
  };

  const onStartTimeChange = (datetime) => {
    const newStartTime = moment(datetime);
    const newEndTime = moment(datetime).add(totalDuration, "minutes");

    if (!validateTimeRange(newStartTime, newEndTime)) {
      setDateError(true);
      setDateErrorMessage(
        "End time must be within the same day as start time."
      );
    } else {
      setStartTime(newStartTime.toISOString());
      setEndTime(newEndTime.toISOString());
      setDateError(false);
      setDateErrorMessage("");
    }
  };

  const onEndTimeChange = (datetime) => {
    const newEndTime = moment(datetime);
    const startMoment = moment(startTime);

    if (!validateTimeRange(startMoment, newEndTime)) {
      setDateError(true);
      setDateErrorMessage(
        "End time must be within the same day as start time."
      );
    } else if (newEndTime.isBefore(startMoment)) {
      setDateError(true);
      setDateErrorMessage("End time cannot be before start time.");
    } else {
      setEndTime(newEndTime.toISOString());
      setDateError(false);
      setDateErrorMessage("");
    }
  };

  const scheduleProgram = () => {
    const st = moment(new Date(startTime), "HH:mm");
    const et = moment(new Date(endTime), "HH:mm");

    if (et.isBefore(st)) {
      return toast.warning("End time cannot be earlier than Start time.");
    }

    if (et.isSame(st)) {
      return toast.warning("End time cannot be same as Start time.");
    }

    scheduleProgramReq.mutate({
      date,
      startTime,
      endTime,
      timezone,
    });
  };

  var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  function inWords (num)
  {
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          Schedule Program
        </Typography>
        <Typography mb={3} variant="subtitle2">
          For "{currentTemplate?.title}"
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="Date"
            inputFormat="dd MMM yyyy"
            value={moment(date)}
            disablePast
            onChange={onDateChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth sx={{ mb: 3 }} />
            )}
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TimePicker
              label="Start Time"
              name="start"
              value={startTime}
              onChange={onStartTimeChange}
              renderInput={(params) => (
                <TextField fullWidth sx={{ mb: 3 }} {...params} />
              )}
            />
            <TimePicker
              label="End Time"
              name="end"
              value={endTime}
              minTime={
                new Date(moment(startTime).add(totalDuration, "minutes"))
              }
              onChange={onEndTimeChange}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  sx={{ mb: 3, ml: 3 }}
                  {...params}
                  error={dateError}
                  helperText={dateErrorMessage}
                />
              )}
            />
          </div>
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
            {tzStrings.map(({ label, value }) => (
              <option key={uuid()} value={value}>
                {label}
              </option>
            ))}
          </TimezoneSelect>
          {sessionsResponse.data?.data?.sessions.length > 1 && (
              <Alert severity="info" style={{ marginTop: "20px" }}>
                <strong>
                  You can run{" "}
                  <em>{inWords(Math.floor(
                      moment(endTime).diff(moment(startTime), "minutes") /
                      totalDuration
                  ))}</em>{" "}
                  parallel and complete iteration(s) of your program in this much time. To adjust the duration of the program, please edit each module's duration.
                </strong>
              </Alert>
          )}

          {sessionsResponse.data?.data?.sessions.length === 1 && (
              <Alert severity="info" style={{ marginTop: "20px" }}>
                <strong>
                  You can run{" "}
                  <em>{inWords(Math.floor(
                      moment(endTime).diff(moment(startTime), "minutes") /
                      totalDuration
                  ))}</em>{" "}
                  complete iteration(s) of your program in this much time. To adjust the duration of the program, please edit each module's duration.
                </strong>
              </Alert>
          )}
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} style={{ color: "#5b105a" ,backgroundColor:'white'}}>
          Cancel
        </Button>
        <Button
          disabled={false}
          variant="contained"
          onClick={scheduleProgram}
          style={{ backgroundColor: "#5b105a" }}
        >
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleProgramDialog;
