"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey } from "@/lib/supabase/auth-errors";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation/authSchema";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setIsSubmitting(false);

    if (error) {
      setServerError(tErrors(authErrorKey(error.message) as "generic"));
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <AuthCard title={t("title")}>
      {success ? (
        <p className="text-sm text-success">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("newPassword")}</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
            {errors.password?.message && (
              <p className="text-xs text-destructive">{tErrors(errors.password.message as "passwordTooShort")}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
