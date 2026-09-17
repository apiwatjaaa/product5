"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Copy, MoreVertical } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameDialog } from "@/components/plan/rename-dialog";
import { DeleteConfirmDialog } from "@/components/plan/delete-confirm-dialog";
import { duplicatePlan } from "@/lib/actions/plans";
import { formatCurrency } from "@/lib/format";

export function PlanCard({
  id,
  name: initialName,
  updatedAt,
  corpusNeeded,
  gap,
}: {
  id: string;
  name: string;
  updatedAt: string;
  corpusNeeded: number;
  gap: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [deleted, setDeleted] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isOnTrack = gap <= 0;

  const onDuplicate = async () => {
    await duplicatePlan(id);
    router.refresh();
  };

  if (deleted) return null;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardTitle className="text-base">
          <Link href={`/plan/${id}`} className="hover:underline">
            {name}
          </Link>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/plan/${id}`} />}>
              {t("dashboard.menu.open")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="size-4" /> {t("dashboard.menu.duplicate")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRenameOpen(true)}>
              {t("dashboard.menu.rename")}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              {t("dashboard.menu.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.lastEdited")}: {new Date(updatedAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US")}
        </p>
        <p className="text-sm">
          {t("dashboard.targetCorpus")}: <span className="font-mono font-medium">{formatCurrency(corpusNeeded, locale)}</span>
        </p>
        <Badge variant={isOnTrack ? "secondary" : "destructive"} className={isOnTrack ? "bg-success/15 text-success" : undefined}>
          {isOnTrack ? t("dashboard.statusOnTrack") : t("dashboard.statusGap", { amount: formatCurrency(gap, locale) })}
        </Badge>
      </CardContent>

      <RenameDialog
        planId={id}
        currentName={name}
        onRenamed={setName}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteConfirmDialog
        planId={id}
        onDeleted={() => setDeleted(true)}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </Card>
  );
}
