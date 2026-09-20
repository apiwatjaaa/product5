// คำแนะนำเมื่อออมไม่ทันเป้า — rule-based คำนวณจากตัวเลขจริงทั้งหมด

import { presentValueAnnuity } from './tvm';
import { RISK_LEVEL_ORDER, RISK_PROFILES } from './constants';
import {
  calculateCorpus,
  calculateGap,
  calculateProjectedSavingsBreakdown,
  getProjectedSavings,
  requiredMonthlyContribution,
} from './corpus';
import type { CorpusResult, PlanInput, RiskLevel, Suggestion } from './types';

const MAX_DELAY_YEARS = 10;

function getNextRiskLevel(level: RiskLevel): RiskLevel | null {
  const index = RISK_LEVEL_ORDER.indexOf(level);
  if (index === RISK_LEVEL_ORDER.length - 1) return null;
  return RISK_LEVEL_ORDER[index + 1];
}

function findDelayRetirementAge(input: PlanInput): { retirementAge: number; gap: number } | null {
  for (let delta = 1; delta <= MAX_DELAY_YEARS; delta++) {
    const newRetirementAge = input.retirementAge + delta;
    if (newRetirementAge >= input.lifeExpectancy) break;

    const modifiedInput: PlanInput = { ...input, retirementAge: newRetirementAge };
    const corpus = calculateCorpus(modifiedInput);
    const projected = getProjectedSavings(modifiedInput);
    const gap = calculateGap(corpus.selected, projected);

    if (gap <= 0) return { retirementAge: newRetirementAge, gap };
  }
  return null;
}

/** รายจ่ายต่อเดือนสูงสุด (มูลค่าเงินวันนี้) ที่เงินออมปัจจุบันรองรับได้ — แก้สมการย้อนกลับจากวิธี annuity */
function calculateMaxAffordableExpenseToday(
  input: PlanInput,
  corpus: CorpusResult,
  projected: number,
): number {
  const realMonthlyRate = corpus.realAnnualRate / 12;
  const pvFactor = presentValueAnnuity(1, realMonthlyRate, corpus.monthsInRetirement);
  const netMonthlyNeedMax = projected / pvFactor;
  const expenseAtRetirementMax = netMonthlyNeedMax + corpus.pensionAtRetirement;
  return expenseAtRetirementMax / Math.pow(1 + input.inflationRate, corpus.yearsToRetirement);
}

export function generateSuggestions(input: PlanInput): Suggestion[] {
  const corpus = calculateCorpus(input);
  const projected = getProjectedSavings(input);
  const gap = calculateGap(corpus.selected, projected);

  if (gap <= 0) {
    return [
      {
        type: 'on_track',
        severity: 'success',
        titleKey: 'recommend.onTrack',
        values: { excess: projected - corpus.selected },
      },
    ];
  }

  const suggestions: Suggestion[] = [];

  // เงินเพิ่มที่ต้องออมจะเข้าเงินลงทุน (ผลตอบแทนสูงกว่า) เงินฝากคงเดิมตามแผน
  const investmentMonthlyRate = input.annualReturn / 12;
  const months = (input.retirementAge - input.currentAge) * 12;
  const { deposit: fvDeposit } = calculateProjectedSavingsBreakdown(input);
  const requiredInvestmentPMT = requiredMonthlyContribution(
    corpus.selected,
    input.currentSavingsInvestment,
    investmentMonthlyRate,
    months,
    fvDeposit,
  );
  const requiredPMT = input.monthlyDeposit + requiredInvestmentPMT;
  const currentTotalPMT = input.monthlyDeposit + input.monthlyInvestment;
  suggestions.push({
    type: 'increase_saving',
    severity: 'danger',
    titleKey: 'recommend.increaseSaving',
    values: { requiredMonthly: requiredPMT, increase: requiredPMT - currentTotalPMT },
  });

  const delay = findDelayRetirementAge(input);
  if (delay) {
    suggestions.push({
      type: 'delay_retirement',
      severity: 'warning',
      titleKey: 'recommend.delayRetirement',
      values: { newRetirementAge: delay.retirementAge, yearsDelay: delay.retirementAge - input.retirementAge },
    });
  }

  const maxExpenseToday = calculateMaxAffordableExpenseToday(input, corpus, projected);
  suggestions.push({
    type: 'reduce_expense',
    severity: 'warning',
    titleKey: 'recommend.reduceExpense',
    values: { maxMonthlyExpenseToday: maxExpenseToday },
  });

  const nextRiskLevel = getNextRiskLevel(input.riskLevel);
  if (nextRiskLevel) {
    const modifiedInput: PlanInput = {
      ...input,
      riskLevel: nextRiskLevel,
      annualReturn: RISK_PROFILES[nextRiskLevel].defaultReturn,
    };
    const newCorpus = calculateCorpus(modifiedInput);
    const newProjected = getProjectedSavings(modifiedInput);
    const newGap = calculateGap(newCorpus.selected, newProjected);
    suggestions.push({
      type: 'increase_risk',
      severity: 'warning',
      titleKey: 'recommend.increaseRisk',
      values: { newRiskReturn: RISK_PROFILES[nextRiskLevel].defaultReturn, newGap },
    });
  }

  return suggestions;
}
