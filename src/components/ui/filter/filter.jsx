'use client';

import { Fragment } from 'react/jsx-runtime';

import FilterButton, {
  FILTER_TYPES,
} from '@/components/ui/filter/filter-button';
import FilterSection from '@/components/ui/filter/filter-section';

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
  'Music',
  'Art',
  'Technology',
  'Sports',
  'Education',
  'Health',
  'Business',
  'Food & Drink',
];

const DATES = ['Today', 'Tomorrow', 'This week', 'Choose date'];

const PRICE = ['Free', 'Not high', 'Expensive'];

export default function Filter() {
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
        {DATES.map((date) => (
          <Fragment key={date}>
            <FilterButton value={date} filterType={FILTER_TYPES.date} />
          </Fragment>
        ))}
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
