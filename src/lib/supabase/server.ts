import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // เรียกจาก Server Component ที่ set cookie ไม่ได้ — proxy.ts จะ refresh session แทน
          }
        },
      },
    },
  );
}

/**
 * ดึงผู้ใช้ปัจจุบันแบบไม่ทำให้หน้าเว็บพัง
 * ถ้ายังไม่ได้ตั้งค่า Supabase หรือเครือข่ายมีปัญหา จะถือว่ายังไม่ได้เข้าสู่ระบบแทนการโยน error
 */
export async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
