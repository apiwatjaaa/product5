// สไตล์ default ของ Recharts Tooltip เป็นกล่องสีขาวตายตัว ไม่ปรับตาม dark mode
// ใช้ CSS variable เดียวกับ theme หลัก เพื่อให้ tooltip เปลี่ยนสีตามเหมือนส่วนอื่นของเว็บ

import type { CSSProperties } from "react";

export const chartTooltipContentStyle: CSSProperties = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  fontSize: "0.8rem",
  padding: "8px 12px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 0.08)",
};

export const chartTooltipLabelStyle: CSSProperties = {
  color: "var(--popover-foreground)",
  fontWeight: 600,
  marginBottom: 4,
};

export const chartTooltipItemStyle: CSSProperties = {
  color: "var(--popover-foreground)",
};
