"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export function Disclaimer() {
  const t = useTranslations("results.disclaimer");

  return (
    <div className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
      <Info className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
      <div>
        <p className="mb-1 font-semibold text-foreground">{t("title")}</p>
        <p className="text-sm text-foreground/90">{t("body")}</p>
      </div>
    </div>
  );
}
