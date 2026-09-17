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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
      <PlanForm isAuthenticated={Boolean(user)} />
    </main>
  );
}
