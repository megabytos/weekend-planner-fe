/** @jsxImportSource react */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  selectIsFavorite,
  toggleFavorite,
} from '@/libs/redux/slices/favorites-slice';

import PlannerButton from './buttons/planner-button';

/** @jsxImportSource react */

export default function EventPoster({ item }) {
  if (!item) return null;

  const dispatch = useAppDispatch();

  const primaryImage =
    item.imageUrl ||
    (Array.isArray(item.photos) ? item.photos[0] : null) ||
    item.url;
  const [imageSrc, setImageSrc] = useState(
    primaryImage || '/images/event-placeholder.jpg',
  );
  const alt = item.title || item.name || 'Event';
  const shortTitle = item.shortTitle || item.title || item.name || 'Event';

  const favoriteKey = useMemo(
    () =>
      item.__key ||
      item.id ||
      item.sources?.[0]?.externalId ||
      item.url ||
      item.title,
    [item],
  );

  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, favoriteKey),
  );

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!favoriteKey) return;
    dispatch(toggleFavorite({ key: favoriteKey, item }));
  };

  return (
    <div className="poster-container w-[335px] h-[266px] md:w-[246px] lg:w-[496px] relative">
      <PlannerButton
        className="absolute right-4 bottom-4 z-1"
        onClick={handleFavorite}
        isActive={isFavorite}
      />
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
        <div className="absolute left-0 right-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3 text-white text-base font-medium">
          {shortTitle}
        </div>
      </Link>
    </div>
  );
}
