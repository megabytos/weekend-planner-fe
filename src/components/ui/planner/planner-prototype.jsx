'use client';

import { useEffect, useMemo, useState } from 'react';

/*
  WeekendPlanner — Planner Prototype (Interactive)
  ------------------------------------------------
  Что можно делать:
  - Выбирать окно дня, режим перемещения и точку старта
  - Добавлять места/события в план (слева панель кандидатов)
  - Менять порядок (стрелки ↑↓), задавать длительность визита для мест
  - Нажимать "Пересчитать" для обновления таймлайна и маршрута
  - Нажимать "Оптимизировать порядок" для жадной сортировки по расстоянию
  - Смотреть карту справа: пины в порядке посещения + ломаная линия
  - Видеть предупреждения: опоздание на событие, пропущенное событие и т.п.
*/

// -------------------- Utils --------------------
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

// speeds (км/ч)
const SPEEDS = { walking: 4.5, cycling: 15, driving: 30 };

// Временные пресеты
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
const CATEGORIES = ['Еда', 'Кино', 'Музеи', 'Концерты', 'С детьми', 'Прогулки'];
const PLACES = [
  {
    id: 'pl_1',
    name: 'PinchukArtCentre',
    category: 'Музеи',
    geo: { lat: 50.4415, lon: 30.5227 },
    priceTier: 1,
    rating: 4.7,
    openNow: true,
    defaultStayMin: 90,
  },
  {
    id: 'pl_2',
    name: 'Кинотеатр Жовтень',
    category: 'Кино',
    geo: { lat: 50.4633, lon: 30.5099 },
    priceTier: 2,
    rating: 4.6,
    openNow: true,
    defaultStayMin: 120,
  },
  {
    id: 'pl_3',
    name: 'Киевский зоопарк',
    category: 'С детьми',
    geo: { lat: 50.4547, lon: 30.4477 },
    priceTier: 2,
    rating: 4.4,
    openNow: false,
    defaultStayMin: 120,
  },
  {
    id: 'pl_4',
    name: 'SkyMall Food Court',
    category: 'Еда',
    geo: { lat: 50.4865, lon: 30.6001 },
    priceTier: 1,
    rating: 4.1,
    openNow: true,
    defaultStayMin: 60,
  },
  {
    id: 'pl_5',
    name: 'Mariinsky Park',
    category: 'Прогулки',
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
    name: 'Концерт на Подоле',
    category: 'Концерты',
    place_id: 'pl_5',
    geo: { lat: 50.465, lon: 30.516 },
    start_at: addMinutes(new Date().toISOString(), 120),
    end_at: addMinutes(new Date().toISOString(), 240),
    price: 300,
    popularity: 0.7,
  },
  {
    id: 'ev_2',
    name: 'Ночь музеев',
    category: 'Музеи',
    place_id: 'pl_1',
    geo: { lat: 50.4415, lon: 30.5227 },
    start_at: tonight().from,
    end_at: tonight().to,
    price: 200,
    popularity: 0.8,
  },
  {
    id: 'ev_3',
    name: 'Показ авторского кино',
    category: 'Кино',
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
  // Контекст дня
  const [city] = useState('Kyiv');
  const [mode, setMode] = useState('walking');
  const [origin, setOrigin] = useState(KYIV);
  const [win, setWin] = useState(defaultWindow());

  // Кандидаты и фильтры слева
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

  // План: только визиты, дорога отображается как отдельные строки на таймлайне
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

  // Расчёт таймлайна + маршрута (упрощённо, без внешнего OSRM)
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
      // дорога до пункта
      legTo(it.geo);
      if (it.kind === 'event_visit') {
        const evStart = it.start_at;
        const evEnd = it.end_at;
        if (new Date(t) > new Date(evEnd)) {
          warnings.push(`Пропущено событие «${it.name}» (к ${fmtTime(evEnd)})`);
          out.push({
            kind: 'event_visit',
            name: it.name,
            status: 'missed',
            start_at: evStart,
            end_at: evEnd,
          });
          t = evEnd; // двигаем маркер времени к фактическому концу события
        } else if (new Date(t) > new Date(evStart)) {
          const lateMin = Math.round(
            (new Date(t).getTime() - new Date(evStart).getTime()) / 60000,
          );
          warnings.push(
            `Опоздание на «${it.name}» на ${lateMin} мин (начало ${fmtTime(evStart)})`,
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
          // есть ожидание до начала
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
        // гибкая длительность
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

    // Проверка окна дня
    if (new Date(t) > new Date(win.to)) {
      warnings.push(`План выходит за пределы окна дня (до ${fmtTime(win.to)})`);
    }

    setTimeline(out);
    setMetrics({
      distanceKm: Number(totalDist.toFixed(2)),
      travelMin: totalTravel,
      onSiteMin: totalStay,
      warnings,
    });
  }

  // Жадная оптимизация порядка по расстоянию (очень упрощённо)
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

  // Пересчёт при изменениях
  useEffect(() => {
    recalc();
  }, [items, win.from, win.to, mode, origin]);

  // Проекция на "карту" (демо, не геодезическая)
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
        <h1 className="text-2xl font-semibold">Планировщик — WeekendPlanner</h1>
        <div className="grid grid-cols-2 gap-2 text-sm items-center border rounded p-3">
          <label>Режим</label>
          <select
            className="border rounded px-2 py-1"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="walking">Пешком</option>
            <option value="cycling">Велосипед</option>
            <option value="driving">Авто</option>
          </select>
          <label>Окно дня</label>
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
          <label>Быстро</label>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setWin(defaultWindow())}
            >
              +6 часов
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setWin(tonightRange())}
            >
              Вечер
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="text-sm text-gray-600">Кандидаты</div>
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
          placeholder="поиск по кандидатам"
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
                    : `рек. ${c.defaultStayMin} мин`}{' '}
                </div>
              </div>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => addCandidate(c)}
              >
                В план
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
            Пересчитать
          </button>
          <button className="px-3 py-2 rounded border" onClick={optimize}>
            Оптимизировать порядок
          </button>
          <div className="ml-auto text-sm text-gray-600">
            Всего: {items.length} пункт(ов)
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-2 border rounded p-2 max-h-[64vh] overflow-auto">
            <div className="text-gray-600 mb-2">
              Таймлайн (окно {fmtTime(win.from)}–{fmtTime(win.to)})
            </div>
            {/* Плановые визиты (редактируемые) */}
            {items.map((it, idx) => (
              <div key={idx} className="border rounded p-2 mb-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {it.kind === 'event_visit' ? 'Событие: ' : 'Место: '}
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
                      Удалить
                    </button>
                  </div>
                </div>
                {it.kind === 'event_visit' ? (
                  <div className="text-gray-600">
                    {new Date(it.start_at).toLocaleString()} –{' '}
                    {new Date(it.end_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    Длительность:
                    <input
                      type="number"
                      min={15}
                      max={300}
                      className="border rounded px-2 py-1 w-24"
                      value={it.stayMin || 60}
                      onChange={(e) => updateStay(idx, e.target.value)}
                    />{' '}
                    мин
                  </div>
                )}
              </div>
            ))}

            <div className="h-px bg-gray-200 my-3" />

            {/* Вычисленный таймлайн (дороги + визиты) */}
            <div className="text-gray-600 mb-1">Расчёт (дороги и визиты):</div>
            {timeline.length === 0 && (
              <div className="text-gray-500">
                Добавьте пункты и нажмите «Пересчитать»
              </div>
            )}
            {timeline.map((r, i) => (
              <div
                key={i}
                className={`border-l-4 pl-2 py-1 mb-1 ${r.kind === 'leg' ? 'border-blue-500' : r.kind === 'wait' ? 'border-amber-500' : 'border-emerald-500'}`}
              >
                {r.kind === 'leg' && (
                  <div>
                    → Переход {fmtTime(r.start_at)}–{fmtTime(r.end_at)} •{' '}
                    {Math.round(r.distanceKm * 10) / 10} км • {r.durationMin}{' '}
                    мин
                  </div>
                )}
                {r.kind === 'wait' && (
                  <div>
                    ⏳ Ожидание {fmtTime(r.start_at)}–{fmtTime(r.end_at)} •{' '}
                    {r.durationMin} мин
                  </div>
                )}
                {r.kind === 'event_visit' && (
                  <div>
                    🎫{' '}
                    {r.status === 'missed'
                      ? '(пропущено) '
                      : r.status === 'late'
                        ? '(опоздание) '
                        : ''}
                    {fmtTime(r.start_at)}–{fmtTime(r.end_at)} • {r.name}
                  </div>
                )}
                {r.kind === 'place_visit' && (
                  <div>
                    📍 {fmtTime(r.start_at)}–{fmtTime(r.end_at)} •{' '}
                    {r.durationMin} мин • {r.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="col-span-1 border rounded p-2">
            <div className="text-sm font-semibold mb-2">Сводка</div>
            <div className="text-sm">Дистанция: {metrics.distanceKm} км</div>
            <div className="text-sm">В дороге: {metrics.travelMin} мин</div>
            <div className="text-sm">На местах: {metrics.onSiteMin} мин</div>
            {metrics.warnings.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-semibold text-amber-700">
                  Предупреждения
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
            Карта (демо). Порядок пинов соответствует таймлайну. Режим: {mode}
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
    { name: 'Старт', geo: origin },
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
  // рендерим как многоугольник из дивов-отрезков
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
