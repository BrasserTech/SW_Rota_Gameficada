/** Reverse proxies may expose an internal URL. Host preserves the public authority. */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  try {
    const parsed = new URL(origin);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.origin !== origin) return false;
    const host = request.headers.get('host') ?? new URL(request.url).host;
    return parsed.host.toLowerCase() === host.toLowerCase();
  } catch { return false; }
}
