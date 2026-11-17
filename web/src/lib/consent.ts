/**
 * Cookie consent, stored in a first-party cookie so the choice is also visible
 * to the server if ever needed. Format: `v1.<analytics 0|1>.<marketing 0|1>.<epoch ms>`.
 * Necessary cookies (sign-in session, language, consent itself) need no consent.
 */

export type Consent = { analytics: boolean; marketing: boolean; date: number };

export const CONSENT_COOKIE = 'zaphira_consent';
export const CONSENT_VERSION = 'v1';
/** CNIL-style guidance: ask again after about 6 months. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 182;
export const CONSENT_EVENT = 'zaphira:consent-change';
export const OPEN_SETTINGS_EVENT = 'zaphira:open-cookie-settings';

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie
    .split('; ')
    .find(part => part.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  const [version, analytics, marketing, date] = (raw ? decodeURIComponent(raw) : '').split('.');
  if (version !== CONSENT_VERSION) return null;
  return { analytics: analytics === '1', marketing: marketing === '1', date: Number(date) || 0 };
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }) {
  const previous = readConsent();
  const value = [CONSENT_VERSION, choice.analytics ? 1 : 0, choice.marketing ? 1 : 0, Date.now()].join('.');
  const secure = location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
  // Scripts that already ran can't be unloaded: reload when a permission is withdrawn
  if ((previous?.analytics && !choice.analytics) || (previous?.marketing && !choice.marketing)) location.reload();
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}
