import { createSlice } from "@reduxjs/toolkit";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axiosClient from "src/utils/axios";

export const CHECKLIST_CHECK_HEIGHT = 42;
export const CHECKLIST_SUBCHECK_HEIGHT = 34;

const initialState = {
    isChecklistOpen: false,
    isReviewChecklistOpen: false,
    checklist: [
        {
            id: "LEARNER_ACTIVATION",
            name: "Learner Activation",
            sublist: [
                {id: "WELCOME_MESSAGE", name: "Welcome Message", check: false},
                {id: "ACTIVATION_DURATION", name: "Acitvation Duration", check: false},
                {id: "QNA_DURATION", name: "Q&A Duration", check: false}
            ],
            check: false
        },
        {
            id: "STRATEGY_PLANNING",
            name: "Strategy & Planning",
            sublist: [
                {id: "DURATION", name: "Duration", check: false},
                {id: "SUBLIMINAL_MSGS", name: "Subliminal Messages", check: false}
            ],
            check: false
        },
        {
            id: "EVIVVE",
            name: "Evivve",
            sublist: [
                {id: "DURATION", name: "Duration", check: false},
                {id: "HEAD_START", name: "Head Start", check: false},
                {id: "CONSEQUENCE", name: "Consequence", check: false},
                {id: "OVERALL_DIFFICULTY", name: "Overall Difficulty", check: false},
                {id: "PACE", name: "Pace", check: false},
            ],
            check: false
        },
        {
            id: "REFLECTION",
            name: "Reflection",
            sublist: [
                {id: "DURATION", name: "Duration", check: false},
                {id: "QUESTIONS", name: "Reflection Questions", check: false}
            ],
            check: false
        },
        {
            id: "DEBRIEF",
            name: "Debrief",
            sublist: [
                {id: "DURATION", name: "Duration", check: false},
                {id: "DEBRIEF_POINTS", name: "Debrief Points", check: false}
            ],
            check: false
        }
    ]
};

export const ChecklistSlice = createSlice({
    name: 'checklist',
    initialState,
    reducers: {
        setChecklist: (state, action) => {
            state.checklist = action.payload;
        },
        setReviewChecklistPopup: (state, action) => {
            state.isReviewChecklistOpen = action.payload;
        },
        setCheck: (state, action) => {
            const id = action.payload.id;
            const check = action.payload.check;

            console.log('id: '+id);
            const isSubcheck = id.includes(':');
            if (isSubcheck) {
                const checkId = id.split(':')[0];
                const subcheckId = id.split(':')[1];
                for (let checkobj of state.checklist) {
                    if (checkobj.id === checkId) {
                        for (let subcheckobj of checkobj.sublist) {
                            if (subcheckobj.id === subcheckId) {
                                subcheckobj.check = check;
                            }
                        }
                    }
                }

                return;
            }

            const checkId = id;
            for (let checkobj of state.checklist) {
                if (checkobj.id === checkId) {
                    for (let subcheckobj of checkobj.sublist) {
                        subcheckobj.check = check;
                    }
                }
            }
        }
    }
});

export const getChecklist = (state) => state?.checklist?.checklist;
export const getChecklistFull = (state) => state?.checklist;

export const useChecklist = (programId, callbacks) => {
    const dispatch = useDispatch();
    const checklist = useSelector(getChecklist);
    return useQuery("dryrun-checklist",
        async () => await axiosClient().get(`/program/${programId}/checklist`), {
        enabled: false,
        onSuccess: ({data}) => {
            const temp = JSON.parse(JSON.stringify(checklist));
            for (let checklist of temp) {
                for (let sublist of checklist.sublist) {
                    if (checklist.id === 'EVIVVE') {
                        sublist.check = data.checklist.includes('EVIVVE');
                        continue;
                    }

                    const checkmark = checklist.id + ':' + sublist.id;
                    sublist.check = data.checklist.includes(checkmark);
                }
            }

            dispatch(setChecklist(temp));
            if (callbacks && callbacks.onSuccess)
                callbacks.onSuccess(data);
        },
        onError: ({data}) => {
            //Disable checklist?
            if (callbacks && callbacks.onError)
                callbacks.onError(data);
        }
    });
}

export const usePatchChecklist = (programId, callbacks) => { //{onSuccess, onError}) => {
    const dispatch = useDispatch();
    return useMutation(
        async (data) => await axiosClient()
        .patch(`/program/${programId}/checklist`, {
            module: data.module,
            check: data.check
        }),
        {
            onSuccess: ({data}) => {
                dispatch(setCheck({id: data.module, check: data.check}));
                if (callbacks && callbacks.onSuccess)
                    callbacks.onSuccess();
            },
            onError: () => {
                if (callbacks && callbacks.onError)
                    callbacks.onError();
            }
        }
    );
}

export const useSyncChecklist = (programId, {onSuccess, onError}) => {
    return useMutation(
        async (data) => await axiosClient()
        .put(`/program/${programId}/checklist`, {
            checklist: data.checklist
        }),
        {
            onSuccess: () => {
                if (onSuccess)
                    onSuccess();
            },
            onError: () => {
                if (onError)
                    onError();
            }
        }
    );
}

export const {
    setChecklist,
    setReviewChecklistPopup,
    setCheck
} = ChecklistSlice.actions;

export default ChecklistSlice.reducer;
