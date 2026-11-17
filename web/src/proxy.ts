import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isLocale, type Locale } from '@/lib/i18n/config';

/** Picks the visitor's language: saved choice first, then browser languages. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const header = request.headers.get('accept-language') ?? '';
  const ranked = header
    .split(',')
    .map(part => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: tag.toLowerCase().split('-')[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return (ranked.find(entry => isLocale(entry.lang))?.lang as Locale | undefined) ?? DEFAULT_LOCALE;
}

/** Storefront URLs always carry a locale: /panier → /fr/panier. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return;

  // Old static-site URLs keep working
  const legacy: Record<string, string> = { '/index.html': '', '/panier.html': '/panier', '/compte.html': '/compte' };
  const rest = pathname in legacy ? legacy[pathname] : pathname === '/' ? '' : pathname;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${rest}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals, API routes, the admin, and static files
  matcher: ['/((?!_next|api|admin|assets|uploads|icon\\.svg|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)']
};
