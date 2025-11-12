import { useSelector } from 'react-redux';

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

/** @type {import('react-redux').TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;
