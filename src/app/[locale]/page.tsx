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

  const stats = [
    { value: "100%", label: t("landing.stats.excel") },
    { value: "3", label: t("landing.stats.methods") },
    { value: "6", label: t("landing.stats.articles") },
    { value: "฿0", label: t("landing.stats.free") },
  ];

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
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_14%,transparent)_1px,transparent_1.5px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[30rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-40 -z-10 size-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--chart-2)_30%,transparent),transparent)] opacity-60"
        />
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-16 pb-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="text-sm font-semibold text-primary">
              {t("brand.school")}
            </p>
            <h1 className="mt-3 text-4xl leading-[1.15] font-bold tracking-tight text-balance sm:text-6xl">
              {t.rich("landing.heroTitle", {
                hl: (chunks) => (
                  <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">{chunks}</span>
                ),
              })}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
                <li key={badge.label} className="flex items-center gap-1.5 text-[0.95rem] text-muted-foreground">
                  <badge.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {badge.label}
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:justify-self-end">
            <div className="relative w-full max-w-md">
            <div className="absolute -bottom-4 -left-5 z-10 hidden items-center gap-2 rounded-full border bg-popover/95 px-3 py-1.5 text-sm font-semibold shadow-lg backdrop-blur sm:flex">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_var(--glow)]" />
              {t("landing.preview.chip")}
            </div>
            <Card className="w-full shadow-2xl shadow-black/25 ring-1 ring-primary/10" aria-hidden="true">
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-muted-foreground">{t("landing.preview.label")}</p>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    {t("landing.preview.ageSpan")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("results.summary.corpusNeeded")}</p>
                  <p className="font-mono text-3xl font-semibold text-primary drop-shadow-[0_0_14px_var(--glow)] tabular-nums sm:text-4xl">
                    {formatCurrency(PREVIEW_CORPUS, locale)}
                  </p>
                </div>

                {/* กราฟตัวอย่าง: เงินออมโตแบบทบต้นเข้าใกล้เส้นเป้าหมาย */}
                <svg viewBox="0 0 320 120" className="h-28 w-full overflow-visible" role="presentation">
                  <defs>
                    <linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" x2="320" y1="18" y2="18" stroke="var(--color-muted-foreground)" strokeDasharray="5 4" strokeWidth="1.5" />
                  <text x="320" y="11" textAnchor="end" fontSize="11" fill="var(--color-muted-foreground)">
                    {t("results.chart.target")}
                  </text>
                  <path d="M0 112 C 60 110, 110 104, 160 92 S 260 52, 320 30 L 320 120 L 0 120 Z" fill="url(#preview-fill)" />
                  <path
                    d="M0 112 C 60 110, 110 104, 160 92 S 260 52, 320 30"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength={1}
                    className="preview-line"
                  />
                  <circle cx="320" cy="30" r="5" fill="var(--color-primary)" stroke="var(--color-card)" strokeWidth="2.5" className="preview-dot" />
                </svg>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("results.summary.requiredMonthly")}</p>
                    <p className="font-mono text-xl font-semibold tabular-nums">
                      {formatCurrency(PREVIEW_REQUIRED_MONTHLY, locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("landing.preview.progress")}</p>
                    <p className="font-mono text-xl font-semibold text-primary tabular-nums">72%</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[72%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t("landing.preview.caption")}</p>
              </CardContent>
            </Card>
            </div>
          </Reveal>
        </div>
      </div>

      {/* แถบข้อเท็จจริงของโปรแกรม */}
      <div className="border-y bg-card/40">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-6 px-4 py-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-mono text-3xl font-semibold text-primary tabular-nums sm:text-4xl">{stat.value}</dd>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* วิธีใช้งาน */}
      <div id="how-it-works" className="scroll-mt-20 border-t bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {t("landing.howItWorks.title")}
          </h2>
          <div className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-linear-to-r from-transparent via-primary/50 to-transparent sm:block"
            />
            {steps.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 100}>
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-card text-primary shadow-[0_0_24px_-6px_var(--glow)]">
                    <step.icon className="size-6" aria-hidden="true" />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">{t("landing.features.title")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delayMs={index * 80} className="h-full">
                <Link href={feature.href} className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <Card className="h-full transition-[box-shadow,border-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-[0_8px_30px_-12px_var(--glow)]">
                    <CardContent className="flex h-full flex-col gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5.5 shrink-0" aria-hidden="true" />
                      </div>
                      <h3 className="mt-1 text-lg font-semibold">{feature.title}</h3>
                      <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{feature.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                        {t("landing.features.go")}
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ปิดท้าย: ชวนเริ่มวางแผน */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card px-6 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-24 h-64 bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70"
          />
          <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">{t("landing.closing.title")}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground sm:text-lg">{t("landing.closing.lead")}</p>
          <Button render={<Link href="/plan/new" />} nativeButton={false} size="lg" className="relative mt-7">
            {t("landing.cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </main>
  );
}
