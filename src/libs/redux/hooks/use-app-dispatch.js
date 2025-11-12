import { useDispatch } from 'react-redux';

import { store } from '../store';

/**
 * @typedef {Object} CounterState
 * @property {number} counter
 */

/**
 * @typedef {Object} ModalState
 * @property {boolean} modal
 */

/**
 * @typedef {Object} RootState
 * @property {CounterState} counter
 * @property {ModalState} modal
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

/** @returns {AppDispatch} */
export const useAppDispatch = () => useDispatch();
