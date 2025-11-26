'use client';

import { useMemo, useState } from 'react';

import {
  CATEGORIES,
  EVENTS,
  KYIV,
  PLACES,
  defaultWindow,
  tonightRange,
} from '@/data/demo-data';
import { usePlannerLogic } from '@/hooks/use-planner-logic';
import { fmtTime } from '@/utils/time';

import Button from '../buttons/button';
import Map from '../map';
import CandidateFilters from './candidate-panel/candidate-filtters';
import CandidatePanel from './candidate-panel/candidate-panel';
import Timeline from './timeline/timeline';

export default function PlannerPrototype() {
  const [city] = useState('Kyiv');
  const [mode, setMode] = useState('walking');
  const [origin, setOrigin] = useState(KYIV);
  const [win, setWin] = useState(defaultWindow());

  const [filterType, setFilterType] = useState('both');
  const [query, setQuery] = useState('');

  const logic = usePlannerLogic({ origin, win, mode });

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

  return (
    <div className="max-w-[335px] md:max-w-[728px] lg:max-w-[1376px] w-full mx-auto relative">
      <h1 className="font-medium text-[16px] leading-6 lg:text-[28px] lg:mb-8">
        Planner
      </h1>
      <CandidateFilters
        mode={mode}
        setMode={setMode}
        win={win}
        setWin={setWin}
        filterType={filterType}
        setFilterType={setFilterType}
        query={query}
        setQuery={setQuery}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-4 md:flex-row lg:flex-row lg:gap-8">
          <CandidatePanel
            candidates={filteredCandidates}
            addCandidate={logic.addCandidate}
          />
          <div className="flex flex-col gap-4 md:w-[354px] lg:gap-4 lg:w-[408px]">
            <h1 className="font-medium text-[16px] leading-6 lg:text-[22px] lg:mb-8">
              Selected
            </h1>
            <div className=" max-h-[637px] overflow-auto">
              <div className="flex items-center gap-2">
                <Button
                  className="px-3 py-2 border border-blue rounded-xl text-blue hover:bg-blue-light"
                  onClick={logic.recalc}
                >
                  Recalculate
                </Button>
                <Button
                  className="px-3 py-2 border border-blue rounded-xl text-blue hover:bg-blue-light"
                  onClick={logic.optimize}
                >
                  Optimize order
                </Button>
                <div className="ml-auto">
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
          </div>
        </div>
        {/* Right: map mock */}
        <div>
          <div className="w-full h-[729px] rounded-xl relative overflow-hidden bg-[linear-gradient(45deg,-white,-white)]">
            <div className="absolute top-2 left-2 bg-white/90 rounded-xl shadow px-3 py-2 text-sm">
              Map (demo). Pin order matches timeline. Mode: {mode}
            </div>
            <Map origin={origin} items={logic.items} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );
}
