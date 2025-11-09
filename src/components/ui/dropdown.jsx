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
    'Option 7',
    'Option 8',
  ],
  label = 'Name',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-[157px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-medium text-[14px] leading-5 flex gap-2 items-center w-full bg-light px-8 py-2.5 text-blue border border-light rounded-[10px] hover:border-blue transition"
      >
        <span>{selected || label}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 stroke-blue" />
        ) : (
          <ChevronDown className="w-5 h-5 stroke-blue" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute left-0 right-0 bg-white border border-white-dark rounded-[10px] max-h-[180px] overflow-y-auto z-10">
          {items.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="font-medium text-[14px] leading-5 px-4 py-2 hover:bg-blue-light cursor-pointer rounded-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
