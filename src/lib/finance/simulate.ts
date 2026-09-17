// จำลองการออมรายปี — สร้างข้อมูลสำหรับตารางรายปีและกราฟเส้น รองรับเป้าหมายพิเศษ

import type { PlanInput, SimulationResult, YearRow } from './types';

export function simulateAccumulation(input: PlanInput): SimulationResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthlyRate = input.annualReturn / 12;
  const goals = input.goals ?? [];

  let balance = input.currentSavings;
  let pmt = input.monthlyContribution;
  let cumulativeContributed = 0;
  let totalReturn = 0;
  const rows: YearRow[] = [];

  for (let year = 1; year <= yearsToRetirement; year++) {
    const startBalance = balance;
    let contributedThisYear = 0;

    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + pmt;
      contributedThisYear += pmt;
    }

    const returnThisYear = balance - startBalance - contributedThisYear;
    const age = input.currentAge + year;

    let goalWithdrawal = 0;
    for (const goal of goals) {
      if (goal.targetAge === age) {
        goalWithdrawal += goal.amountToday * Math.pow(1 + input.inflationRate, year);
      }
    }
    if (goalWithdrawal > 0) {
      balance = Math.max(0, balance - goalWithdrawal);
    }

    cumulativeContributed += contributedThisYear;
    totalReturn += returnThisYear;

    rows.push({
      year,
      age,
      monthlyContribution: pmt,
      contributedThisYear,
      returnThisYear,
      goalWithdrawal,
      endingBalance: balance,
      cumulativeContributed,
    });

    pmt = pmt * (1 + input.contributionGrowth);
  }

  return {
    rows,
    projectedAtRetirement: rows.length > 0 ? rows[rows.length - 1].endingBalance : input.currentSavings,
    totalContributed: cumulativeContributed,
    totalReturn,
  };
}
