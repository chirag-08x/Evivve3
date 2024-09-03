import { createSlice } from '@reduxjs/toolkit';

export const accessTokenKey = 'token';
export const expiresInKey = 'expiresIn';

const initialState = {
  accessToken: null,
  expireIn: null
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
        localStorage.setItem(accessTokenKey, action.payload.accessToken);
        localStorage.setItem(expiresInKey, action.payload.expiresIn);
        state.accessToken = action.payload.accessToken;
        state.expireIn = action.payload.expiresIn;
    },
    clearToken: (state) => {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(expiresInKey);
        state.accessToken = initialState.accessToken;
        state.expireIn = initialState.expireIn;
    },
  },
});

export const { setToken, clearToken  } =
AuthSlice.actions;

export default AuthSlice.reducer;
