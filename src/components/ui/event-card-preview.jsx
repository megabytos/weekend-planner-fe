import { CalendarFold } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Address from './address';
import PlannerButton from './buttons/planner-button';

export default function EventCardPreview({ item }) {
  if (!item) return null;

  const primaryImage =
    item.imageUrl ||
    (Array.isArray(item.photos) ? item.photos[0] : null) ||
    item.url;
  const [imageSrc, setImageSrc] = useState(
    primaryImage || '/images/event-placeholder.jpg',
  );
  const title = item.title || item.name || 'Event';
  const locationLabel =
    item.address ||
    [item.city?.name, item.city?.countryCode].filter(Boolean).join(', ') ||
    null;
  const startsAt =
    item.nextOccurrence?.startsAt ||
    item.occurrences?.[0]?.start ||
    item.occurrences?.[0]?.startDate ||
    null;
  const dateLabel = startsAt
    ? new Date(startsAt).toLocaleDateString('en-GB')
    : null;

  const priceLabel = item.isFree
    ? 'Free'
    : item.priceFrom
      ? `${item.priceFrom}${item.currency ? ` ${item.currency}` : ''}`
      : null;

  return (
    <div className="font-medium rounded-xl overflow-hidden">
      <Link href="#">
        <div className="w-[335px] h-[200px] md:w-[354px] lg:w-[320px]">
          <Image
            src={imageSrc}
            alt="Event"
            width={300}
            height={200}
            loading="eager"
            className="w-full h-full object-cover"
            onError={() => setImageSrc('/images/event-placeholder.jpg')}
          />
        </div>
        <footer className="flex w-[335px] md:w-[354px] lg:w-[320px] min-w-0 flex-col gap-2 p-2 bg-white-dark">
          <h1 className="text-[22px] leading-7 min-w-0 truncate ">{title}</h1>
          {dateLabel && (
            <div className="flex items-center gap-2">
              <CalendarFold size={20} />
              <span>{dateLabel}</span>
            </div>
          )}
          {locationLabel && <Address address={locationLabel} />}
          {(priceLabel || item.type) && (
            <div className="flex items-center gap-2">
              {priceLabel && <span>{priceLabel}</span>}
              {item.type && <span className="text-orange">{item.type}</span>}
            </div>
          )}
          <PlannerButton onClick={() => {}} />
        </footer>
      </Link>
    </div>
  );
}
