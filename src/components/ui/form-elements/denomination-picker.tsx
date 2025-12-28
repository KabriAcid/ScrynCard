'use client';

import { cn } from '@/lib/utils';

type Denomination = {
  id: string;
  label: string;
};

interface DenominationPickerProps {
  denominations: readonly Denomination[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function DenominationPicker({ denominations, selected, onToggle }: DenominationPickerProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {denominations.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-card p-2 text-center text-card-foreground transition-all hover:bg-accent/50 w-fit',
            selected.includes(item.id) && 'border-primary bg-primary/10 text-primary'
          )}
        >
          <span className="text-base font-semibold px-2">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
