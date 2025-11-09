import Image from 'next/image';

export default function OrganizedBy({
  width = 40,
  height = 40,
  organizer: { name, avatarUrl },
}) {
  return (
    <div className="inline-flex justify-start items-center gap-2">
      <Image
        src={avatarUrl}
        alt={name}
        width={width}
        height={height}
        className="rounded-full"
      />
      <p className="text-base leading-6 text-black">{name}</p>
    </div>
  );
}
