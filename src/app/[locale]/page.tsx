import { ArrowRight, GraduationCap, LineChart, PiggyBank } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

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
      <div className="mx-auto w-full max-w-3xl px-4 pt-16 pb-10 sm:pt-24 lg:pb-24">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("brand.school")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t("landing.heroSubtitle")}
        </p>
        <Button render={<Link href="/plan/new" />} nativeButton={false} size="lg" className="mt-6">
          {t("landing.cta")}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mx-auto w-full max-w-3xl divide-y border-t px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const row = (
            <div className="flex gap-4 border-l-2 border-transparent py-6 pl-3 transition-colors group-hover:border-primary">
              <Icon
                className="mt-0.5 size-5 shrink-0 text-primary drop-shadow-[0_0_6px_var(--glow)]"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
          return (
            <Reveal key={feature.title} delayMs={index * 80}>
              {"href" in feature ? (
                <Link href={feature.href} className="group block hover:bg-accent/40">
                  {row}
                </Link>
              ) : (
                row
              )}
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
