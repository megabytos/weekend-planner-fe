import DEFAULT_TABS from '@/constants/tabs';

import getViewportType from './get-view-port';

const activeDefaultTabs = () => {
  if (getViewportType() === 'mobile') {
    return [DEFAULT_TABS.EVENTS];
  }
  return [DEFAULT_TABS.MAP, DEFAULT_TABS.EVENTS];
};

export default activeDefaultTabs;
