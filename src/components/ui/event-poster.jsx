import Image from 'next/image';
import Link from 'next/link';

export default function EventPoster({ item }) {
  return (
    <div className="poster-container w-[335px] h-[266px] md:w-[246px] lg:w-[496px]">
      <Link href="#">
        <Image
          src={item.url}
          alt="Event"
          width={496}
          height={266}
          className="rounded-xl w-full h-full object-cover"
          loading="eager"
        />
      </Link>
    </div>
  );
}
