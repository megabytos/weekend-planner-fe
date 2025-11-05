import { useDispatch } from 'react-redux';

import { store } from '../store';

/**
 * @typedef {Object} CounterState
 * @property {number} counter
 */

/**
 * @typedef {Object} RootState
 * @property {CounterState} counter
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

/** @returns {AppDispatch} */
export const useAppDispatch = () => useDispatch();
