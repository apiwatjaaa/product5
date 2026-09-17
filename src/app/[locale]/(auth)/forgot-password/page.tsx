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
import { getSiteUrl } from "@/lib/supabase/redirect-url";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation/authSchema";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tErrors = useTranslations("auth.errors");
  const locale = useLocale();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${getSiteUrl()}/${locale}/reset-password`,
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(tErrors(authErrorKey(error.message) as "generic"));
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title={t("sentTitle")}>
        <p className="text-sm text-muted-foreground">{t("sentBody")}</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium hover:underline">
          {t("backToLogin")}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("title")}>
      <p className="mb-4 text-sm text-muted-foreground">{t("description")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email?.message && (
            <p className="text-xs text-destructive">{tErrors(errors.email.message as "invalidEmail")}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </AuthCard>
  );
}
