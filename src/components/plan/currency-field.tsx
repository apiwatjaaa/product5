"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNumberField } from "@/hooks/use-number-field";

const QUICK_ADD_STEPS = [1000, 5000, 10000];

function formatThousands(value: number): string {
  if (Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function CurrencyField({
  value,
  onChange,
  id,
  ariaLabel,
  ariaDescribedBy,
  helperText,
  quickAddSteps = QUICK_ADD_STEPS,
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  helperText?: string;
  quickAddSteps?: number[];
}) {
  const { inputProps } = useNumberField({
    value,
    onChange,
    format: formatThousands,
    round: Math.round,
    min: 0,
    step: quickAddSteps[0] ?? 1000,
    allowDecimal: false,
  });

  return (
    <div className="space-y-1.5">
      <Input
        id={id}
        type="text"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className="text-right font-mono"
        {...inputProps}
      />
      {quickAddSteps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {quickAddSteps.map((step) => (
            <Button
              key={step}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => onChange(value + step)}
            >
              +{formatThousands(step)}
            </Button>
          ))}
        </div>
      )}
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
