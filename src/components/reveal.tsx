"use client";

import { useEffect, useRef, useState } from "react";

/**
 * เฟดขึ้นเบา ๆ เมื่อเลื่อนมาถึง
 * - สิ่งที่อยู่ในจอตั้งแต่โหลดหน้า จะเห็นทันที (ไม่ซ่อนก่อน) — แก้กล่องหน้าแรกที่เคยว่างเปล่าตอนโหลด
 * - ถ้า JavaScript ยังไม่ทำงาน เนื้อหาก็ยังแสดงครบ
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // อยู่ในจอแล้ว ไม่ต้องซ่อน

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion =
    state === "static"
      ? ""
      : `transition-[opacity,transform] duration-500 ease-out ${
          state === "hidden" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`;

  return (
    <div
      ref={ref}
      style={state === "shown" ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`${motion} ${className}`}
    >
      {children}
    </div>
  );
}
