"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Lightbulb,
  LineChart,
  PieChart,
  PiggyBank,
  Scale,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { GrowthChart } from "@/components/charts/growth-chart";
import { PortfolioPie } from "@/components/charts/portfolio-pie";
import { YearlyTable } from "@/components/plan/yearly-table";
import { MethodComparison } from "@/components/plan/method-comparison";
import { Disclaimer } from "@/components/plan/disclaimer";
import { GapAlert, OnTrackNote } from "@/components/plan/gap-alert";
import { GoalShortfallAlert } from "@/components/plan/goal-shortfall-alert";

import {
  calculateCorpus,
  calculateGap,
  calculateProjectedSavingsBreakdown,
  getProjectedSavings,
  requiredMonthlyContribution,
} from "@/lib/finance/corpus";
import { findGoalShortfalls, simulateAccumulation } from "@/lib/finance/simulate";
import { generateSuggestions } from "@/lib/finance/recommend";
import { RISK_PROFILES } from "@/lib/finance/constants";
import { formatCurrency } from "@/lib/format";
import { useCountUp } from "@/lib/use-count-up";
import type { PlanInput } from "@/lib/finance/types";

/** วงแหวนแสดงว่าเงินที่คาดว่าจะมี คิดเป็นกี่ % ของเป้าหมาย */
function ProgressRing({ value }: { value: number }) {
  const t = useTranslations("results.summary");
  const pct = Math.round(value * 100);
  const r = 52;
  const c = 2 * Math.PI * r;
  const done = value >= 1;
  return (
    <div className="relative size-40" role="img" aria-label={t("progressAria", { pct })}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={done ? "var(--color-success)" : "var(--color-primary)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          className="drop-shadow-[0_0_8px_var(--glow)] transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold tabular-nums">{pct}%</span>
        <span className="text-xs font-medium text-muted-foreground">{t("progressUnit")}</span>
      </div>
    </div>
  );
}

export function ResultsView({ input }: { input: PlanInput }) {
  const t = useTranslations();
  const locale = useLocale();

  const corpus = useMemo(() => calculateCorpus(input), [input]);
  const simulation = useMemo(() => simulateAccumulation(input), [input]);
  const projected = useMemo(() => getProjectedSavings(input), [input]);
  const gap = calculateGap(corpus.selected, projected);
  const suggestions = useMemo(() => generateSuggestions(input), [input]);
  const goalShortfalls = useMemo(() => findGoalShortfalls(input), [input]);
  const riskProfile = RISK_PROFILES[input.riskLevel];

  const months = (input.retirementAge - input.currentAge) * 12;
  const { deposit: fvDeposit } = calculateProjectedSavingsBreakdown(input);
  const requiredInvestmentPMT = requiredMonthlyContribution(
    corpus.selected,
    input.currentSavingsInvestment,
    input.annualReturn / 12,
    months,
    fvDeposit,
  );
  const requiredPMT = input.monthlyDeposit + requiredInvestmentPMT;
  const savingIsSufficient = input.monthlyDeposit + input.monthlyInvestment >= requiredPMT;

  const progress = corpus.selected > 0 ? Math.min(1, Math.max(0, projected / corpus.selected)) : 1;

  const corpusDisplay = useCountUp(corpus.selected);
  const requiredPmtDisplay = useCountUp(requiredPMT);
  const expenseDisplay = useCountUp(corpus.expenseAtRetirement);

  return (
    <div className="space-y-8 lg:space-y-12">
      {corpus.netMonthlyNeed === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/5 p-4 text-sm font-medium text-success">
          <CheckCircle2 className="size-5 shrink-0" />
          {t("results.pensionSufficient")}
        </div>
      )}

      {/* 1. แผงสรุปหลัก: วงแหวนความคืบหน้า + ตัวเลขสำคัญ 3 ตัว */}
      <Card className="relative overflow-hidden border-primary/25 shadow-xl shadow-black/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70"
        />
        <CardContent className="relative grid grid-cols-1 items-center gap-8 py-2 md:grid-cols-[auto_1fr] md:gap-10">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing value={progress} />
            <p className="text-center text-sm text-muted-foreground">
              {t("results.summary.projectedLabel")}{" "}
              <span className="font-mono font-semibold text-foreground tabular-nums">{formatCurrency(projected, locale)}</span>
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:border-l md:pl-10">
            <div>
              <dt className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <PiggyBank className="size-4 shrink-0" aria-hidden="true" />
                {t("results.summary.corpusNeeded")}
              </dt>
              <dd className="mt-2 font-mono text-[1.6rem] leading-tight font-semibold text-primary drop-shadow-[0_0_14px_var(--glow)] tabular-nums">
                {formatCurrency(corpusDisplay, locale)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Wallet className="size-4 shrink-0" aria-hidden="true" />
                {t("results.summary.requiredMonthly")}
              </dt>
              <dd
                className={`mt-2 font-mono text-[1.6rem] leading-tight font-semibold tabular-nums ${
                  savingIsSufficient ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(requiredPmtDisplay, locale)}
              </dd>
              <dd className="mt-1 text-sm text-muted-foreground">
                {t("results.summary.comparedToActual")}:{" "}
                {formatCurrency(input.monthlyDeposit + input.monthlyInvestment, locale)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
                {t("results.summary.expenseAtRetirement")}
              </dt>
              <dd className="mt-2 font-mono text-[1.6rem] leading-tight font-semibold tabular-nums">
                {formatCurrency(expenseDisplay, locale)}
              </dd>
              <dd className="mt-1 text-sm text-muted-foreground">
                {t("results.summary.adjustedFromToday", {
                  amount: formatCurrency(input.monthlyExpenseToday, locale),
                })}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {input.pensionMonthlyToday > 0 && (
        <p className="text-sm text-muted-foreground">{t("results.pensionAssumption")}</p>
      )}

      {/* 2. กล่องเตือนเมื่อออมไม่ทันเป้า */}
      <GapAlert gap={gap} suggestions={suggestions} />
      {gap <= 0 && <OnTrackNote excess={projected - corpus.selected} />}

      {/* 3. กราฟเส้นการเติบโตของเงินออม */}
      <Reveal className="space-y-4">
        <GoalShortfallAlert shortfalls={goalShortfalls} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("results.chart.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart
              rows={simulation.rows}
              target={corpus.selected}
              currentAge={input.currentAge}
              initialSavings={input.currentSavingsDeposit + input.currentSavingsInvestment}
            />
          </CardContent>
        </Card>
      </Reveal>

      {/* 4. กราฟวงกลมสัดส่วนพอร์ต */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("results.portfolio.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <PortfolioPie allocation={riskProfile.allocation} />
            <div className="space-y-2 text-sm">
              <p className="font-medium">{t(`riskLevel.${input.riskLevel}`)}</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {riskProfile.assetsTh.map((asset) => (
                  <li key={asset}>{asset}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 5. คำแนะนำการออมและการลงทุน */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("results.recommend.savingTips.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>{t("results.recommend.savingTips.payYourselfFirst")}</li>
              <li>{t("results.recommend.savingTips.autoTransfer")}</li>
              <li>{t("results.recommend.savingTips.reviewYearly")}</li>
              {corpus.yearsToRetirement < 10 && (
                <li className="flex items-start gap-1.5 text-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                  {t("results.recommend.savingTips.nearRetirement")}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </Reveal>

      {/* 6. ตารางแผนการออมรายปี */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("results.table.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyTable rows={simulation.rows} />
          </CardContent>
        </Card>
      </Reveal>

      {/* 7. เปรียบเทียบ 3 วิธีคำนวณ */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("results.comparison.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MethodComparison corpus={corpus} selectedMethod={input.corpusMethod} />
          </CardContent>
        </Card>
      </Reveal>

      {/* 8. ข้อความปฏิเสธความรับผิดชอบ */}
      <Reveal>
        <Disclaimer />
      </Reveal>
    </div>
  );
}
