"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNumberField } from "@/hooks/use-number-field";

export function StepperField({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  helperText,
  ariaDescribedBy,
  decreaseAriaLabel,
  increaseAriaLabel,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  ariaDescribedBy?: string;
  decreaseAriaLabel?: string;
  increaseAriaLabel?: string;
}) {
  const { inputProps, commit } = useNumberField({
    value,
    onChange,
    format: (n) => String(Math.round(n)),
    round: Math.round,
    min,
    max,
    step,
    allowDecimal: false,
  });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={decreaseAriaLabel}
          onClick={() => commit(value - step)}
        >
          <Minus />
        </Button>
        <Input
          id={id}
          type="text"
          aria-describedby={ariaDescribedBy}
          className="text-center font-mono"
          {...inputProps}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={increaseAriaLabel}
          onClick={() => commit(value + step)}
        >
          <Plus />
        </Button>
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
