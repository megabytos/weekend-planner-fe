const PAGE_SIZE = 10;

const buildSearchParams = ({ page, searchQuery, filter }) => {
  const sanitizeString = (value) =>
    typeof value === 'string' ? value.trim() : undefined;

  const toLower = (value) => sanitizeString(value)?.toLowerCase();

  const result = {
    page,
    pageSize: PAGE_SIZE,
  };

  const normalizedQuery = sanitizeString(searchQuery);
  if (normalizedQuery) {
    result.q = normalizedQuery;
  }

  const customDate = sanitizeString(filter?.customDate);
  const normalizedDate = toLower(filter?.date);
  if (customDate) {
    result.when = customDate;
  } else if (normalizedDate && normalizedDate !== 'choose date') {
    result.when =
      normalizedDate === 'this weekend'
        ? 'this_weekend'
        : normalizedDate || 'this_weekend';
  } else {
    result.when = 'this_weekend';
  }

  const target = sanitizeString(filter?.target) || 'events';
  result.kind = target;

  const normalizedCategories = Array.isArray(filter?.categories)
    ? filter.categories.map((category) => toLower(category)).filter(Boolean)
    : [];
  if (normalizedCategories.length) {
    result.categories = normalizedCategories;
  }

  const budgetTier = sanitizeString(filter?.budgetTier);
  if (budgetTier) {
    result.budgetTier = budgetTier;
  }

  const mood = sanitizeString(filter?.mood);
  if (mood) {
    result.mood = mood;
  }

  const transportMode = sanitizeString(filter?.transportMode);
  if (transportMode) {
    result.transportMode = transportMode;
  }

  const timeBudget = sanitizeString(filter?.timeBudget);
  if (timeBudget) {
    result.timeBudget = timeBudget;
  }

  const companyType = sanitizeString(filter?.companyType);
  if (companyType) {
    result.companyType = companyType;
  }

  const kidsAgeGroups = Array.isArray(filter?.kidsAgeGroups)
    ? filter.kidsAgeGroups
        .map((group) => sanitizeString(group))
        .filter(Boolean)
    : [];
  if (kidsAgeGroups.length) {
    result.kidsAgeGroups = kidsAgeGroups;
  }

  const indoorOutdoor = sanitizeString(filter?.indoorOutdoor);
  if (indoorOutdoor) {
    result.indoorOutdoor = indoorOutdoor;
  }

  const city = filter?.city;
  if (city) {
    result.city = city;
  }
  return result;
};

export default buildSearchParams;
