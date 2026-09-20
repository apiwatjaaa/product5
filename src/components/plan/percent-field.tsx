"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useNumberField } from "@/hooks/use-number-field";

function formatPercent(value: number): string {
  return String(Math.round(value * 10) / 10);
}

/** ช่องกรอกเปอร์เซ็นต์ (เก็บเป็นสัดส่วน 0-1) — มีทั้ง slider และช่องพิมพ์ตัวเลข เลื่อนทีละ step */
export function PercentField({
  id,
  value,
  onChange,
  min = 0,
  max = 20,
  step = 0.1,
  helperText,
  ariaDescribedBy,
  decreaseAriaLabel,
  increaseAriaLabel,
  presets,
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
  presets?: number[];
}) {
  const percent = Math.round(value * 1000) / 10;
  const round = (n: number) => Math.round(n * 10) / 10;

  const { inputProps, commit } = useNumberField({
    value: percent,
    onChange: (p) => onChange(p / 100),
    format: formatPercent,
    round,
    min,
    max,
    step,
  });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={decreaseAriaLabel}
          onClick={() => commit(percent - step)}
        >
          <Minus />
        </Button>
        <Slider
          value={percent}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => commit(v)}
          className="min-w-0 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={increaseAriaLabel}
          onClick={() => commit(percent + step)}
        >
          <Plus />
        </Button>
        <div className="relative w-20 shrink-0">
          <Input
            id={id}
            type="text"
            aria-describedby={ariaDescribedBy}
            className="pr-5 text-right font-mono"
            {...inputProps}
          />
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
            %
          </span>
        </div>
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => commit(preset)}
            >
              {preset}%
            </Button>
          ))}
        </div>
      )}
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
