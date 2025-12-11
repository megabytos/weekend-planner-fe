'use client';

import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSearchQuery } from '@/hooks/use-search-query';
import buildSearchParams from '@/utils/params-builder';

/**
 * A hook that fetches events based on the search query and filters.
 *
 * @param {Object} props - An object with the search value and filter.
 * @param {string} props.searchValue - The search value.
 * @param {Object} props.filter - An object with the filter options.
 * @returns {Object} An object with the events, hasMore, handleSearchSubmit, isError, isFetching, isLoading, and loadMoreRef.
 */
const useSearchData = ({ searchValue, filter }) => {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const loadMoreRef = useRef(null);

  const handleSearchSubmit = useCallback(() => {
    setPage(1);
    setEvents([]);
    setHasMore(false);
    setSearchQuery(searchValue.trim());
  }, [searchValue]);

  const searchParams = useMemo(
    () => buildSearchParams({ page, searchQuery, filter }),
    [page, searchQuery, filter],
  );

  const { data, isLoading, isError, isFetching } = useSearchQuery(searchParams);

  // Generate a safe unique key
  const ensureKey = useCallback((item) => {
    if (!item) return null;
    if (item.__key) return item;

    const safeId =
      item.id && item.id !== 'foursquare:undefined' ? item.id : null;
    const safeSourceId =
      item.sources?.[0]?.externalId &&
      item.sources[0].externalId !== 'undefined'
        ? item.sources[0].externalId
        : null;
    const key = safeId || safeSourceId || item.url || item.title || nanoid();
    return { ...item, __key: key };
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const fetchedEvents = data.items ?? [];
    const withKeys = fetchedEvents
      .map((item) => ensureKey(item))
      .filter(Boolean);

    setEvents((prev) =>
      page === 1
        ? withKeys
        : [...prev.map((item) => ensureKey(item)).filter(Boolean), ...withKeys],
    );

    const { pagination, total } = data;
    if (pagination?.page && pagination?.limit && typeof total === 'number') {
      setHasMore(pagination.page * pagination.limit < total);
    } else {
      setHasMore(false);
    }
  }, [data, page]);

  const isInitialLoading = isLoading && page === 1;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore || isInitialLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !isFetching &&
          !isInitialLoading
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isFetching, isInitialLoading]);

  return {
    events,
    hasMore,
    handleSearchSubmit,
    isError,
    isFetching,
    isLoading,
    loadMoreRef,
  };
};

export default useSearchData;
