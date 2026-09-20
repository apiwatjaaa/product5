"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShieldQuestion } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { RISK_LEVEL_ORDER, RISK_PROFILES } from "@/lib/finance/constants";
import { futureValue } from "@/lib/finance/tvm";
import { formatCurrency, formatPercent } from "@/lib/format";

const PRINCIPAL = 100_000;
const YEARS = 20;

export function RiskReturnCalculator() {
  const t = useTranslations("learn.riskReturnCalculator");
  const tRisk = useTranslations("riskLevel");
  const locale = useLocale();

  const [levelIndex, setLevelIndex] = useState(1);
  const level = RISK_LEVEL_ORDER[levelIndex];
  const profile = RISK_PROFILES[level];

  const worstCase = useMemo(
    () => futureValue(PRINCIPAL, profile.returnRange.worst, YEARS),
    [profile],
  );
  const bestCase = useMemo(
    () => futureValue(PRINCIPAL, profile.returnRange.best, YEARS),
    [profile],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldQuestion className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <Label className="text-muted-foreground">{t("chooseRisk")}</Label>
            <span className="font-medium">{tRisk(level)}</span>
          </div>
          <Slider
            value={levelIndex}
            min={0}
            max={RISK_LEVEL_ORDER.length - 1}
            step={1}
            onValueChange={(v) => setLevelIndex(v)}
            aria-label={t("chooseRisk")}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {t("scenario", { amount: formatCurrency(PRINCIPAL, locale), years: YEARS })}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-xs text-muted-foreground">
              {t("worstCase")} ({formatPercent(profile.returnRange.worst, locale, 0)}/{t("perYear")})
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-destructive">
              {formatCurrency(worstCase, locale)}
            </p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <p className="text-xs text-muted-foreground">
              {t("bestCase")} ({formatPercent(profile.returnRange.best, locale, 0)}/{t("perYear")})
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-success">
              {formatCurrency(bestCase, locale)}
            </p>
          </div>
        </div>

        <p className="flex items-start gap-1.5 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          {t("warning")}
        </p>

        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
