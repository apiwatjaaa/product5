"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Printer } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RenameDialog } from "@/components/plan/rename-dialog";
import { DeleteConfirmDialog } from "@/components/plan/delete-confirm-dialog";

export function PlanDetailHeader({ planId, initialName }: { planId: string; initialName: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState(initialName);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <h1 className="text-2xl font-semibold sm:text-3xl">{name}</h1>
      <div className="flex flex-wrap gap-2">
        <Button
          render={<Link href={`/plan/${planId}/edit`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
        >
          <Pencil className="size-4" /> {t("planDetail.edit")}
        </Button>
        <RenameDialog planId={planId} currentName={name} onRenamed={setName} />
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" /> {t("planDetail.print")}
        </Button>
        <DeleteConfirmDialog planId={planId} onDeleted={() => router.push("/dashboard")} />
      </div>
    </div>
  );
}
