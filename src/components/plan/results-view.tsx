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

  const corpusDisplay = useCountUp(corpus.selected);
  const requiredPmtDisplay = useCountUp(requiredPMT);
  const expenseDisplay = useCountUp(corpus.expenseAtRetirement);

  return (
    <div className="space-y-8 lg:space-y-24">
      {corpus.netMonthlyNeed === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/5 p-4 text-sm font-medium text-success">
          <CheckCircle2 className="size-5 shrink-0" />
          {t("results.pensionSufficient")}
        </div>
      )}

      {/* 1. สรุปตัวเลขใหญ่ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              <PiggyBank className="size-4 shrink-0" aria-hidden="true" />
              {t("results.summary.corpusNeeded")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold drop-shadow-[0_0_14px_var(--glow)] tabular-nums">
              {formatCurrency(corpusDisplay, locale)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              <Wallet className="size-4 shrink-0" aria-hidden="true" />
              {t("results.summary.requiredMonthly")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-mono text-2xl font-semibold tabular-nums ${savingIsSufficient ? "text-success" : "text-destructive"}`}>
              {formatCurrency(requiredPmtDisplay, locale)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("results.summary.comparedToActual")}:{" "}
              {formatCurrency(input.monthlyDeposit + input.monthlyInvestment, locale)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
              {t("results.summary.expenseAtRetirement")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {formatCurrency(expenseDisplay, locale)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("results.summary.adjustedFromToday", {
                amount: formatCurrency(input.monthlyExpenseToday, locale),
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {input.pensionMonthlyToday > 0 && (
        <p className="text-xs text-muted-foreground">{t("results.pensionAssumption")}</p>
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
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
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
