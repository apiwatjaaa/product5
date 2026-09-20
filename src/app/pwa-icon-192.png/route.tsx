import { ImageResponse } from "next/og";
import { PiggyBankIconSvg } from "@/lib/piggy-bank-icon";

export async function GET() {
  return new ImageResponse(<PiggyBankIconSvg size={192} />, { width: 192, height: 192 });
}
