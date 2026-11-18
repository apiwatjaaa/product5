"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Link, getPathname } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey, safeNextPath } from "@/lib/supabase/auth-errors";
import { loginSchema, type LoginValues } from "@/lib/validation/authSchema";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginValues) => {
    setServerError(null);
    setIsSubmitting(true);
    let error: { message: string } | null = null;
    try {
      const supabase = createClient();
      ({ error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      }));
    } catch {
      error = { message: "network" };
    } finally {
      setIsSubmitting(false);
    }

    if (error) {
      setServerError(tErrors(authErrorKey(error.message) as "generic"));
      return;
    }
    // โหลดหน้าใหม่ทั้งหน้า (ไม่ใช้ router.push) เพื่อให้เซิร์ฟเวอร์อ่าน cookie ของ session ใหม่แน่นอน
    // แก้อาการล็อกอินสำเร็จแล้วแต่เด้งกลับมาหน้าเข้าสู่ระบบ
    window.location.assign(getPathname({ href: next, locale }));
  };

  return (
    <AuthCard title={t("title")} description={t("subtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email?.message && (
            <p role="alert" className="text-sm text-destructive">{tErrors(errors.email.message as "invalidCredentials")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password?.message && (
            <p role="alert" className="text-sm text-destructive">
              {tErrors(errors.password.message as "invalidCredentials")}
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </AuthCard>
  );
}
