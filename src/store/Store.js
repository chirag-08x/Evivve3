import { configureStore } from "@reduxjs/toolkit";
import CustomizerReducer from "./customizer/CustomizerSlice";
import ProgramReducer from "./apps/programs/ProgramSlice";
import UserReducer from "./apps/user/UserSlice";
import AuthReducer from "./apps/auth/AuthSlice";
import PresentReducer from "./apps/present/PresentSlice";
import SchedulerReducer from "src/views/apps/scheduler/SchedulerSlice";
import ChecklistReducer from "src/views/pages/present/DryRunChecklistSlice";
import BillingReducer from "./apps/billing/BillingSlice";

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    programs: ProgramReducer,
    user: UserReducer,
    auth: AuthReducer,
    present: PresentReducer,
    scheduler: SchedulerReducer,
    checklist: ChecklistReducer,
    billing: BillingReducer,
  },
});

export default store;
