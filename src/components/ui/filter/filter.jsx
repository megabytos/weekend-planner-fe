'use client';

import { Fragment, useMemo, useState } from 'react';

import Calendar from '@/components/ui/calendar';
import FilterButton from '@/components/ui/filter/filter-button';
import FilterSection from '@/components/ui/filter/filter-section';
import FILTER_TYPES from '@/constants/filter-types';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  selectFilter,
  setCustomDate,
} from '@/libs/redux/slices/filter-slice';

const CITIES = [
  'New York',
  'Los Angeles',
  'Madrid',
  'Barcelona',
  'London',
  'Rome',
  'Berlin',
  'Paris',
];
const CATS = [
  'Concerts',
  'Festivals',
  'Sports',
  'Theatre and Arts',
  'Family Events',
];

const DATES = ['Now', 'Tonight', 'Tomorrow', 'This weekend', 'Choose date'];

const PRICE = ['Free', '$', '$$', '$$$', 'Unlimited'];

export default function Filter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const [showCalendar, setShowCalendar] = useState(false);

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
        {CITIES.map((city) => (
          <Fragment key={city}>
            <FilterButton value={city} filterType={FILTER_TYPES.city} />
          </Fragment>
        ))}
      </FilterSection>

      <FilterSection label="Category">
        {CATS.map((category) => (
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

      <FilterSection label="Price">
        {PRICE.map((price) => (
          <Fragment key={price}>
            <FilterButton value={price} filterType={FILTER_TYPES.price} />
          </Fragment>
        ))}
      </FilterSection>
    </div>
  );
}
