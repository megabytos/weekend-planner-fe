import { Heart } from 'lucide-react';

import cn from '@/utils/class-names';

export default function FavoriteIcon({ isFavorite }) {
  return (
    <>
      <Heart
        className={cn(
          isFavorite ? 'text-blue fill-blue' : 'text-black',
          'w-6 h-6',
        )}
      />
    </>
  );
}
