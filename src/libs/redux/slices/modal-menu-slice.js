/**
 * Modal menu slice
 * - State: `{ isOpen }`
 * - Actions: `openModal`, `closeModal`, `toggleModal`
 * - Purpose: control the mobile/menu modal visibility.
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const modalMenuSlice = createSlice({
  name: 'modalMenu',
  initialState,
  reducers: {
    openModal: () => ({
      isOpen: true,
    }),
    closeModal: () => ({
      isOpen: false,
    }),
    toggleModal: (state) => ({
      ...state,
      isOpen: !state.isOpen,
    }),
  },
});

export const { openModal, closeModal, toggleModal } = modalMenuSlice.actions;
export default modalMenuSlice.reducer;
