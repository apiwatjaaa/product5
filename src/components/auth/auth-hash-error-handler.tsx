"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * Supabase ส่ง error ของลิงก์ยืนยัน/รีเซ็ตรหัสผ่านที่หมดอายุหรือใช้ไปแล้ว
 * กลับมาที่ Site URL เป็น hash fragment (#error=...&error_code=...) โดยตรง
 * ไม่ผ่าน /callback เลย ต้องดักจับตรงนี้เพื่อไม่ให้ผู้ใช้เจอ URL แปลกๆ เฉยๆ
 */
export function AuthHashErrorHandler() {
  const t = useTranslations("auth.errors");

  useEffect(() => {
    if (!window.location.hash.includes("error=")) return;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const errorCode = params.get("error_code");
    toast.error(errorCode === "otp_expired" ? t("linkExpired") : t("generic"));

    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState({}, "", url.toString());
  }, [t]);

  return null;
}
