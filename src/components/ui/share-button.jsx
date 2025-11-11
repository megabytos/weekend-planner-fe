import { Share2 } from 'lucide-react';

import ButtonIcon from './button-icon';

export default function ShareButton({ handleShare }) {
  return (
    <ButtonIcon clickFunction={handleShare}>
      <Share2 size={20} className="text-black" />
    </ButtonIcon>
  );
}
