"use client";

import { AlertTriangle, CalendarClock, CheckCircle2, PiggyBank, Scissors, TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format";
import type { Suggestion } from "@/lib/finance/types";

type OptionCard = {
  key: string;
  icon: typeof PiggyBank;
  title: string;
  value: string;
  note: string;
  warning?: boolean;
};

export function GapAlert({ gap, suggestions }: { gap: number; suggestions: Suggestion[] }) {
  const t = useTranslations("results");
  const locale = useLocale();

  if (gap <= 0) return null;

  const cards: OptionCard[] = [];
  for (const s of suggestions) {
    if (s.type === "increase_saving") {
      cards.push({
        key: s.type,
        icon: PiggyBank,
        title: t("options.saving.title"),
        value: t("options.perMonth", { amount: formatCurrency(s.values.requiredMonthly, locale) }),
        note: t("options.saving.note", { increase: formatCurrency(s.values.increase, locale) }),
      });
    } else if (s.type === "delay_retirement") {
      cards.push({
        key: s.type,
        icon: CalendarClock,
        title: t("options.delay.title"),
        value: t("options.delay.value", { age: s.values.newRetirementAge }),
        note: t("options.delay.note", { years: s.values.yearsDelay }),
      });
    } else if (s.type === "reduce_expense") {
      cards.push({
        key: s.type,
        icon: Scissors,
        title: t("options.expense.title"),
        value: t("options.perMonth", { amount: formatCurrency(s.values.maxMonthlyExpenseToday, locale) }),
        note: t("options.expense.note"),
      });
    } else if (s.type === "increase_risk") {
      const newGap = s.values.newGap ?? 0;
      cards.push({
        key: s.type,
        icon: TrendingUp,
        title: t("options.risk.title"),
        value: t("options.risk.value", { rate: Math.round((s.values.newRiskReturn ?? 0) * 100) }),
        note:
          newGap <= 0
            ? t("options.risk.reach", { amount: formatCurrency(-newGap, locale) })
            : t("options.risk.short", { amount: formatCurrency(newGap, locale) }),
        warning: true,
      });
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="gap-title">
      <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4">
        <AlertTriangle className="size-6 shrink-0 text-destructive" aria-hidden="true" />
        <div>
          <h2 id="gap-title" className="text-xl font-bold text-destructive">
            {t("gapAlert.titleShort")} {formatCurrency(gap, locale)}
          </h2>
          <p className="text-sm text-muted-foreground">{t("options.subtitle")}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <li key={card.key} className="flex gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums">{card.value}</p>
                <p className={`mt-1 text-sm ${card.warning ? "text-warning" : "text-muted-foreground"}`}>{card.note}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function OnTrackNote({ excess }: { excess: number }) {
  const t = useTranslations("results.recommend");
  const locale = useLocale();
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-5 py-4 text-[1.02rem] font-semibold text-success"
    >
      <CheckCircle2 className="size-6 shrink-0" aria-hidden="true" />
      {t("onTrack", { excess: formatCurrency(excess, locale) })}
    </div>
  );
}
