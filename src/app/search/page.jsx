'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import EventCard from '@/components/event-card';
import Container from '@/components/layout/container';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Filter from '@/components/ui/filter/filter';
import InputButton from '@/components/ui/input/input-button';
import Map from '@/components/ui/map';
import Tabs from '@/components/ui/tabs';
import DEFAULT_TABS from '@/constants/tabs';
import VIEWPORT from '@/constants/viewport';
import { useSearchQuery } from '@/hooks/use-search-query';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { selectFilter } from '@/libs/redux/slices/filter-slice';
import { selectSearch, setSearch } from '@/libs/redux/slices/search-slice';
import getViewportType from '@/utils/get-view-port';
import normalizeTabs from '@/utils/normalize-tabs';
import buildSearchParams from '@/utils/params-builder';

/**
 * SearchPage
 *
 * This component displays a search input, breadcrumbs, and tabs with filters and map.
 * It fetches events based on the search query and filters, and displays them in a list.
 * It also has pagination and an observer to load more events when the user scrolls to the bottom of the page.
 *
 * @returns {JSX.Element} A JSX element containing the search page.
 */
export default function SearchPage() {
  // * tabs and viewport settings
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

  // * Filter and search input logic
  const dispatch = useAppDispatch();
  const { search: searchValue = '' } = useAppSelector(selectSearch);
  const filter = useAppSelector(selectFilter);

  const handleSearchChange = (event) => {
    dispatch(setSearch(event.target.value));
  };
  // submit search query
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
    setSearchQuery(searchValue.trim());
  };

  // * Pagination variables
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  // * Search
  const searchParams = useMemo(
    () => buildSearchParams({ page, searchQuery, filter }),
    [page, searchQuery, filter],
  );

  const { data, isLoading, isError, isFetching } = useSearchQuery(searchParams);

  // * Data and Pagination
  useEffect(() => {
    if (!data) {
      return;
    }

    const fetchedEvents =
      data.items?.filter((item) => item.type === 'event') ?? [];

    setEvents((prev) =>
      page === 1 ? fetchedEvents : [...prev, ...fetchedEvents],
    );
    console.log(data);
    if (data.page && data.pageSize && typeof data.total === 'number') {
      setHasMore(data.page * data.pageSize < data.total);
    } else {
      setHasMore(false);
    }
  }, [data, page]);

  // * Observer
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // ! Temporary until data is connected
  const address = filter.city || 'city';
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
    <Container className="flex flex-col gap-5 pb-5 md:min-h-[800px] lg:min-h-[1038px]">
      <InputButton
        placeholder="Search"
        divClasses="mt-5"
        name="search"
        value={searchValue}
        onChange={handleSearchChange}
        submitFunction={handleSearchSubmit}
      >
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
            {isLoading && <p>Loading events…</p>}
            {isError && (
              <p className="text-red">Failed to load events. Try again.</p>
            )}
            {!isLoading && !isError && events.length === 0 && (
              <p>No events found for selected filters.</p>
            )}
            {events.map((event) => (
              <div key={event.id}>
                <EventCard event={event} />
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
      {isFetching && page > 1 && hasMore && <p>Loading more events…</p>}
      <div ref={loadMoreRef} className="h-1" />
    </Container>
  );
}
