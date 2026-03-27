import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  disabled,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
      <Button
        aria-label="Decrease quantity"
        className="h-9 w-9 rounded-full px-0"
        disabled={disabled || value <= 1}
        size="sm"
        variant="ghost"
        onClick={onDecrease}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
        {value}
      </span>
      <Button
        aria-label="Increase quantity"
        className="h-9 w-9 rounded-full px-0"
        disabled={disabled}
        size="sm"
        variant="ghost"
        onClick={onIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
