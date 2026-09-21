import {
  ArrowRight,
  Calculator,
  ClipboardList,
  GraduationCap,
  LineChart,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { formatCurrency } from "@/lib/format";

const PREVIEW_CORPUS = 8_400_000;
const PREVIEW_REQUIRED_MONTHLY = 12_500;

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();

  const badges = [
    { icon: ShieldCheck, label: t("landing.badges.noEmail") },
    { icon: Sparkles, label: t("landing.badges.free") },
    { icon: Calculator, label: t("landing.badges.formulaBased") },
  ] as const;

  const steps = [
    { icon: ClipboardList, title: t("landing.howItWorks.steps.one.title"), description: t("landing.howItWorks.steps.one.description") },
    { icon: LineChart, title: t("landing.howItWorks.steps.two.title"), description: t("landing.howItWorks.steps.two.description") },
    { icon: SlidersHorizontal, title: t("landing.howItWorks.steps.three.title"), description: t("landing.howItWorks.steps.three.description") },
  ] as const;

  const features = [
    {
      icon: PiggyBank,
      title: t("landing.features.calculate.title"),
      description: t("landing.features.calculate.description"),
      href: "/plan/new",
    },
    {
      icon: LineChart,
      title: t("landing.features.track.title"),
      description: t("landing.features.track.description"),
      href: "/plan/new",
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
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-96 bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-60"
        />
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-14 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-24">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {t("brand.school")}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button render={<Link href="/plan/new" />} nativeButton={false} size="lg">
                {t("landing.cta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg" render={<Link href="#how-it-works" />} nativeButton={false}>
                {t("landing.secondaryCta")}
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {badges.map((badge) => (
                <li key={badge.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <badge.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {badge.label}
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:justify-self-end">
            <Card className="w-full max-w-sm shadow-lg" aria-hidden="true">
              <CardContent className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("landing.preview.label")}
                </p>
                <div>
                  <p className="text-xs text-muted-foreground">{t("results.summary.corpusNeeded")}</p>
                  <p className="font-mono text-2xl font-semibold text-primary drop-shadow-[0_0_14px_var(--glow)] tabular-nums">
                    {formatCurrency(PREVIEW_CORPUS, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("results.summary.requiredMonthly")}</p>
                  <p className="font-mono text-xl font-semibold tabular-nums">
                    {formatCurrency(PREVIEW_REQUIRED_MONTHLY, locale)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{t("landing.preview.caption")}</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* วิธีใช้งาน */}
      <div id="how-it-works" className="scroll-mt-20 border-t bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {t("landing.howItWorks.title")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 100}>
                <div className="flex flex-col items-start gap-3 rounded-xl border bg-card p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <step.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delayMs={index * 80}>
                <Link href={feature.href} className="group block h-full">
                  <Card className="h-full transition-[box-shadow,border-color] group-hover:border-primary/50 group-hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-3">
                      <Icon
                        className="size-6 shrink-0 text-primary drop-shadow-[0_0_6px_var(--glow)]"
                        aria-hidden="true"
                      />
                      <h2 className="font-semibold">{feature.title}</h2>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
