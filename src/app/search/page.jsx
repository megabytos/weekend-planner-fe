'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import EventCard from '@/components/event-card';
import Container from '@/components/layout/container';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Filter from '@/components/ui/filter/filter';
import InputButton from '@/components/ui/input/input-button';
import Map from '@/components/ui/map';
import Tabs from '@/components/ui/tabs';
import DEFAULT_TABS from '@/constants/tabs';
import useSearchData from '@/hooks/use-search-data';
import useSearchTabs from '@/hooks/use-search-tabs';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { selectFilter } from '@/libs/redux/slices/filter-slice';
import { selectSearch, setSearch } from '@/libs/redux/slices/search-slice';
import { DEFAULT_CITY } from '@/utils/params-builder';

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
  const { checkActiveTab, handleTabClick } = useSearchTabs();

  // * Filter and search input logic
  const dispatch = useAppDispatch();
  const { search: searchValue = '' } = useAppSelector(selectSearch);
  const filter = useAppSelector(selectFilter);

  const handleSearchChange = (event) => {
    dispatch(setSearch(event.target.value));
  };
  const {
    events,
    hasMore,
    handleSearchSubmit,
    isError,
    isFetching,
    isLoading,
    loadMoreRef,
  } = useSearchData({ searchValue, filter });

  // ! Temporary
  const address = filter.city?.name || DEFAULT_CITY.city.name;
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
    <Container className="flex flex-col gap-5 pb-5 max-w-[375px] md:min-h-[800px] lg:min-h-[1038px]">
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
          <div className="md:min-w-[545px] lg:min-w-[526px] space-y-4">
            {isLoading && <p>Loading events…</p>}
            {isError && (
              <p className="text-red">Failed to load events. Try again.</p>
            )}
            {!isLoading && !isError && events.length === 0 && (
              <p>No events found for selected filters.</p>
            )}
            {events.map((event, index) => {
              const key = event?.__key;
              return (
                <div key={key}>
                  <EventCard event={event} />
                </div>
              );
            })}
          </div>
        </section>

        <section
          className={checkActiveTab(DEFAULT_TABS.MAP) ? 'block' : 'hidden'}
        >
          <div className="rounded-xl border w-full flex justify-center">
            <Map places={events} />
          </div>
        </section>
      </div>
      {isFetching && !isLoading && hasMore && <p>Loading more events…</p>}
      <div ref={loadMoreRef} className="h-1" />
    </Container>
  );
}
