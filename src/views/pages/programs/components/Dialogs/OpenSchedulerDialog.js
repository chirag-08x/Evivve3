import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toggleSchedulerDialog } from "src/store/apps/programs/ProgramSlice";
import axiosClient from "src/utils/axios";
import BuyCreditsDialog from "src/views/apps/scheduler/BuyCreditsDialog";
import MakeEvivveFreeDialog from "src/views/apps/scheduler/MakeEvivveFreeDialog";
import ReviewProgramDialog from "src/views/apps/scheduler/ReviewProgramDialog";
import ScheduleCalendar from "src/views/apps/scheduler/ScheduleCalendar";
import ScheduleProgramDialog from "src/views/apps/scheduler/ScheduleProgramDialog";
import { setScheduleInfo } from "src/views/apps/scheduler/SchedulerSlice";
import moment from "moment";
import queryClient from "src/utils/queryClient";

const OpenSchedulerDialog = ({owner,programStatus,pid}) => {
    let { id } = useParams() ;
    useEffect(() => {
        if(!id)
          {
                id=pid
          }
      }, [pid])
    const open = useSelector((state) => state?.programs?.showSchedulerDialog);
    const dispatch = useDispatch();

    const [stack, setStack] = useState([]);
    const [isFreeDialogOpen, setFreeDialogOpen] = useState(false);
    const [isCalendarDialogOpen, setCalendarDialogOpen] = useState(false);
    const [isScheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [isCreditsDialogOpen, setCreditsDialogOpen] = useState(false);
    const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [isScheduled, setScheduled] = useState(false);

    const scheduleResp = useQuery("program-schedule", async () => await axiosClient().get(`/program/${id}/schedule`), {
        onSuccess: ({data}) => {
            if (open) {
                
                const stack = [];
                closeDialogs();
                if (data?.schedule?.startTime) {
                    dispatch(setScheduleInfo({
                        date: data.schedule.startTime,
                        timezone: data.schedule.timezone,
                        startTime: data.schedule.startTime,
                        endTime: data.schedule.endTime
                    }));
                    setScheduled(true);
                    setReviewDialogOpen(true);
                    stack.push('review');
                } else {
                    setScheduled(false);
                    setCalendarDialogOpen(true);
                    stack.push('calendar');
                }
                setStack(stack);
            }
        }
    });


    function updateDialog (dialog, state) {
        switch (dialog) {
            case 'free':
                setFreeDialogOpen(state);
                break;
            case 'calendar':
                setCalendarDialogOpen(state);
                break;
            case 'schedule':
                setScheduleDialogOpen(state);
                break;
            case 'credits':
                setCreditsDialogOpen(state);
                break;
            case 'review':
                setReviewDialogOpen(state);
                break;
        }
    }

    function openDialog (dialog, isCloseDialogs) {
        const dialogs = ['free', 'calendar', 'schedule', 'credits', 'review'];
        if (!dialogs.includes(dialog))
            return;

        if (isCloseDialogs) {
            closeDialogs();
            updateDialog(dialog, true);
            setStack([dialog]);
            return;
        }

        setStack([...stack, dialog]);
        updateDialog(dialog, true);
    }

    function closeDialog (action) {
        console.log('CLOSING: ' + JSON.stringify(stack));
        if (action === 'CLOSE_ALL') {
            closeDialogs();
            dispatch(toggleSchedulerDialog(false));
            return;
        }

        const temp = stack;
        const dialog = temp.pop();
        if (!dialog)
            return;

        setStack([...temp]);
        updateDialog(dialog, false);
        if (temp.length == 0)
            dispatch(toggleSchedulerDialog(false));

        scheduleResp.refetch();
    }

    function closeDialogs () {
        setFreeDialogOpen(false);
        setCalendarDialogOpen(false);
        setScheduleDialogOpen(false);
        setCreditsDialogOpen(false);
        setReviewDialogOpen(false);
        setStack([]);
    }

    useEffect(() => {
        if (open) {
            scheduleResp.refetch();
        }
    }, [open]);

    return (<>
        <ScheduleCalendar  open={isCalendarDialogOpen} onClose={closeDialog} openDialog={openDialog}/>
        <ScheduleProgramDialog  pid={id?id:pid} isScheduled={isScheduled} open={isScheduleDialogOpen} onClose={closeDialog} openDialog={openDialog}/>
        <ReviewProgramDialog owner={owner} programStatus={programStatus} pid={id?id:pid} open={isReviewDialogOpen} onClose={closeDialog} openDialog={openDialog}/>

        <BuyCreditsDialog open={isCreditsDialogOpen} onClose={closeDialog} openDialog={openDialog}/>
        <MakeEvivveFreeDialog open={isFreeDialogOpen} onClose={closeDialog} openDialog={openDialog}/>
    </>);
};

export default OpenSchedulerDialog;
