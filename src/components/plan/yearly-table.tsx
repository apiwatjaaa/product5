"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { YearRow } from "@/lib/finance/types";

const PREVIEW_YEARS = 10;

export function YearlyTable({ rows }: { rows: YearRow[] }) {
  const t = useTranslations("results.table");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const expandedBeforePrint = useRef(expanded);

  useEffect(() => {
    const handleBeforePrint = () => {
      expandedBeforePrint.current = expanded;
      setExpanded(true);
    };
    const handleAfterPrint = () => setExpanded(expandedBeforePrint.current);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [expanded]);

  const visibleRows = expanded ? rows : rows.slice(0, PREVIEW_YEARS);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border print:overflow-visible print:rounded-none print:border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card">{t("age")}</TableHead>
              <TableHead>{t("year")}</TableHead>
              <TableHead className="text-right">{t("monthlyContribution")}</TableHead>
              <TableHead className="text-right">{t("contributedThisYear")}</TableHead>
              <TableHead className="text-right">{t("returnThisYear")}</TableHead>
              <TableHead className="text-right">{t("goalWithdrawal")}</TableHead>
              <TableHead className="text-right">{t("endingBalance")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.year}
                className={`print:break-inside-avoid ${row.goalWithdrawal > 0 ? "bg-warning/10" : ""}`}
              >
                <TableCell className="sticky left-0 bg-card font-mono">{row.age}</TableCell>
                <TableCell className="font-mono">{row.year}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(row.monthlyContribution, locale)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(row.contributedThisYear, locale)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(row.returnThisYear, locale)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {row.goalWithdrawal > 0 ? formatCurrency(row.goalWithdrawal, locale) : "—"}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(row.endingBalance, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > PREVIEW_YEARS && (
        <Button
          variant="outline"
          size="sm"
          className="print:hidden"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t("showLess") : t("showAll", { count: rows.length })}
        </Button>
      )}
    </div>
  );
}
