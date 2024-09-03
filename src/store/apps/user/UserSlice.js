import { createSlice } from '@reduxjs/toolkit';

export const UserTypeEnum = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
});

const initialState = {
    profile: {
        id: null,
        first_name: null,
        last_name: null,
        email: null,
        is_blocked: false,
        userrType: null,
        phone: null,
        company: null,
        position: null,
        user_type: UserTypeEnum.USER,
        created_at: null,
        updated_at: null,
        avatar_url: null,
        plan: null
    }
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.profile = action.payload;
    },
    clearUser: (state) => {
        state.profile = initialState.profile;
    },
  },
});

export const { setUser, clearUser  } =
UserSlice.actions;

export default UserSlice.reducer;
