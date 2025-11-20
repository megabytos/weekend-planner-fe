import { useSelector } from 'react-redux';

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
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/** @type {import('react-redux').TypedUseSelectorHook<RootState>} */

export const useAppSelector = useSelector;
