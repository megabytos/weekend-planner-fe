import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth-slice';
import counterReducer from './slices/counter-slice';
import filterReducer from './slices/filter-slice';
import modalMenuReducer from './slices/modal-menu-slice';
import searchReducer from './slices/search-slice';

const rootReducer = combineReducers({
  counter: counterReducer,
  modalMenu: modalMenuReducer,
  filter: filterReducer,
  search: searchReducer,
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter'],
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
