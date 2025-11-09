import { Eye } from 'lucide-react';

export default function Viewers({ viewers }) {
  return (
    <div className="w-10 flex items-center justify-start gap-1">
      <Eye className="w-6 h-6 text-black fill-none" />
      <p className="text-xs leading-4 text-black">{viewers}</p>
    </div>
  );
}
