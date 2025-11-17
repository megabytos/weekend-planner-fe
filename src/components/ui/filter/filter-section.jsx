'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function FilterSection({
  items = ['Option 1', 'Option 2', 'Option 3'],
  label = 'Name',
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-wrap text-left w-[335px] md:w-[167px] lg:w-[320px] ">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="font-medium text-base leading-6 flex gap-2 items-center w-full text-black transition"
      >
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 stroke-black" />
        ) : (
          <ChevronDown className="w-6 h-6 stroke-black" />
        )}
      </button>

      {isOpen && children}
    </div>
  );
}
