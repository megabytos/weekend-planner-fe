'use client';

import { useState, useEffect } from 'react';

import Button from '../../buttons/button';

export default function StayTimeSelector({
  defaultMinutes = 60,
  onTimeChange,
}) {
  const [minutes, setMinutes] = useState(defaultMinutes);

  useEffect(() => {
    setMinutes(defaultMinutes);
  }, [defaultMinutes]);

  const handleDecrease = () => {
    const newMinutes = Math.max(10, minutes - 10);
    setMinutes(newMinutes);
    if (onTimeChange) {
      onTimeChange(newMinutes);
    }
  };

  const handleIncrease = () => {
    const newMinutes = minutes + 10;
    setMinutes(newMinutes);
    if (onTimeChange) {
      onTimeChange(newMinutes);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light min-w-[32px]"
        onClick={handleDecrease}
      >
        -
      </Button>
      <span className="text-sm font-medium min-w-[60px] text-center">
        {minutes} min
      </span>
      <Button
        className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light min-w-[32px]"
        onClick={handleIncrease}
      >
        +
      </Button>
    </div>
  );
}

