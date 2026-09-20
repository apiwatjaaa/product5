"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TrendingDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CurrencyField } from "@/components/plan/currency-field";
import { SliderNumberField } from "@/components/learn/slider-number-field";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { futureValue } from "@/lib/finance/tvm";
import { formatCurrency, formatNumber } from "@/lib/format";

const REFERENCE_AMOUNT = 100;
// ตัวอย่างตายตัวจากเอกสารโครงงาน (เงินเฟ้อ 3% 20 ปี) — ไม่ผูกกับค่าที่ผู้ใช้ปรับ ใช้สูตรเดียวกันเพื่อไม่ให้ตัวเลขเพี้ยนจากที่อ้างอิงในบทความ
const DOCUMENTED_RATE = 0.03;
const DOCUMENTED_YEARS = 20;

export function InflationCalculator() {
  const t = useTranslations("learn.inflationCalculator");
  const locale = useLocale();

  const [priceToday, setPriceToday] = useState(60);
  const [years, setYears] = useState(20);
  const [inflationPercent, setInflationPercent] = useState(3);

  const rate = inflationPercent / 100;

  const futurePrice = useMemo(() => futureValue(priceToday, rate, years), [priceToday, rate, years]);
  const realValueOfReference = useMemo(
    () => futureValue(REFERENCE_AMOUNT, rate, -years),
    [rate, years],
  );
  const documentedExampleResult = useMemo(
    () => futureValue(REFERENCE_AMOUNT, DOCUMENTED_RATE, DOCUMENTED_YEARS),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="inf-price">{t("priceToday")}</Label>
            <CurrencyField
              id="inf-price"
              value={priceToday}
              onChange={setPriceToday}
              quickAddSteps={[]}
            />
            <p className="text-xs text-muted-foreground">{t("pricePlaceholder")}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inf-years">{t("years")}</Label>
            <SliderNumberField
              id="inf-years"
              value={years}
              onChange={setYears}
              min={1}
              max={40}
              suffix={t("yearsSuffix")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inf-rate">{t("inflationRate")}</Label>
            <SliderNumberField
              id="inf-rate"
              value={inflationPercent}
              onChange={setInflationPercent}
              min={0}
              max={10}
              step={0.5}
              allowDecimal
              suffix="%"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">
              {t("futurePriceLabel", { price: formatCurrency(priceToday, locale), years })}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-destructive">
              {formatCurrency(futurePrice, locale)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">
              {t("purchasingPowerLabel", {
                amount: formatCurrency(REFERENCE_AMOUNT, locale),
                years,
              })}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-destructive">
              {formatCurrency(realValueOfReference, locale)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("documentedExample", {
                amount: formatNumber(REFERENCE_AMOUNT, locale),
                rate: DOCUMENTED_RATE * 100,
                years: DOCUMENTED_YEARS,
                result: formatNumber(documentedExampleResult, locale, 2),
              })}
            </p>
          </div>
        </div>

        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
