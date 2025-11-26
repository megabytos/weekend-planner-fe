import { Hourglass, MapPin, MoveRight, Tickets } from 'lucide-react';

import { fmtTime } from '@/utils/time';

export default function TimelineItem({ r }) {
  return (
    <div
      className={`border-l-4 pl-2 py-1 mb-1 ${
        r.kind === 'leg'
          ? 'border-blue'
          : r.kind === 'wait'
            ? 'border-orange'
            : 'border-gray'
      }`}
    >
      {r.kind === 'leg' && (
        <div className="flex gap-2 items-center">
          <MoveRight className="w-5 h-5 stroke-blue" />
          <div>
            Leg {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{' '}
            {Math.round(r.distanceKm * 10) / 10} km • {r.durationMin} min
          </div>
        </div>
      )}
      {r.kind === 'wait' && (
        <div className="flex gap-2 items-center">
          <Hourglass className="w-5 h-5 stroke-blue" />
          <div>
            Waiting {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{' '}
            {r.durationMin} min
          </div>
        </div>
      )}
      {r.kind === 'event_visit' && (
        <div className="flex gap-2 items-center">
          <Tickets className="w-5 h-5 stroke-blue" />{' '}
          <div>
            {r.status === 'missed'
              ? '(missed) '
              : r.status === 'late'
                ? '(late) '
                : ''}
            {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.name}
          </div>
        </div>
      )}
      {r.kind === 'place_visit' && (
        <div className="flex gap-2 items-center">
          <MapPin className="w-5 h-5 stroke-blue" />
          <div>
            {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.durationMin} min •{' '}
            {r.name}
          </div>
        </div>
      )}
    </div>
  );
}
