"use client";

import { useTranslations } from "next-intl";

export function Disclaimer() {
  const t = useTranslations("results.disclaimer");

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
      <p className="mb-1 font-semibold text-foreground">{t("title")}</p>
      <p className="text-sm text-foreground/90">{t("body")}</p>
    </div>
  );
}
