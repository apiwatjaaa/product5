import {
  Clock3,
  PieChart,
  Receipt,
  Scale,
  ShieldQuestion,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type { LearnSlug } from "@/lib/learn/articles";

export const ARTICLE_ICONS: Record<LearnSlug, LucideIcon> = {
  "time-value-of-money": Clock3,
  "compound-interest": TrendingUp,
  inflation: TrendingDown,
  "real-return": Scale,
  "risk-and-return": ShieldQuestion,
  "asset-allocation": PieChart,
  "personal-income-tax": Receipt,
};
