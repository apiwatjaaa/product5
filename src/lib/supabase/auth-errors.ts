// แปล error ดิบจาก Supabase Auth เป็น key ข้อความที่คนทั่วไปเข้าใจ (ดู messages/*.json -> auth.errors.*)

const PATTERNS: Array<{ match: RegExp; key: string }> = [
  { match: /invalid login credentials/i, key: "invalidCredentials" },
  { match: /user already registered/i, key: "emailTaken" },
  { match: /unable to validate email address/i, key: "invalidEmail" },
  { match: /password should be at least/i, key: "passwordTooShort" },
  { match: /rate limit/i, key: "rateLimited" },
];

export function authErrorKey(message: string | undefined | null): string {
  if (!message) return "generic";
  const found = PATTERNS.find((p) => p.match.test(message));
  return found?.key ?? "generic";
}
