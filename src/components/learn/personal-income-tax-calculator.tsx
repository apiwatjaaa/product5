"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Receipt } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyField } from "@/components/plan/currency-field";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import {
  PERSONAL_ALLOWANCE,
  STANDARD_EXPENSE_DEDUCTION_CAP,
  calculateEmploymentTaxableIncome,
  calculateProgressiveTax,
} from "@/lib/finance/tax";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

type IncomeMode = "average" | "monthly";

const DEFAULT_MONTHLY_INCOME = 35000;

export function PersonalIncomeTaxCalculator() {
  const t = useTranslations("learn.personalIncomeTaxCalculator");
  const locale = useLocale();

  const [incomeMode, setIncomeMode] = useState<IncomeMode>("average");
  const [monthlyIncome, setMonthlyIncome] = useState(DEFAULT_MONTHLY_INCOME);
  const [monthlyIncomes, setMonthlyIncomes] = useState<number[]>(() =>
    Array<number>(12).fill(DEFAULT_MONTHLY_INCOME),
  );

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", { month: "short" });
    return Array.from({ length: 12 }, (_, month) => fmt.format(new Date(2024, month, 1)));
  }, [locale]);

  function updateMonthlyIncome(index: number, value: number) {
    setMonthlyIncomes((prev) => prev.map((current, i) => (i === index ? value : current)));
  }

  const annualIncome =
    incomeMode === "monthly" ? monthlyIncomes.reduce((sum, value) => sum + value, 0) : monthlyIncome * 12;
  const averageMonthlyIncome = annualIncome / 12;

  const expenseDeduction = useMemo(
    () => Math.min(annualIncome * 0.5, STANDARD_EXPENSE_DEDUCTION_CAP),
    [annualIncome],
  );
  const netTaxableIncome = useMemo(() => calculateEmploymentTaxableIncome(annualIncome), [annualIncome]);
  const taxResult = useMemo(() => calculateProgressiveTax(netTaxableIncome), [netTaxableIncome]);

  const effectiveRateOnGross = annualIncome > 0 ? taxResult.totalTax / annualIncome : 0;
  const monthlyTax = taxResult.totalTax / 12;
  const netMonthlyIncome = averageMonthlyIncome - monthlyTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Tabs value={incomeMode} onValueChange={(value) => setIncomeMode(value as IncomeMode)}>
            <TabsList>
              <TabsTrigger value="average">{t("modeAverage")}</TabsTrigger>
              <TabsTrigger value="monthly">{t("modeMonthly")}</TabsTrigger>
            </TabsList>

            <TabsContent value="average" className="mt-3 space-y-1.5">
              <Label htmlFor="tax-income">{t("monthlyIncome")}</Label>
              <CurrencyField
                id="tax-income"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                quickAddSteps={[5000, 10000, 50000]}
              />
              <p className="text-xs text-muted-foreground">{t("monthlyIncomeHelper")}</p>
            </TabsContent>

            <TabsContent value="monthly" className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {monthLabels.map((label, index) => (
                  <div key={label} className="space-y-1">
                    <Label htmlFor={`tax-income-month-${index}`} className="text-xs text-muted-foreground">
                      {label}
                    </Label>
                    <CurrencyField
                      id={`tax-income-month-${index}`}
                      value={monthlyIncomes[index]}
                      onChange={(value) => updateMonthlyIncome(index, value)}
                      quickAddSteps={[]}
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">{t("totalAnnualIncome")}</p>
                <p className="mt-1 font-mono text-lg font-semibold">{formatCurrency(annualIncome, locale)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t("monthlyModeHelper")}</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">
              {t("expenseDeduction", { cap: formatNumber(STANDARD_EXPENSE_DEDUCTION_CAP, locale) })}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold">{formatCurrency(expenseDeduction, locale)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{t("personalAllowance")}</p>
            <p className="mt-1 font-mono text-lg font-semibold">{formatCurrency(PERSONAL_ALLOWANCE, locale)}</p>
          </div>
          <div className="rounded-lg border p-4 sm:col-span-2">
            <p className="text-xs text-muted-foreground">{t("netTaxableIncome")}</p>
            <p className="mt-1 font-mono text-lg font-semibold">{formatCurrency(netTaxableIncome, locale)}</p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground">{t("totalTax")}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">
            {formatCurrency(taxResult.totalTax, locale)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("monthlyTax", { amount: formatCurrency(monthlyTax, locale) })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{t("netMonthlyIncome")}</p>
            <p className="mt-1 font-mono text-lg font-semibold">{formatCurrency(netMonthlyIncome, locale)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{t("effectiveRate")}</p>
            <p className="mt-1 font-mono text-lg font-semibold">
              {formatPercent(effectiveRateOnGross, locale, 1)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("marginalRate", { rate: formatPercent(taxResult.marginalRate, locale, 0) })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t("bracketTitle")}</p>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("bracketHeaderRange")}</TableHead>
                  <TableHead className="text-right">{t("bracketHeaderRate")}</TableHead>
                  <TableHead className="text-right">{t("bracketHeaderTax")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxResult.brackets.map((bracket) => (
                  <TableRow key={bracket.from}>
                    <TableCell>
                      {bracket.upTo === null
                        ? t("bracketRangeOpen", { from: formatNumber(bracket.from, locale) })
                        : t("bracketRangeTo", {
                            from: formatNumber(bracket.from, locale),
                            to: formatNumber(bracket.upTo, locale),
                          })}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPercent(bracket.rate, locale, 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(bracket.taxForBracket, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{t("scopeNote")}</p>
        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
