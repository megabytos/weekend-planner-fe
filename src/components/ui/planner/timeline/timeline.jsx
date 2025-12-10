import { CalendarFold, ChevronDown, ChevronUp } from 'lucide-react';

import { fmtTime } from '@/utils/time';

import Button from '../../buttons/button';
import TimelineItem from '../timeline/timeline-item';

export default function Timeline({
  items,
  timeline,
  metrics,
  removeItem,
  moveDown,
  moveUp,
  updateStay,
  optimize,
  recalc,
  win,
}) {
  return (
    <>
      <div className="text-medium">
        <div className="flex flex-col gap-4 md:w-[354px] lg:gap-4 lg:w-[408px]">
          <div className="font-medium mt-8">
            Timeline (window {fmtTime(win.from)} - {fmtTime(win.to)})
          </div>

          {/* Planned visits (editable) */}
          {items.map((it, idx) => (
            <div
              key={idx}
              className="flex bg-white-dark rounded-xl p-2 justify-between items-center"
            >
              <div className="flex-col items-center">
                <div className="font-medium mb-4">
                  {it.kind === 'event_visit' ? 'Event: ' : 'Place: '}
                  {it.name}
                </div>
                <div className="flex gap-2 items-center">
                  <CalendarFold className="h-5 w-5" />
                  {it.kind === 'event_visit' ? (
                    <div className="font-light">
                      {it.start_at && it.end_at ? (() => {
                        const startDate = new Date(it.start_at);
                        const endDate = new Date(it.end_at);
                        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                          return 'Invalid date';
                        }
                        return `${startDate.toLocaleString()} - ${endDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`;
                      })() : 'No time info'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>Duration:</span>
                      <span
                        className="font-light">
                        {it.stayMin ?? 60} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  className="border border-blue rounded-xl px-1 py-1 hover:bg-blue-light"
                  onClick={() => moveUp(idx)}
                >
                  <ChevronUp className="w-5 h-5 stroke-blue" />
                </Button>
                <Button
                  className="border border-blue rounded-xl px-1 py-1 hover:bg-blue-light"
                  onClick={() => moveDown(idx)}
                >
                  <ChevronDown className="w-5 h-5 stroke-blue" />
                </Button>
                <Button
                  className="text-blue border border-blue rounded-xl px-1 py-1 hover:bg-blue-light"
                  onClick={() => removeItem(idx)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          <div className="h-0.5 bg-gray-200 my-3" />

          {/* Calculated timeline (legs + visits) */}
          <div className="font-medium mb-1">Calculation (legs and visits):</div>
          {timeline.length === 0 && (
            <div className="text-gray-500">
              Add items and press "Recalculate"
            </div>
          )}
          {timeline.map((r, i) => (
            <TimelineItem r={r} key={i} />
          ))}
        </div>

        <div className="col-span-1 border rounded p-2">
          <div className="text-sm font-medium mb-2">Summary</div>
          <div className="text-sm">Distance: {metrics.distanceKm} km</div>
          <div className="text-sm">On the way: {metrics.travelMin} min</div>
          <div className="text-sm">On site: {metrics.onSiteMin} min</div>
          {metrics.warnings.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium text-pink">Warnings</div>
              <ul className="list-disc pl-5 text-sm text-pink">
                {metrics.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
