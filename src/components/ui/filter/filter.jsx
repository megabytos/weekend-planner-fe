'use client';

import { FilterButton } from '@/components/ui/FilterButton';
import { FilterSection } from '@/components/ui/FilterSection';

const CITIES = [
  'Київ',
  'Вінниця',
  'Тернопіль',
  'Житомир',
  'Одеса',
  'Хмельницький',
  'Львів',
  'Кропивницький',
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

export default function Filters() {
  return (
    <div className="space-y-6">
      <FilterSection title="Місто">
        {CITIES.map((c) => (
          <FilterButton />
        ))}
      </FilterSection>

      <FilterSection title="Category">
        {CATS.map((c) => (
          <FilterButton />
        ))}
      </FilterSection>

      <FilterSection title="Date">
        <FilterButton>Today</FilterButton>
        <FilterButton>Tomorrow</FilterButton>
        <FilterButton>This week</FilterButton>
        <FilterButton>Choose date</FilterButton>
      </FilterSection>

      <FilterSection title="Price">
        <FilterButton>Free</FilterButton>
        <FilterButton>Not high</FilterButton>
        <FilterButton>Expensive</FilterButton>
      </FilterSection>
    </div>
  );
}
