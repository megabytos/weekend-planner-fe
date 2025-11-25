'use client';

import Fuse from 'fuse.js';
import { Fragment, useEffect, useMemo, useState } from 'react';

import Calendar from '@/components/ui/calendar';
import FilterButton from '@/components/ui/filter/filter-button';
import FilterSection from '@/components/ui/filter/filter-section';
import InputBase from '@/components/ui/input/input-base';
import {
  BUDGET_TIERS,
  CATS,
  CITIES,
  COMPANY_TYPES,
  DATES,
  FILTER_TYPES,
  INDOOR_OUTDOOR,
  KIDS_AGE_GROUPS,
  MOOD,
  TARGETS,
  TIME_BUDGETS,
  TRANSPORT_MODES,
} from '@/constants/filter-types';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { selectFilter, setCustomDate } from '@/libs/redux/slices/filter-slice';
import { getCities } from '@/services/fetch/get-city';
import {
  getEventsCategories,
  getPlacesCategories,
} from '@/services/fetch/get-types';

export default function Filter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const [showCalendar, setShowCalendar] = useState(false);
  const [cityOptions, setCityOptions] = useState(
    CITIES.map((name, idx) => ({ id: idx + 1, name })),
  );
  const [citySearch, setCitySearch] = useState('');
  const [categoryOptions, setCategoryOptions] = useState(CATS);
  const [categorySearch, setCategorySearch] = useState('');

  const customDateLabel = useMemo(() => {
    if (!filter.customDate) {
      return 'Choose date';
    }

    const date = new Date(filter.customDate);
    if (Number.isNaN(date.getTime())) {
      return 'Choose date';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [filter.customDate]);

  const handleChooseDateClick = () => {
    const isSelected = filter.date === 'Choose date';
    if (!isSelected) {
      setShowCalendar(true);
      return true;
    }

    setShowCalendar((prev) => !prev);
    return false;
  };

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) {
      return;
    }

    const isoDate = selectedDate.toISOString().split('T')[0];
    dispatch(setCustomDate(isoDate));
    setShowCalendar(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      try {
        const data = await getCities();
        const items = Array.isArray(data?.items) ? data.items : data;
        const normalized =
          Array.isArray(items) && items.length
            ? items
                .map((item, idx) => {
                  if (typeof item === 'string') {
                    return { id: idx + 1, name: item };
                  }
                  const { id, code, name, title, countryCode } = item || {};
                  const label = name || title || code || String(id);
                  if (!label) return null;
                  return { id, code, name: label, countryCode };
                })
                .filter(Boolean)
            : [];
        if (isMounted && normalized.length) {
          setCityOptions(normalized);
        }
      } catch (error) {
        console.error('Failed to load cities', error);
      }
    };

    loadCities();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCities = useMemo(() => {
    const query = citySearch.trim();

    const fuse = new Fuse(cityOptions, {
      keys: ['name', 'code'],
      threshold: 0.3,
    });

    return fuse.search(query).map((result) => result.item);
  }, [cityOptions, citySearch]);

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim();

    const fuse = new Fuse(
      categoryOptions.map((item) =>
        typeof item === 'string' ? { name: item } : item,
      ),
      { keys: ['name'], threshold: 0.3 },
    );

    return fuse.search(query).map((result) => result.item.name || result.item);
  }, [categoryOptions, categorySearch]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        if (filter.target === 'places') {
          const data = await getPlacesCategories();
          const items = Array.isArray(data?.items) ? data.items : data;
          const names = Array.isArray(items)
            ? items
                .map((item) => item?.name || item?.title || item)
                .filter(Boolean)
            : [];
          if (isMounted && names.length) {
            setCategoryOptions(names);
            return;
          }
        } else if (filter.target === 'events') {
          const data = await getEventsCategories();
          const items = Array.isArray(data?.items) ? data.items : data;
          const names = Array.isArray(items)
            ? items
                .map((item) => item?.name || item?.title || item)
                .filter(Boolean)
            : [];
          if (isMounted && names.length) {
            setCategoryOptions(names);
            return;
          }
        } else if (filter.target === 'both') {
          const [eventsData, placesData] = await Promise.all([
            getEventsCategories(),
            getPlacesCategories(),
          ]);

          const normalize = (input) => {
            const items = Array.isArray(input?.items) ? input.items : input;
            return Array.isArray(items)
              ? items
                  .map((item) => item?.name || item?.title || item)
                  .filter(Boolean)
              : [];
          };

          const merged = [...normalize(eventsData), ...normalize(placesData)];
          const unique = Array.from(new Set(merged));
          if (isMounted && unique.length) {
            setCategoryOptions(unique);
            return;
          }
        }

        if (isMounted) {
          setCategoryOptions(CATS);
        }
      } catch (error) {
        console.error('Failed to load categories', error);
        if (isMounted) {
          setCategoryOptions(CATS);
        }
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [filter.target]);

  return (
    <div className="relative flex flex-col gap-5 w-[335px] md:w-[167px] lg:w-[320px]">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[22px] top-2 leading-7 font-medium ">Filters</h3>
        <FilterButton
          classes="w-12 p-2"
          value="clear"
          filterType={FILTER_TYPES.clear}
        />
      </div>

      <FilterSection label="City">
        <InputBase
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
          placeholder="Search city..."
          divClasses="my-2 w-full"
          inputClasses="h-10 text-sm"
        />
        {filteredCities.map((city) => (
          <Fragment key={city?.id || city?.name}>
            <FilterButton
              value={city}
              label={city?.name}
              filterType={FILTER_TYPES.city}
            />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Category">
        <InputBase
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          placeholder="Search category..."
          divClasses="my-2 w-full"
          inputClasses="h-10 text-sm"
        />
        {filteredCategories.map((category) => (
          <Fragment key={category}>
            <FilterButton value={category} filterType={FILTER_TYPES.category} />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Date">
        {DATES.map((date) => {
          const isChooseDate = date === 'Choose date';
          return (
            <Fragment key={date}>
              <FilterButton
                value={date}
                filterType={FILTER_TYPES.date}
                label={isChooseDate ? customDateLabel : date}
                onClick={
                  isChooseDate
                    ? handleChooseDateClick
                    : () => {
                        setShowCalendar(false);
                        return true;
                      }
                }
              />
            </Fragment>
          );
        })}
        {showCalendar && (
          <div className="mt-3">
            <Calendar onSelect={handleDateSelect} value={filter.customDate} />
          </div>
        )}
      </FilterSection>

      <FilterSection label="Part of the day">
        {TIME_BUDGETS.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.timeBudget}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Budget">
        {BUDGET_TIERS.map((tier) => (
          <Fragment key={tier}>
            <FilterButton value={tier} filterType={FILTER_TYPES.budgetTier} />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Mood">
        {MOOD.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.mood}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Company">
        {COMPANY_TYPES.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.companyType}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>

      {filter.companyType === 'kids' && (
        <FilterSection label="Kids age">
          {KIDS_AGE_GROUPS.map(({ value, label }) => (
            <Fragment key={value}>
              <FilterButton
                value={value}
                filterType={FILTER_TYPES.kidsAgeGroup}
                label={label}
              />
            </Fragment>
          ))}
        </FilterSection>
      )}

      <FilterSection label="Target">
        {TARGETS.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.target}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Transport">
        {TRANSPORT_MODES.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.transportMode}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Indoor/Outdoor">
        {INDOOR_OUTDOOR.map(({ value, label }) => (
          <Fragment key={value}>
            <FilterButton
              value={value}
              filterType={FILTER_TYPES.indoorOutdoor}
              label={label}
            />
          </Fragment>
        ))}
      </FilterSection>
    </div>
  );
}
