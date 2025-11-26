import TimelineItem from "../timeline/timeline-item";
import { fmtTime } from "@/utils/time";

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
                  {it.kind === "event_visit" ? "Event: " : "Place: "}
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
              {it.kind === "event_visit" ? (
                <div className="text-gray-600">
                  {new Date(it.start_at).toLocaleString()} -{" "}
                  {new Date(it.end_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
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
                  />{" "}
                  min
                </div>
              )}
            </div>
          ))}

          <div className="h-px bg-gray-200 my-3" />

          {/* Calculated timeline (legs + visits) */}
          <div className="text-gray-600 mb-1">Calculation (legs and visits):</div>
          {timeline.length === 0 && (
            <div className="text-gray-500">Add items and press "Recalculate"</div>
          )}
          {timeline.map((r, i) => (
            <TimelineItem r={r} key={i} />
          ))}
        </div>

        <div className="col-span-1 border rounded p-2">
          <div className="text-sm font-semibold mb-2">Summary</div>
          <div className="text-sm">Distance: {metrics.distanceKm} km</div>
          <div className="text-sm">On the way: {metrics.travelMin} min</div>
          <div className="text-sm">On site: {metrics.onSiteMin} min</div>
          {metrics.warnings.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-semibold text-amber-700">Warnings</div>
              <ul className="list-disc pl-5 text-sm text-amber-700">
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
