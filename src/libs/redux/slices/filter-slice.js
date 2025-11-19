import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  city: '',
  categories: [],
  date: '',
  price: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleCity: (state, { payload }) => {
      state.city = payload;
    },
    toggleCategory: (state, { payload }) => {
      const index = state.categories.indexOf(payload);
      if (index === -1) {
        state.categories.push(payload);
      } else {
        state.categories.splice(index, 1);
      }
    },
    setDate: (state, { payload }) => {
      state.date = payload;
    },
    setPrice: (state, { payload }) => {
      state.price = payload;
    },
    resetFilters: () => initialState,
  },
});

export const { toggleCity, toggleCategory, setDate, setPrice, resetFilters } =
  filterSlice.actions;
export default filterSlice.reducer;
export const selectFilter = (state) => state.filter;
