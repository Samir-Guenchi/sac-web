/**
 * ZAPHIRA — Translation helpers
 *
 * t('section.key', { var }) returns the string for the active language,
 * falling back to English. applyLanguage() refreshes every [data-i18n] and
 * [data-i18n-placeholder] element and sets <html lang/dir>. It runs again
 * automatically whenever cartStore.setLanguage() fires `i18n:change`.
 */

import { I18N } from '../data/i18n.js';
import { cartStore } from '../state/cart-state.js';

function lookup(dict, key) {
  return key.split('.').reduce((val, k) => (val && val[k] !== undefined ? val[k] : undefined), dict);
}

function resolve(key) {
  const val = lookup(I18N[cartStore.language], key);
  if (typeof val === 'string') return val;
  const fallback = lookup(I18N.en, key);
  return typeof fallback === 'string' ? fallback : null;
}

export function t(key, vars = {}) {
  const val = resolve(key);
  if (val === null) return key;
  return val.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? vars[name] : match));
}

/**
 * Pick the active language from a localized data value: { en, fr, ar } → string.
 * Plain strings (proper names, legacy data) are returned unchanged.
 */
export function loc(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[cartStore.language] ?? value.en ?? '';
  }
  return value ?? '';
}

export function applyLanguage() {
  const lang = cartStore.language;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = resolve(el.getAttribute('data-i18n'));
    if (val === null) return;
    if (el.classList.contains('hermes-hero-title') || el.classList.contains('hermes-hero-description')) {
      el.innerHTML = '';
      const em = document.createElement('em');
      em.textContent = val;
      el.appendChild(em);
    } else {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = resolve(el.getAttribute('data-i18n-placeholder'));
    if (val !== null) el.setAttribute('placeholder', val);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const val = resolve(el.getAttribute('data-i18n-alt'));
    if (val !== null) el.setAttribute('alt', val);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const val = resolve(el.getAttribute('data-i18n-aria'));
    if (val !== null) el.setAttribute('aria-label', val);
  });
}

document.addEventListener('i18n:change', applyLanguage);
