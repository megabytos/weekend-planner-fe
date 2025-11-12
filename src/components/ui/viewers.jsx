import { Eye } from 'lucide-react';

export default function Viewers({ viewers }) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Eye size={20} className="text-black fill-none" />
      <p className="text-xs leading-4 text-black">{viewers}</p>
    </div>
  );
}
