import type { PlanFormValues } from "@/lib/validation/planSchema";
import type { PlanInput } from "@/lib/finance/types";
import type { PlanGoalRow, PlanRow } from "@/lib/supabase/types";

export function rowToPlanInput(row: PlanRow, goals: PlanGoalRow[]): PlanInput {
  return {
    currentAge: row.current_age,
    retirementAge: row.retirement_age,
    lifeExpectancy: row.life_expectancy,
    monthlyExpenseToday: Number(row.monthly_expense_today),
    currentSavingsDeposit: Number(row.current_savings_deposit),
    currentSavingsInvestment: Number(row.current_savings_investment),
    monthlyDeposit: Number(row.monthly_deposit),
    monthlyInvestment: Number(row.monthly_investment),
    riskLevel: row.risk_level,
    inflationRate: Number(row.inflation_rate),
    annualReturn: Number(row.annual_return),
    depositReturn: Number(row.deposit_return),
    contributionGrowth: Number(row.contribution_growth),
    pensionMonthlyToday: Number(row.pension_monthly_today),
    corpusMethod: row.corpus_method,
    goals: goals
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((g) => ({
        name: g.name,
        amountToday: Number(g.amount_today),
        targetAge: g.target_age,
      })),
  };
}

export function rowToPlanFormValues(row: PlanRow, goals: PlanGoalRow[]): PlanFormValues {
  return rowToPlanInput(row, goals) as PlanFormValues;
}

export function planFormToInsertRow(values: PlanFormValues, userId: string, name: string) {
  return {
    user_id: userId,
    ...planFormToUpdateRow(values, name),
  };
}

export function planFormToUpdateRow(values: PlanFormValues, name: string) {
  return {
    name,
    current_age: values.currentAge,
    retirement_age: values.retirementAge,
    life_expectancy: values.lifeExpectancy,
    monthly_expense_today: values.monthlyExpenseToday,
    current_savings_deposit: values.currentSavingsDeposit,
    current_savings_investment: values.currentSavingsInvestment,
    monthly_deposit: values.monthlyDeposit,
    monthly_investment: values.monthlyInvestment,
    risk_level: values.riskLevel,
    inflation_rate: values.inflationRate,
    annual_return: values.annualReturn,
    deposit_return: values.depositReturn,
    contribution_growth: values.contributionGrowth,
    pension_monthly_today: values.pensionMonthlyToday,
    corpus_method: values.corpusMethod,
  };
}
