"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useNumberField } from "@/hooks/use-number-field";

/**
 * ช่องกรอกตัวเลขคู่กับ slider สำหรับเครื่องคำนวณในหน้า /learn — ใช้ useNumberField เดียวกับ
 * หน้าฟอร์มวางแผน เพื่อไม่ให้เคอร์เซอร์กระโดดหรือพิมพ์จุดทศนิยม/ลบจนว่างไม่ได้เหมือนที่เคยแก้ไปแล้ว
 */
export function SliderNumberField({
  id,
  ariaLabel,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  allowDecimal = false,
}: {
  id?: string;
  ariaLabel?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  allowDecimal?: boolean;
}) {
  const round = allowDecimal ? (n: number) => Math.round(n * 10) / 10 : Math.round;

  const { inputProps, commit } = useNumberField({
    value,
    onChange,
    format: (n) => String(round(n)),
    round,
    min,
    max,
    step,
    allowDecimal,
  });

  return (
    <div className="flex items-center gap-3">
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => commit(v)}
        className="min-w-0 flex-1"
        aria-label={ariaLabel}
      />
      <div className="relative w-20 shrink-0">
        <Input
          id={id}
          type="text"
          aria-label={!id ? ariaLabel : undefined}
          className={suffix ? "pr-6 text-right font-mono" : "text-right font-mono"}
          {...inputProps}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
