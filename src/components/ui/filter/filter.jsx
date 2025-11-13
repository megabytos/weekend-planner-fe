'use client';

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
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <FilterSection label="City">
        {CITIES.map((city) => (
          <FilterButton
            key={city}
            value={city}
            filterType={FILTER_TYPES.city}
          />
        ))}
      </FilterSection>

      <FilterSection label="Category">
        {CATS.map((category) => (
          <FilterButton
            key={category}
            value={category}
            filterType={FILTER_TYPES.category}
          />
        ))}
      </FilterSection>

      <FilterSection label="Date">
        {DATES.map((date) => (
          <FilterButton
            key={date}
            value={date}
            filterType={FILTER_TYPES.date}
          />
        ))}
      </FilterSection>

      <FilterSection label="Price">
        {PRICE.map((price) => (
          <FilterButton
            key={price}
            value={price}
            filterType={FILTER_TYPES.price}
          />
        ))}
      </FilterSection>
    </div>
  );
}
