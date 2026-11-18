import { createClient } from "@supabase/supabase-js";

/**
 * กันไม่ให้ Supabase (แพ็กเกจฟรี) พักโปรเจกต์อัตโนมัติเมื่อไม่มีคนใช้งานประมาณ 7 วัน
 * Vercel Cron เรียก route นี้วันละครั้ง (ตั้งเวลาใน vercel.json) เพื่อส่งคำขอเล็ก ๆ ไปที่ฐานข้อมูล
 * ไม่อ่านข้อมูลของใคร: ใช้ anon key ซึ่งถูก Row Level Security กันไว้ จึงได้ผลลัพธ์ว่างเสมอ
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // ถ้าตั้ง CRON_SECRET ไว้ใน Vercel จะยอมรับเฉพาะคำขอจาก Vercel Cron เท่านั้น
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, error: "supabase_not_configured" }, { status: 500 });
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase.from("plans").select("id", { head: true, count: "exact" }).limit(1);
    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 502 });
    }
    return Response.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch {
    return Response.json({ ok: false, error: "network" }, { status: 502 });
  }
}
