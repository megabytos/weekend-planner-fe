'use client';

import Image from 'next/image';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';
import Address from '@/components/ui/address';
import EventDate from '@/components/ui/event-date';
import EventPrice from '@/components/ui/event-price';
import FavoriteButton from '@/components/ui/favorite-button';
import OrganizedBy from '@/components/ui/organized-by';
import ShareButton from '@/components/ui/share-button';
import Viewers from '@/components/ui/viewers';

export default function Event() {
  const handleShare = () => {
    // Share functionality here
  };

  const handleFavorite = () => {
    // Favorite functionality here
  };

  return (
    <Section>
      <Container className="flex flex-col gap-4 lg:max-w-5xl">
        <div>Breadcrumbs</div>
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/event-placeholder.jpg"
            alt="Event"
            width={335}
            height={200}
            className="w-full h-auto max-h-[480px] md:max-h-[360px] дп:max-h-[360px] object-cover"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <EventDate dateString="2024-12-31" />
          </div>
          <div className="flex items-center gap-4">
            <Viewers viewers={123} />
            <ShareButton handleShare={handleShare} />
            <FavoriteButton isFavorite={true} handleFavorite={handleFavorite} />
          </div>
        </div>
        <h1 className="text-[22px]">Event Title</h1>
        <EventPrice price="50 USD" />
        <div className="flex flex-col gap-2">
          <span className="font-medium">Location</span>
          <Address address="123 Main St, City, Country" />
        </div>
        <div>
          <h2 className="font-medium">Event Details</h2>
          <p className="mt-2">Description of the event goes here.</p>
        </div>
        <div>
          <h2 className="mb-2 font-medium">Host</h2>
          <OrganizedBy
            organizer={{
              name: 'John Doe',
              avatarUrl: '/images/organizer-placeholder.jpg',
            }}
          />
        </div>
      </Container>
    </Section>
  );
}
