import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, { payload }) => {
      const key = payload?.key;
      if (!key) return;

      if (state.items[key]) {
        delete state.items[key];
      } else {
        state.items[key] = payload?.item || null;
      }
    },
    clearFavorites: (state) => {
      state.items = {};
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const selectFavorites = (state) => state.favorites?.items || {};
export const selectIsFavorite = (state, key) => !!state.favorites?.items?.[key];
