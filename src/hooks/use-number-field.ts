"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

function sanitizeNumericInput(raw: string, allowDecimal: boolean): string {
  const cleaned = raw.replace(allowDecimal ? /[^\d.]/g : /[^\d]/g, "");
  if (!allowDecimal) return cleaned;
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
}

/**
 * ช่องกรอกตัวเลขแบบ controlled ที่พิมพ์ลื่นไหล: เก็บสิ่งที่ผู้ใช้พิมพ์เป็น string ดิบไว้ระหว่างโฟกัส
 * (ไม่ parse ทับ state ทุก keystroke) แปลงเป็นตัวเลขจริงและจัด format ใหม่เฉพาะตอน blur/ลูกศร/ปุ่ม +-
 * เพื่อไม่ให้เคอร์เซอร์กระโดดหรือพิมพ์จุดทศนิยม/ลบจนว่างไม่ได้
 */
export function useNumberField({
  value,
  onChange,
  format,
  round = (n: number) => n,
  min,
  max,
  step = 1,
  allowDecimal = true,
}: {
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  round?: (value: number) => number;
  min?: number;
  max?: number;
  step?: number;
  allowDecimal?: boolean;
}) {
  const [text, setText] = useState(() => format(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(format(value));
  }, [value, format]);

  const clamp = (n: number) => {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  };

  const commit = (raw: number) => {
    const bounded = clamp(round(Number.isFinite(raw) ? raw : value));
    onChange(bounded);
    setText(format(bounded));
  };

  const currentNumber = () => {
    const parsed = parseFloat(text);
    return Number.isFinite(parsed) ? parsed : value;
  };

  return {
    commit,
    inputProps: {
      value: text,
      inputMode: "decimal" as const,
      onFocus: (e: FocusEvent<HTMLInputElement>) => {
        focused.current = true;
        e.target.select();
      },
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setText(sanitizeNumericInput(e.target.value, allowDecimal));
      },
      onBlur: () => {
        focused.current = false;
        commit(currentNumber());
      },
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          commit(currentNumber() + step);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          commit(currentNumber() - step);
        } else if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      },
    },
  };
}
