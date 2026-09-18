import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  return updateSession(request, response);
}

export const config = {
  // apple-icon ไม่มีนามสกุลไฟล์ใน URL (ต่างจาก icon.svg/favicon.ico) ต้อง exclude เองไม่งั้น
  // middleware ภาษาจะดักไปเติม locale prefix แล้ว 404 เพราะ route นี้มีแค่ที่ root เท่านั้น
  matcher: ["/((?!api|trpc|_next|_vercel|apple-icon|.*\\..*).*)"],
};
