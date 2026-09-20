// จำลองการออมรายปี — สร้างข้อมูลสำหรับตารางรายปีและกราฟเส้น รองรับเป้าหมายพิเศษ

import type { GoalShortfall, PlanInput, SimulationResult, YearRow } from './types';

export function simulateAccumulation(input: PlanInput): SimulationResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const depositMonthlyRate = input.depositReturn / 12;
  const investmentMonthlyRate = input.annualReturn / 12;
  const goals = input.goals ?? [];

  let depositBalance = input.currentSavingsDeposit;
  let investmentBalance = input.currentSavingsInvestment;
  let depositPmt = input.monthlyDeposit;
  let investmentPmt = input.monthlyInvestment;
  let cumulativeContributed = 0;
  let totalReturn = 0;
  const rows: YearRow[] = [];

  for (let year = 1; year <= yearsToRetirement; year++) {
    const startBalance = depositBalance + investmentBalance;
    let contributedThisYear = 0;

    for (let month = 1; month <= 12; month++) {
      depositBalance = depositBalance * (1 + depositMonthlyRate) + depositPmt;
      investmentBalance = investmentBalance * (1 + investmentMonthlyRate) + investmentPmt;
      contributedThisYear += depositPmt + investmentPmt;
    }

    const returnThisYear = depositBalance + investmentBalance - startBalance - contributedThisYear;
    const age = input.currentAge + year;

    let goalWithdrawal = 0;
    for (const goal of goals) {
      if (goal.targetAge === age) {
        goalWithdrawal += goal.amountToday * Math.pow(1 + input.inflationRate, year);
      }
    }
    // ถอนจากเงินฝาก (สภาพคล่องสูงกว่า) ก่อนเสมอ — ยอมให้ติดลบได้จริงถ้าเงินไม่พอ ไม่ตัดเป็น 0
    if (goalWithdrawal > 0) {
      depositBalance -= goalWithdrawal;
    }

    const endingBalance = depositBalance + investmentBalance;

    cumulativeContributed += contributedThisYear;
    totalReturn += returnThisYear;

    rows.push({
      year,
      age,
      monthlyContribution: depositPmt + investmentPmt,
      contributedThisYear,
      returnThisYear,
      goalWithdrawal,
      depositBalance,
      investmentBalance,
      endingBalance,
      cumulativeContributed,
    });

    depositPmt = depositPmt * (1 + input.contributionGrowth);
    investmentPmt = investmentPmt * (1 + input.contributionGrowth);
  }

  return {
    rows,
    projectedAtRetirement:
      rows.length > 0
        ? rows[rows.length - 1].endingBalance
        : input.currentSavingsDeposit + input.currentSavingsInvestment,
    totalContributed: cumulativeContributed,
    totalReturn,
  };
}

/**
 * หาเป้าหมายพิเศษที่ทำให้ยอดเงินรวมติดลบ (ไม่พอ) พร้อมคำนวณว่าขาดเท่าไหร่
 * และต้องออมเพิ่ม (เข้าเงินลงทุน) เดือนละเท่าไหร่ตั้งแต่วันนี้ถึงอายุเป้าหมายนั้น เพื่อไม่ให้ติดลบ
 */
export function findGoalShortfalls(input: PlanInput): GoalShortfall[] {
  const simulation = simulateAccumulation(input);
  const goals = (input.goals ?? []).slice().sort((a, b) => a.targetAge - b.targetAge);
  const investmentMonthlyRate = input.annualReturn / 12;

  const shortfalls: GoalShortfall[] = [];

  for (const goal of goals) {
    const rowsFromGoal = simulation.rows.filter((r) => r.age >= goal.targetAge);
    if (rowsFromGoal.length === 0) continue;

    const worstBalance = rowsFromGoal.reduce((min, r) => Math.min(min, r.endingBalance), Infinity);
    if (worstBalance >= 0) continue;

    const firstNegativeRow = rowsFromGoal.find((r) => r.endingBalance < 0);
    const negativeFromAge = firstNegativeRow ? firstNegativeRow.age : goal.targetAge;
    const shortfall = Math.abs(worstBalance);
    const monthsToGoal = (goal.targetAge - input.currentAge) * 12;
    let requiredExtraMonthly = 0;
    if (monthsToGoal > 0) {
      requiredExtraMonthly =
        Math.abs(investmentMonthlyRate) < 1e-9
          ? shortfall / monthsToGoal
          : (shortfall * investmentMonthlyRate) / (Math.pow(1 + investmentMonthlyRate, monthsToGoal) - 1);
    }

    shortfalls.push({
      goalName: goal.name,
      targetAge: goal.targetAge,
      negativeFromAge,
      shortfall,
      requiredExtraMonthly,
    });
  }

  return shortfalls;
}
