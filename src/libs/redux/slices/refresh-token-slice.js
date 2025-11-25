import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  refreshToken: null,
};

const refreshTokenSlice = createSlice({
  name: 'refreshToken',
  initialState,
  reducers: {
    add: (state, { payload }) => {
      state.refreshToken = payload;
    },
  },
});

export const { add } = refreshTokenSlice.actions;
export default refreshTokenSlice.reducer;
export const selectRefreshToken = (state) => state.refreshToken;
