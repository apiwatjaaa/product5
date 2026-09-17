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
  currentSavings: number;
  monthlyContribution: number;
  riskLevel: RiskLevel;
  inflationRate: number;
  annualReturn: number;
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
  endingBalance: number;
  cumulativeContributed: number;
}

export interface SimulationResult {
  rows: YearRow[];
  projectedAtRetirement: number;
  totalContributed: number;
  totalReturn: number;
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
