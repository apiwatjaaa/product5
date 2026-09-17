"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { CorpusMethod, CorpusResult } from "@/lib/finance/types";

const METHODS: CorpusMethod[] = ["annuity", "simple", "rule4"];

export function MethodComparison({
  corpus,
  selectedMethod,
}: {
  corpus: CorpusResult;
  selectedMethod: CorpusMethod;
}) {
  const t = useTranslations("results.comparison");
  const tMethod = useTranslations("corpusMethod");
  const locale = useLocale();

  const monthsInRetirement = corpus.monthsInRetirement / 12;
  const showEqualNote = Math.abs(monthsInRetirement - 25) < 0.01;

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("method")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {METHODS.map((method) => (
            <TableRow key={method} className={method === selectedMethod ? "bg-accent" : undefined}>
              <TableCell>{tMethod(method)}</TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(corpus.byMethod[method], locale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showEqualNote && <p className="text-xs text-muted-foreground">{t("note")}</p>}
    </div>
  );
}
