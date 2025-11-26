export function fmtTime(d) {
    return new Date(d).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  export function addMinutes(iso, minutes) {
    return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
  }
  