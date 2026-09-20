"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyField } from "@/components/plan/currency-field";
import { SliderNumberField } from "@/components/learn/slider-number-field";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { futureValue, futureValueAnnuity, futureValueSimple } from "@/lib/finance/tvm";
import { formatCompact, formatCurrency } from "@/lib/format";
import {
  chartTooltipContentStyle,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
} from "@/lib/chart-tooltip-style";

const GROWTH_YEARS = 30;
const RETIREMENT_AGE = 60;

export function CompoundInterestChart() {
  const t = useTranslations("learn.compoundInterestChart");
  const locale = useLocale();

  const [principal, setPrincipal] = useState(10000);
  const [ratePercent, setRatePercent] = useState(5);
  const [showSimple, setShowSimple] = useState(true);

  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [startRatePercent, setStartRatePercent] = useState(5);
  const [earlyAge, setEarlyAge] = useState(25);
  const [lateAge, setLateAge] = useState(35);

  const growthData = useMemo(() => {
    const r = ratePercent / 100;
    return Array.from({ length: GROWTH_YEARS + 1 }, (_, year) => ({
      year,
      compound: futureValue(principal, r, year),
      simple: futureValueSimple(principal, r, year),
    }));
  }, [principal, ratePercent]);

  const startEarlyResult = useMemo(() => {
    const monthlyRate = startRatePercent / 100 / 12;
    const monthsFromEarly = Math.max(1, (RETIREMENT_AGE - earlyAge) * 12);
    const monthsFromLate = Math.max(1, (RETIREMENT_AGE - lateAge) * 12);
    const corpusEarly = futureValueAnnuity(monthlyContribution, monthlyRate, monthsFromEarly);
    const corpusLate = futureValueAnnuity(monthlyContribution, monthlyRate, monthsFromLate);
    const contributedEarly = monthlyContribution * monthsFromEarly;
    const contributedLate = monthlyContribution * monthsFromLate;
    return {
      corpusEarly,
      corpusLate,
      contributedEarly,
      contributedLate,
      corpusDiff: corpusEarly - corpusLate,
      contributedDiff: contributedEarly - contributedLate,
    };
  }, [monthlyContribution, startRatePercent, earlyAge, lateAge]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth">
          <TabsList>
            <TabsTrigger value="growth">{t("tabGrowth")}</TabsTrigger>
            <TabsTrigger value="startEarly">{t("tabStartEarly")}</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ci-principal">{t("principal")}</Label>
                <CurrencyField
                  id="ci-principal"
                  value={principal}
                  onChange={setPrincipal}
                  quickAddSteps={[10000, 50000, 100000]}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-rate">{t("annualRate")}</Label>
                <SliderNumberField
                  id="ci-rate"
                  value={ratePercent}
                  onChange={setRatePercent}
                  min={1}
                  max={15}
                  step={0.5}
                  allowDecimal
                  suffix="%"
                />
              </div>
            </div>

            <Button
              type="button"
              variant={showSimple ? "default" : "outline"}
              size="sm"
              aria-pressed={showSimple}
              onClick={() => setShowSimple((v) => !v)}
            >
              {t("toggleSimple")}
            </Button>

            <div className="h-72 w-full" role="img" aria-label={t("tabGrowth")}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => `${t("yearsLabel")} ${v}`}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatCompact(v, locale)}
                    tick={{ fontSize: 12 }}
                    width={56}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value), locale), String(name)]}
                    labelFormatter={(year) => `${t("yearsLabel")} ${year}`}
                    contentStyle={chartTooltipContentStyle}
                    labelStyle={chartTooltipLabelStyle}
                    itemStyle={chartTooltipItemStyle}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="compound"
                    name={t("compoundLine")}
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  {showSimple && (
                    <Line
                      type="monotone"
                      dataKey="simple"
                      name={t("simpleLine")}
                      stroke="var(--color-chart-2)"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="startEarly" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ci-monthly">{t("monthlyContribution")}</Label>
                <CurrencyField
                  id="ci-monthly"
                  value={monthlyContribution}
                  onChange={setMonthlyContribution}
                  quickAddSteps={[1000, 5000, 10000]}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-start-rate">{t("annualRate")}</Label>
                <SliderNumberField
                  id="ci-start-rate"
                  value={startRatePercent}
                  onChange={setStartRatePercent}
                  min={1}
                  max={15}
                  step={0.5}
                  allowDecimal
                  suffix="%"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-early-age">{t("startAgeEarly")}</Label>
                <SliderNumberField
                  id="ci-early-age"
                  value={earlyAge}
                  onChange={setEarlyAge}
                  min={18}
                  max={RETIREMENT_AGE - 1}
                  suffix={t("ageSuffix")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-late-age">{t("startAgeLate")}</Label>
                <SliderNumberField
                  id="ci-late-age"
                  value={lateAge}
                  onChange={setLateAge}
                  min={18}
                  max={RETIREMENT_AGE - 1}
                  suffix={t("ageSuffix")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{t("startAtAge", { age: earlyAge })}</p>
                <p className="mt-1 font-mono text-xl font-semibold text-success">
                  {formatCurrency(startEarlyResult.corpusEarly, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("totalContributedLabel")}: {formatCurrency(startEarlyResult.contributedEarly, locale)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{t("startAtAge", { age: lateAge })}</p>
                <p className="mt-1 font-mono text-xl font-semibold">
                  {formatCurrency(startEarlyResult.corpusLate, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("totalContributedLabel")}: {formatCurrency(startEarlyResult.contributedLate, locale)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
              <p>
                {t("costOfWaiting", { years: Math.abs(lateAge - earlyAge) })}:{" "}
                <span className="font-mono font-semibold">
                  {formatCurrency(startEarlyResult.corpusDiff, locale)}
                </span>
              </p>
              <p className="mt-1 text-muted-foreground">
                {t("contributionGap", {
                  amount: formatCurrency(Math.abs(startEarlyResult.contributedDiff), locale),
                })}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <CalculatorDisclaimer />
        </div>
      </CardContent>
    </Card>
  );
}
