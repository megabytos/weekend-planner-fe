import { CalendarFold } from 'lucide-react';
import Image from 'next/image';

import Address from './ui/address';
import FavoriteButton from './ui/favorite-button';
import ShareButton from './ui/share-button';
import Viewers from './ui/viewers';

export default function EventCard() {
  const handleShare = () => {
    // Share functionality here
  };

  const handleFavorite = () => {
    // Favorite functionality here
  };

  return (
    <div className="font-medium md:flex md:items-stretch">
      <div className="rounded-xl overflow-hidden">
        <Image
          src="/images/event-placeholder.jpg"
          alt="Event"
          width={335}
          height={200}
          className="w-[335px] h-[200px] md:w-[280px] object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 md:grow p-2 md:p-0 md:pl-5">
        <h3>Event title</h3>
        <Address address="123 Main St, City, Country" />
        <div>
          <span>Price</span> <span>Currency</span>
        </div>
        <footer className="flex justify-between items-center md:mt-auto">
          <div className="flex items-center gap-2">
            <CalendarFold size={20} />
            <span>31.12.2024</span>
          </div>

          <div className="flex items-center gap-4">
            <Viewers viewers={123} />
            <ShareButton handleShare={handleShare} />
            <FavoriteButton isFavorite={true} handleFavorite={handleFavorite} />
          </div>
        </footer>
      </div>
    </div>
  );
}
