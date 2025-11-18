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
    resetSearch: () => getInitialState(),
  },
});

export const { setSearch, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;

export const selectSearch = (state) => state.search;
