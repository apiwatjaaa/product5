// คำนวณเงินก้อนที่ต้องมี ณ วันเกษียณ, เงินที่คาดว่าจะมี, เงินที่ต้องออมเพิ่ม และช่องว่าง (Gap)

import { futureValue, futureValueAnnuity, presentValueAnnuity, realRate } from './tvm';
import { simulateAccumulation } from './simulate';
import type { CorpusResult, PlanInput } from './types';

export function calculateCorpus(input: PlanInput): CorpusResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthsInRetirement = (input.lifeExpectancy - input.retirementAge) * 12;

  const expenseAtRetirement = futureValue(input.monthlyExpenseToday, input.inflationRate, yearsToRetirement);
  const pensionAtRetirement = futureValue(input.pensionMonthlyToday, input.inflationRate, yearsToRetirement);
  const netMonthlyNeed = Math.max(0, expenseAtRetirement - pensionAtRetirement);

  const realAnnualRate = realRate(input.annualReturn, input.inflationRate);
  const realMonthlyRate = realAnnualRate / 12;

  const byMethod = {
    annuity: presentValueAnnuity(netMonthlyNeed, realMonthlyRate, monthsInRetirement),
    simple: netMonthlyNeed * monthsInRetirement,
    rule4: netMonthlyNeed * 12 * 25,
  };

  return {
    yearsToRetirement,
    monthsInRetirement,
    expenseAtRetirement,
    pensionAtRetirement,
    netMonthlyNeed,
    realAnnualRate,
    byMethod,
    selected: byMethod[input.corpusMethod],
  };
}

/** เงินที่คาดว่าจะมี ณ วันเกษียณ ด้วยสูตรปิด (ไม่มีเป้าหมายพิเศษ และไม่เพิ่มเงินออมรายปี) */
export function calculateProjectedSavings(input: PlanInput): number {
  const monthsToRetirement = (input.retirementAge - input.currentAge) * 12;
  const monthlyRate = input.annualReturn / 12;

  const fvCurrentSavings = futureValue(input.currentSavings, monthlyRate, monthsToRetirement);
  const fvContributions = futureValueAnnuity(input.monthlyContribution, monthlyRate, monthsToRetirement);

  return fvCurrentSavings + fvContributions;
}

/** เงินที่คาดว่าจะมี ณ วันเกษียณ — ใช้สูตรปิดถ้าเป็นกรณีพื้นฐาน หรือจำลองรายปีถ้ามีเป้าหมายพิเศษ/เพิ่มเงินออมรายปี */
export function getProjectedSavings(input: PlanInput): number {
  const hasGoals = (input.goals?.length ?? 0) > 0;
  if (hasGoals || input.contributionGrowth > 0) {
    return simulateAccumulation(input).projectedAtRetirement;
  }
  return calculateProjectedSavings(input);
}

/** เงินที่ต้องออมต่อเดือนเพื่อให้ถึงเป้า */
export function requiredMonthlyContribution(
  corpus: number,
  currentSavings: number,
  monthlyRate: number,
  months: number,
): number {
  const fvSavings = futureValue(currentSavings, monthlyRate, months);
  const need = corpus - fvSavings;
  if (need <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-9) return need / months;
  return (need * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}

/** ช่องว่าง (Gap): > 0 คือออมไม่ทันเป้า, <= 0 คือถึงเป้าแล้ว */
export function calculateGap(corpus: number, projected: number): number {
  return corpus - projected;
}
