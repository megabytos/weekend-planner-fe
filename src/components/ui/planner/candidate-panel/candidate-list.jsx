export default function CandidateList({ candidates, addCandidate }) {
    return (
      <div className="border rounded p-2 max-h-[52vh] overflow-auto">
        {candidates.map((c) => (
          <div
            key={c.type + "_" + c.id}
            className="border-b py-2 text-sm flex justify-between"
          >
            <div>
              <div className="font-medium">
                {c.name} <span className="text-gray-500">({c.type})</span>
              </div>
              <div className="text-gray-600">
                {c.type === "event"
                  ? `${new Date(c.start_at).toLocaleString()} — ${new Date(
                      c.end_at
                    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : `rec. ${c.defaultStayMin} min`}{" "}
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
    );
  }
  