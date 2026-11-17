/** Display-only currency conversion. Orders are always priced and stored in DZD. */

export const CURRENCIES = ['DZD', 'EUR', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** DZD per 1 unit of the foreign currency, editable in the admin settings. */
export type ExchangeRates = { EUR: number; USD: number };

export const DEFAULT_RATES: ExchangeRates = { EUR: 148, USD: 136 };

export function formatPrice(amountDzd: number, currency: Currency, rates: ExchangeRates): string {
  if (currency === 'DZD') return `${amountDzd.toLocaleString('en-US')} DZD`;
  const converted = Math.round(amountDzd / rates[currency]);
  return `${currency === 'EUR' ? '€' : '$'}${converted.toLocaleString('en-US')}`;
}

export const isCurrency = (value: unknown): value is Currency =>
  typeof value === 'string' && (CURRENCIES as readonly string[]).includes(value);
