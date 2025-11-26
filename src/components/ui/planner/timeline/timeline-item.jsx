import { fmtTime } from "@/utils/time";

export default function TimelineItem({ r }) {
  return (
    <div
      className={`border-l-4 pl-2 py-1 mb-1 ${
        r.kind === "leg"
          ? "border-blue-500"
          : r.kind === "wait"
          ? "border-amber-500"
          : "border-emerald-500"
      }`}
    >
      {r.kind === "leg" && (
        <div>
          → Leg {fmtTime(r.start_at)} - {fmtTime(r.end_at)} •{" "}
          {Math.round(r.distanceKm * 10) / 10} km • {r.durationMin} min
        </div>
      )}
      {r.kind === "wait" && (
        <div>
          ⏳ Waiting {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.durationMin} min
        </div>
      )}
      {r.kind === "event_visit" && (
        <div>
          🎫{" "}
          {r.status === "missed" ? "(missed) " : r.status === "late" ? "(late) " : ""}
          {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.name}
        </div>
      )}
      {r.kind === "place_visit" && (
        <div>
          📍 {fmtTime(r.start_at)} - {fmtTime(r.end_at)} • {r.durationMin} min •{" "}
          {r.name}
        </div>
      )}
    </div>
  );
}
