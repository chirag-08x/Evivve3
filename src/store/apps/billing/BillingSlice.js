import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessInfo: {},
  currentPlan: {},
  paymentMethod: {},
};

export const BillingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setBusinessInfo: (state, action) => {
      state.businessInfo = action.payload;
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
    },
  },
});

export const { setBusinessInfo, setCurrentPlan } = BillingSlice.actions;

export default BillingSlice.reducer;
