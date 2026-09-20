"use client";

import { AlertOctagon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format";
import type { GoalShortfall } from "@/lib/finance/types";

export function GoalShortfallAlert({ shortfalls }: { shortfalls: GoalShortfall[] }) {
  const t = useTranslations("results.goalShortfall");
  const locale = useLocale();

  if (shortfalls.length === 0) return null;

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertOctagon className="size-4 shrink-0" aria-hidden="true" />
        {t("title")}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm">
        {shortfalls.map((s) => (
          <li key={`${s.goalName}-${s.targetAge}`}>
            {t("item", {
              goalName: s.goalName,
              negativeFromAge: s.negativeFromAge,
              shortfall: formatCurrency(s.shortfall, locale),
              requiredExtraMonthly: formatCurrency(s.requiredExtraMonthly, locale),
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
