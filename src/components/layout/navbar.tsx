import { PiggyBank } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { InstallAppButton } from "@/components/layout/install-app-button";

export async function Navbar() {
  const t = await getTranslations();
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden print:static">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-0 px-4 py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2 py-1 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <PiggyBank className="size-[18px]" aria-hidden="true" />
          </span>
          {t("brand.name")}
        </Link>
        <div className="ml-auto flex items-center gap-1 md:order-last md:ml-0">
          <InstallAppButton />
          <LocaleToggle />
          <ModeToggle />
        </div>
        <nav className="-mx-2 flex w-full items-center gap-1 overflow-x-auto pb-1 md:mx-0 md:ml-auto md:w-auto md:pb-0">
          <Button variant="ghost" size="sm" render={<Link href="/learn" />} nativeButton={false}>
            {t("nav.learn")}
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/plan/new" />} nativeButton={false}>
            {t("nav.planNew")}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/dashboard" />} nativeButton={false}>
                {t("nav.dashboard")}
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/login" />} nativeButton={false}>
              {t("nav.login")}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
