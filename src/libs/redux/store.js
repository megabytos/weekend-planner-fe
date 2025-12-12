import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import authReducer from './slices/auth-slice';
import citiesReducer, { setCurrentCityId } from './slices/cities-slice';
import favoritesReducer from './slices/favorites-slice';
import filterReducer, { toggleCity } from './slices/filter-slice';
import modalMenuReducer from './slices/modal-menu-slice';
import refreshTokenReducer from './slices/refresh-token-slice';
import searchReducer from './slices/search-slice';

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const rootReducer = combineReducers({
  refreshToken: refreshTokenReducer,
  modalMenu: modalMenuReducer,
  filter: filterReducer,
  search: searchReducer,
  auth: authReducer,
  favorites: favoritesReducer,
  cities: citiesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'favorites', 'refreshToken', 'filter', 'cities'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Listener middleware for bidirectional sync between cities.currentCityId and filter.city
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    const prevId = previousState?.cities?.currentCityId ?? null;
    const nextId = currentState?.cities?.currentCityId ?? null;
    return prevId !== nextId;
  },
  effect: async (_action, api) => {
    const state = api.getState();
    const id = state.cities.currentCityId ?? null;
    const items = Array.isArray(state.cities.items) ? state.cities.items : [];
    const currentFilterCityId = state.filter?.city?.id ?? null;
    const nextCity =
      id != null
        ? items.find((c) => Number(c.id) === Number(id)) || null
        : null;

    // Avoid toggling off when the filter already holds this city
    if (Number(currentFilterCityId) === (id != null ? Number(id) : null)) {
      return;
    }

    api.dispatch(toggleCity(nextCity));
  },
});
// Sync: when filter.city changes -> update cities.currentCityId
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    const prevId = previousState?.filter?.city?.id ?? null;
    const nextId = currentState?.filter?.city?.id ?? null;
    return prevId !== nextId;
  },
  effect: async (_action, api) => {
    const state = api.getState();
    const newId = state.filter.city?.id ?? null;
    const currentId = state.cities.currentCityId ?? null;
    if (currentId !== newId) {
      api.dispatch(setCurrentCityId(newId));
    }
  },
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
