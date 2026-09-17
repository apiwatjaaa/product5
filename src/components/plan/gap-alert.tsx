"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format";
import type { Suggestion } from "@/lib/finance/types";

export function GapAlert({ gap, suggestions }: { gap: number; suggestions: Suggestion[] }) {
  const t = useTranslations("results.gapAlert");
  const tRecommend = useTranslations("results.recommend");
  const locale = useLocale();

  if (gap <= 0) return null;

  const items = suggestions.filter((s) => s.type !== "on_track");

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
      <p className="mb-3 flex items-center gap-2 text-lg font-semibold text-destructive">
        <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
        {t("titleShort")} {formatCurrency(gap, locale)}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm">
        {items.map((s) => (
          <li key={s.type}>
            {s.type === "increase_saving" &&
              tRecommend("increaseSaving", {
                requiredMonthly: formatCurrency(s.values.requiredMonthly, locale),
                increase: formatCurrency(s.values.increase, locale),
              })}
            {s.type === "delay_retirement" &&
              tRecommend("delayRetirement", { newRetirementAge: s.values.newRetirementAge })}
            {s.type === "reduce_expense" &&
              tRecommend("reduceExpense", {
                maxMonthlyExpenseToday: formatCurrency(s.values.maxMonthlyExpenseToday, locale),
              })}
            {s.type === "increase_risk" && tRecommend("increaseRisk")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OnTrackNote({ excess }: { excess: number }) {
  const t = useTranslations("results.recommend");
  const locale = useLocale();
  return (
    <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/5 p-4 text-sm font-medium text-success">
      <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
      {t("onTrack", { excess: formatCurrency(excess, locale) })}
    </div>
  );
}
