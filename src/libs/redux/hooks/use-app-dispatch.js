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
 * @property {string} city
 * @property {string[]} categories
 * @property {string|null} date
 * @property {string|null} customDate
 * @property {string|null} budgetTier
 * @property {string|null} timeBudget
 * @property {string|null} companyType
 * @property {string[]} kidsAgeGroups
 * @property {string|null} mood
 * @property {string} target
 * @property {string|null} transportMode
 * @property {string|null} indoorOutdoor
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
