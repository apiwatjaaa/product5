"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { formatCompact, formatCurrency } from "@/lib/format";
import {
  chartTooltipContentStyle,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
} from "@/lib/chart-tooltip-style";
import type { YearRow } from "@/lib/finance/types";

export function GrowthChart({
  rows,
  target,
  currentAge,
}: {
  rows: YearRow[];
  target: number;
  currentAge: number;
}) {
  const t = useTranslations("results.chart");
  const locale = useLocale();

  const data = [
    { age: currentAge, balance: rows[0]?.endingBalance ? rows[0].endingBalance - rows[0].returnThisYear - rows[0].contributedThisYear : 0, contributed: 0 },
    ...rows.map((r) => ({
      age: r.age,
      balance: r.endingBalance,
      contributed: r.cumulativeContributed,
    })),
  ];

  return (
    <div className="h-80 w-full" role="img" aria-label={t("title")}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="age" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v: number) => formatCompact(v, locale)}
            tick={{ fontSize: 12 }}
            width={56}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(Number(value), locale), String(name)]}
            labelFormatter={(age) => `${t("title")} — ${age}`}
            contentStyle={chartTooltipContentStyle}
            labelStyle={chartTooltipLabelStyle}
            itemStyle={chartTooltipItemStyle}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="balance"
            name={t("returnArea")}
            stroke="none"
            fill="var(--color-chart-1)"
            fillOpacity={0.15}
          />
          <Line
            type="monotone"
            dataKey="contributed"
            name={t("contributed")}
            stroke="var(--color-chart-2)"
            strokeDasharray="4 4"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name={t("actualBalance")}
            stroke="var(--color-chart-1)"
            dot={false}
            strokeWidth={2.5}
          />
          {rows
            .filter((r) => r.goalWithdrawal > 0)
            .map((r) => (
              <ReferenceDot
                key={r.year}
                x={r.age}
                y={r.endingBalance}
                r={5}
                fill="var(--color-chart-1)"
                stroke="var(--color-background)"
                strokeWidth={2}
              />
            ))}
          <ReferenceLine
            y={target}
            stroke="var(--color-destructive)"
            strokeDasharray="6 3"
            label={{ value: t("target"), position: "insideTopRight", fontSize: 12, fill: "var(--color-destructive)" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
