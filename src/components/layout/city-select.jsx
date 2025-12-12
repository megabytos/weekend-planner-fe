'use client';

import { useMemo } from 'react';

import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  selectCitiesItems,
  selectCurrentCityId,
  setCurrentCityId,
} from '@/libs/redux/slices/cities-slice';

export default function CitySelect({ className = '' }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCitiesItems);
  const currentCityId = useAppSelector(selectCurrentCityId);

  const grouped = useMemo(() => {
    const list = Array.isArray(items) ? items.slice() : [];
    const cleaned = list.filter((c) => c && c.id != null && c.name);
    const map = new Map();
    for (const city of cleaned) {
      const rawLabel = city.countryName || city.country || city.countryCode || 'Other';
      const label = String(rawLabel || 'Other');
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(city);
    }
    const groups = Array.from(map.entries());
    groups.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    for (const [, cities] of groups) {
      cities.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    return groups; // [ [label, cities[]], ... ]
  }, [items]);

  const handleChange = (e) => {
    const value = e?.target?.value;
    const id = value === '' ? null : Number(value);
    dispatch(setCurrentCityId(id));
  };

  return (
    <select
      aria-label="Select city"
      className={`px-2 py-1 rounded-md border border-blue-light text-sm text-blue bg-white focus:outline-none focus:ring-2 focus:ring-blue-light ${className}`}
      value={currentCityId ?? ''}
      onChange={handleChange}
    >
      <option value="" disabled hidden>
        Select city
      </option>
      {grouped.map(([label, cities]) => (
        <optgroup key={label} label={label}>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
