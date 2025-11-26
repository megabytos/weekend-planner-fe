"use client";

import { useState, useMemo } from "react";
import CandidatePanel from "./candidate-panel/candidate-panel";
import Timeline from "./timeline/timeline";
import Map from "../map";
import { usePlannerLogic } from "@/hooks/use-planner-logic";
import { PLACES, EVENTS, CATEGORIES, KYIV, defaultWindow, tonightRange } from "@/data/demo-data";
import { fmtTime } from "@/utils/time";

export default function PlannerPrototype() {
  const [city] = useState("Kyiv");
  const [mode, setMode] = useState("walking");
  const [origin, setOrigin] = useState(KYIV);
  const [win, setWin] = useState(defaultWindow());

  const [filterType, setFilterType] = useState("both");
  const [query, setQuery] = useState("");

  const logic = usePlannerLogic({ origin, win, mode });

  const filteredCandidates = useMemo(() => {
    const res = [];
    if (filterType !== "events") {
      for (const p of PLACES) {
        if (
          query &&
          !`${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())
        )
          continue;
        res.push({
          type: "place",
          id: p.id,
          name: p.name,
          category: p.category,
          geo: p.geo,
          defaultStayMin: p.defaultStayMin,
        });
      }
    }
    if (filterType !== "places") {
      for (const e of EVENTS) {
        if (
          query &&
          !`${e.name} ${e.category}`.toLowerCase().includes(query.toLowerCase())
        )
          continue;
        res.push({
          type: "event",
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
      (a.type === "event") === (b.type === "event")
        ? a.name.localeCompare(b.name)
        : a.type === "event"
        ? -1
        : 1
    );
  }, [filterType, query]);

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4 p-4">
      <CandidatePanel
        filterType={filterType}
        setFilterType={setFilterType}
        query={query}
        setQuery={setQuery}
        candidates={filteredCandidates}
        addCandidate={logic.addCandidate}
        win={win}
        setWin={setWin}
        mode={mode}
        setMode={setMode}
      />

      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded bg-emerald-600 text-white"
            onClick={logic.recalc}
          >
            Recalculate
          </button>
          <button className="px-3 py-2 rounded border" onClick={logic.optimize}>
            Optimize order
          </button>
          <div className="ml-auto text-sm text-gray-600">
            Total: {logic.items.length} item(s)
          </div>
        </div>

        <Timeline
          items={logic.items}
          timeline={logic.timeline}
          metrics={logic.metrics}
          removeItem={logic.removeItem}
          moveDown={logic.moveDown}
          moveUp={logic.moveUp}
          updateStay={logic.updateStay}
          optimize={logic.optimize}
          recalc={logic.recalc}
          win={win}
        />
      </div>

      {/* Right: map mock */}
      <div className="col-span-4">
        <div className="w-full h-[78vh] border rounded relative overflow-hidden bg-[linear-gradient(45deg,#f6f6f6,#ffffff)]">
          <div className="absolute top-2 left-2 bg-white/90 rounded shadow px-3 py-2 text-sm">
            Map (demo). Pin order matches timeline. Mode: {mode}
          </div>
          <Map origin={origin} items={logic.items} mode={mode} />
        </div>
      </div>
    </div>
  );
}
