import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice';
import counterReducer from './counterSlice';
import filterReducer from './filter-slice';
import modalMenuReducer from './modal-menu-slice';
import searchReducer from './search-slice';

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
