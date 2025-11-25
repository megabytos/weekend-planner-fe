const PAGE_SIZE = 10;
const DEFAULT_BBOX = { south: -90, west: -180, north: 90, east: 180 };

const sanitizeString = (value) =>
  typeof value === 'string' ? value.trim() : undefined;

const toLower = (value) => sanitizeString(value)?.toLowerCase();

const toSlug = (value) =>
  sanitizeString(value)
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildWhen = (filter) => {
  const customDate = sanitizeString(filter?.customDate);
  if (customDate) {
    const from = `${customDate}T00:00:00.000Z`;
    const to = `${customDate}T23:59:59.999Z`;
    return { type: 'range', from, to };
  }

  const preset = toLower(filter?.date);
  const presetMap = {
    now: 'now',
    'today evening': 'today_evening',
    tonight: 'tonight',
    tomorrow: 'tomorrow',
    'this weekend': 'this_weekend',
  };

  const presetValue = preset ? presetMap[preset] : null;
  return { type: 'preset', preset: presetValue || 'this_weekend' };
};

const buildWho = (filter) => {
  const companyType = sanitizeString(filter?.companyType);
  const kidsAgeGroups = Array.isArray(filter?.kidsAgeGroups)
    ? filter.kidsAgeGroups.map((group) => sanitizeString(group)).filter(Boolean)
    : [];

  const who = {};
  if (companyType) {
    who.companyType = companyType;
  }
  if (kidsAgeGroups.length) {
    who.kidsAgeGroups = kidsAgeGroups;
  }

  return Object.keys(who).length ? who : undefined;
};

const buildBudget = (filter) => {
  const tier = sanitizeString(filter?.budgetTier);
  return tier ? { tier } : undefined;
};

const buildFilters = (filter) => {
  const normalizedCategories = Array.isArray(filter?.categories)
    ? filter.categories.map((category) => toSlug(category)).filter(Boolean)
    : [];

  const filters = {};
  if (normalizedCategories.length) {
    filters.categorySlugs = normalizedCategories;
  }

  const transport = sanitizeString(filter?.transportMode);
  if (transport) {
    filters.transport = transport;
  }

  const indoorOutdoor = sanitizeString(filter?.indoorOutdoor);
  if (indoorOutdoor) {
    filters.indoorOutdoor = indoorOutdoor;
  }

  return Object.keys(filters).length ? filters : undefined;
};

const buildWhere = (filter) => {
  const city = filter?.city;
  if (city && typeof city === 'object' && typeof city.id === 'number') {
    return {
      city: {
        id: city.id,
        code: city.code,
        name: city.name,
        countryCode: city.countryCode,
      },
    };
  }

  return { bbox: DEFAULT_BBOX };
};

const buildSearchParams = ({ page, searchQuery, filter }) => {
  const result = {
    target: sanitizeString(filter?.target) || 'events',
  };

  const normalizedQuery = sanitizeString(searchQuery);
  if (normalizedQuery) {
    result.q = normalizedQuery;
  }

  result.where = buildWhere(filter);
  result.when = buildWhen(filter);

  const who = buildWho(filter);
  if (who) {
    result.who = who;
  }

  const budget = buildBudget(filter);
  if (budget) {
    result.budget = budget;
  }

  const mood = sanitizeString(filter?.mood);
  if (mood) {
    result.mood = mood;
  }

  const filters = buildFilters(filter);
  if (filters) {
    result.filters = filters;
  }

  const pageNumber = Number.isFinite(Number(page)) ? Number(page) : 1;
  const limit = PAGE_SIZE;
  result.pagination = { limit, page: pageNumber };

  return result;
};

export default buildSearchParams;
