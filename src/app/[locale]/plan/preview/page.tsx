import { notFound } from "next/navigation";
import { ResultsView } from "@/components/plan/results-view";
import type { PlanInput } from "@/lib/finance/types";

/**
 * หน้าดูตัวอย่างผลลัพธ์สำหรับตอนพัฒนาเท่านั้น (ใช้ตรวจหน้าตาโดยไม่ต้องล็อกอิน)
 * บนเว็บจริง (production) หน้านี้จะขึ้น 404 เสมอ
 */
const SAMPLE: PlanInput = {
  currentAge: 25,
  retirementAge: 60,
  lifeExpectancy: 85,
  monthlyExpenseToday: 20000,
  currentSavingsDeposit: 0,
  currentSavingsInvestment: 100000,
  monthlyDeposit: 0,
  monthlyInvestment: 8000,
  riskLevel: "moderate",
  inflationRate: 0.03,
  annualReturn: 0.05,
  depositReturn: 0.015,
  contributionGrowth: 0,
  pensionMonthlyToday: 0,
  corpusMethod: "annuity",
  goals: [{ name: "ซื้อบ้าน", amountToday: 500000, targetAge: 35 }],
};

export default function PlanPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">แผนตัวอย่าง (TC-01)</h1>
      <ResultsView input={SAMPLE} />
    </main>
  );
}
