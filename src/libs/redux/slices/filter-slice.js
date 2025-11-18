import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cities: [],
  categories: [],
  date: null,
  price: null,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleCity: (state, { payload }) => {
      const index = state.cities.indexOf(payload);
      if (index === -1) {
        state.cities.push(payload);
      } else {
        state.cities.splice(index, 1);
      }
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
