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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:py-16">
      <div className="mb-8 lg:mb-24">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{plan.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PlanForm isAuthenticated planId={plan.id} initialValues={values} initialName={plan.name} />
    </main>
  );
}
