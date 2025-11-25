'use client';

import { useCallback, useEffect, useState } from 'react';

import DEFAULT_TABS from '@/constants/tabs';
import VIEWPORT from '@/constants/viewport';
import getViewportType from '@/utils/get-view-port';
import normalizeTabs from '@/utils/normalize-tabs';

const useSearchTabs = () => {
  const [viewport, setViewport] = useState(getViewportType());
  const [activeTab, setActiveTab] = useState([DEFAULT_TABS.EVENTS]);

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

  useEffect(() => {
    if (checkActiveTab(DEFAULT_TABS.MAP)) {
      setTimeout(() => {
        window.dispatchEvent(new Event('map-visible'));
      }, 50);
    }
  }, [activeTab, checkActiveTab]);

  return { checkActiveTab, handleTabClick, viewport };
};

export default useSearchTabs;
