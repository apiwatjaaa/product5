"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import {
  Landmark,
  Loader2,
  PiggyBank,
  Plus,
  SlidersHorizontal,
  Target,
  Trash2,
  User,
} from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyField } from "@/components/plan/currency-field";
import { RISK_LEVEL_ORDER, RISK_PROFILES } from "@/lib/finance/constants";
import { calculateCorpus, calculateGap, calculateProjectedSavings } from "@/lib/finance/corpus";
import { formatCurrency } from "@/lib/format";
import {
  planFormDefaults,
  planFormSchema,
  type PlanFormValues,
} from "@/lib/validation/planSchema";
import { DRAFT_PLAN_STORAGE_KEY } from "@/lib/plan-draft";
import { createPlan, updatePlan } from "@/lib/actions/plans";

const KNOWN_VALIDATION_KEYS = new Set([
  "retirementAfterCurrent",
  "lifeExpectancyAfterRetirement",
]);

function fieldErrorMessage(
  fieldName: string,
  error: FieldError | undefined,
  t: ReturnType<typeof useTranslations>,
): string | undefined {
  if (!error) return undefined;
  if (typeof error.message === "string" && KNOWN_VALIDATION_KEYS.has(error.message)) {
    return t(`validation.${error.message}` as "validation.retirementAfterCurrent");
  }
  if (error.type === "too_small" || error.type === "too_big") {
    if (fieldName === "currentAge") return t("validation.currentAgeRange");
    if (fieldName === "retirementAge") return t("validation.retirementAgeRange");
    if (fieldName === "lifeExpectancy") return t("validation.lifeExpectancyRange");
    if (error.type === "too_small") return t("validation.mustBeNonNegative");
  }
  return t("validation.required");
}

export function PlanForm({
  isAuthenticated,
  planId,
  initialValues,
  initialName,
}: {
  isAuthenticated: boolean;
  planId?: string;
  initialValues?: PlanFormValues;
  initialName?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: initialValues ?? planFormDefaults,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "goals" });
  const values = useWatch({ control }) as Partial<PlanFormValues>;
  const riskLevel = watch("riskLevel");

  useEffect(() => {
    if (planId) return; // ไม่ต้องคืนค่าฉบับร่างเมื่อกำลังแก้ไขแผนที่มีอยู่แล้ว
    const raw = sessionStorage.getItem(DRAFT_PLAN_STORAGE_KEY);
    if (!raw) return;
    sessionStorage.removeItem(DRAFT_PLAN_STORAGE_KEY);
    try {
      reset(JSON.parse(raw));
    } catch {
      // ฉบับร่างเสียหาย ข้ามไป
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue("annualReturn", RISK_PROFILES[riskLevel].defaultReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskLevel]);

  const preview = useMemo(() => {
    const input = { ...planFormDefaults, ...values };
    const corpus = calculateCorpus(input);
    const projected = calculateProjectedSavings(input);
    const gap = calculateGap(corpus.selected, projected);
    return { corpus, gap };
  }, [values]);

  const onSubmit = async (data: PlanFormValues) => {
    if (!isAuthenticated) {
      sessionStorage.setItem(DRAFT_PLAN_STORAGE_KEY, JSON.stringify(data));
      router.push("/login?next=/plan/new");
      return;
    }

    setSaveError(null);
    setIsSaving(true);
    const result = planId
      ? await updatePlan(planId, data, initialName ?? t("planForm.defaultName"))
      : await createPlan(data);
    setIsSaving(false);

    if ("error" in result) {
      setSaveError(t("validation.required"));
      return;
    }
    router.push(`/plan/${result.id}`);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t("planForm.basicCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="currentAge">{t("planForm.basicCard.currentAge")}</Label>
              <Input
                id="currentAge"
                type="number"
                aria-describedby={errors.currentAge ? "currentAge-error" : undefined}
                {...register("currentAge", { valueAsNumber: true })}
              />
              {errors.currentAge && (
                <p id="currentAge-error" className="text-xs text-destructive">
                  {fieldErrorMessage("currentAge", errors.currentAge, t)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retirementAge">{t("planForm.basicCard.retirementAge")}</Label>
              <Input
                id="retirementAge"
                type="number"
                aria-describedby={errors.retirementAge ? "retirementAge-error" : undefined}
                {...register("retirementAge", { valueAsNumber: true })}
              />
              {errors.retirementAge && (
                <p id="retirementAge-error" className="text-xs text-destructive">
                  {fieldErrorMessage("retirementAge", errors.retirementAge, t)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lifeExpectancy">{t("planForm.basicCard.lifeExpectancy")}</Label>
              <Input
                id="lifeExpectancy"
                type="number"
                aria-describedby={errors.lifeExpectancy ? "lifeExpectancy-error" : undefined}
                {...register("lifeExpectancy", { valueAsNumber: true })}
              />
              {errors.lifeExpectancy && (
                <p id="lifeExpectancy-error" className="text-xs text-destructive">
                  {fieldErrorMessage("lifeExpectancy", errors.lifeExpectancy, t)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="monthlyExpenseToday">
                {t("planForm.basicCard.monthlyExpenseToday")}
              </Label>
              <CurrencyField
                id="monthlyExpenseToday"
                value={values.monthlyExpenseToday ?? 0}
                onChange={(v) => setValue("monthlyExpenseToday", v, { shouldValidate: true })}
                ariaDescribedBy={errors.monthlyExpenseToday ? "monthlyExpenseToday-error" : undefined}
              />
              {errors.monthlyExpenseToday && (
                <p id="monthlyExpenseToday-error" className="text-xs text-destructive">
                  {fieldErrorMessage("monthlyExpenseToday", errors.monthlyExpenseToday, t)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currentSavings">{t("planForm.basicCard.currentSavings")}</Label>
              <CurrencyField
                id="currentSavings"
                value={values.currentSavings ?? 0}
                onChange={(v) => setValue("currentSavings", v, { shouldValidate: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="monthlyContribution">
                {t("planForm.basicCard.monthlyContribution")}
              </Label>
              <CurrencyField
                id="monthlyContribution"
                value={values.monthlyContribution ?? 0}
                onChange={(v) => setValue("monthlyContribution", v, { shouldValidate: true })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>{t("planForm.basicCard.riskLevel")}</Label>
              <RadioGroup
                value={riskLevel}
                onValueChange={(v) => setValue("riskLevel", v as PlanFormValues["riskLevel"])}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {RISK_LEVEL_ORDER.map((level) => (
                  <Label
                    key={level}
                    htmlFor={`risk-${level}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
                  >
                    <RadioGroupItem value={level} id={`risk-${level}`} className="mt-0.5" />
                    <span>
                      <span className="block font-medium">{t(`riskLevel.${level}`)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {(RISK_PROFILES[level].defaultReturn * 100).toFixed(0)}% / {t("common.years")}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Accordion className="space-y-4">
          <AccordionItem value="pension" className="rounded-lg border px-4">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Landmark className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {t("planForm.pensionCard.title")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("planForm.pensionCard.description")}</p>
              <div className="space-y-1.5">
                <Label htmlFor="pensionMonthlyToday">
                  {t("planForm.pensionCard.pensionMonthlyToday")}
                </Label>
                <CurrencyField
                  id="pensionMonthlyToday"
                  value={values.pensionMonthlyToday ?? 0}
                  onChange={(v) => setValue("pensionMonthlyToday", v, { shouldValidate: true })}
                />
                <p className="text-xs text-muted-foreground">{t("planForm.pensionCard.note")}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="goals" className="rounded-lg border px-4">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Target className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {t("planForm.goalsCard.title")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("planForm.goalsCard.description")}</p>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <Input
                    aria-label={t("planForm.goalsCard.namePlaceholder")}
                    placeholder={t("planForm.goalsCard.namePlaceholder")}
                    {...register(`goals.${index}.name` as const)}
                  />
                  <CurrencyField
                    ariaLabel={t("planForm.goalsCard.amountPlaceholder")}
                    value={values.goals?.[index]?.amountToday ?? 0}
                    onChange={(v) => setValue(`goals.${index}.amountToday`, v, { shouldValidate: true })}
                  />
                  <Input
                    type="number"
                    aria-label={t("planForm.goalsCard.targetAgePlaceholder")}
                    placeholder={t("planForm.goalsCard.targetAgePlaceholder")}
                    {...register(`goals.${index}.targetAge` as const, { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("planForm.goalsCard.remove")}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", amountToday: 0, targetAge: (values.currentAge ?? 30) + 5 })}
              >
                <Plus className="size-4" /> {t("planForm.goalsCard.add")}
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced" className="rounded-lg border px-4">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {t("planForm.advancedCard.title")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="inflationRate">{t("planForm.advancedCard.inflationRate")}</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={((values.inflationRate ?? 0) * 100).toFixed(1)}
                  onChange={(e) => setValue("inflationRate", Number(e.target.value) / 100)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="annualReturn">{t("planForm.advancedCard.annualReturn")}</Label>
                <Input
                  id="annualReturn"
                  type="number"
                  step="0.1"
                  value={((values.annualReturn ?? 0) * 100).toFixed(1)}
                  onChange={(e) => setValue("annualReturn", Number(e.target.value) / 100)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contributionGrowth">
                  {t("planForm.advancedCard.contributionGrowth")}
                </Label>
                <Input
                  id="contributionGrowth"
                  type="number"
                  step="0.1"
                  value={((values.contributionGrowth ?? 0) * 100).toFixed(1)}
                  onChange={(e) => setValue("contributionGrowth", Number(e.target.value) / 100)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="corpusMethod">{t("planForm.advancedCard.corpusMethod")}</Label>
                <Select
                  value={values.corpusMethod ?? "annuity"}
                  onValueChange={(v) => setValue("corpusMethod", v as PlanFormValues["corpusMethod"])}
                >
                  <SelectTrigger id="corpusMethod" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annuity">{t("corpusMethod.annuity")}</SelectItem>
                    <SelectItem value="simple">{t("corpusMethod.simple")}</SelectItem>
                    <SelectItem value="rule4">{t("corpusMethod.rule4")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {isSaving ? t("planDetail.saving") : t("planForm.submit")}
        </Button>
      </div>

      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="size-5 shrink-0 text-primary" aria-hidden="true" />
            {t("planForm.livePreview.title")}
          </CardTitle>
          <CardDescription>{t("planForm.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">{t("planForm.livePreview.corpusNeeded")}</p>
            <p className="font-mono text-xl font-semibold">
              {formatCurrency(preview.corpus.selected, locale)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("planForm.livePreview.requiredMonthly")}
            </p>
            <p
              className={`font-mono text-xl font-semibold ${
                preview.gap > 0 ? "text-destructive" : "text-success"
              }`}
            >
              {preview.gap > 0
                ? t("planForm.livePreview.gapWarning") + " " + formatCurrency(preview.gap, locale)
                : t("planForm.livePreview.onTrack")}
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
