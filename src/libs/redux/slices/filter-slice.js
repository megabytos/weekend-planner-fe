/**
 * Filter slice
 * - State: search filters (city, categories, date presets, budgets, moods, etc).
 * - Actions: toggle setters per filter, clear via `resetFilters`.
 * - Purpose: centralize filter state for search queries and UI.
 */
import { createSlice } from '@reduxjs/toolkit';

import { DEFAULT_CITY } from '@/utils/params-builder';

const initialState = {
  city: DEFAULT_CITY.city,
  categories: [],
  date: '',
  customDate: '',
  budgetTier: '',
  timeBudget: '',
  companyType: '',
  kidsAgeGroups: [],
  mood: '',
  target: 'events',
  transportMode: '',
  indoorOutdoor: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleCity: (state, { payload }) => {
      state.city =
        state.city?.id && payload?.id && state.city.id === payload.id
          ? null
          : payload;
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
      if (payload !== 'Choose date') {
        state.customDate = '';
      }
    },
    setCustomDate: (state, { payload }) => {
      state.customDate = payload;
      state.date = 'Choose date';
    },
    setBudgetTier: (state, { payload }) => {
      state.budgetTier = payload;
    },
    setTimeBudget: (state, { payload }) => {
      state.timeBudget = payload;
    },
    setCompanyType: (state, { payload }) => {
      state.companyType = payload;
      if (payload !== 'kids') {
        state.kidsAgeGroups = [];
      }
    },
    toggleKidsAgeGroup: (state, { payload }) => {
      const index = state.kidsAgeGroups.indexOf(payload);
      if (index === -1) {
        state.kidsAgeGroups.push(payload);
      } else {
        state.kidsAgeGroups.splice(index, 1);
      }
    },
    setMood: (state, { payload }) => {
      state.mood = payload;
    },
    setTarget: (state, { payload }) => {
      state.target = payload || 'events';
    },
    setTransportMode: (state, { payload }) => {
      state.transportMode = payload;
    },
    setIndoorOutdoor: (state, { payload }) => {
      state.indoorOutdoor = payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  toggleCity,
  toggleCategory,
  setDate,
  setCustomDate,
  setBudgetTier,
  setTimeBudget,
  setCompanyType,
  toggleKidsAgeGroup,
  setMood,
  setTarget,
  setTransportMode,
  setIndoorOutdoor,
  resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
export const selectFilter = (state) => state.filter;
