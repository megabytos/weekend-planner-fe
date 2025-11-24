'use client';

import { FILTER_TYPES } from '@/constants/filter-types';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  resetFilters,
  selectFilter,
  setBudgetTier,
  setCompanyType,
  setDate,
  setIndoorOutdoor,
  setMood,
  setTarget,
  setTimeBudget,
  setTransportMode,
  toggleCategory,
  toggleCity,
  toggleKidsAgeGroup,
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
      case FILTER_TYPES.budgetTier:
        return filter.budgetTier === value;
      case FILTER_TYPES.timeBudget:
        return filter.timeBudget === value;
      case FILTER_TYPES.companyType:
        return filter.companyType === value;
      case FILTER_TYPES.kidsAgeGroup:
        return filter.kidsAgeGroups.includes(value);
      case FILTER_TYPES.mood:
        return filter.mood === value;
      case FILTER_TYPES.target:
        return filter.target === value;
      case FILTER_TYPES.transportMode:
        return filter.transportMode === value;
      case FILTER_TYPES.indoorOutdoor:
        return filter.indoorOutdoor === value;
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
      case FILTER_TYPES.budgetTier:
        dispatch(setBudgetTier(filter.budgetTier === value ? null : value));
        break;
      case FILTER_TYPES.timeBudget:
        dispatch(setTimeBudget(filter.timeBudget === value ? null : value));
        break;
      case FILTER_TYPES.companyType:
        dispatch(setCompanyType(filter.companyType === value ? '' : value));
        break;
      case FILTER_TYPES.kidsAgeGroup:
        dispatch(toggleKidsAgeGroup(value));
        break;
      case FILTER_TYPES.mood:
        dispatch(setMood(filter.mood === value ? '' : value));
        break;
      case FILTER_TYPES.target:
        dispatch(setTarget(filter.target === value ? 'events' : value));
        break;
      case FILTER_TYPES.transportMode:
        dispatch(setTransportMode(filter.transportMode === value ? '' : value));
        break;
      case FILTER_TYPES.indoorOutdoor:
        dispatch(setIndoorOutdoor(filter.indoorOutdoor === value ? '' : value));
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
