"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { renamePlan } from "@/lib/actions/plans";

export function RenameDialog({
  planId,
  currentName,
  onRenamed,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  planId: string;
  currentName: string;
  onRenamed?: (name: string) => void;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations();
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    const result = await renamePlan(planId, name.trim());
    setIsSaving(false);
    if (!("error" in result)) {
      setOpen(false);
      onRenamed?.(name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            trigger ?? (
              <Button variant="outline" size="sm">
                <Pencil className="size-4" /> {t("planDetail.rename")}
              </Button>
            )
          }
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.renameDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="plan-name">{t("dashboard.renameDialog.label")}</Label>
          <Input
            id="plan-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
