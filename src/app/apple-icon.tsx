import { ImageResponse } from "next/og";
import { PiggyBankIconSvg } from "@/lib/piggy-bank-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<PiggyBankIconSvg size={180} />, { ...size });
}
