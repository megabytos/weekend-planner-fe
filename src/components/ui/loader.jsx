'use client';

export default function Loader() {
  return (
    <svg
      className="mr-3 h-10 w-10 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-50"
        cx="12"
        cy="12"
        r="10"
        stroke="var(--blue)"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-90"
        fill="var(--blue)"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
}
