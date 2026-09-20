import { ImageResponse } from "next/og";
import { PiggyBankIconSvg } from "@/lib/piggy-bank-icon";

export async function GET() {
  return new ImageResponse(<PiggyBankIconSvg size={512} />, { width: 512, height: 512 });
}
