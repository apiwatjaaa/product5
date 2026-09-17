"use client";

import { useLocale, useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RISK_PROFILES, RISK_LEVEL_ORDER } from "@/lib/finance/constants";
import { formatPercent } from "@/lib/format";

export function RiskProfileTable({ variant }: { variant: "return" | "allocation" }) {
  const t = useTranslations("learn.riskProfileTable");
  const tRisk = useTranslations("riskLevel");
  const locale = useLocale();

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("riskLevel")}</TableHead>
            {variant === "return" ? (
              <TableHead className="text-right">{t("expectedReturn")}</TableHead>
            ) : (
              <>
                <TableHead className="text-right">{t("bondsAndDeposits")}</TableHead>
                <TableHead className="text-right">{t("stocks")}</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {RISK_LEVEL_ORDER.map((level) => {
            const profile = RISK_PROFILES[level];
            return (
              <TableRow key={level}>
                <TableCell className="font-medium">{tRisk(level)}</TableCell>
                {variant === "return" ? (
                  <TableCell className="text-right font-mono">
                    {formatPercent(profile.defaultReturn, locale, 0)}
                  </TableCell>
                ) : (
                  <>
                    <TableCell className="text-right font-mono">
                      {formatPercent(profile.allocation.bondsAndDeposits, locale, 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPercent(profile.allocation.stocks, locale, 0)}
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
