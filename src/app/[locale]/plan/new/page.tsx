import { getTranslations } from "next-intl/server";
import { PlanForm } from "@/components/plan/plan-form";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function PlanNewPage() {
  const t = await getTranslations("planForm");
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:py-16">
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground sm:text-lg">{t("subtitle")}</p>
      </div>
      <PlanForm isAuthenticated={Boolean(user)} />
    </main>
  );
}
