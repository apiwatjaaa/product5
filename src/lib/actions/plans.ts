"use server";

import { createClient } from "@/lib/supabase/server";
import { planFormToInsertRow, planFormToUpdateRow } from "@/lib/plans/mapping";
import type { PlanFormValues } from "@/lib/validation/planSchema";

export async function createPlan(values: PlanFormValues, name = "แผนของฉัน") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" as const };

  const { data: plan, error } = await supabase
    .from("plans")
    .insert(planFormToInsertRow(values, user.id, name))
    .select("id")
    .single();

  if (error || !plan) return { error: error?.message ?? "insert_failed" };

  if (values.goals.length > 0) {
    const { error: goalsError } = await supabase.from("plan_goals").insert(
      values.goals.map((goal, index) => ({
        plan_id: plan.id,
        name: goal.name,
        amount_today: goal.amountToday,
        target_age: goal.targetAge,
        sort_order: index,
      })),
    );
    if (goalsError) return { error: goalsError.message };
  }

  return { id: plan.id as string };
}

export async function updatePlan(id: string, values: PlanFormValues, name: string) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "unauthenticated" as const };

  const { error } = await supabase
    .from("plans")
    .update(planFormToUpdateRow(values, name))
    .eq("id", id);
  if (error) return { error: error.message };

  const { error: deleteGoalsError } = await supabase.from("plan_goals").delete().eq("plan_id", id);
  if (deleteGoalsError) return { error: deleteGoalsError.message };

  if (values.goals.length > 0) {
    const { error: goalsError } = await supabase.from("plan_goals").insert(
      values.goals.map((goal, index) => ({
        plan_id: id,
        name: goal.name,
        amount_today: goal.amountToday,
        target_age: goal.targetAge,
        sort_order: index,
      })),
    );
    if (goalsError) return { error: goalsError.message };
  }

  return { id };
}

export async function deletePlan(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function renamePlan(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("plans").update({ name }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function duplicatePlan(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" as const };

  const { data: original, error: fetchError } = await supabase
    .from("plans")
    .select("*, plan_goals(*)")
    .eq("id", id)
    .single();
  if (fetchError || !original) return { error: fetchError?.message ?? "not_found" };

  const { plan_goals, id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = original;

  const { data: copy, error: insertError } = await supabase
    .from("plans")
    .insert({ ...rest, name: `${original.name} (สำเนา)` })
    .select("id")
    .single();
  if (insertError || !copy) return { error: insertError?.message ?? "insert_failed" };

  if (plan_goals && plan_goals.length > 0) {
    const { error: goalsError } = await supabase.from("plan_goals").insert(
      plan_goals.map((g: { name: string; amount_today: number; target_age: number; sort_order: number }) => ({
        plan_id: copy.id,
        name: g.name,
        amount_today: g.amount_today,
        target_age: g.target_age,
        sort_order: g.sort_order,
      })),
    );
    if (goalsError) return { error: goalsError.message };
  }

  return { id: copy.id as string };
}
