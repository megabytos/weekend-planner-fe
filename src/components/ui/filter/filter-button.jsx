'use client';

import FILTER_TYPES from '@/constants/filter-types';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  resetFilters,
  selectFilter,
  setDate,
  setPrice,
  toggleCategory,
  toggleCity,
} from '@/libs/redux/slices/filter-slice';
import cn from '@/utils/class-names';

export default function FilterButton({
  classes = '',
  value = '',
  filterType,
  label = '',
  onClick = null,
}) {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);

  const selected = (() => {
    switch (filterType) {
      case FILTER_TYPES.city:
        return filter.city === value;
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

    if (onClick) {
      const shouldContinue = onClick();
      if (shouldContinue === false) {
        return;
      }
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
      case FILTER_TYPES.clear:
        dispatch(resetFilters());
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
      {label || value}
    </button>
  );
}
