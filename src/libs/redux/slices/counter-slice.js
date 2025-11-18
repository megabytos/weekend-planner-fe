import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  counter: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    add: (state) => {
      state.counter += 1;
    },
  },
});

export const { add } = counterSlice.actions;
export default counterSlice.reducer;
