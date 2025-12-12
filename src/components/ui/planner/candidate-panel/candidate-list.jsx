'use client';

import { useState } from 'react';
import { CalendarFold } from 'lucide-react';

import Button from '../../buttons/button';
import StayTimeSelector from './stay-time-selector';

export default function CandidateList({
  candidates,
  addCandidate,
  lockedCityKey,
}) {
  const [stayTimes, setStayTimes] = useState({});

  const handleTimeChange = (candidateId, minutes) => {
    setStayTimes(prev => ({
      ...prev,
      [candidateId]: minutes,
    }));
  };

  const handleAddCandidate = (candidate) => {
    if (candidate.type === 'place') {
      const stayMin =
        stayTimes[candidate.id] ||
        candidate.defaultStayMin ||
        60;

      addCandidate({
        ...candidate,
        defaultStayMin: stayMin,
      });
    } else {
      addCandidate(candidate);
    }
  };

  const getCityKey = (city) => {
    if (!city) return null;
    if (city.id) return `id:${city.id}`;
    if (city.name) return `name:${city.name.toLowerCase()}`;
    return null;
  };

  const canAddCandidate = (candidate) => {
    if (!lockedCityKey) return true;
    return candidate.__cityKey === lockedCityKey;
  };

  const formatEventTime = (startAt, endAt) => {
    if (!startAt || !endAt) return 'No time info';

    try {
      const startDate = new Date(startAt);
      const endDate = new Date(endAt);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Invalid date';
      }

      const dateStr = startDate.toLocaleDateString();
      const startTime = startDate.toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      );
      const endTime = endDate.toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      );

      return `${dateStr}, ${startTime} — ${endTime}`;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="flex flex-col gap-4 max-h-[637px] overflow-auto md:w-[354px] lg:w-[408px] pr-2">
      {candidates.map(c => {
        const canAdd = canAddCandidate(c);

        return (
          <div
            key={`${c.type}_${c.id}`}
            className={`flex bg-white-dark rounded-xl p-2 justify-between items-center gap-2 ${
              !canAdd ? 'opacity-50' : ''
            }`}
          >
            <div className="flex flex-col flex-1">
              <div className="font-medium mb-4">
                {c.name}{' '}
                <span className="text-gray">({c.type})</span>

                {!canAdd && (
                  <span className="text-red text-sm ml-2">
                    (Different city)
                  </span>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <CalendarFold className="h-5 w-5" />

                <div className="font-light">
                  {c.type === 'event'
                    ? formatEventTime(c.start_at, c.end_at)
                    : c.type === 'place'
                    ? `rec. ${c.defaultStayMin} min`
                    : 'No time info'}
                </div>
              </div>

              {c.type === 'place' && (
                <div className="mt-2">
                  <StayTimeSelector
                    defaultMinutes={c.defaultStayMin || 60}
                    onTimeChange={(minutes) =>
                      handleTimeChange(c.id, minutes)
                    }
                  />
                </div>
              )}
            </div>

            <Button
              className={`text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light shrink-0 ${
                !canAdd ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!canAdd}
              onClick={() => canAdd && handleAddCandidate(c)}
            >
              Add to plan
            </Button>
          </div>
        );
      })}
    </div>
  );
}
