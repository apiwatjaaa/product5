import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest, response: NextResponse) {
  // ยังไม่ได้ตั้งค่า Supabase (เช่น รันบนเครื่องที่ไม่มี .env.local) — ข้ามการ refresh session ไปเลย ไม่ให้ทั้งเว็บพัง
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // ต้องเรียก getUser() เพื่อ refresh session token ให้ทันเวลาเสมอ
  try {
    await supabase.auth.getUser();
  } catch {
    // เครือข่ายไปยัง Supabase มีปัญหา — ให้หน้าเว็บโหลดต่อได้ ผู้ใช้จะเห็นสถานะยังไม่เข้าสู่ระบบ
  }

  return response;
}
