import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ARTICLE_ICONS } from "@/components/learn/article-icons";
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 divide-y border-t border-b">
        {LEARN_ARTICLES.map((article) => {
          const Icon = ARTICLE_ICONS[article.slug];
          return (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group flex items-start gap-4 border-l-2 border-transparent py-5 pl-3 transition-colors hover:bg-accent/40 hover:border-primary"
            >
              <Icon
                className="mt-0.5 size-5 shrink-0 text-primary drop-shadow-[0_0_6px_var(--glow)]"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{isTh ? article.titleTh : article.titleEn}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {isTh ? article.summaryTh : article.summaryEn}
                </p>
              </div>
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
