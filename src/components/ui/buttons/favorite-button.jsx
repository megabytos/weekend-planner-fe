import { Heart } from 'lucide-react';

import cn from '@/utils/class-names';

import Button from './button';

export default function FavoriteButton({ isFavorite, handleFavorite }) {
  return (
    <Button onClick={handleFavorite}>
      <Heart
        size={20}
        className={cn(isFavorite ? 'text-blue fill-blue' : 'text-black')}
      />
    </Button>
  );
}
