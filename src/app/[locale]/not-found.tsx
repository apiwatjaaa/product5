import { Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
        <Compass className="size-7" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2">
        {t("backHome")}
      </Button>
    </main>
  );
}
