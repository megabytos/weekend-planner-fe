'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  selectIsFavorite,
  toggleFavorite,
} from '@/libs/redux/slices/favorites-slice';

import Address from './ui/address';
import FavoriteButton from './ui/buttons/favorite-button';
import ShareButton from './ui/buttons/share-button';
import EventDate from './ui/event-date';
import EventPrice from './ui/event-price';
import Viewers from './ui/viewers';

export default function EventCard({ event }) {
  if (!event) return null;

  const dispatch = useAppDispatch();

  const {
    title,
    type,
    address,
    city,
    imageUrl,
    photos,
    nextOccurrence,
    occurrences,
    priceFrom,
    priceTo,
    currency,
    isFree,
    reviewCount,
    priceTier,
    openNow,
    openUntil,
    rating,
    primaryCategory,
    categories,
    isFavorite: initialFavorite,
  } = event;

  const favoriteKey = useMemo(
    () =>
      event.__key ||
      event.id ||
      event.sources?.[0]?.externalId ||
      event.url ||
      event.title,
    [event],
  );

  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, favoriteKey),
  );

  const isEvent = type === 'event';

  const primaryImage =
    imageUrl || (Array.isArray(photos) && photos[0]) || null;
  const [imageSrc, setImageSrc] = useState(
    primaryImage || '/images/event-placeholder.jpg',
  );

  const locationLabel =
    address ||
    [city?.name, city?.countryCode].filter(Boolean).join(', ') ||
    null;

  const startsAt = isEvent
    ? nextOccurrence?.startsAt ||
      occurrences?.[0]?.start ||
      occurrences?.[0]?.startDate ||
      null
    : null;

  const categoryLabel =
    primaryCategory?.name || primaryCategory?.slug || categories?.[0]?.name;

  const handleShare = () => {
    // Implement share functionality here
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite({ key: favoriteKey, item: event }));
  };

  return (
    <div className="font-medium md:flex md:items-stretch">
      <div className="rounded-xl overflow-hidden">
        <Image
          src={imageSrc}
          alt={title || 'Event'}
          width={335}
          height={200}
          className="w-[335px] h-[200px] md:w-[280px] object-cover"
          onError={() => setImageSrc('/images/event-placeholder.jpg')}
        />
      </div>
      <div className="flex flex-col gap-2 md:grow p-2 md:p-0 md:pl-5">
        {title && <h3>{title}</h3>}
        {locationLabel && <Address address={locationLabel} />}
        <div className="flex items-center gap-3 text-sm text-black">
          <EventPrice
            isFree={isFree}
            priceFrom={priceFrom}
            priceTo={priceTo}
            currency={currency}
            priceTier={priceTier}
          />
          {categoryLabel && (
            <span className="text-orange">{categoryLabel}</span>
          )}
          {typeof rating === 'number' && (
            <span>{`Rating: ${rating.toFixed(1)}`}</span>
          )}
          {typeof openNow === 'boolean' && (
            <span className="text-sm">
              {openNow
                ? 'Open now'
                : openUntil
                  ? `Closes ${openUntil}`
                  : 'Closed'}
            </span>
          )}
        </div>
        <footer className="flex justify-between items-center md:mt-auto">
          {startsAt && <EventDate dateString={startsAt} />}
          {typeof reviewCount === 'number' && reviewCount > 0 && (
            <Viewers viewers={reviewCount} />
          )}
          <div className="flex items-center gap-2 ">
            <ShareButton handleShare={handleShare} />
            <FavoriteButton
              isFavorite={isFavorite}
              handleFavorite={handleFavorite}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
