import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { rowToPlanInput } from "@/lib/plans/mapping";
import { ResultsView } from "@/components/plan/results-view";
import { PlanDetailHeader } from "@/components/plan/plan-detail-header";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect({ href: `/login?next=/plan/${id}`, locale });
  }

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*, plan_goals(*)")
    .eq("id", id)
    .single();

  if (error || !plan) {
    notFound();
  }

  const input = rowToPlanInput(plan, plan.plan_goals ?? []);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 print:max-w-none print:px-0 print:py-0">
      <PlanDetailHeader planId={plan.id} initialName={plan.name} />
      <ResultsView input={input} />
    </main>
  );
}
