import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="font-mono text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2">
        {t("backHome")}
      </Button>
    </main>
  );
}
