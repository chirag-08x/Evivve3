import { createSlice } from "@reduxjs/toolkit";
import { MODULE_TYPE } from "src/views/pages/present/constants";

// const API_URL = '/api/data/notes/NotesData';

const PROGRAM_CARDS = [];

const initialState = {
  templates: [],
  roles: [],
  programID: "",
  onboarding: window.localStorage.getItem("onboarding") || false,
  showPrgramReadyDialog: false,
  showPrsentModeDialog: false,
  showItineraryModeDialog: false,
  showParticipantsDialog: false,
  showSessionsDialog: false,
  showSchedulerDialog: false,
  showDeleteDialog:false,
  showAdjustContextDialog: {
    showDialog: false,
    showBtn: false,
  },
  context: {},
  participants: {},
  showUnsavedChangesDialog: false,
  editFlag: false,
  programList: {},
  customizeDialog: {
    showDialog: false,
    type: "",
    selectedModule: "",
  },
  list: [],
  selectedTemplate: null,
  selectedProgram: {
    id: "",
    name: "",
    currTemplate: null,
    modules: [],
  },
  upcomingProgram: null,
  recentProgram: null,
};

export const ProgramSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    saveActivationLearnerModule: (state, action) => {
      const activationModule = state.selectedProgram.modules?.find(
        (mod) => mod.type === MODULE_TYPE["learner/activation"]
      );
      activationModule.qaTime = action.payload.qaTime;
    },
    toggleProgramReadyDialog: (state, action) => {
      state.showPrgramReadyDialog = action.payload;
    },
    setProgramList: (state, action) => {
      state.programList = action.payload;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setProgramCards: (state, action) => {
      const currTemplate = {
        title: action.payload.name,
        description: action.payload.description,
        ...action.payload.templateType,
      };
      state.selectedProgram.facilitatorState = action.payload.facilitatorState;
      state.selectedProgram.currTemplate = currTemplate;
      state.selectedProgram.modules = action.payload.modules;
      state.selectedProgram.owner = action.payload.owner;
      state.selectedProgram.session_count = action.payload.session_count;
      state.selectedProgram.usage = action.payload.usage;
    },
    setProgramSessionCount: (state, action) => {
      state.selectedProgram.session_count = action.payload.session_count;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setProgramID: (state, action) => {
      state.programID = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      const id = action.payload;
      const currentTemplate = state.templates.find(
        ({ id: tempId }) => id === tempId
      );
      state.selectedTemplate = currentTemplate;
    },
    setContext: (state, action) => {
      state.context = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    togglePrsentModeDialog: (state, action) => {
      state.showPrsentModeDialog = action.payload;
    },
    toggleSchedulerDialog: (state, action) => {
      state.showSchedulerDialog = action.payload;
    },
    toggleDeleteProgramDialog:(state,action)=>{
      state.showDeleteDialog=action.payload
    },
    toggleSessionsDialog: (state, action) => {
      state.showSessionsDialog = action.payload;
    },
    toggleItineraryModeDialog: (state, action) => {
      state.showItineraryModeDialog = action.payload;
    },
    toggleCustomizeDialog: (state, action) => {
      state.customizeDialog = {
        showDialog: !state.customizeDialog.showDialog,
        type: action.payload || "",
        selectedModule:
          state.selectedProgram.modules.find(
            ({ name }) => name === action.payload
          ) || "",
      };
      state.editFlag = false;
    },
    toggleUnsavedChangesDialog: (state, action) => {
      state.showUnsavedChangesDialog = action.payload;
    },
    toggleAdjustContextDialog: (state, action) => {
      state.showAdjustContextDialog = {
        ...state.showAdjustContextDialog,
        ...action.payload,
      };
    },
    toggleEditFlag: (state, action) => {
      state.editFlag = action.payload;
    },
    toggleParticipantsDialog: (state, action) => {
      state.showParticipantsDialog = action.payload;
    },
    updateModule: (state, action) => {
      const PROGRAM_IDX = PROGRAM_CARDS.findIndex(
        ({ type }) => type === action.payload.type
      );
      PROGRAM_CARDS[PROGRAM_IDX] = {
        ...PROGRAM_CARDS[PROGRAM_IDX],
        ...action.payload.data,
      };
      state.selectedProgram.modules = [...PROGRAM_CARDS];
    },
  },
});

export const getParticipants = (state) => state?.programs?.participants;
export const getSelectedProgram = (state) => state?.programs?.selectedProgram;
export const getProgramsList = (state) => state?.programs?.programList;
export const getCurrentTemplate = (state) =>
  state?.programs?.selectedProgram?.currTemplate;
export const getSelectedTemplate = (state) => state?.programs?.selectedTemplate;
export const getProgramId = (state) => state?.programs?.programID;
export const getOnboarding = (state) => state?.programs?.onboarding;
export const getRoles = (state) => state?.programs?.roles;
export const getTemplates = (state) => state?.programs?.templates;
export const getSelectedCustomizeModule = (state) =>
  state?.programs?.customizeDialog;

export const {
  toggleProgramReadyDialog,
  togglePrsentModeDialog,
  toggleItineraryModeDialog,
  toggleCustomizeDialog,
  toggleUnsavedChangesDialog,
  toggleAdjustContextDialog,
  toggleParticipantsDialog,
  toggleSessionsDialog,
  toggleSchedulerDialog,
  toggleDeleteProgramDialog,
  toggleEditFlag,
  updateModule,
  setProgramList,
  setTemplates,
  setContext,
  setRoles,
  setProgramID,
  setProgramCards,
  setProgramSessionCount,
  setSelectedTemplate,
  setParticipants,
} = ProgramSlice.actions;

export default ProgramSlice.reducer;
