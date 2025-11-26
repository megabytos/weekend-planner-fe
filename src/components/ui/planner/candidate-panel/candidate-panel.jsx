import CandidateFilters from "./candidate-filtters";
import CandidateList from "./candidate-list";

export default function CandidatePanel({
  filterType,
  setFilterType,
  query,
  setQuery,
  candidates,
  addCandidate,
  win,
  setWin,
  mode,
  setMode,
}) {
  return (
    <div className="col-span-3 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Planner</h1>
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
      <CandidateList candidates={candidates} addCandidate={addCandidate} />
    </div>
  );
}
