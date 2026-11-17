'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Catalog } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n/config';
import { createTranslator, pick, type Dictionary, type TFunction } from '@/lib/i18n/translate';
import { formatPrice, isCurrency, type Currency } from '@/lib/money';
import { MAX_LINE_QUANTITY, lineKey, normalizeMonogram, unitPriceDzd, type CartLine } from '@/lib/pricing';
import type { Localized } from '@/db/schema';

const CART_KEY = 'zaphira_cart_v2';
const LEGACY_CART_KEY = 'zaphira_cart_v1';
const CURRENCY_KEY = 'zaphira_currency_v1';

export type KeyedLine = CartLine & { key: string };

type StoreValue = {
  locale: Locale;
  t: TFunction;
  loc: (value: Localized | null | undefined) => string;
  catalog: Catalog;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  price: (amountDzd: number) => string;
  cart: {
    hydrated: boolean;
    lines: KeyedLine[];
    count: number;
    subtotalDzd: number;
    add: (line: CartLine) => void;
    setQuantity: (key: string, quantity: number) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
  ui: {
    lastAdded: KeyedLine | null;
    dismissAdded: () => void;
    quickViewId: string | null;
    openQuickView: (productId: string) => void;
    closeQuickView: () => void;
    searchOpen: boolean;
    setSearchOpen: (open: boolean) => void;
    storyOpen: boolean;
    setStoryOpen: (open: boolean) => void;
    toasts: { id: number; title: string; message: string }[];
    toast: (title: string, message: string) => void;
    dismissToast: (id: number) => void;
  };
};

const StoreContext = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const value = use(StoreContext);
  if (!value) throw new Error('useStore must be used inside <StoreProvider>');
  return value;
}

/** Converts carts saved by the original static site (v1) to id-only lines. */
function migrateLegacyCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const items = JSON.parse(raw) as Array<{ id?: string; isCustom?: boolean; quantity?: number; specs?: Record<string, string> }>;
    return items.flatMap((item): CartLine[] => {
      const quantity = Math.min(MAX_LINE_QUANTITY, Math.max(1, Number(item.quantity) || 1));
      if (item.isCustom) {
        const s = item.specs ?? {};
        if (!s.colorId || !s.materialId || !s.pearlsId || !s.chainId) return []; // pre-id carts can't be re-priced
        return [{ type: 'bespoke', quantity, selection: { color: s.colorId, material: s.materialId, pearls: s.pearlsId, chain: s.chainId, monogram: normalizeMonogram(s.monogram ?? '') } }];
      }
      return item.id ? [{ type: 'product', productId: item.id, quantity }] : [];
    });
  } catch {
    return [];
  }
}

function readCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) return JSON.parse(saved) as CartLine[];
    const migrated = migrateLegacyCart(localStorage.getItem(LEGACY_CART_KEY));
    localStorage.removeItem(LEGACY_CART_KEY);
    return migrated;
  } catch {
    return [];
  }
}

export function StoreProvider({
  locale,
  dictionary,
  catalog,
  children
}: {
  locale: Locale;
  dictionary: Dictionary;
  catalog: Catalog;
  children: ReactNode;
}) {
  const t = useMemo(() => createTranslator(dictionary), [dictionary]);
  const loc = useCallback((value: Localized | null | undefined) => pick(value, locale), [locale]);

  const [currency, setCurrencyState] = useState<Currency>('DZD');
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage is only read after hydration so server and client HTML match
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from browser storage */
    setLines(readCart());
    try {
      const savedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (isCurrency(savedCurrency)) setCurrencyState(savedCurrency);
    } catch {}
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  // Keep several open tabs in sync
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) setLines(readCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {}
  }, []);

  const price = useCallback((amountDzd: number) => formatPrice(amountDzd, currency, catalog.settings.rates), [currency, catalog.settings.rates]);

  // Lines whose product or options were removed from the catalog are dropped
  const keyedLines = useMemo<KeyedLine[]>(
    () => lines.filter(line => unitPriceDzd(catalog, line) !== null).map(line => ({ ...line, key: lineKey(line) })),
    [lines, catalog]
  );

  const [lastAdded, setLastAdded] = useState<KeyedLine | null>(null);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [toasts, setToasts] = useState<StoreValue['ui']['toasts']>([]);

  const add = useCallback((line: CartLine) => {
    const normalized: CartLine = line.type === 'bespoke' ? { ...line, selection: { ...line.selection, monogram: normalizeMonogram(line.selection.monogram) } } : line;
    const key = lineKey(normalized);
    setLines(current => {
      const existing = current.find(l => lineKey(l) === key);
      if (!existing) return [...current, normalized];
      return current.map(l => (lineKey(l) === key ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, l.quantity + normalized.quantity) } : l));
    });
    setLastAdded({ ...normalized, key });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines(current =>
      quantity <= 0 ? current.filter(l => lineKey(l) !== key) : current.map(l => (lineKey(l) === key ? { ...l, quantity: Math.min(MAX_LINE_QUANTITY, quantity) } : l))
    );
  }, []);

  const remove = useCallback((key: string) => setLines(current => current.filter(l => lineKey(l) !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const toast = useCallback((title: string, message: string) => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { id, title, message }]);
    setTimeout(() => setToasts(current => current.filter(item => item.id !== id)), 3800);
  }, []);

  const value: StoreValue = {
    locale,
    t,
    loc,
    catalog,
    currency,
    setCurrency,
    price,
    cart: {
      hydrated,
      lines: keyedLines,
      count: keyedLines.reduce((sum, line) => sum + line.quantity, 0),
      subtotalDzd: keyedLines.reduce((sum, line) => sum + (unitPriceDzd(catalog, line) ?? 0) * line.quantity, 0),
      add,
      setQuantity,
      remove,
      clear
    },
    ui: {
      lastAdded,
      dismissAdded: () => setLastAdded(null),
      quickViewId,
      openQuickView: setQuickViewId,
      closeQuickView: () => setQuickViewId(null),
      searchOpen,
      setSearchOpen,
      storyOpen,
      setStoryOpen,
      toasts,
      toast,
      dismissToast: id => setToasts(current => current.filter(item => item.id !== id))
    }
  };

  return <StoreContext value={value}>{children}</StoreContext>;
}
