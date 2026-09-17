import { z } from "zod";

export const planGoalSchema = z.object({
  name: z.string().min(1),
  amountToday: z.number().positive(),
  targetAge: z.number().int().min(1).max(120),
});

export const planFormSchema = z
  .object({
    currentAge: z.number().int().min(15).max(80),
    retirementAge: z.number().int().min(40).max(85),
    lifeExpectancy: z.number().int().min(60).max(110),
    monthlyExpenseToday: z.number().positive(),
    currentSavings: z.number().min(0),
    monthlyContribution: z.number().min(0),
    riskLevel: z.enum(["conservative", "moderate", "aggressive"]),
    pensionMonthlyToday: z.number().min(0),
    goals: z.array(planGoalSchema),
    inflationRate: z.number().min(0).max(1),
    annualReturn: z.number().min(0).max(1),
    contributionGrowth: z.number().min(0).max(1),
    corpusMethod: z.enum(["annuity", "simple", "rule4"]),
  })
  .superRefine((data, ctx) => {
    if (data.retirementAge <= data.currentAge) {
      ctx.addIssue({
        code: "custom",
        path: ["retirementAge"],
        message: "retirementAfterCurrent",
      });
    }
    if (data.lifeExpectancy <= data.retirementAge) {
      ctx.addIssue({
        code: "custom",
        path: ["lifeExpectancy"],
        message: "lifeExpectancyAfterRetirement",
      });
    }
  });

export type PlanFormValues = z.infer<typeof planFormSchema>;

export const planFormDefaults: PlanFormValues = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  monthlyExpenseToday: 20000,
  currentSavings: 0,
  monthlyContribution: 5000,
  riskLevel: "moderate",
  pensionMonthlyToday: 0,
  goals: [],
  inflationRate: 0.03,
  annualReturn: 0.05,
  contributionGrowth: 0,
  corpusMethod: "annuity",
};
