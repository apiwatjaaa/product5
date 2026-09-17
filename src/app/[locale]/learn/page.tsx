import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LEARN_ARTICLES } from "@/lib/learn/articles";

export default async function LearnHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("learn.hub");
  const isTh = locale === "th";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LEARN_ARTICLES.map((article) => (
          <Link key={article.slug} href={`/learn/${article.slug}`} className="group block h-full">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <CardTitle>{isTh ? article.titleTh : article.titleEn}</CardTitle>
                <CardDescription>{isTh ? article.summaryTh : article.summaryEn}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-1 text-sm font-medium text-primary">
                {t("readArticle")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
