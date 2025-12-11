/**
 * Auth slice
 * - State: `{ name, email, password }`
 * - Actions: `setAuthField(field,value)`, `resetAuth()`
 * - Purpose: track auth form fields/client-side auth data.
 */
import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  name: '',
  email: '',
  password: '',
});

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setAuthField: (state, { payload }) => {
      if (
        !payload ||
        !payload.field ||
        !Object.prototype.hasOwnProperty.call(state, payload.field)
      ) {
        return;
      }

      state[payload.field] = payload.value ?? '';
    },
    resetAuthInputs: () => getInitialState(),
  },
});

export const { setAuthField, resetAuthInputs } = authSlice.actions;

export default authSlice.reducer;

export const selectAuthInputs = (state) => state.authInputs;
export const selectAuthField = (state, field) => state.authInputs[field] ?? '';
