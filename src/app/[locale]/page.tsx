import { ArrowRight, GraduationCap, LineChart, PiggyBank } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const t = await getTranslations();

  const features = [
    {
      icon: PiggyBank,
      title: t("landing.features.calculate.title"),
      description: t("landing.features.calculate.description"),
    },
    {
      icon: LineChart,
      title: t("landing.features.track.title"),
      description: t("landing.features.track.description"),
    },
    {
      icon: GraduationCap,
      title: t("landing.features.learn.title"),
      description: t("landing.features.learn.description"),
      href: "/learn",
    },
  ] as const;

  return (
    <main className="flex flex-1 flex-col">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-accent),transparent)]"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <PiggyBank className="size-3.5 text-primary" aria-hidden="true" />
            {t("brand.school")}
          </span>
          <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-5xl">
            {t("landing.heroTitle")}
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
            {t("landing.heroSubtitle")}
          </p>
          <Button
            render={<Link href="/plan/new" />}
            nativeButton={false}
            size="lg"
            className="mt-2"
          >
            {t("landing.cta")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 pb-20 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const card = (
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
          return "href" in feature ? (
            <Link key={feature.title} href={feature.href} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={feature.title} className="h-full">
              {card}
            </div>
          );
        })}
      </div>
    </main>
  );
}
