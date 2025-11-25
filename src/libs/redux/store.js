import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth-slice';
import favoritesReducer from './slices/favorites-slice';
import filterReducer from './slices/filter-slice';
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
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'favorites', 'refreshToken'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
