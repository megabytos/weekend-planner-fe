import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import PlannerButton from './buttons/planner-button';

export default function EventPoster({ item }) {
  if (!item) return null;

  const primaryImage =
    item.imageUrl ||
    (Array.isArray(item.photos) ? item.photos[0] : null) ||
    item.url;
  const [imageSrc, setImageSrc] = useState(
    primaryImage || '/images/event-placeholder.jpg',
  );
  const alt = item.title || item.name || 'Event';

  return (
    <div className="poster-container w-[335px] h-[266px] md:w-[246px] lg:w-[496px] relative">
      <PlannerButton className="absolute right-4 bottom-4" onClick={() => {}} />
      <Link href="#">
        <Image
          src={imageSrc}
          alt={alt}
          width={496}
          height={266}
          className="rounded-xl w-full h-full object-cover"
          loading="eager"
          onError={() => setImageSrc('/images/event-placeholder.jpg')}
        />
      </Link>
    </div>
  );
}
