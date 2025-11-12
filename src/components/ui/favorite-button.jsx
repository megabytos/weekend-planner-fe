import { Heart } from 'lucide-react';

import cn from '@/utils/class-names';

import ButtonIcon from './button-icon';

export default function FavoriteButton({ isFavorite, handleFavorite }) {
  return (
    <ButtonIcon clickFunction={handleFavorite}>
      <Heart
        size={20}
        className={cn(isFavorite ? 'text-blue fill-blue' : 'text-black')}
      />
    </ButtonIcon>
  );
}
