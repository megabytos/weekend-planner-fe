'use client';

import {
  selectFilter,
  setDate,
  setPrice,
  toggleCategory,
  toggleCity,
} from '@/libs/redux/filterSlice';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import cn from '@/utils/class-names';

export const FILTER_TYPES = {
  city: 'city',
  category: 'category',
  date: 'date',
  price: 'price',
};

export default function FilterButton({ classes = '', value = '', filterType }) {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);

  const selected = (() => {
    switch (filterType) {
      case FILTER_TYPES.city:
        return filter.cities.includes(value);
      case FILTER_TYPES.category:
        return filter.categories.includes(value);
      case FILTER_TYPES.date:
        return filter.date === value;
      case FILTER_TYPES.price:
        return filter.price === value;
      default:
        return false;
    }
  })();

  const handleClick = () => {
    if (!value) {
      return;
    }

    switch (filterType) {
      case FILTER_TYPES.city:
        dispatch(toggleCity(value));
        break;
      case FILTER_TYPES.category:
        dispatch(toggleCategory(value));
        break;
      case FILTER_TYPES.date:
        dispatch(setDate(filter.date === value ? null : value));
        break;
      case FILTER_TYPES.price:
        dispatch(setPrice(filter.price === value ? null : value));
        break;
      default:
        break;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'px-2 py-1 rounded-[10px] border-blue-light text-sm text-blue transition hover:bg-blue-light ',
        selected ? 'bg-blue-light' : 'bg-white',
        classes,
      )}
    >
      {value}
    </button>
  );
}
