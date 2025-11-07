'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function CustomDropdown({
  items = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
    'Option 6',
  ],
  label = 'City',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="inline-block text-left w-[157px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-medium text-[14px] leading-[20px] flex gap-2 items-center w-full bg-[var(--blue-light)] px-8 py-2.5 text-[var(--blue)] border border-[var(--blue-light)] rounded-[10px] hover:border-[var(--blue)] transition"
      >
        <span>{selected || label}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 stroke-[var(--blue)]" />
        ) : (
          <ChevronDown className="w-5 h-5 stroke-[var(--blue)]" />
        )}
      </button>

      {isOpen && (
        <ul className="left-0 right-0 bg-white border border-[var(--color-white-dark)] rounded-[10px] max-h-[120px] overflow-y-auto">
          {items.map((item) => (
            <li
              key={item}
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
              }}
              className="font-medium text-[14px] leading-[20px] px-4 py-2 hover:bg-[var(--blue-light)] cursor-pointer rounded-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
