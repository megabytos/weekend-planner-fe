'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSearchQuery } from '@/hooks/use-search-query';
import buildSearchParams from '@/utils/params-builder';

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

  useEffect(() => {
    if (!data) {
      return;
    }

    const fetchedEvents = data.items ?? [];

    setEvents((prev) =>
      page === 1 ? fetchedEvents : [...prev, ...fetchedEvents],
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
