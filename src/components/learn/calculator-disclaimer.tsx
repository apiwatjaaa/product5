"use client";

import { useTranslations } from "next-intl";

/** ข้อความเตือนที่ต้องมีใต้เครื่องคำนวณทุกอันในหน้า /learn */
export function CalculatorDisclaimer() {
  const t = useTranslations("learn.calculatorDisclaimer");
  return <p className="text-xs text-muted-foreground">{t("text")}</p>;
}
