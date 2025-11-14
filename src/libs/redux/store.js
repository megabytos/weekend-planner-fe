import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice';
import counterReducer from './counterSlice';
import filterReducer from './filter-slice';
import modalBurgerReducer from './modal-burgerSlice';
import searchReducer from './search-slice';

const rootReducer = combineReducers({
  counter: counterReducer,
  modal: modalBurgerReducer,
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
