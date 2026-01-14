import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps extends React.ComponentProps<'input'> {
  min?: number;
}

const QuantityInput = React.forwardRef<HTMLInputElement, QuantityInputProps>(
  ({ className, min = 1, ...props }, ref) => {
    const { value, onChange } = props;
    const numericValue = Number(value);

    const handleIncrement = () => {
      const e = { target: { value: String(numericValue + 10) } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(e);
    };

    const handleDecrement = () => {
      const newValue = Math.max(min, numericValue - 10);
      const e = { target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(e);
    };

    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={numericValue <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          className={cn('h-8 w-20 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none', className)}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
QuantityInput.displayName = 'QuantityInput';

export { QuantityInput };
