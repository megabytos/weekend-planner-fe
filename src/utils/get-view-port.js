/**
 * Determine viewport category using breakpoints.
 * - DESKTOP >= DESKTOP_BREAKPOINT
 * - TABLET >= TABLET_BREAKPOINT
 * - else MOBILE
 */
import VIEWPORT from '@/constants/viewport';
import {
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
} from '@/constants/viewport-breakpoints';

const getViewportType = () => {
  if (typeof window === 'undefined') {
    return VIEWPORT.MOBILE;
  }

  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    return VIEWPORT.DESKTOP;
  }

  if (window.innerWidth >= TABLET_BREAKPOINT) {
    return VIEWPORT.TABLET;
  }

  return VIEWPORT.MOBILE;
};

export default getViewportType;
