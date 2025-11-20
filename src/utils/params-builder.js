const PAGE_SIZE = 10;

const buildSearchParams = ({ page, searchQuery, filter }) => {
  const sanitizeString = (value) =>
    typeof value === 'string' ? value.trim() : undefined;

  const toLower = (value) => sanitizeString(value)?.toLowerCase();

  const result = {
    kind: 'events',
    page,
    pageSize: PAGE_SIZE,
  };

  const normalizedQuery = sanitizeString(searchQuery);
  if (normalizedQuery) {
    result.q = normalizedQuery;
  }

  const normalizedDate = toLower(filter?.date);
  if (normalizedDate) {
    result.when =
      normalizedDate === 'this weekend'
        ? 'this_weekend'
        : normalizedDate || 'this_weekend';
  } else {
    result.when = 'this_weekend';
  }

  const normalizedCategories = Array.isArray(filter?.categories)
    ? filter.categories.map((category) => toLower(category)).filter(Boolean)
    : [];
  if (normalizedCategories.length) {
    result.categories = normalizedCategories;
  }

  const normalizedBudget = toLower(filter?.price);
  if (normalizedBudget) {
    result.budget = normalizedBudget;
  }

  const city = filter?.city;
  if (city) {
    result.city = city;
  }
  return result;
};

export default buildSearchParams;
