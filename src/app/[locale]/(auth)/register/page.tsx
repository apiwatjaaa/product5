"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey } from "@/lib/supabase/auth-errors";
import { registerSchema, type RegisterValues } from "@/lib/validation/authSchema";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterValues) => {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(tErrors(authErrorKey(error.message) as "generic"));
      return;
    }

    // Supabase ไม่คืน error เมื่ออีเมลนี้ถูกใช้ไปแล้ว แต่จะคืนผู้ใช้ที่มี identities ว่างเปล่าแทน
    // (กันการสแกนหาอีเมลที่มีอยู่จริง) จึงต้องเช็คตรงนี้เพื่อบอกว่าอีเมลถูกใช้แล้ว
    if (signUpData.user && signUpData.user.identities?.length === 0) {
      setServerError(tErrors("emailTaken"));
      return;
    }

    router.push(next);
    router.refresh();
  };

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
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
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
