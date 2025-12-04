import { CalendarFold } from 'lucide-react';

import Button from '../../buttons/button';

export default function CandidateList({ candidates, addCandidate }) {
  return (
    <div className="flex flex-col gap-4 max-h-[637px] overflow-auto md:w-[354px] lg:gap-4 lg:w-[408px] pr-2 ">
      {candidates.map((c) => (
        <div
          key={c.type + '_' + c.id}
          className="flex bg-white-dark rounded-xl p-2 justify-between items-center"
        >
          <div className="flex-col">
            <div className="font-medium mb-4">
              {c.name} <span className="text-gray">({c.type})</span>
            </div>
            <div className="flex gap-2 items-center">
              <CalendarFold className="h-5 w-5" />
              <div className="font-light">
                {c.type === 'event'
                  ? `${new Date(c.start_at).toLocaleString()} — ${new Date(
                      c.end_at,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : `rec. ${c.defaultStayMin} min`}{' '}
              </div>
            </div>
          </div>
          <Button
            className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light"
            onClick={() => addCandidate(c)}
          >
            Add to plan
          </Button>
        </div>
      ))}
    </div>
  );
}
