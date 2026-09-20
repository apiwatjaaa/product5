"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PieChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PortfolioPie } from "@/components/charts/portfolio-pie";
import { CalculatorDisclaimer } from "@/components/learn/calculator-disclaimer";
import { RISK_LEVEL_ORDER, RISK_PROFILES } from "@/lib/finance/constants";
import type { RiskLevel } from "@/lib/finance/types";

export function AssetAllocationCalculator() {
  const t = useTranslations("learn.assetAllocationCalculator");
  const tRisk = useTranslations("riskLevel");

  const [riskLevel, setRiskLevel] = useState<RiskLevel>("moderate");
  const profile = RISK_PROFILES[riskLevel];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>{t("chooseRisk")}</Label>
          <RadioGroup
            value={riskLevel}
            onValueChange={(v) => setRiskLevel(v as RiskLevel)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {RISK_LEVEL_ORDER.map((level) => (
              <Label
                key={level}
                htmlFor={`aa-risk-${level}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
              >
                <RadioGroupItem value={level} id={`aa-risk-${level}`} />
                {tRisk(level)}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <PortfolioPie allocation={profile.allocation} />

        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
