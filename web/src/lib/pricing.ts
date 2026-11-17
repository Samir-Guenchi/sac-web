/**
 * Pricing rules shared by the storefront (display) and the server (checkout).
 * The server always recomputes prices from the database with these functions;
 * prices sent by the browser are never trusted.
 */

import type { OptionKind } from '@/db/schema';
import type { Catalog, CustomizerOption } from './catalog-types';

export type BespokeSelection = Record<OptionKind, string> & { monogram: string };

/** A cart line as stored in the browser: ids and quantity only. */
export type CartLine =
  | { type: 'product'; productId: string; quantity: number }
  | { type: 'bespoke'; selection: BespokeSelection; quantity: number };

export const MAX_LINE_QUANTITY = 10;

export function normalizeMonogram(value: string): string {
  return value.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
}

export function findOption(catalog: Catalog, kind: OptionKind, id: string): CustomizerOption | undefined {
  return catalog.options[kind].find(option => option.id === id);
}

export function defaultSelection(catalog: Catalog): BespokeSelection {
  const first = (kind: OptionKind) => catalog.options[kind][0]?.id ?? '';
  return { color: first('color'), material: first('material'), pearls: first('pearls'), chain: first('chain'), monogram: '' };
}

/** Returns null when any option no longer exists or is inactive. */
export function bespokePriceDzd(catalog: Catalog, selection: BespokeSelection): number | null {
  let total = catalog.settings.basePriceDzd;
  for (const kind of ['color', 'material', 'pearls', 'chain'] as const) {
    const option = findOption(catalog, kind, selection[kind]);
    if (!option) return null;
    total += option.priceModifierDzd;
  }
  if (normalizeMonogram(selection.monogram)) total += catalog.settings.monogramCostDzd;
  return total;
}

export function unitPriceDzd(catalog: Catalog, line: CartLine): number | null {
  if (line.type === 'product') {
    return catalog.products.find(p => p.id === line.productId)?.priceDzd ?? null;
  }
  return bespokePriceDzd(catalog, line.selection);
}

/** Identity of a cart line: same product/configuration → same line. */
export function lineKey(line: CartLine): string {
  if (line.type === 'product') return `p:${line.productId}`;
  const s = line.selection;
  return `b:${s.color}|${s.material}|${s.pearls}|${s.chain}|${normalizeMonogram(s.monogram)}`;
}
