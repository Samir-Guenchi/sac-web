/** Plain, serializable catalog shapes shared by Server and Client Components. */

import type { Localized, OptionKind } from '@/db/schema';
import type { ExchangeRates } from './money';

export type Product = {
  id: string;
  name: string;
  collection: Localized;
  tag: Localized;
  badgeClass: string;
  priceDzd: number;
  shortDescription: Localized;
  fullDescription: Localized;
  materials: Localized;
  dimensions: Localized;
  hardware: Localized;
  primaryImage: string;
  gallery: string[];
};

export type CustomizerOption = {
  kind: OptionKind;
  id: string;
  name: Localized;
  description: Localized | null;
  hex: string | null;
  imageUrl: string | null;
  priceModifierDzd: number;
};

export type ContactNumber = { display: string; tel: string | null };

export type ShopSettings = {
  basePriceDzd: number;
  monogramCostDzd: number;
  rates: ExchangeRates;
  contact: { whatsapp: ContactNumber; phone: ContactNumber };
};

export type Catalog = {
  products: Product[];
  options: Record<OptionKind, CustomizerOption[]>;
  settings: ShopSettings;
};

export type JournalEntry = {
  id: number;
  tag: Localized;
  title: Localized;
  excerpt: Localized;
  image: string;
  readTime: Localized;
  date: Localized;
};

export type Testimonial = {
  id: number;
  quote: Localized;
  author: string;
  location: Localized;
  product: string;
};

export const DEFAULT_SETTINGS: ShopSettings = {
  basePriceDzd: 18500,
  monogramCostDzd: 1500,
  rates: { EUR: 148, USD: 136 },
  // TODO(before launch): set the real numbers in Admin → Settings
  contact: {
    whatsapp: { display: '+213 (0) XX XX XX XX', tel: null },
    phone: { display: '+213 (0) XX XX XX XX', tel: null }
  }
};
