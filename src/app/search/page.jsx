'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import EventCard from '@/components/event-card';
import Container from '@/components/layout/container';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Filter from '@/components/ui/filter/filter';
import InputButton from '@/components/ui/input/input-button';
import Map from '@/components/ui/map';
import Tabs from '@/components/ui/tabs';
import DEFAULT_TABS from '@/constants/tabs';
import VIEWPORT from '@/constants/viewport';
import getViewportType from '@/utils/get-view-port';
import normalizeTabs from '@/utils/normalize-tabs';

export default function SearchPage() {
  const [viewport, setViewport] = useState(VIEWPORT.MOBILE);
  const [activeTab, setActiveTab] = useState([DEFAULT_TABS.EVENTS]);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportType());
    };

    setViewport(getViewportType());
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

  const handleTabClick = (tab) => {
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
  };

  const checkActiveTab = (tab) => activeTab.includes(tab);

  // ! Temporary until data is connected
  const address = 'Sample City';
  const pathname = usePathname();
  const linkAddress = pathname.split('/');

  const breadcrumbs = useMemo(
    () => [
      { label: 'WeekendPlanner', href: '/' },
      { label: linkAddress[1] || 'search', href: '/search' },
    ],
    [linkAddress],
  );

  return (
    <Container className="flex flex-col gap-5 md:h-[800px] lg:h-[1038px]">
      <InputButton placeholder="Search" divClasses="mt-5">
        <Search className="w-6 h-6" />
      </InputButton>

      <div>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Tabs
        address={address}
        handleTabClick={handleTabClick}
        checkActiveTab={checkActiveTab}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <section
          className={
            (checkActiveTab(DEFAULT_TABS.FILTERS) ? 'block' : 'hidden') +
            ' md:block'
          }
        >
          <Filter />
        </section>

        <section
          className={checkActiveTab(DEFAULT_TABS.EVENTS) ? 'block' : 'hidden'}
        >
          <div className="space-y-4">
            {/* * Temporary until data is connected*/}
            {[1, 2, 3, 4, 5].map((event) => (
              <div key={event}>
                <EventCard />
              </div>
            ))}
          </div>
        </section>

        <section
          className={checkActiveTab(DEFAULT_TABS.MAP) ? 'block' : 'hidden'}
        >
          <div className="h-64 rounded-xl border">
            <Map />
          </div>
        </section>
      </div>
    </Container>
  );
}
