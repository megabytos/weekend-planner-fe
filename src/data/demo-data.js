// -------------------- Demo Data --------------------
export const KYIV = { lat: 50.4501, lon: 30.5234 };
export const CATEGORIES = ["Food", "Cinema", "Museums", "Concerts", "With kids", "Walks"];

export const PLACES = [
  {
    id: "pl_1",
    name: "PinchukArtCentre",
    category: "Museums",
    geo: { lat: 50.4415, lon: 30.5227 },
    priceTier: 1,
    rating: 4.7,
    openNow: true,
    defaultStayMin: 90,
  },
  {
    id: "pl_2",
    name: "Zhovten Cinema",
    category: "Cinema",
    geo: { lat: 50.4633, lon: 30.5099 },
    priceTier: 2,
    rating: 4.6,
    openNow: true,
    defaultStayMin: 120,
  },
  {
    id: "pl_3",
    name: "Kyiv Zoo",
    category: "With kids",
    geo: { lat: 50.4547, lon: 30.4477 },
    priceTier: 2,
    rating: 4.4,
    openNow: false,
    defaultStayMin: 120,
  },
  {
    id: "pl_4",
    name: "SkyMall Food Court",
    category: "Food",
    geo: { lat: 50.4865, lon: 30.6001 },
    priceTier: 1,
    rating: 4.1,
    openNow: true,
    defaultStayMin: 60,
  },
  {
    id: "pl_5",
    name: "Mariinsky Park",
    category: "Walks",
    geo: { lat: 50.4456, lon: 30.5453 },
    priceTier: 0,
    rating: 4.8,
    openNow: true,
    defaultStayMin: 60,
  },
];

function defaultWindowLocal() {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setHours(end.getHours() + 6);
  return { from: start.toISOString(), to: end.toISOString() };
}
function tonightRangeLocal() {
  const now = new Date();
  const d = new Date(now);
  d.setHours(18, 0, 0, 0);
  const e = new Date(now);
  e.setHours(23, 0, 0, 0);
  if (e < now) {
    d.setDate(d.getDate() + 1);
    e.setDate(e.getDate() + 1);
  }
  return { from: d.toISOString(), to: e.toISOString() };
}

export function defaultWindow() {
  return defaultWindowLocal();
}
export function tonightRange() {
  return tonightRangeLocal();
}
export function tonight() {
  const t = tonightRangeLocal();
  return { from: t.from, to: t.to };
}

export const EVENTS = [
  {
    id: "ev_1",
    name: "Concert in Podil",
    category: "Concerts",
    place_id: "pl_5",
    geo: { lat: 50.465, lon: 30.516 },
    start_at: addMinutesLocal(new Date().toISOString(), 120),
    end_at: addMinutesLocal(new Date().toISOString(), 240),
    price: 300,
    popularity: 0.7,
  },
  {
    id: "ev_2",
    name: "Night of Museums",
    category: "Museums",
    place_id: "pl_1",
    geo: { lat: 50.4415, lon: 30.5227 },
    start_at: tonight().from,
    end_at: tonight().to,
    price: 200,
    popularity: 0.8,
  },
  {
    id: "ev_3",
    name: "Art-house film screening",
    category: "Cinema",
    place_id: "pl_2",
    geo: { lat: 50.4633, lon: 30.5099 },
    start_at: addMinutesLocal(new Date().toISOString(), 24 * 60),
    end_at: addMinutesLocal(new Date().toISOString(), 24 * 60 + 120),
    price: 250,
    popularity: 0.5,
  },
];

function addMinutesLocal(iso, minutes) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

export const SPEEDS = { walking: 4.5, cycling: 15, driving: 30 };
