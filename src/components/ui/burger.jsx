'use client';

import Link from 'next/link';

import { nanoid } from '@reduxjs/toolkit';

import Dropdown from './dropdown';

export default function Burger({
  items = [
    'Registration',
    'Add an event',
    'Ideas generation',
    'Favorites',
    'About us',
  ],
}) {
  return (
    <div>
      <ul className="flex-col w-[157px]">
        <li>
          <Dropdown label="City"></Dropdown>
        </li>
        <li>
          <Dropdown label="Categories"></Dropdown>
        </li>
        {items.map((item) => (
          <li
            className="font-medium text-[14px] leading-5 flex items-center gap-2 px-6 py-2.5 text-blue border border-white rounded-[10px] hover:border-blue transition"
            key={nanoid()}
          >
            <Link href="#">{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
