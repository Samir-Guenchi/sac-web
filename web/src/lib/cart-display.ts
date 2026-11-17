import type { Localized } from '@/db/schema';
import type { Catalog } from './catalog-types';
import type { TFunction } from './i18n/translate';
import { findOption, normalizeMonogram, type CartLine } from './pricing';

export type LineDescription = {
  name: string;
  image: string;
  /** e.g. "Collection Signature Couture" for catalog bags */
  collection: string;
  /** [label, value] pairs for bespoke bags */
  specs: Array<[string, string]>;
  monogram: string;
  reference: string;
};

const FALLBACK_IMAGE = '/assets/images/products/product-pearl-ivory.jpg';

export function describeLine(
  line: CartLine,
  catalog: Catalog,
  loc: (value: Localized | null | undefined) => string,
  t: TFunction
): LineDescription {
  if (line.type === 'product') {
    const product = catalog.products.find(p => p.id === line.productId);
    return {
      name: product?.name ?? line.productId,
      image: product?.primaryImage ?? FALLBACK_IMAGE,
      collection: product ? loc(product.collection) : '',
      specs: [],
      monogram: '',
      reference: `ZPH-${line.productId.toUpperCase()}`
    };
  }

  const s = line.selection;
  const color = findOption(catalog, 'color', s.color);
  const optionName = (kind: 'material' | 'pearls' | 'chain') => loc(findOption(catalog, kind, s[kind])?.name);
  const colorName = loc(color?.name);
  return {
    name: t('studio.itemName', { color: colorName }),
    image: color?.imageUrl ?? FALLBACK_IMAGE,
    collection: '',
    specs: [
      [t('panier.specColor'), colorName],
      [t('panier.specMaterial'), optionName('material')],
      [t('panier.specPearls'), optionName('pearls')],
      [t('panier.specChain'), optionName('chain')]
    ],
    monogram: normalizeMonogram(s.monogram),
    reference: `ZPH-BESPOKE-${s.color.toUpperCase()}`
  };
}
