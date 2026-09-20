"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock3 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CurrencyField } from "@/components/plan/currency-field";
import { SliderNumberField } from "@/components/learn/slider-number-field";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { futureValue } from "@/lib/finance/tvm";
import { formatCompact, formatCurrency } from "@/lib/format";
import {
  chartTooltipContentStyle,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
} from "@/lib/chart-tooltip-style";

export function TvmCalculator() {
  const t = useTranslations("learn.tvmCalculator");
  const locale = useLocale();

  const [principal, setPrincipal] = useState(100_000);
  const [years, setYears] = useState(20);
  const [ratePercent, setRatePercent] = useState(5);

  const rate = ratePercent / 100;
  const futureVal = useMemo(() => futureValue(principal, rate, years), [principal, rate, years]);
  const gained = futureVal - principal;

  const chartData = useMemo(
    () =>
      Array.from({ length: years + 1 }, (_, year) => ({
        year,
        value: futureValue(principal, rate, year),
      })),
    [principal, rate, years],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock3 className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tvm-principal">{t("principal")}</Label>
            <CurrencyField
              id="tvm-principal"
              value={principal}
              onChange={setPrincipal}
              quickAddSteps={[10000, 50000, 100000]}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tvm-years">{t("years")}</Label>
            <SliderNumberField
              id="tvm-years"
              value={years}
              onChange={setYears}
              min={1}
              max={40}
              suffix={t("yearsSuffix")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tvm-rate">{t("rate")}</Label>
            <SliderNumberField
              id="tvm-rate"
              value={ratePercent}
              onChange={setRatePercent}
              min={1}
              max={10}
              step={0.5}
              allowDecimal
              suffix="%"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{t("futureValue")}</p>
            <p className="mt-1 font-mono text-xl font-semibold text-primary">
              {formatCurrency(futureVal, locale)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{t("gained")}</p>
            <p className="mt-1 font-mono text-xl font-semibold text-success">
              {formatCurrency(gained, locale)}
            </p>
          </div>
        </div>

        <div className="h-64 w-full" role="img" aria-label={t("title")}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => formatCompact(v, locale)}
                tick={{ fontSize: 12 }}
                width={56}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value), locale), t("futureValue")]}
                labelFormatter={(year) => `${t("yearsLabel")} ${year}`}
                contentStyle={chartTooltipContentStyle}
                labelStyle={chartTooltipLabelStyle}
                itemStyle={chartTooltipItemStyle}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
