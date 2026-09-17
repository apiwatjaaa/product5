"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey } from "@/lib/supabase/auth-errors";
import { getCallbackUrl } from "@/lib/supabase/redirect-url";
import { registerSchema, type RegisterValues } from "@/lib/validation/authSchema";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("auth.errors");
  const locale = useLocale();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterValues) => {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: getCallbackUrl(locale, "/dashboard") },
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(tErrors(authErrorKey(error.message) as "generic"));
      return;
    }
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <AuthCard title={t("checkEmailTitle")}>
        <p className="text-sm text-muted-foreground">{t("checkEmailBody")}</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium hover:underline">
          {t("loginLink")}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("title")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email?.message && (
            <p className="text-xs text-destructive">{tErrors(errors.email.message as "invalidEmail")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
          {errors.password?.message && (
            <p className="text-xs text-destructive">{tErrors(errors.password.message as "passwordTooShort")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message === "passwordMismatch"
                ? t("passwordMismatch")
                : tErrors(errors.confirmPassword.message as "passwordTooShort")}
            </p>
          )}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </AuthCard>
  );
}
