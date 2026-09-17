import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ARTICLE_ICONS } from "@/components/learn/article-icons";
import { CompoundInterestChart } from "@/components/learn/compound-interest-chart";
import { RiskProfileTable } from "@/components/learn/risk-profile-table";
import { LEARN_ARTICLES, getLearnArticle } from "@/lib/learn/articles";

export function generateStaticParams() {
  return LEARN_ARTICLES.map((article) => ({ slug: article.slug }));
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) {
    notFound();
  }

  const t = await getTranslations("learn.article");
  const isTh = locale === "th";
  const Icon = ARTICLE_ICONS[article.slug];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Button
        render={<Link href="/learn" />}
        nativeButton={false}
        variant="ghost"
        size="sm"
        className="-ml-2 mb-6"
      >
        <ArrowLeft className="size-4" /> {t("backToHub")}
      </Button>

      <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold text-balance sm:text-3xl">
        {isTh ? article.titleTh : article.titleEn}
      </h1>
      <p className="mt-2 text-muted-foreground">{isTh ? article.summaryTh : article.summaryEn}</p>

      <div className="mt-8 space-y-8">
        {article.sections.map((section, index) => (
          <div key={index} className="space-y-3">
            <h2 className="text-lg font-semibold">{isTh ? section.headingTh : section.headingEn}</h2>
            {(isTh ? section.bodyTh : section.bodyEn).map((paragraph, pIndex) => (
              <p key={pIndex} className="leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
            {index === 0 && article.slug === "risk-and-return" && (
              <RiskProfileTable variant="return" />
            )}
            {index === 1 && article.slug === "asset-allocation" && (
              <RiskProfileTable variant="allocation" />
            )}
          </div>
        ))}
      </div>

      {article.interactive && (
        <div className="mt-8">
          <CompoundInterestChart />
        </div>
      )}

      <Card className="mt-10">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">{t("ctaDescription")}</p>
          <Button render={<Link href="/plan/new" />} nativeButton={false}>
            {t("cta")}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
