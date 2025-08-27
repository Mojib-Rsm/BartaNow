import { Megaphone } from 'lucide-react';

type AdSpotProps = {
  className?: string;
  label?: string;
};

export default function AdSpot({ className, label = 'বিজ্ঞাপন' }: AdSpotProps) {
  return (
    <div
      className={`flex items-center justify-center w-full bg-muted/50 border border-dashed rounded-md text-muted-foreground ${className}`}
    >
      <div className="flex flex-col items-center gap-2 py-8">
        <Megaphone className="h-8 w-8" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
