import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { rowToPlanFormValues } from "@/lib/plans/mapping";
import { PlanForm } from "@/components/plan/plan-form";

export default async function PlanEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("planForm");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect({ href: `/login?next=/plan/${id}/edit`, locale });
  }

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*, plan_goals(*)")
    .eq("id", id)
    .single();

  if (error || !plan) {
    notFound();
  }

  const values = rowToPlanFormValues(plan, plan.plan_goals ?? []);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold">{plan.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
      <PlanForm isAuthenticated planId={plan.id} initialValues={values} initialName={plan.name} />
    </main>
  );
}
