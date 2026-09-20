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

type ChartPoint = {
  age: number;
  /** เงินต้นที่ออมไปสะสม (เงินเริ่มต้น + เงินสมทบสะสม) — ไม่ลดลงจากการถอนเป้าหมายพิเศษ */
  principal: number;
  /** ยอดรวมจริง (ไม่ถูกตัดเป็น null) — ใช้เป็นแหล่งข้อมูลเดียวของ tooltip ให้ตรงกับตารางรายปีเสมอ */
  total: number;
  totalPositive: number | null;
  totalNegative: number | null;
};

/** ฝั่งของยอดเงิน ณ จุดหนึ่ง — ใช้แทน Math.sign() เพราะ 0 ต้องนับเป็นฝั่งบวก ไม่ใช่ฝั่งกลางที่ทำให้เข้าใจผิดว่าข้ามศูนย์ */
function isNegativeSide(v: number): boolean {
  return v < 0;
}

function ChartTooltip({
  active,
  payload,
  ageLabel,
  principalLabel,
  totalLabel,
  totalNegativeLabel,
  locale,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  ageLabel: (age: number) => string;
  principalLabel: string;
  totalLabel: string;
  totalNegativeLabel: string;
  locale: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const isNegative = point.total < 0;

  return (
    <div style={chartTooltipContentStyle}>
      <p style={chartTooltipLabelStyle}>{ageLabel(point.age)}</p>
      <p style={chartTooltipItemStyle}>
        {principalLabel}: {formatCurrency(point.principal, locale)}
      </p>
      <p
        style={{
          ...chartTooltipItemStyle,
          color: isNegative ? "var(--color-destructive)" : chartTooltipItemStyle.color,
          fontWeight: 600,
        }}
      >
        {isNegative ? totalNegativeLabel : totalLabel}: {formatCurrency(point.total, locale)}
      </p>
    </div>
  );
}

export function GrowthChart({
  rows,
  target,
  currentAge,
  initialSavings,
}: {
  rows: YearRow[];
  target: number;
  currentAge: number;
  initialSavings: number;
}) {
  const t = useTranslations("results.chart");
  const locale = useLocale();

  const startPoint: ChartPoint = {
    age: currentAge,
    principal: initialSavings,
    total: initialSavings,
    totalPositive: initialSavings >= 0 ? initialSavings : null,
    totalNegative: isNegativeSide(initialSavings) ? initialSavings : null,
  };

  const yearPoints: ChartPoint[] = rows.map((r, i) => {
    const prev = i === 0 ? { endingBalance: initialSavings } : rows[i - 1];
    const next = rows[i + 1];
    const prevNeg = isNegativeSide(prev.endingBalance);
    const nextNeg = next ? isNegativeSide(next.endingBalance) : isNegativeSide(r.endingBalance);
    const currentNeg = isNegativeSide(r.endingBalance);
    // รวมจุดตัดศูนย์ไว้ในทั้งสองเส้น ให้เส้นบวก/ลบต่อกันสนิทตรงจุดที่ข้ามศูนย์
    const isCrossing = currentNeg !== prevNeg || currentNeg !== nextNeg;
    const principal = initialSavings + r.cumulativeContributed;

    return {
      age: r.age,
      principal,
      total: r.endingBalance,
      totalPositive: !currentNeg || isCrossing ? r.endingBalance : null,
      totalNegative: currentNeg || isCrossing ? r.endingBalance : null,
    };
  });

  const data = [startPoint, ...yearPoints];
  const hasNegative = rows.some((r) => r.endingBalance < 0);

  return (
    <div className="h-80 w-full" role="img" aria-label={t("title")}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="age" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v: number) => formatCompact(v, locale)} tick={{ fontSize: 12 }} width={56} />
          <Tooltip
            content={
              <ChartTooltip
                ageLabel={(age) => t("ageLabel", { age })}
                principalLabel={t("principal")}
                totalLabel={t("actualBalance")}
                totalNegativeLabel={t("actualBalanceNegative")}
                locale={locale}
              />
            }
          />
          <Legend />
          <ReferenceLine y={0} stroke="var(--color-foreground)" strokeWidth={1.5} label={{ value: "0", position: "insideBottomLeft", fontSize: 11, fill: "var(--color-muted-foreground)" }} />
          <Area
            type="monotone"
            dataKey="totalNegative"
            stroke="none"
            fill="var(--color-destructive)"
            fillOpacity={0.12}
            connectNulls={false}
            legendType="none"
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="principal"
            name={t("principal")}
            stroke="var(--color-chart-2)"
            strokeDasharray="4 2"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="totalPositive"
            name={t("actualBalance")}
            stroke="var(--color-chart-1)"
            dot={false}
            strokeWidth={2.5}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="totalNegative"
            name={t("actualBalanceNegative")}
            stroke="var(--color-destructive)"
            strokeDasharray="6 3"
            dot={false}
            strokeWidth={2.5}
            connectNulls={false}
            legendType={hasNegative ? "line" : "none"}
          />
          {rows
            .filter((r) => r.goalWithdrawal > 0)
            .map((r) => (
              <ReferenceDot
                key={r.year}
                x={r.age}
                y={r.endingBalance}
                r={5}
                fill={r.endingBalance < 0 ? "var(--color-destructive)" : "var(--color-chart-1)"}
                stroke="var(--color-background)"
                strokeWidth={2}
              />
            ))}
          <ReferenceLine
            y={target}
            stroke="var(--color-chart-4)"
            strokeDasharray="6 3"
            label={{ value: t("target"), position: "insideTopRight", fontSize: 12, fill: "var(--color-chart-4)" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
