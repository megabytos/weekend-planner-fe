import { useDispatch } from 'react-redux';

import { store } from '../store';

/**
 * @typedef {Object} CounterState
 * @property {number} counter
 */

/**
 * @typedef {Object} ModalMenuState
 * @property {boolean} isOpen
 */

/**
 * @typedef {Object} FilterState
 * @property {string[]} cities
 * @property {string[]} categories
 * @property {string|null} date
 * @property {string|null} price
 */

/**
 * @typedef {Object} SearchState
 * @property {string} search
 */

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

/** @returns {AppDispatch} */
export const useAppDispatch = () => useDispatch();
