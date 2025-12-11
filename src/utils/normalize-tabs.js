/**
 * Normalize active tabs based on viewport:
 * - Mobile: keep only the first tab.
 * - Tablet: allow only events/map, keep the last one.
 * - Desktop: allow events/map, default to both if empty.
 */
import DEFAULT_TABS from '@/constants/tabs';
import VIEWPORT from '@/constants/viewport';

const normalizeTabs = (tabs, viewport) => {
  if (viewport === VIEWPORT.MOBILE) {
    return [tabs[0]];
  }

  if (viewport === VIEWPORT.TABLET) {
    const allowed = tabs.filter(
      (tab) => tab === DEFAULT_TABS.EVENTS || tab === DEFAULT_TABS.MAP,
    );
    const nextTab = allowed.length
      ? allowed[allowed.length - 1]
      : DEFAULT_TABS.EVENTS;
    return [nextTab];
  }

  if (viewport === VIEWPORT.DESKTOP) {
    const allowed = tabs.filter(
      (tab) => tab === DEFAULT_TABS.EVENTS || tab === DEFAULT_TABS.MAP,
    );
    return allowed.length ? allowed : [DEFAULT_TABS.EVENTS, DEFAULT_TABS.MAP];
  }

  return tabs;
};

export default normalizeTabs;
