'use client';

import { useCallback, useEffect, useState } from 'react';

import DEFAULT_TABS from '@/constants/tabs';
import VIEWPORT from '@/constants/viewport';
import activeDefaultTabs from '@/utils/get-default-tabs';
import getViewportType from '@/utils/get-view-port';
import normalizeTabs from '@/utils/normalize-tabs';

/**
 * Returns an object containing the current viewport, active tabs, and functions to check if a tab is active and to handle tab clicks.
 *
 * @returns {Object} An object containing the current viewport, active tabs, and functions to check if a tab is active and to handle tab clicks.
 *
 * @property {string} viewport - The current viewport (mobile, tablet, or desktop).
 * @property {string[]} activeTab - The currently active tabs.
 * @property {function} checkActiveTab - A function to check if a tab is active.
 * @property {function} handleTabClick - A function to handle tab clicks.
 */
const useSearchTabs = () => {
  const [viewport, setViewport] = useState(getViewportType());
  const [activeTab, setActiveTab] = useState(activeDefaultTabs());

  useEffect(() => {
    const handleResize = () => setViewport(getViewportType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveTab((prev) => {
      const normalized = normalizeTabs(prev, viewport);
      const hasSameLength = normalized.length === prev.length;
      const isSame =
        hasSameLength && normalized.every((tab) => prev.includes(tab));

      return isSame ? prev : normalized;
    });
  }, [viewport]);

  const checkActiveTab = useCallback(
    (tab) => activeTab.includes(tab),
    [activeTab],
  );

  const handleTabClick = useCallback(
    (tab) => {
      if (viewport === VIEWPORT.DESKTOP) {
        setActiveTab((prev) => {
          if (tab === DEFAULT_TABS.FILTERS) {
            return prev;
          }

          if (prev.includes(tab)) {
            const nextTabs = prev.filter((t) => t !== tab);
            return nextTabs.length ? nextTabs : prev;
          }

          return [...prev, tab];
        });
        return;
      }

      setActiveTab([tab]);
    },
    [viewport],
  );

  return { checkActiveTab, handleTabClick, viewport };
};

export default useSearchTabs;
