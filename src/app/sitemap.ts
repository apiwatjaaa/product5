import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEARN_ARTICLES } from "@/lib/learn/articles";
import { SITE_URL } from "@/lib/site";

function withLocales(path: string): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );
  return {
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    withLocales(""),
    withLocales("/learn"),
    ...LEARN_ARTICLES.map((article) => withLocales(`/learn/${article.slug}`)),
  ];
}
