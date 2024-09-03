import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    date: null,
    timezone: null,
    startTime: null,
    endTime: null,

    isProgramTimeOkay: false,
    isParticipantsCountOkay: false,
    isSessionCountOkay: false,
    isGameSettingOkay: false
};

export const ScheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setTimezone: (state, action) => {
            state.timezone = action.payload;
        },
        setStartTime: (state, action) => {
            state.startTime = action.payload;
        },
        setEndTime: (state, action) => {
            state.endTime = action.payload;
        },
        setScheduleInfo: (state, action) => {
            state.date = action.payload.date;
            state.timezone = action.payload.timezone;
            state.startTime = action.payload.startTime;
            state.endTime = action.payload.endTime;
        },
        setEvivveFreeCheck: (state, action) => {
            state.isProgramTimeOkay = action.payload.isProgramTimeOkay === undefined ? state.isProgramTimeOkay : action.payload.isProgramTimeOkay;
            state.isParticipantsCountOkay = action.payload.isParticipantsCountOkay === undefined ? state.isParticipantsCountOkay : action.payload.isParticipantsCountOkay;
            state.isSessionCountOkay = action.payload.isSessionCountOkay === undefined ? state.isSessionCountOkay : action.payload.isSessionCountOkay;
            state.isGameSettingOkay = action.payload.isGameSettingOkay === undefined ? state.isGameSettingOkay : action.payload.isGameSettingOkay;
        }
    },
});

export const SchedulerCallbacks = {};

export const getScheduleInfo = (state) => state?.scheduler;

export const {
    setDate,
    setTimezone,
    setStartTime,
    setEndTime,
    setScheduleInfo,
    setEvivveFreeCheck
} = ScheduleSlice.actions;

export default ScheduleSlice.reducer;
