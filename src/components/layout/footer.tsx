import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t print:hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {year} {t("brand.name")} — {t("brand.school")}
        </p>
        <p>
          <Link href="/learn" className="hover:text-foreground hover:underline">
            {t("nav.learn")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
