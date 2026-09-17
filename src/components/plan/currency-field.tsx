"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

function formatThousands(value: number): string {
  if (Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function parseDigits(raw: string): number {
  const cleaned = raw.replace(/[^0-9]/g, "");
  return cleaned === "" ? 0 : Number(cleaned);
}

export function CurrencyField({
  value,
  onChange,
  id,
  ariaDescribedBy,
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  ariaDescribedBy?: string;
}) {
  const [text, setText] = useState(formatThousands(value));

  useEffect(() => {
    setText(formatThousands(value));
  }, [value]);

  return (
    <Input
      id={id}
      inputMode="numeric"
      aria-describedby={ariaDescribedBy}
      value={text}
      onChange={(e) => {
        const parsed = parseDigits(e.target.value);
        setText(parsed === 0 ? e.target.value.replace(/[^0-9]/g, "") : formatThousands(parsed));
        onChange(parsed);
      }}
      className="text-right font-mono"
    />
  );
}
