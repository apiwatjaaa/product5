import { PiggyBank } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { InstallAppButton } from "@/components/layout/install-app-button";

export async function Navbar() {
  const t = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden print:static">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2">
        <Link href="/" className="flex items-center gap-1.5 font-semibold">
          <PiggyBank className="size-5 text-primary" aria-hidden="true" />
          {t("brand.name")}
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
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
            <Button variant="ghost" size="sm" render={<Link href="/login" />} nativeButton={false}>
              {t("nav.login")}
            </Button>
          )}
          <InstallAppButton />
          <LocaleToggle />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
