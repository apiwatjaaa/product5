"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
          {t("backHome")}
        </Button>
      </div>
    </main>
  );
}
