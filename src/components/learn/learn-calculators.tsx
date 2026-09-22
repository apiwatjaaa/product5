import type { ComponentType } from "react";

import type { LearnSlug } from "@/lib/learn/articles";
import { TvmCalculator } from "@/components/learn/tvm-calculator";
import { CompoundInterestChart } from "@/components/learn/compound-interest-chart";
import { InflationCalculator } from "@/components/learn/inflation-calculator";
import { RealReturnCalculator } from "@/components/learn/real-return-calculator";
import { RiskReturnCalculator } from "@/components/learn/risk-return-calculator";
import { AssetAllocationCalculator } from "@/components/learn/asset-allocation-calculator";
import { PersonalIncomeTaxCalculator } from "@/components/learn/personal-income-tax-calculator";

export const LEARN_CALCULATORS: Record<LearnSlug, ComponentType> = {
  "time-value-of-money": TvmCalculator,
  "compound-interest": CompoundInterestChart,
  inflation: InflationCalculator,
  "real-return": RealReturnCalculator,
  "risk-and-return": RiskReturnCalculator,
  "asset-allocation": AssetAllocationCalculator,
  "personal-income-tax": PersonalIncomeTaxCalculator,
};
