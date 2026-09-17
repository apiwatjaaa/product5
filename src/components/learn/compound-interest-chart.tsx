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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { futureValue, futureValueAnnuity } from "@/lib/finance/tvm";
import { formatCompact, formatCurrency } from "@/lib/format";

const GROWTH_YEARS = 30;
const RETIREMENT_AGE = 65;
const START_AGE_EARLY = 25;
const START_AGE_LATE = 35;

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function CompoundInterestChart() {
  const t = useTranslations("learn.compoundInterestChart");
  const locale = useLocale();

  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [startRate, setStartRate] = useState(5);

  const growthData = useMemo(() => {
    const r = rate / 100;
    return Array.from({ length: GROWTH_YEARS + 1 }, (_, year) => ({
      year,
      compound: futureValue(principal, r, year),
      simple: principal * (1 + r * year),
    }));
  }, [principal, rate]);

  const startEarlyResult = useMemo(() => {
    const monthlyRate = startRate / 100 / 12;
    const monthsFromEarly = (RETIREMENT_AGE - START_AGE_EARLY) * 12;
    const monthsFromLate = (RETIREMENT_AGE - START_AGE_LATE) * 12;
    const corpusEarly = futureValueAnnuity(monthlyContribution, monthlyRate, monthsFromEarly);
    const corpusLate = futureValueAnnuity(monthlyContribution, monthlyRate, monthsFromLate);
    return {
      corpusEarly,
      corpusLate,
      contributedEarly: monthlyContribution * monthsFromEarly,
      contributedLate: monthlyContribution * monthsFromLate,
      diff: corpusEarly - corpusLate,
    };
  }, [monthlyContribution, startRate]);

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ci-principal">{t("principal")}</Label>
                <Input
                  id="ci-principal"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  value={principal}
                  onChange={(e) => setPrincipal(clamp(Number(e.target.value), 0, 10_000_000))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-rate">{t("annualRate")}</Label>
                <Input
                  id="ci-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={20}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(clamp(Number(e.target.value), 0, 20))}
                />
              </div>
            </div>

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
                  <Line
                    type="monotone"
                    dataKey="simple"
                    name={t("simpleLine")}
                    stroke="var(--color-chart-2)"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="startEarly" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ci-monthly">{t("monthlyContribution")}</Label>
                <Input
                  id="ci-monthly"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(clamp(Number(e.target.value), 0, 1_000_000))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ci-start-rate">{t("annualRate")}</Label>
                <Input
                  id="ci-start-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={20}
                  step={0.5}
                  value={startRate}
                  onChange={(e) => setStartRate(clamp(Number(e.target.value), 0, 20))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{t("startAt25")}</p>
                <p className="mt-1 font-mono text-xl font-semibold text-success">
                  {formatCurrency(startEarlyResult.corpusEarly, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("totalContributed25")}: {formatCurrency(startEarlyResult.contributedEarly, locale)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{t("startAt35")}</p>
                <p className="mt-1 font-mono text-xl font-semibold">
                  {formatCurrency(startEarlyResult.corpusLate, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("totalContributed35")}: {formatCurrency(startEarlyResult.contributedLate, locale)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
              {t("costOfWaiting")}:{" "}
              <span className="font-mono font-semibold">
                {formatCurrency(startEarlyResult.diff, locale)}
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
