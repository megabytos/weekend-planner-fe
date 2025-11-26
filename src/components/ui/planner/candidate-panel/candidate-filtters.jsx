import { defaultWindow, tonightRange } from "@/data/demo-data";

export default function CandidateFilters({
  mode,
  setMode,
  win,
  setWin,
  filterType,
  setFilterType,
  query,
  setQuery,
}) {
  return (
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

      <div className="flex gap-2 items-center col-span-2">
        <div className="text-sm text-gray-600">Candidates</div>
        <div className="ml-auto flex gap-2">
          {["both", "places", "events"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-1 border rounded text-sm ${filterType === t ? "bg-black text-white" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="search candidates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
