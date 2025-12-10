export function fmtTime(d) {
    if (!d) return 'N/A';
    const date = new Date(d);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  export function addMinutes(iso, minutes) {
    if (!iso) return null;
    const date = new Date(iso);
    if (isNaN(date.getTime())) return null;
    return new Date(date.getTime() + minutes * 60000).toISOString();
  }
  