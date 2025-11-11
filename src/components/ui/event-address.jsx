import { MapPin } from 'lucide-react';

export default function EventAddress({ address }) {
  return (
    <div className="flex items-center gap-2">
      <MapPin size={20} />
      <span>{address}</span>
    </div>
  );
}
