import { useState, useEffect } from "react";
import { haversineKm, clamp } from "../utils/geo";
import { addMinutes, fmtTime } from "../utils/time";
import { SPEEDS } from "../data/demo-data";


export function usePlannerLogic({ origin, win, mode }) {
  const [items, setItems] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [metrics, setMetrics] = useState({
    distanceKm: 0,
    travelMin: 0,
    onSiteMin: 0,
    warnings: [],
  });

  function addCandidate(c) {
    if (c.type === "place") {
      setItems((prev) => [
        ...prev,
        {
          kind: "place_visit",
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
          kind: "event_visit",
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
    setItems((prev) => {
      if (i >= prev.length - 1) return prev;
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
          : it
      )
    );
  }

  function recalc() {
    const warnings = [];
    const speedKmh = SPEEDS[mode];
    const out = [];
    let cur = { lat: origin.lat, lon: origin.lon };
    let t = new Date(win.from).toISOString();
    let totalDist = 0;
    let totalTravel = 0;
    let totalStay = 0;

    const legTo = (toGeo) => {
      const distKm = haversineKm(
        { lat: cur.lat, lon: cur.lon },
        { lat: toGeo.lat, lon: toGeo.lon }
      );
      const durMin = Math.ceil((distKm / speedKmh) * 60);
      out.push({
        kind: "leg",
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

    items.forEach((it, idx) => {
      legTo(it.geo);
      if (it.kind === "event_visit") {
        const evStart = it.start_at;
        const evEnd = it.end_at;
        if (new Date(t) > new Date(evEnd)) {
          warnings.push(`Missed event "${it.name}" (by ${fmtTime(evEnd)})`);
          out.push({
            kind: "event_visit",
            name: it.name,
            status: "missed",
            start_at: evStart,
            end_at: evEnd,
          });
          t = evEnd;
        } else if (new Date(t) > new Date(evStart)) {
          const lateMin = Math.round(
            (new Date(t).getTime() - new Date(evStart).getTime()) / 60000
          );
          warnings.push(
            `Late to "${it.name}" by ${lateMin} min (starts at ${fmtTime(
              evStart
            )})`
          );
          out.push({
            kind: "event_visit",
            name: it.name,
            status: "late",
            start_at: t,
            end_at: evEnd,
          });
          totalStay += Math.max(
            0,
            Math.round((new Date(evEnd).getTime() - new Date(t).getTime()) / 60000)
          );
          t = evEnd;
        } else {
          const waitMin = Math.round(
            (new Date(evStart).getTime() - new Date(t).getTime()) / 60000
          );
          if (waitMin > 0) {
            out.push({
              kind: "wait",
              durationMin: waitMin,
              start_at: t,
              end_at: evStart,
            });
          }
          t = evStart;
          out.push({
            kind: "event_visit",
            name: it.name,
            status: "on_time",
            start_at: evStart,
            end_at: evEnd,
          });
          totalStay += Math.round(
            (new Date(evEnd).getTime() - new Date(evStart).getTime()) / 60000
          );
          t = evEnd;
        }
      } else if (it.kind === "place_visit") {
        const end = addMinutes(t, it.stayMin || 60);
        out.push({
          kind: "place_visit",
          name: it.name,
          start_at: t,
          end_at: end,
          durationMin: it.stayMin || 60,
        });
        totalStay += it.stayMin || 60;
        t = end;
      }
    });

    if (new Date(t) > new Date(win.to)) {
      warnings.push(`Plan goes beyond the day window (until ${fmtTime(win.to)})`);
    }

    setTimeline(out);
    setMetrics({
      distanceKm: Number(totalDist.toFixed(2)),
      travelMin: totalTravel,
      onSiteMin: totalStay,
      warnings,
    });
  }

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

  useEffect(() => {
    recalc();
  }, [items, win.from, win.to, mode, origin]);

  return {
    items,
    setItems,
    timeline,
    metrics,
    addCandidate,
    removeItem,
    moveUp,
    moveDown,
    updateStay,
    recalc,
    optimize,
  };
}
