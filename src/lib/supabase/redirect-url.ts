export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getCallbackUrl(locale: string, next: string): string {
  const url = new URL(`${getSiteUrl()}/${locale}/callback`);
  url.searchParams.set("next", next);
  return url.toString();
}
