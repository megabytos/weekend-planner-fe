import { useDispatch } from 'react-redux';

import { store } from '../store';
import { useFilterSelector } from './use-app-selector';
import { useSearchSelector } from './use-app-selector';

/**
 * @typedef {Object} CounterState
 * @property {number} counter
 */

/**
 * @typedef {Object} FilterState
 * @property {string[]} cities
 * @property {string[]} categories
 * @property {string|null} date
 * @property {string|null} price
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
