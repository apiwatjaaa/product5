import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/plan/plan-card";
import { calculateCorpus, calculateGap, calculateProjectedSavings } from "@/lib/finance/corpus";
import { rowToPlanInput } from "@/lib/plans/mapping";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect({ href: "/login?next=/dashboard", locale });
  }

  const { data: plans } = await supabase
    .from("plans")
    .select("*, plan_goals(*)")
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:py-16">
      <div className="mb-8 flex items-center justify-between gap-4 lg:mb-24">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
        <Button render={<Link href="/plan/new">{t("newPlan")}</Link>} />
      </div>

      {!plans || plans.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <p className="font-semibold">{t("empty.title")}</p>
          <p className="text-sm text-muted-foreground">{t("empty.description")}</p>
          <Button render={<Link href="/plan/new">{t("empty.cta")}</Link>} className="mt-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const input = rowToPlanInput(plan, plan.plan_goals ?? []);
            const corpus = calculateCorpus(input);
            const projected = calculateProjectedSavings(input);
            const gap = calculateGap(corpus.selected, projected);
            return (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                updatedAt={plan.updated_at}
                corpusNeeded={corpus.selected}
                projected={projected}
                gap={gap}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
