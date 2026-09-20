// ชนิดข้อมูลสำหรับโมดูลคำนวณเงินเพื่อการเกษียณ

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export type CorpusMethod = 'annuity' | 'simple' | 'rule4';

export interface PlanGoal {
  name: string;
  amountToday: number;
  targetAge: number;
}

export interface PlanInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyExpenseToday: number;
  /** เงินฝาก/เงินสดที่มีอยู่แล้ว — เติบโตด้วย depositReturn */
  currentSavingsDeposit: number;
  /** เงินลงทุนที่มีอยู่แล้ว — เติบโตด้วย annualReturn ตามความเสี่ยง */
  currentSavingsInvestment: number;
  /** ฝากธนาคารต่อเดือน — เติบโตด้วย depositReturn */
  monthlyDeposit: number;
  /** ลงทุนต่อเดือน — เติบโตด้วย annualReturn ตามความเสี่ยง */
  monthlyInvestment: number;
  riskLevel: RiskLevel;
  inflationRate: number;
  /** อัตราผลตอบแทนเงินลงทุนต่อปี ตามระดับความเสี่ยง */
  annualReturn: number;
  /** อัตราผลตอบแทนเงินฝากต่อปี ค่าเริ่มต้น 1.5% แก้ได้ในตั้งค่าขั้นสูง */
  depositReturn: number;
  contributionGrowth: number;
  pensionMonthlyToday: number;
  corpusMethod: CorpusMethod;
  goals?: PlanGoal[];
}

export interface CorpusResult {
  yearsToRetirement: number;
  monthsInRetirement: number;
  expenseAtRetirement: number;
  pensionAtRetirement: number;
  netMonthlyNeed: number;
  realAnnualRate: number;
  byMethod: {
    annuity: number;
    simple: number;
    rule4: number;
  };
  selected: number;
}

export interface YearRow {
  year: number;
  age: number;
  monthlyContribution: number;
  contributedThisYear: number;
  returnThisYear: number;
  goalWithdrawal: number;
  /** ยอดเงินฝากคงเหลือปลายปี */
  depositBalance: number;
  /** ยอดเงินลงทุนคงเหลือปลายปี */
  investmentBalance: number;
  /** ยอดรวม (เงินฝาก + เงินลงทุน) ปลายปี — ติดลบได้จริงถ้าเป้าหมายพิเศษดึงเงินเกินที่มี */
  endingBalance: number;
  cumulativeContributed: number;
}

export interface SimulationResult {
  rows: YearRow[];
  projectedAtRetirement: number;
  totalContributed: number;
  totalReturn: number;
}

/** เป้าหมายพิเศษที่ทำให้เงินไม่พอ (ยอดรวมติดลบหลังถอน) พร้อมทางแก้ที่คำนวณจริง */
export interface GoalShortfall {
  goalName: string;
  targetAge: number;
  /** อายุแรกที่ยอดรวมติดลบจริงหลังเป้าหมายนี้ (อาจมากกว่า targetAge ได้ถ้ายังไม่ติดลบทันที) */
  negativeFromAge: number;
  /** ขาดอยู่เท่าไหร่ (มูลค่า ณ ปีที่ขาดหนักที่สุดหลังเป้าหมายนี้) */
  shortfall: number;
  /** ต้องออมเพิ่ม (ลงทุน) เดือนละเท่าไหร่ตั้งแต่วันนี้ถึงอายุเป้าหมายนี้ เพื่อไม่ให้ติดลบ */
  requiredExtraMonthly: number;
}

export type SuggestionType =
  | 'increase_saving'
  | 'delay_retirement'
  | 'reduce_expense'
  | 'increase_risk'
  | 'on_track';

export type SuggestionSeverity = 'success' | 'warning' | 'danger';

export interface Suggestion {
  type: SuggestionType;
  severity: SuggestionSeverity;
  titleKey: string;
  values: Record<string, number>;
}
