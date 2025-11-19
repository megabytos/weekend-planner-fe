import { MapPin } from 'lucide-react';

export default function Address({ address }) {
  return (
    <div className="h-5 flex items-center justify-start gap-2">
      <MapPin className="w-5 h-5 text-black aria-hidden" />
      <address className="not-italic text-blue text-sm leading-5">
        {address}
      </address>
    </div>
  );
}
