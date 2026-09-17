"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslations } from "next-intl";

export function PortfolioPie({
  allocation,
}: {
  allocation: { bondsAndDeposits: number; stocks: number };
}) {
  const t = useTranslations("results.portfolio");

  const data = [
    { key: "bondsAndDeposits", name: t("bondsAndDeposits"), value: allocation.bondsAndDeposits },
    { key: "stocks", name: t("stocks"), value: allocation.stocks },
  ];
  const colors = ["var(--color-chart-2)", "var(--color-chart-1)"];

  return (
    <div className="h-64 w-full" role="img" aria-label={t("title")}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.key} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
