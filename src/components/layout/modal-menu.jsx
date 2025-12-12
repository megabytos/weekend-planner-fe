'use client';

import { X } from 'lucide-react';

import Button from '../ui/buttons/button';
import ModalMenuItems from './modal-menu-items';
import CitySelect from './city-select';

export default function ModalMenu({ onClose }) {
  return (
    <div
      className="relative w-[197px] h-full bg-blue-light"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-center pt-[68px] h-full">
        <Button className="absolute top-5 right-5" onClick={onClose}>
          <X className="w-6 h-6 stroke-blue" />
        </Button>
        <div className="flex flex-col gap-4">
          <div className="px-6">
            <CitySelect className="w-[157px]" />
          </div>
          <ModalMenuItems onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
