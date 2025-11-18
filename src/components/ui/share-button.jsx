import { Share2 } from 'lucide-react';

import Button from './button';

export default function ShareButton({ handleShare }) {
  return (
    <Button onClick={handleShare}>
      <Share2 size={20} className="text-black" />
    </Button>
  );
}
