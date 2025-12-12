'use client';

/**
 * Cities slice
 * - Holds global list of cities and selected current city id
 * - Fetch policy:
 *    - App start / normal pages: TTL = 24h
 *    - Home page trigger: throttle = 60s
 * - Uses `getCities()` API helper: GET /geo/cities
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCities } from '@/services/fetch/get-city';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOME_THROTTLE_MS = 60 * 1000;

/**
 * Normalize API response to array of city objects.
 * - Preserves ALL fields coming from API (e.g., countryName, codeIATA, coordinates, boundingBox, etc.).
 * - Ensures `id` is a Number and `name` is a String.
 */
const normalizeCities = (data) => {
  const items = Array.isArray(data?.items) ? data.items : data;
  if (!Array.isArray(items)) return [];
  return items
    .map((item, idx) => {
      if (typeof item === 'string') {
        return { id: idx + 1, name: item };
      }
      const { id, code, name, title } = item || {};
      const label = name || title || code || (id != null ? String(id) : null);
      if (!label) return null;
      return { ...item, id: Number(id), name: String(label) };
    })
    .filter(Boolean);
};

/**
 * Thunk to fetch cities list if needed according to policy.
 * @param {{ reason: 'app'|'home' }} arg
 */
export const fetchCitiesIfNeeded = createAsyncThunk(
  'cities/fetchIfNeeded',
  async (_arg, _thunkApi) => {
    const data = await getCities();
    return {
      defaultCityId: typeof data?.defaultCityId === 'number' ? data.defaultCityId : null,
      items: normalizeCities(data),
      fetchedAt: Date.now(),
    };
  },
  {
    condition: (arg, { getState }) => {
      const { reason } = arg || { reason: 'app' };
      const state = getState();
      const slice = state?.cities;
      const now = Date.now();
      const items = Array.isArray(slice?.items) ? slice.items : [];
      const lastFetchedAt = Number(slice?.lastFetchedAt) || 0;
      const lastHomeRefreshAt = Number(slice?.lastHomeRefreshAt) || 0;

      // If nothing loaded yet, always allow
      if (!items.length) return true;

      // App-level TTL = 24h
      const isStale = now - lastFetchedAt > DAY_MS;
      if (reason === 'app') {
        return isStale;
      }

      // Home trigger throttle = 60s, but also allow if TTL stale
      if (reason === 'home') {
        const throttled = now - lastHomeRefreshAt < HOME_THROTTLE_MS;
        return !throttled || isStale;
      }

      return false;
    },
  },
);

const initialState = {
  items: [],
  currentCityId: null, // number|null
  lastFetchedAt: 0,
  lastHomeRefreshAt: 0,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCurrentCityId: (state, { payload }) => {
      // Guard to avoid redundant updates
      const nextId = typeof payload === 'string' ? Number(payload) : payload;
      if (Number(state.currentCityId) === Number(nextId)) return;
      state.currentCityId = Number.isFinite(Number(nextId)) ? Number(nextId) : null;
    },
    // Internal use to stamp home refresh time when home-triggered fetch succeeds
    _markHomeRefreshed: (state) => {
      state.lastHomeRefreshAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCitiesIfNeeded.fulfilled, (state, { payload, meta }) => {
      const { items, defaultCityId, fetchedAt } = payload || {};
      if (Array.isArray(items)) {
        state.items = items;
      }
      // Update fetch timestamp
      state.lastFetchedAt = fetchedAt || Date.now();

      // Mark home refresh time if the trigger reason was 'home'
      if (meta?.arg?.reason === 'home') {
        state.lastHomeRefreshAt = Date.now();
      }

      // Initialize current city from API default only if not set yet
      if (!state.currentCityId && Number.isFinite(Number(defaultCityId))) {
        state.currentCityId = Number(defaultCityId);
      }
    });
  },
});

export const { setCurrentCityId } = citiesSlice.actions;

export default citiesSlice.reducer;

// Selectors
export const selectCities = (state) => state.cities;
export const selectCitiesItems = (state) => state.cities.items || [];
export const selectCurrentCityId = (state) => state.cities.currentCityId;
