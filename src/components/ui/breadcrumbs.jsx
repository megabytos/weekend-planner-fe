import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <ul className="flex items-center text-sm [&_li:not(:last-child)::after]:px-2 [&_li:not(:last-child)::after]:content-['›'] [&_li:not(:last-child)::after]:font-black">
      {items.map((item, idx) => (
        <li key={`${idx}:${item.label}`}>
          <Link href={item.href} className="font-light hover:underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
