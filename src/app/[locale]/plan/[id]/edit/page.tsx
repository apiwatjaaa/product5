import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
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
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: `/login?next=/plan/${id}/edit`, locale });
  }

  const supabase = await createClient();
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
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{plan.name}</h1>
        <p className="mt-2 text-muted-foreground sm:text-lg">{t("subtitle")}</p>
      </div>
      <PlanForm isAuthenticated planId={plan.id} initialValues={values} initialName={plan.name} />
    </main>
  );
}
