"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("theme");

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label={t("toggle")} disabled />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t(isDark ? "switchToLight" : "switchToDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="[&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:rotate-45"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
