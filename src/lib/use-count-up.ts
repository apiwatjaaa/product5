"use client";

import { useEffect, useRef, useState } from "react";

// นับเลขไล่ขึ้นจาก 0 ถึงค่าเป้าหมายด้วย requestAnimationFrame
// ข้ามอนิเมชันทันทีถ้าเครื่องตั้งค่า prefers-reduced-motion ไว้
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // แท็บไม่ได้แสดงอยู่ (requestAnimationFrame จะหยุด) หรือผู้ใช้ปิดแอนิเมชัน — แสดงค่าจริงทันที
    if (document.visibilityState !== "visible" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    startRef.current = null;
    let frame: number;

    function step(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    // กันกรณีเบราว์เซอร์หน่วง requestAnimationFrame (เช่น แท็บอยู่เบื้องหลัง) จนตัวเลขค้างกลางทาง
    const finish = window.setTimeout(() => setValue(target), durationMs + 150);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finish);
    };
  }, [target, durationMs]);

  return value;
}
