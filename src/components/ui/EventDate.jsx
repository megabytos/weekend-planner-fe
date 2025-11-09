'use client';

import { CalendarFold } from 'lucide-react';

export default function EventDate({ dateString, locale = 'en-US' }) {
  const eventDate = new Date(dateString);
  const isValidDate = !isNaN(eventDate.getDay());
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const formattedDate = isValidDate
    ? eventDate.toLocaleDateString(locale, options)
    : '';
  return (
    <div className="flex justify-start items-center gap-1 text-base leading-6 text-black">
      <CalendarFold className="h-6 w-6" />
      <time dateTime={formattedDate}>{formattedDate}</time>
    </div>
  );
}
