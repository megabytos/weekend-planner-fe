import { useSelector } from "react-redux";

/**
 * @typedef {Object} CounterState
 * @property {number} counter
 */

/**
 * @typedef {Object} RootState
 * @property {CounterState} counter
 */

/** @type {import('react-redux').TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;
