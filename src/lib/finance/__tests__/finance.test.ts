// ชุดทดสอบ TC-01 ถึง TC-10 ตามสเปก (คลาดเคลื่อนได้ไม่เกิน ±1 บาท)
// TC-01 ถึง TC-08 คือกรณีเดิมทั้งหมด ย้ายมาใช้ฟิลด์เงินฝาก/เงินลงทุนแยกกัน โดยใส่เงินก้อนเดิม
// ทั้งหมดไว้ที่ "เงินลงทุน" (เงินฝาก = 0) ผลลัพธ์จึงต้องตรงกับตัวเลขเดิมทุกตัว
// TC-09, TC-10 คือกรณีใหม่: แยกเงินฝาก/เงินลงทุนจริง และยอดเงินติดลบได้เมื่อเป้าหมายพิเศษดึงเงินเกิน

import { describe, expect, it } from 'vitest';
import { futureValue, futureValueAnnuity, futureValueSimple, presentValueAnnuity, realRate } from '../tvm';
import {
  calculateCorpus,
  calculateGap,
  calculateProjectedSavings,
  getProjectedSavings,
  requiredMonthlyContribution,
} from '../corpus';
import { findGoalShortfalls, simulateAccumulation } from '../simulate';
import { generateSuggestions } from '../recommend';
import { calculateEmploymentTaxableIncome, calculateProgressiveTax } from '../tax';
import type { PlanInput } from '../types';

const TOLERANCE = 1;

function expectClose(actual: number, expected: number, tolerance = TOLERANCE) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

function basePlan(overrides: Partial<PlanInput>): PlanInput {
  return {
    currentAge: 25,
    retirementAge: 60,
    lifeExpectancy: 85,
    monthlyExpenseToday: 20000,
    currentSavingsDeposit: 0,
    currentSavingsInvestment: 100000,
    monthlyDeposit: 0,
    monthlyInvestment: 8000,
    riskLevel: 'moderate',
    inflationRate: 0.03,
    annualReturn: 0.05,
    depositReturn: 0.015,
    contributionGrowth: 0,
    pensionMonthlyToday: 0,
    corpusMethod: 'annuity',
    ...overrides,
  };
}

describe('tvm.ts', () => {
  it('futureValue คำนวณดอกเบี้ยทบต้น', () => {
    expectClose(futureValue(100, 0.03, 20), 180.61, 0.01);
  });

  it('futureValueAnnuity กันหารศูนย์เมื่อ rate ใกล้ 0', () => {
    expect(futureValueAnnuity(1000, 0, 12)).toBe(12000);
  });

  it('presentValueAnnuity กันหารศูนย์เมื่อ rate ใกล้ 0', () => {
    expect(presentValueAnnuity(1000, 0, 12)).toBe(12000);
  });

  it('realRate ใช้สูตร Fisher เต็ม', () => {
    expectClose(realRate(0.05, 0.03) * 100, 1.9417, 0.001);
    expect(realRate(0.03, 0.03)).toBeCloseTo(0, 9);
  });

  it('futureValueSimple คำนวณดอกเบี้ยธรรมดา (ไม่ทบต้น)', () => {
    expect(futureValueSimple(100, 0.05, 10)).toBeCloseTo(150, 9);
    expect(futureValueSimple(1000, 0, 20)).toBe(1000);
  });

  it('futureValueSimple ให้ผลน้อยกว่า futureValue เสมอเมื่อ n > 1 และ rate > 0', () => {
    const simple = futureValueSimple(10000, 0.05, 30);
    const compound = futureValue(10000, 0.05, 30);
    expect(simple).toBeLessThan(compound);
  });
});

describe('TC-01 กรณีมาตรฐาน', () => {
  const input = basePlan({});
  const corpus = calculateCorpus(input);
  const projected = calculateProjectedSavings(input);

  it('รายจ่ายต่อเดือน ณ วันเกษียณ', () => {
    expectClose(corpus.expenseAtRetirement, 56277.25);
  });

  it('อัตราผลตอบแทนที่แท้จริง', () => {
    expectClose(corpus.realAnnualRate * 100, 1.9417, 0.001);
  });

  it('เงินก้อนวิธี A/B/C', () => {
    expectClose(corpus.byMethod.annuity, 13366752.17);
    expectClose(corpus.byMethod.simple, 16883174.73);
    expectClose(corpus.byMethod.rule4, 16883174.73);
  });

  it('เงินที่คาดว่าจะมี', () => {
    expectClose(projected, 9662111.25);
  });

  it('ช่องว่างและเงินที่ต้องออมเพิ่ม', () => {
    const gap = calculateGap(corpus.byMethod.annuity, projected);
    expectClose(gap, 3704640.92);

    const requiredPMT = requiredMonthlyContribution(
      corpus.byMethod.annuity,
      input.currentSavingsInvestment,
      input.annualReturn / 12,
      (input.retirementAge - input.currentAge) * 12,
    );
    expectClose(requiredPMT, 11260.86);
  });
});

describe('TC-02 ผลตอบแทนเท่ากับเงินเฟ้อ (เคสหารศูนย์)', () => {
  const input = basePlan({ annualReturn: 0.03 });
  const corpus = calculateCorpus(input);
  const projected = calculateProjectedSavings(input);

  it('อัตราผลตอบแทนที่แท้จริงเป็น 0 พอดี', () => {
    expect(corpus.realAnnualRate).toBeCloseTo(0, 9);
  });

  it('เงินก้อนวิธี A เท่ากับวิธี B เมื่อ realRate = 0', () => {
    expectClose(corpus.byMethod.annuity, 16883174.73);
    expectClose(corpus.byMethod.annuity, corpus.byMethod.simple, 0.01);
  });

  it('เงินที่คาดว่าจะมีและเงินที่ต้องออมเพิ่ม ไม่พัง', () => {
    expectClose(projected, 6217900.17);
    const requiredPMT = requiredMonthlyContribution(
      corpus.byMethod.annuity,
      input.currentSavingsInvestment,
      input.annualReturn / 12,
      (input.retirementAge - input.currentAge) * 12,
    );
    expectClose(requiredPMT, 22382.14);
  });
});

describe('TC-03 เริ่มออมช้า ความเสี่ยงสูง (ถึงเป้าแล้ว)', () => {
  const input = basePlan({
    currentAge: 40,
    monthlyExpenseToday: 25000,
    currentSavingsInvestment: 500000,
    monthlyInvestment: 15000,
    riskLevel: 'aggressive',
    annualReturn: 0.08,
  });
  const corpus = calculateCorpus(input);
  const projected = calculateProjectedSavings(input);

  it('รายจ่าย ณ วันเกษียณ และอัตราผลตอบแทนที่แท้จริง', () => {
    expectClose(corpus.expenseAtRetirement, 45152.78);
    expectClose(corpus.realAnnualRate * 100, 4.8544, 0.001);
  });

  it('เงินก้อนวิธี A และเงินที่คาดว่าจะมี', () => {
    expectClose(corpus.byMethod.annuity, 7837164.79);
    expectClose(projected, 11298707.62);
  });

  it('ช่องว่างติดลบ = ถึงเป้าแล้ว → on_track', () => {
    const gap = calculateGap(corpus.byMethod.annuity, projected);
    expectClose(gap, -3461542.83);

    const suggestions = generateSuggestions(input);
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].type).toBe('on_track');
  });
});

describe('TC-04 มีเงินบำนาญ', () => {
  const input = basePlan({
    currentAge: 30,
    monthlyExpenseToday: 30000,
    currentSavingsInvestment: 200000,
    monthlyInvestment: 10000,
    pensionMonthlyToday: 6000,
  });
  const corpus = calculateCorpus(input);
  const projected = calculateProjectedSavings(input);

  it('รายจ่ายและเงินบำนาญ ณ วันเกษียณ', () => {
    expectClose(corpus.expenseAtRetirement, 72817.87);
    expectClose(corpus.pensionAtRetirement, 14563.57);
    expectClose(corpus.netMonthlyNeed, 58254.3);
  });

  it('เงินก้อนวิธี A, เงินที่คาดว่าจะมี, ต้องออมเดือนละ', () => {
    expectClose(corpus.byMethod.annuity, 13836333.41);
    expectClose(projected, 9216135.22);

    const requiredPMT = requiredMonthlyContribution(
      corpus.byMethod.annuity,
      input.currentSavingsInvestment,
      input.annualReturn / 12,
      (input.retirementAge - input.currentAge) * 12,
    );
    expectClose(requiredPMT, 15551.4);
  });
});

describe('TC-05 อายุยืน 90 ปี (วิธี B ≠ วิธี C)', () => {
  const input = basePlan({
    currentAge: 30,
    lifeExpectancy: 90,
    currentSavingsInvestment: 0,
    monthlyInvestment: 10000,
  });
  const corpus = calculateCorpus(input);

  it('เงินก้อนวิธี A, B, C ต่างกัน', () => {
    expectClose(corpus.byMethod.annuity, 13237931.27);
    expectClose(corpus.byMethod.simple, 17476289.79);
    expectClose(corpus.byMethod.rule4, 14563574.83);
    expect(Math.abs(corpus.byMethod.simple - corpus.byMethod.rule4)).toBeGreaterThan(1);
  });
});

describe('TC-06 ตารางรายปี (TC-01 + เพิ่มเงินออมปีละ 3%)', () => {
  const input = basePlan({ contributionGrowth: 0.03 });
  const result = simulateAccumulation(input);

  const expectedRows = [
    { year: 1, age: 26, endingBalance: 203347.03, nextPmt: 8240.0 },
    { year: 2, age: 27, endingBalance: 314928.42, nextPmt: 8487.2 },
    { year: 3, age: 28, endingBalance: 435253.86, nextPmt: 8741.82 },
    { year: 4, age: 29, endingBalance: 564861.77, nextPmt: 9004.07 },
    { year: 5, age: 30, endingBalance: 704320.85, nextPmt: 9274.19 },
  ];

  it.each(expectedRows)('ปีที่ $year: ยอดสะสมและเงินออมปีถัดไปตรงตามสเปก', ({ year, age, endingBalance, nextPmt }) => {
    const row = result.rows[year - 1];
    expect(row.age).toBe(age);
    expectClose(row.endingBalance, endingBalance);
    expectClose(result.rows[year].monthlyContribution, nextPmt);
  });
});

describe('TC-07 คำแนะนำเมื่อออมไม่ทันเป้า (ต่อจาก TC-01)', () => {
  const input = basePlan({});
  const suggestions = generateSuggestions(input);

  it('increase_saving: ออมเป็นเดือนละ 11,260.86', () => {
    const s = suggestions.find((x) => x.type === 'increase_saving');
    expect(s).toBeDefined();
    expectClose(s!.values.requiredMonthly, 11260.86);
    expectClose(s!.values.increase, 3260.86);
  });

  it('delay_retirement: เลื่อนไปอายุ 66 ปี', () => {
    const s = suggestions.find((x) => x.type === 'delay_retirement');
    expect(s).toBeDefined();
    expect(s!.values.newRetirementAge).toBe(66);
  });

  it('reduce_expense: ลดเหลือเดือนละ 14,456.93', () => {
    const s = suggestions.find((x) => x.type === 'reduce_expense');
    expect(s).toBeDefined();
    expectClose(s!.values.maxMonthlyExpenseToday, 14456.93);
  });

  it('increase_risk: เปลี่ยนเป็นความเสี่ยงสูง gap ติดลบ (เกินเป้า)', () => {
    const s = suggestions.find((x) => x.type === 'increase_risk');
    expect(s).toBeDefined();
    expectClose(s!.values.newRiskReturn * 100, 8);
    expectClose(s!.values.newGap, -10212277, 5);
  });

  it('ค่ากลางระหว่างทางของ delay_retirement ต้องตรง', () => {
    const check = (retirementAge: number, expectedGap: number) => {
      const modified = basePlan({ retirementAge });
      const c = calculateCorpus(modified);
      const p = calculateProjectedSavings(modified);
      expectClose(calculateGap(c.byMethod.annuity, p), expectedGap, 5);
    };
    check(63, 1671600);
    check(65, 22997);
    check(66, -900395);
  });
});

describe('TC-08 กรณีขอบที่ต้องไม่พัง', () => {
  it('เงินออมต่อเดือน = 0 คำนวณได้ปกติ แสดง gap เต็มจำนวน', () => {
    const input = basePlan({ monthlyInvestment: 0 });
    const corpus = calculateCorpus(input);
    const projected = calculateProjectedSavings(input);
    const gap = calculateGap(corpus.byMethod.annuity, projected);
    expect(Number.isFinite(gap)).toBe(true);
    expect(gap).toBeGreaterThan(0);
  });

  it('เงินบำนาญ > รายจ่าย → netMonthlyNeed = 0 และเงินก้อนที่ต้องมี = 0', () => {
    const input = basePlan({ monthlyExpenseToday: 5000, pensionMonthlyToday: 50000 });
    const corpus = calculateCorpus(input);
    expect(corpus.netMonthlyNeed).toBe(0);
    expect(corpus.byMethod.annuity).toBe(0);
    expect(corpus.byMethod.simple).toBe(0);
    expect(corpus.byMethod.rule4).toBe(0);
  });

  it('เป้าหมายพิเศษมากกว่าเงินที่มี → ยอดเงินติดลบได้จริง ไม่ตัดเป็น 0', () => {
    const input = basePlan({
      goals: [{ name: 'ซื้อบ้าน', amountToday: 999999999, targetAge: 26 }],
    });
    const result = simulateAccumulation(input);
    const row = result.rows.find((r) => r.age === 26);
    expect(row).toBeDefined();
    expect(row!.endingBalance).toBeLessThan(0);
  });

  it('อัตราผลตอบแทน = 0 ไม่หารศูนย์', () => {
    const input = basePlan({ annualReturn: 0 });
    expect(() => calculateCorpus(input)).not.toThrow();
    expect(() => calculateProjectedSavings(input)).not.toThrow();
    const corpus = calculateCorpus(input);
    const projected = calculateProjectedSavings(input);
    expect(Number.isFinite(corpus.byMethod.annuity)).toBe(true);
    expect(Number.isFinite(projected)).toBe(true);
  });

  it('มีเป้าหมายพิเศษ → getProjectedSavings ใช้ simulateAccumulation แทนสูตรปิด', () => {
    const input = basePlan({
      goals: [{ name: 'ท่องเที่ยว', amountToday: 150000, targetAge: 30 }],
    });
    const viaSimulate = simulateAccumulation(input).projectedAtRetirement;
    const viaGetProjected = getProjectedSavings(input);
    expect(viaGetProjected).toBe(viaSimulate);
  });
});

describe('TC-09 แยกเงินฝากกับเงินลงทุนคนละอัตราผลตอบแทน', () => {
  it('เงินฝากโตด้วย depositReturn เงินลงทุนโตด้วย annualReturn แยกกันจริง', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 31,
      currentSavingsDeposit: 100000,
      currentSavingsInvestment: 100000,
      monthlyDeposit: 0,
      monthlyInvestment: 0,
      depositReturn: 0.015,
      annualReturn: 0.08,
    });
    const result = simulateAccumulation(input);
    const row = result.rows[0];
    expectClose(row.depositBalance, futureValue(100000, 0.015 / 12, 12));
    expectClose(row.investmentBalance, futureValue(100000, 0.08 / 12, 12));
    expectClose(row.endingBalance, row.depositBalance + row.investmentBalance);
  });

  it('calculateProjectedSavings รวมสองก้อนที่คำนวณคนละอัตรากันแล้ว', () => {
    const input = basePlan({
      currentSavingsDeposit: 50000,
      currentSavingsInvestment: 50000,
      monthlyDeposit: 2000,
      monthlyInvestment: 6000,
    });
    const monthsToRetirement = (input.retirementAge - input.currentAge) * 12;
    const expectedDeposit =
      futureValue(50000, input.depositReturn / 12, monthsToRetirement) +
      futureValueAnnuity(2000, input.depositReturn / 12, monthsToRetirement);
    const expectedInvestment =
      futureValue(50000, input.annualReturn / 12, monthsToRetirement) +
      futureValueAnnuity(6000, input.annualReturn / 12, monthsToRetirement);
    expectClose(calculateProjectedSavings(input), expectedDeposit + expectedInvestment);
  });
});

describe('TC-10 เป้าหมายพิเศษทำให้เงินไม่พอ (findGoalShortfalls)', () => {
  it('ไม่มีเป้าหมายที่ทำให้ติดลบ → คืน array ว่าง', () => {
    const input = basePlan({});
    expect(findGoalShortfalls(input)).toHaveLength(0);
  });

  it('เป้าหมายดึงเงินเกินที่มี → รายงานเป้าหมาย ขาดเท่าไหร่ และต้องออมเพิ่มเดือนละเท่าไหร่', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 60,
      currentSavingsDeposit: 0,
      currentSavingsInvestment: 0,
      monthlyDeposit: 0,
      monthlyInvestment: 1000,
      goals: [{ name: 'ซื้อบ้าน', amountToday: 2000000, targetAge: 35 }],
    });
    const shortfalls = findGoalShortfalls(input);
    expect(shortfalls).toHaveLength(1);
    expect(shortfalls[0].goalName).toBe('ซื้อบ้าน');
    expect(shortfalls[0].targetAge).toBe(35);
    expect(shortfalls[0].shortfall).toBeGreaterThan(0);
    expect(shortfalls[0].requiredExtraMonthly).toBeGreaterThan(0);

    // เพิ่มเงินลงทุนต่อเดือนตามที่แนะนำ (ทดแทนเงินเดิมทั้งหมด) แล้วต้องไม่ติดลบอีก
    const boosted = { ...input, monthlyInvestment: input.monthlyInvestment + shortfalls[0].requiredExtraMonthly };
    const boostedResult = simulateAccumulation(boosted);
    const rowAtGoal = boostedResult.rows.find((r) => r.age === 35);
    expect(rowAtGoal).toBeDefined();
    expect(rowAtGoal!.endingBalance).toBeGreaterThanOrEqual(-1);
  });

  it('รายงาน negativeFromAge ตรงกับปีแรกที่ยอดรวมติดลบจริง (ไม่ใช่แค่ targetAge)', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 60,
      currentSavingsDeposit: 0,
      currentSavingsInvestment: 0,
      monthlyDeposit: 0,
      monthlyInvestment: 1000,
      goals: [{ name: 'ซื้อบ้าน', amountToday: 2000000, targetAge: 35 }],
    });
    const shortfalls = findGoalShortfalls(input);
    const simulation = simulateAccumulation(input);
    const firstNegative = simulation.rows.find((r) => r.age >= 35 && r.endingBalance < 0);
    expect(firstNegative).toBeDefined();
    expect(shortfalls[0].negativeFromAge).toBe(firstNegative!.age);
  });
});

describe('TC-11 ยอดติดลบต้องเป็นจริง ห้าม clamp เป็น 0', () => {
  it('เป้าหมายดึงเงินเกินที่มี → endingBalance ติดลบได้จริง ไม่ถูกตัดเป็น 0', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 40,
      currentSavingsDeposit: 0,
      currentSavingsInvestment: 0,
      monthlyDeposit: 0,
      monthlyInvestment: 1000,
      goals: [{ name: 'ซื้อรถ', amountToday: 5000000, targetAge: 32 }],
    });
    const result = simulateAccumulation(input);
    const goalRow = result.rows.find((r) => r.age === 32)!;
    expect(goalRow.depositBalance).toBeLessThan(0);
    expect(goalRow.endingBalance).toBeLessThan(0);
  });

  it('ปีถัดจากที่ติดลบต้องคำนวณดอกเบี้ย/เงินสมทบต่อจากยอดติดลบนั้น ไม่ใช่เริ่มใหม่จาก 0', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 40,
      currentSavingsDeposit: 0,
      currentSavingsInvestment: 0,
      monthlyDeposit: 0,
      monthlyInvestment: 1000,
      goals: [{ name: 'ซื้อรถ', amountToday: 5000000, targetAge: 32 }],
    });
    const result = simulateAccumulation(input);
    const goalRow = result.rows.find((r) => r.age === 32)!;
    const nextRow = result.rows.find((r) => r.age === 33)!;
    expect(goalRow.depositBalance).toBeLessThan(0);
    // เงินฝากปีถัดไปต้อง = ยอดติดลบเดิมคูณดอกเบี้ยต่อ (futureValue จากฐานติดลบ) ไม่ใช่เริ่มจาก 0
    expectClose(nextRow.depositBalance, futureValue(goalRow.depositBalance, input.depositReturn / 12, 12));
    expect(nextRow.depositBalance).toBeLessThan(goalRow.depositBalance);
  });

  it('ยอดรวมติดลบต่อเนื่องหลายปีถ้าเงินสมทบไม่พอชดเชย', () => {
    const input = basePlan({
      currentAge: 30,
      retirementAge: 45,
      currentSavingsDeposit: 0,
      currentSavingsInvestment: 0,
      monthlyDeposit: 0,
      monthlyInvestment: 100,
      goals: [{ name: 'ซื้อรถ', amountToday: 5000000, targetAge: 32 }],
    });
    const result = simulateAccumulation(input);
    const rowsAfterGoal = result.rows.filter((r) => r.age >= 32 && r.age <= 40);
    expect(rowsAfterGoal.every((r) => r.endingBalance < 0)).toBe(true);
  });
});

describe('tax.ts', () => {
  it('เงินได้สุทธิ 0 บาท ไม่เสียภาษี', () => {
    const result = calculateProgressiveTax(0);
    expect(result.totalTax).toBe(0);
    expect(result.marginalRate).toBe(0);
  });

  it('เงินได้สุทธิ 150,000 บาทแรก ได้รับยกเว้นภาษีทั้งหมด', () => {
    const result = calculateProgressiveTax(150_000);
    expect(result.totalTax).toBe(0);
  });

  it('เงินได้สุทธิ 400,000 บาท เสียภาษีแบบขั้นบันไดถูกต้อง', () => {
    // 150,000 แรก 0% + 150,000 ถัดไป 5% (7,500) + 100,000 ที่เหลือ 10% (10,000)
    const result = calculateProgressiveTax(400_000);
    expectClose(result.totalTax, 17_500, 0.01);
    expect(result.marginalRate).toBe(0.1);
  });

  it('เงินได้สุทธิเกิน 5,000,000 บาท ใช้อัตราขั้นสูงสุด 35% กับส่วนเกิน', () => {
    const result = calculateProgressiveTax(5_100_000);
    expect(result.marginalRate).toBe(0.35);
    const lastBracket = result.brackets.at(-1)!;
    expectClose(lastBracket.taxForBracket, 35_000, 0.01);
  });

  it('calculateEmploymentTaxableIncome หักค่าใช้จ่าย 50% สูงสุด 100,000 และค่าลดหย่อนส่วนตัว 60,000', () => {
    // รายได้ 600,000: หักค่าใช้จ่าย min(300,000, 100,000) = 100,000, หักส่วนตัว 60,000
    expectClose(calculateEmploymentTaxableIncome(600_000), 440_000, 0.01);
    // รายได้ 100,000: หักค่าใช้จ่าย min(50,000, 100,000) = 50,000, หักส่วนตัว 60,000 → ไม่ติดลบ
    expectClose(calculateEmploymentTaxableIncome(100_000), 0, 0.01);
  });
});
