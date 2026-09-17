"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePlan } from "@/lib/actions/plans";

export function DeleteConfirmDialog({
  planId,
  onDeleted,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  planId: string;
  onDeleted: () => void;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations();
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [isDeleting, setIsDeleting] = useState(false);

  const onConfirm = async () => {
    setIsDeleting(true);
    const result = await deletePlan(planId);
    setIsDeleting(false);
    if (!("error" in result)) {
      setOpen(false);
      onDeleted();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger
          render={
            trigger ?? (
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4" /> {t("planDetail.delete")}
              </Button>
            )
          }
        />
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dashboard.deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("dashboard.deleteDialog.body")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {t("dashboard.deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
