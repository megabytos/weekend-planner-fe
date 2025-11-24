const FILTER_TYPES = {
  city: 'city',
  category: 'category',
  date: 'date',
  budgetTier: 'budgetTier',
  timeBudget: 'timeBudget',
  companyType: 'companyType',
  kidsAgeGroup: 'kidsAgeGroup',
  mood: 'mood',
  target: 'target',
  transportMode: 'transportMode',
  indoorOutdoor: 'indoorOutdoor',
  clear: 'clear',
};

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
  'Concerts',
  'Festivals',
  'Sports',
  'Theatre and Arts',
  'Family Events',
];

const DATES = ['Now', 'Tonight', 'Tomorrow', 'This weekend', 'Choose date'];

const BUDGET_TIERS = ['FREE', 'CHEAP', 'MODERATE', 'EXPENSIVE', 'ANY'];

const TIME_BUDGETS = [
  { value: 'UP_TO_2_HOURS', label: 'Up to 2 hours' },
  { value: 'HALF_DAY', label: 'Half day' },
  { value: 'FULL_DAY', label: 'Full day' },
  { value: 'EVENING', label: 'Evening' },
];

const COMPANY_TYPES = [
  { value: 'kids', label: 'Kids' },
  { value: 'couple', label: 'Couple' },
  { value: 'solo', label: 'Solo' },
  { value: 'friends', label: 'Friends' },
  { value: 'coworkers', label: 'Coworkers' },
];

const KIDS_AGE_GROUPS = [
  { value: '0-3', label: '0-3' },
  { value: '4-7', label: '4-7' },
  { value: '8-12', label: '8-12' },
  { value: '13-16', label: '13-16' },
];

const MOOD = [
  { value: 'CALM', label: 'Calm' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ROMANTIC', label: 'Romantic' },
  { value: 'ANY', label: 'Any' },
];

const TARGETS = [
  { value: 'events', label: 'Events' },
  { value: 'places', label: 'Places' },
  { value: 'both', label: 'Both' },
];

const TRANSPORT_MODES = [
  { value: 'WALK', label: 'Walk' },
  { value: 'PUBLIC', label: 'Public Transit' },
  { value: 'CAR', label: 'Car' },
  { value: 'BIKE', label: 'Bike' },
];

const INDOOR_OUTDOOR = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'any', label: 'Any' },
];

export {
  FILTER_TYPES,
  CITIES,
  CATS,
  DATES,
  BUDGET_TIERS,
  TIME_BUDGETS,
  COMPANY_TYPES,
  KIDS_AGE_GROUPS,
  MOOD,
  TARGETS,
  TRANSPORT_MODES,
  INDOOR_OUTDOOR,
};
