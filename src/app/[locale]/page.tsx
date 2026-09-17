import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">{t("brand.school")}</p>
      <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
        {t("landing.heroTitle")}
      </h1>
      <p className="max-w-xl text-muted-foreground">{t("landing.heroSubtitle")}</p>
      <Button
        render={<Link href="/plan/new">{t("landing.cta")}</Link>}
        nativeButton={false}
        size="lg"
      />
    </main>
  );
}
