import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: false,
};

const modalBurgerSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      return {
        ...state,
        modal: !state.modal,
      };
    },
  },
});

export const { openModal } = modalBurgerSlice.actions;
export default modalBurgerSlice.reducer;
