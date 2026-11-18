"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [pending, setPending] = useState(false);

  const onSignOut = async () => {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ออกจากระบบฝั่งเซิร์ฟเวอร์ไม่สำเร็จ ก็ยังพาผู้ใช้กลับหน้าแรกและโหลดสถานะใหม่
    } finally {
      setPending(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={onSignOut} disabled={pending}>
      {t("signOut")}
    </Button>
  );
}
