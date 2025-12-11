/**
 * Search slice
 * - State: `{ search }`
 * - Actions: `setSearch(value)`
 * - Purpose: hold the current search query text.
 */
import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  search: '',
});

const searchSlice = createSlice({
  name: 'search',
  initialState: getInitialState(),
  reducers: {
    setSearch: (state, { payload = '' }) => {
      state.search = payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;

export const selectSearch = (state) => state.search;
