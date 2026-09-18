import { getTranslations } from "next-intl/server";
import { PlanForm } from "@/components/plan/plan-form";
import { createClient } from "@/lib/supabase/server";

export default async function PlanNewPage() {
  const t = await getTranslations("planForm");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:py-16">
      <div className="mb-8 lg:mb-24">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PlanForm isAuthenticated={Boolean(user)} />
    </main>
  );
}
