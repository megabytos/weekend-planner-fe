import { CalendarFold } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Address from './address';

export default function EventCardPreview({ item }) {
  return (
    <div className="font-medium rounded-xl overflow-hidden">
      <Link href="#">
        <div className="w-[335px] h-[200px] md:w-[354px] lg:w-[320px]">
          <Image
            src={item.url}
            alt="Event"
            width={300}
            height={200}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <footer className="flex flex-col gap-2 p-2 bg-white-dark">
          <h1 className="text-[22px] leading-7">Event Title</h1>
          <div className="flex items-center gap-2">
            <CalendarFold size={20} />
            <span>31.12.2025</span>
          </div>
          <Address address="123 Main St, City, Country" />
          <div>
            <span>Price</span> <span>Currency</span>
          </div>
        </footer>
      </Link>
    </div>
  );
}
