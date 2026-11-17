/** Plain, serializable catalog shapes shared by Server and Client Components. */

import type { Localized, OptionKind } from '@/db/schema';
import type { ExchangeRates } from './money';

export type Category = {
  id: string;
  name: Localized;
  description: Localized | null;
  image: string | null;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string | null;
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

/** Site imagery the admin can replace (Admin → Settings → Media). */
export type SiteMedia = {
  heroVideo: string;
  heroPoster: string;
  craftImage: string;
  heritageImage: string;
};

/** Social profile URLs; empty ones are hidden in the footer. */
export type SocialLinks = { instagram: string; facebook: string; tiktok: string };

/** Optional measurement IDs; scripts load only after the visitor's consent. */
export type TrackingIds = { gaMeasurementId: string; metaPixelId: string };

export type ShopSettings = {
  basePriceDzd: number;
  monogramCostDzd: number;
  rates: ExchangeRates;
  contact: { whatsapp: ContactNumber; phone: ContactNumber };
  media: SiteMedia;
  social: SocialLinks;
  tracking: TrackingIds;
};

export type Catalog = {
  categories: Category[];
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
  body: Localized | null;
  gallery: string[];
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
  },
  media: {
    heroVideo: '/assets/video/zaphira-hero.mp4',
    heroPoster: '/assets/images/branding/zaphira-hero-poster.jpg',
    craftImage: '/assets/images/editorial/craftsmanship-macro.jpg',
    heritageImage: '/assets/images/editorial/algeria-heritage.jpg'
  },
  social: { instagram: '', facebook: '', tiktok: '' },
  tracking: { gaMeasurementId: '', metaPixelId: '' }
};
