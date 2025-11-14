import { useSelector } from 'react-redux';

import { selectFilter } from '../filter-slice';
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
 * @typedef {Object} FilterState
 * @property {string[]} cities
 * @property {string[]} categories
 * @property {string|null} date
 * @property {string|null} price
 */

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/** @type {import('react-redux').TypedUseSelectorHook<RootState>} */

export const useAppSelector = useSelector;
