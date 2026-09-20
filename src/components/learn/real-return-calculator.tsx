"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, Scale } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SliderNumberField } from "@/components/learn/slider-number-field";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { realRate } from "@/lib/finance/tvm";
import { formatPercent } from "@/lib/format";

const PRESETS = [
  { key: "deposit", value: 1.5 },
  { key: "bond", value: 3 },
  { key: "stock", value: 8 },
] as const;

export function RealReturnCalculator() {
  const t = useTranslations("learn.realReturnCalculator");
  const locale = useLocale();

  const [nominalPercent, setNominalPercent] = useState(1.5);
  const [inflationPercent, setInflationPercent] = useState(3);

  const real = useMemo(
    () => realRate(nominalPercent / 100, inflationPercent / 100),
    [nominalPercent, inflationPercent],
  );
  const isNegative = real < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="rr-nominal">{t("nominalRate")}</Label>
            <SliderNumberField
              id="rr-nominal"
              value={nominalPercent}
              onChange={setNominalPercent}
              min={0}
              max={15}
              step={0.5}
              allowDecimal
              suffix="%"
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.key}
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setNominalPercent(preset.value)}
                >
                  {t(`preset.${preset.key}`)} ({preset.value}%)
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rr-inflation">{t("inflationRate")}</Label>
            <SliderNumberField
              id="rr-inflation"
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

        <div
          className={`rounded-lg border p-4 ${
            isNegative ? "border-destructive/40 bg-destructive/5" : "border-success/40 bg-success/5"
          }`}
        >
          <p className="text-xs text-muted-foreground">{t("realReturn")}</p>
          <p
            className={`mt-1 font-mono text-2xl font-semibold ${
              isNegative ? "text-destructive" : "text-success"
            }`}
          >
            {formatPercent(real, locale, 2)}
          </p>
          {isNegative && (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {t("negativeWarning")}
            </p>
          )}
        </div>

        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
