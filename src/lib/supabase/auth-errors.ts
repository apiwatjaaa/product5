// แปล error ดิบจาก Supabase Auth เป็น key ข้อความที่คนทั่วไปเข้าใจ (ดู messages/*.json -> auth.errors.*)

const PATTERNS: Array<{ match: RegExp; key: string }> = [
  { match: /invalid login credentials/i, key: "invalidCredentials" },
  { match: /user already registered/i, key: "emailTaken" },
  { match: /unable to validate email address/i, key: "invalidEmail" },
  { match: /password should be at least/i, key: "passwordTooShort" },
  { match: /rate limit/i, key: "rateLimited" },
  { match: /email not confirmed/i, key: "emailNotConfirmed" },
  { match: /failed to fetch|network|load failed/i, key: "network" },
];

export function authErrorKey(message: string | undefined | null): string {
  if (!message) return "generic";
  const found = PATTERNS.find((p) => p.match.test(message));
  return found?.key ?? "generic";
}

/**
 * ป้องกัน open redirect: ยอมรับเฉพาะ path ภายในเว็บ (ขึ้นต้นด้วย "/" ตัวเดียว)
 * เช่น ?next=//evil.com หรือ ?next=https://evil.com จะถูกแทนด้วยค่าเริ่มต้น
 */
export function safeNextPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}
