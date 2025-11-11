'use client';

export default function Section({ className = '', children }) {
  return <section className={className}>{children}</section>;
}
