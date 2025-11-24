'use client';

import { useEffect, useMemo, useState } from 'react';

const R_EARTH_KM = 6371;
function haversineKm(a, b) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R_EARTH_KM * Math.asin(Math.sqrt(x));
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
function addMinutes(iso, minutes) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// speeds (km/h)
const SPEEDS = { walking: 4.5, cycling: 15, driving: 30 };

// Time presets
function defaultWindow() {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setHours(end.getHours() + 6);
  return { from: start.toISOString(), to: end.toISOString() };
}
function tonightRange() {
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

// -------------------- Demo Data --------------------
const KYIV = { lat: 50.4501, lon: 30.5234 };
const CATEGORIES = [
  'Food',
  'Cinema',
  'Museums',
  'Concerts',
  'With kids',
  'Walks',
];
const PLACES = [
  {
    id: 'pl_1',
    name: 'PinchukArtCentre',
    category: 'Museums',
    geo: { lat: 50.4415, lon: 30.5227 },
    priceTier: 1,
    rating: 4.7,
    openNow: true,
    defaultStayMin: 90,
  },
  {
    id: 'pl_2',
    name: 'Zhovten Cinema',
    category: 'Cinema',
    geo: { lat: 50.4633, lon: 30.5099 },
    priceTier: 2,
    rating: 4.6,
    openNow: true,
    defaultStayMin: 120,
  },
  {
    id: 'pl_3',
    name: 'Kyiv Zoo',
    category: 'With kids',
    geo: { lat: 50.4547, lon: 30.4477 },
    priceTier: 2,
    rating: 4.4,
    openNow: false,
    defaultStayMin: 120,
  },
  {
    id: 'pl_4',
    name: 'SkyMall Food Court',
    category: 'Food',
    geo: { lat: 50.4865, lon: 30.6001 },
    priceTier: 1,
    rating: 4.1,
    openNow: true,
    defaultStayMin: 60,
  },
  {
    id: 'pl_5',
    name: 'Mariinsky Park',
    category: 'Walks',
    geo: { lat: 50.4456, lon: 30.5453 },
    priceTier: 0,
    rating: 4.8,
    openNow: true,
    defaultStayMin: 60,
  },
];

function tonight() {
  const t = tonightRange();
  return { from: t.from, to: t.to };
}

const EVENTS = [
  {
    id: 'ev_1',
    name: 'Concert in Podil',
    category: 'Concerts',
    place_id: 'pl_5',
    geo: { lat: 50.465, lon: 30.516 },
    start_at: addMinutes(new Date().toISOString(), 120),
    end_at: addMinutes(new Date().toISOString(), 240),
    price: 300,
    popularity: 0.7,
  },
  {
    id: 'ev_2',
    name: 'Night of Museums',
    category: 'Museums',
    place_id: 'pl_1',
    geo: { lat: 50.4415, lon: 30.5227 },
    start_at: tonight().from,
    end_at: tonight().to,
    price: 200,
    popularity: 0.8,
  },
  {
    id: 'ev_3',
    name: 'Art-house film screening',
    category: 'Cinema',
    place_id: 'pl_2',
    geo: { lat: 50.4633, lon: 30.5099 },
    start_at: addMinutes(new Date().toISOString(), 24 * 60),
    end_at: addMinutes(new Date().toISOString(), 24 * 60 + 120),
    price: 250,
    popularity: 0.5,
  },
];

// -------------------- Main Component --------------------
export default function PlannerPrototype() {
  // Day context
  const [city] = useState('Kyiv');
  const [mode, setMode] = useState('walking');
  const [origin, setOrigin] = useState(KYIV);
  const [win, setWin] = useState(defaultWindow());

  // Candidates and filters on the left
  const [filterType, setFilterType] = useState('both');
  const [query, setQuery] = useState('');
  const filteredCandidates = useMemo(() => {
    const res = [];
    if (filterType !== 'events') {
      for (const p of PLACES) {
        if (
          query &&
          !`${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())
        )
          continue;
        res.push({
          type: 'place',
          id: p.id,
          name: p.name,
          category: p.category,
          geo: p.geo,
          defaultStayMin: p.defaultStayMin,
        });
      }
    }
    if (filterType !== 'places') {
      for (const e of EVENTS) {
        if (
          query &&
          !`${e.name} ${e.category}`.toLowerCase().includes(query.toLowerCase())
        )
          continue;
        res.push({
          type: 'event',
          id: e.id,
          name: e.name,
          category: e.category,
          geo: e.geo,
          start_at: e.start_at,
          end_at: e.end_at,
          place_id: e.place_id,
        });
      }
    }
    return res.sort((a, b) =>
      (a.type === 'event') === (b.type === 'event')
        ? a.name.localeCompare(b.name)
        : a.type === 'event'
          ? -1
          : 1,
    );
  }, [filterType, query]);

  // Plan: only visits, travel is displayed as separate rows on the timeline
  const [items, setItems] = useState([]); // [{id, type:'place'|'event', ref_id, name, geo, stayMin?}]

  function addCandidate(c) {
    if (c.type === 'place') {
      setItems((prev) => [
        ...prev,
        {
          kind: 'place_visit',
          ref_id: c.id,
          name: c.name,
          geo: c.geo,
          stayMin: c.defaultStayMin,
        },
      ]);
    } else {
      setItems((prev) => [
        ...prev,
        {
          kind: 'event_visit',
          ref_id: c.id,
          name: c.name,
          geo: c.geo,
          start_at: c.start_at,
          end_at: c.end_at,
        },
      ]);
    }
  }
  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveUp(i) {
    if (i <= 0) return;
    setItems((prev) => {
      const a = [...prev];
      [a[i - 1], a[i]] = [a[i], a[i - 1]];
      return a;
    });
  }
  function moveDown(i) {
    if (i >= items.length - 1) return;
    setItems((prev) => {
      const a = [...prev];
      [a[i + 1], a[i]] = [a[i], a[i + 1]];
      return a;
    });
  }
  function updateStay(i, minutes) {
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, stayMin: clamp(Number(minutes) || 60, 15, 300) }
          : it,
      ),
    );
  }

  // Timeline + route calculation (simplified, without external OSRM)
  const [timeline, setTimeline] = useState([]); // rows: leg|visit with times
  const [metrics, setMetrics] = useState({
    distanceKm: 0,
    travelMin: 0,
    onSiteMin: 0,
    warnings: [],
  });

  function recalc() {
    const warnings = [];
    const speedKmh = SPEEDS[mode];
    const out = [];
    let cur = { lat: origin.lat, lon: origin.lon };
    let t = new Date(win.from).toISOString();
    let totalDist = 0;
    let totalTravel = 0;
    let totalStay = 0;

    // Helper for leg
    const legTo = (toGeo) => {
      const distKm = haversineKm(
        { lat: cur.lat, lon: cur.lon },
        { lat: toGeo.lat, lon: toGeo.lon },
      );
      const durMin = Math.ceil((distKm / speedKmh) * 60);
      out.push({
        kind: 'leg',
        distanceKm: distKm,
        durationMin: durMin,
        start_at: t,
        end_at: addMinutes(t, durMin),
      });
      totalDist += distKm;
      totalTravel += durMin;
      t = addMinutes(t, durMin);
      cur = { ...toGeo };
    };

    // Iterate items in current order
    items.forEach((it, idx) => {
      // leg to the point
      legTo(it.geo);
      if (it.kind === 'event_visit') {
        const evStart = it.start_at;
        const evEnd = it.end_at;
        if (new Date(t) > new Date(evEnd)) {
          warnings.push(`Missed event "${it.name}" (by ${fmtTime(evEnd)})`);
          out.push({
            kind: 'event_visit',
            name: it.name,
            status: 'missed',
            start_at: evStart,
            end_at: evEnd,
          });
          t = evEnd; // move time marker to the actual end of the event
        } else if (new Date(t) > new Date(evStart)) {
          const lateMin = Math.round(
            (new Date(t).getTime() - new Date(evStart).getTime()) / 60000,
          );
          warnings.push(
            `Late to "${it.name}" by ${lateMin} min (starts at ${fmtTime(evStart)})`,
          );
          out.push({
            kind: 'event_visit',
            name: it.name,
            status: 'late',
            start_at: t,
            end_at: evEnd,
          });
          totalStay += Math.max(
            0,
            Math.round(
              (new Date(evEnd).getTime() - new Date(t).getTime()) / 60000,
            ),
          );
          t = evEnd;
        } else {
          // there is waiting time before the start
          const waitMin = Math.round(
            (new Date(evStart).getTime() - new Date(t).getTime()) / 60000,
          );
          if (waitMin > 0) {
            out.push({
              kind: 'wait',
              durationMin: waitMin,
              start_at: t,
              end_at: evStart,
            });
          }
          t = evStart;
          out.push({
            kind: 'event_visit',
            name: it.name,
            status: 'on_time',
            start_at: evStart,
            end_at: evEnd,
          });
          totalStay += Math.round(
            (new Date(evEnd).getTime() - new Date(evStart).getTime()) / 60000,
          );
          t = evEnd;
        }
      } else if (it.kind === 'place_visit') {
        // flexible duration
        const end = addMinutes(t, it.stayMin || 60);
        out.push({
          kind: 'place_visit',
          name: it.name,
          start_at: t,
          end_at: end,
          durationMin: it.stayMin || 60,
        });
        totalStay += it.stayMin || 60;
        t = end;
      }
    });

    // Check day window
    if (new Date(t) > new Date(win.to)) {
      warnings.push(
        `Plan goes beyond the day window (until ${fmtTime(win.to)})`,
      );
    }

    setTimeline(out);
    setMetrics({
      distanceKm: Number(totalDist.toFixed(2)),
      travelMin: totalTravel,
      onSiteMin: totalStay,
      warnings,
    });
  }

  // Greedy distance-based order optimization (very simplified)
  function optimize() {
    if (items.length <= 2) {
      return;
    }
    const remaining = items.map((x, i) => ({ ...x, _i: i }));
    const route = [];
    let cur = origin;
    while (remaining.length) {
      let bestIdx = 0;
      let bestD = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const d = haversineKm(cur, remaining[i].geo);
        if (d < bestD) {
          bestD = d;
          bestIdx = i;
        }
      }
      const [next] = remaining.splice(bestIdx, 1);
      route.push(next);
      cur = next.geo;
    }
    setItems(route);
  }

  // Recalculate on changes
  useEffect(() => {
    recalc();
  }, [items, win.from, win.to, mode, origin]);

  // Projection to "map" (demo, non-geodesic)
  function project(pt) {
    const latMin = 50.4,
      latMax = 50.52,
      lonMin = 30.45,
      lonMax = 30.6;
    const x = (pt.lon - lonMin) / (lonMax - lonMin);
    const y = 1 - (pt.lat - latMin) / (latMax - latMin);
    return { x, y };
  }

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4 p-4">
      {/* Left: candidates */}
      <div className="col-span-3 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Planner</h1>
        <div className="grid grid-cols-2 gap-2 text-sm items-center border rounded p-3">
          <label>Mode</label>
          <select
            className="border rounded px-2 py-1"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="walking">On foot</option>
            <option value="cycling">Bicycle</option>
            <option value="driving">Car</option>
          </select>
          <label>Day window</label>
          <div className="flex gap-1 flex-col">
            <input
              type="datetime-local"
              className="border rounded px-2 py-1"
              value={new Date(win.from).toISOString().slice(0, 16)}
              onChange={(e) =>
                setWin((w) => ({
                  ...w,
                  from: new Date(e.target.value).toISOString(),
                }))
              }
            />
            <input
              type="datetime-local"
              className="border rounded px-2 py-1"
              value={new Date(win.to).toISOString().slice(0, 16)}
              onChange={(e) =>
                setWin((w) => ({
                  ...w,
                  to: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>
          <label>Quick</label>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setWin(defaultWindow())}
            >
              +6 hours
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setWin(tonightRange())}
            >
              Evening
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="text-sm text-gray-600">Candidates</div>
          <div className="ml-auto flex gap-2">
            {['both', 'places', 'events'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-1 border rounded text-sm ${filterType === t ? 'bg-black text-white' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <input
          className="border rounded px-2 py-1"
          placeholder="search candidates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="border rounded p-2 max-h-[52vh] overflow-auto">
          {filteredCandidates.map((c) => (
            <div
              key={c.type + '_' + c.id}
              className="border-b py-2 text-sm flex justify-between"
            >
              <div>
                <div className="font-medium">
                  {c.name} <span className="text-gray-500">({c.type})</span>
                </div>
                <div className="text-gray-600">
                  {c.type === 'event'
                    ? `${new Date(c.start_at).toLocaleString()} — ${new Date(c.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : `rec. ${c.defaultStayMin} min`}{' '}
                </div>
              </div>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => addCandidate(c)}
              >
                Add to plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: timeline */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded bg-emerald-600 text-white"
            onClick={recalc}
          >
            Recalculate
          </button>
          <button className="px-3 py-2 rounded border" onClick={optimize}>
            Optimize order
          </button>
          <div className="ml-auto text-sm text-gray-600">
            Total: {items.length} item(s)
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-2 border rounded p-2 max-h-[64vh] overflow-auto">
            <div className="text-gray-600 mb-2">
              Timeline (window {fmtTime(win.from)} - {fmtTime(win.to)})
            </div>
            {/* Planned visits (editable) */}
            {items.map((it, idx) => (
              <div key={idx} className="border rounded p-2 mb-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {it.kind === 'event_visit' ? 'Event: ' : 'Place: '}
                    {it.name}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => moveUp(idx)}
                    >
                      ↑
                    </button>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => moveDown(idx)}
                    >
                      ↓
                    </button>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => removeItem(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {it.kind === 'event_visit' ? (
                  <div className="text-gray-600">
                    {new Date(it.start_at).toLocaleString()} -{' '}
                    {new Date(it.end_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    Duration:
                    <input
                      type="number"
                      min={15}
                      max={300}
                      className="border rounded px-2 py-1 w-24"
                      value={it.stayMin || 60}
                      onChange={(e) => updateStay(idx, e.target.value)}
                    />{' '}
                    min
                  </div>
                )}
              </div>
            ))}

            <div className="h-px bg-gray-200 my-3" />

            {/* Calculated timeline (legs + visits) */}
            <div className="text-gray-600 mb-1">
              Calculation (legs and visits):
            </div>
            {timeline.length === 0 && (
              <div className="text-gray-500">
                Add items and press "Recalculate"
              </div>
            )}
            {timeline.map((r, i) => (
              <div
                key={i}
                className={`border-l-4 pl-2 py-1 mb-1 ${r.kind === 'leg' ? 'border-blue-500' : r.kind === 'wait' ? 'border-amber-500' : 'border-emerald-500'}`}
              >
                {r.kind === 'leg' && (
                  <div>
                    → Leg {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{' '}
                    {Math.round(r.distanceKm * 10) / 10} km • {r.durationMin}{' '}
                    min
                  </div>
                )}
                {r.kind === 'wait' && (
                  <div>
                    ⏳ Waiting {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{' '}
                    {r.durationMin} min
                  </div>
                )}
                {r.kind === 'event_visit' && (
                  <div>
                    🎫{' '}
                    {r.status === 'missed'
                      ? '(missed) '
                      : r.status === 'late'
                        ? '(late) '
                        : ''}
                    {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.name}
                  </div>
                )}
                {r.kind === 'place_visit' && (
                  <div>
                    📍 {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{' '}
                    {r.durationMin} min • {r.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="col-span-1 border rounded p-2">
            <div className="text-sm font-semibold mb-2">Summary</div>
            <div className="text-sm">Distance: {metrics.distanceKm} km</div>
            <div className="text-sm">On the way: {metrics.travelMin} min</div>
            <div className="text-sm">On site: {metrics.onSiteMin} min</div>
            {metrics.warnings.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-semibold text-amber-700">
                  Warnings
                </div>
                <ul className="list-disc pl-5 text-sm text-amber-700">
                  {metrics.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: map mock */}
      <div className="col-span-4">
        <div className="w-full h-[78vh] border rounded relative overflow-hidden bg-[linear-gradient(45deg,#f6f6f6,#ffffff)]">
          <div className="absolute top-2 left-2 bg-white/90 rounded shadow px-3 py-2 text-sm">
            Map (demo). Pin order matches timeline. Mode: {mode}
          </div>
          {/* Route polyline */}
          <RoutePolyline origin={origin} items={items} project={project} />
          {/* Pins */}
          <Pins origin={origin} items={items} project={project} />
        </div>
      </div>
    </div>
  );
}

function Pins({ origin, items, project }) {
  const all = [
    { name: 'Start', geo: origin },
    ...items.map((x) => ({ name: x.name, geo: x.geo })),
  ];
  return (
    <>
      {all.map((p, i) => {
        const { x, y } = project(p.geo);
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              transform: 'translate(-50%,-100%)',
            }}
          >
            <div
              className={`px-2 py-1 text-xs rounded ${i === 0 ? 'bg-gray-700' : 'bg-rose-600'} text-white shadow`}
            >
              {i === 0 ? 'Start' : i}
            </div>
            <div
              className={`w-0 h-0 border-l-4 border-r-4 border-t-8 ${i === 0 ? 'border-t-gray-700' : 'border-t-rose-600'} border-l-transparent border-r-transparent mx-auto`}
            />
          </div>
        );
      })}
    </>
  );
}

function RoutePolyline({ origin, items, project }) {
  if (!items || items.length === 0) return null;
  const pts = [origin, ...items.map((x) => x.geo)];
  const path = pts.map((pt) => project(pt));
  // render as a polyline made from div segments
  return (
    <>
      {path.slice(0, -1).map((p, i) => {
        const q = path[i + 1];
        const x1 = p.x * 100,
          y1 = p.y * 100,
          x2 = q.x * 100,
          y2 = q.y * 100;
        const dx = x2 - x1,
          dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <div
            key={i}
            className="absolute bg-blue-600/60"
            style={{
              left: `${x1}%`,
              top: `${y1}%`,
              width: `${len}%`,
              height: 2,
              transform: `rotate(${ang}deg)`,
              transformOrigin: '0 0',
            }}
          />
        );
      })}
    </>
  );
}
