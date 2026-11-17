'use client';

import Link from 'next/link';
import { useStore } from '@/components/store/StoreProvider';
import type { Product } from '@/lib/catalog-types';

/** Product tile used on the home page, collection pages, search and "you may also like". */
export function ProductCard({ product, reveal = true }: { product: Product; reveal?: boolean }) {
  const { t, loc, locale, price, cart, ui } = useStore();
  const href = `/${locale}/produits/${product.id}`;

  return (
    <article className={`product-card${reveal ? ' reveal' : ''}`}>
      <div className="product-image-container">
        <span className={`badge ${product.badgeClass} product-card-badge`}>{loc(product.tag)}</span>
        <Link href={href} aria-label={product.name}>
          <img src={product.primaryImage} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-overlay-actions">
          <button type="button" className="btn btn-secondary btn-sm btn-full" onClick={() => ui.openQuickView(product.id)}>
            {t('collection.quickView')}
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-material-tag">{loc(product.collection)}</div>
        <h3 className="product-name">
          <Link href={href}>{product.name}</Link>
        </h3>
        <div className="product-price-row">
          <span className="product-price">{price(product.priceDzd)}</span>
          <button type="button" className="btn-text" disabled={!cart.hydrated} onClick={() => cart.add({ type: 'product', productId: product.id, quantity: 1 })}>
            {t('collection.addToBag')} +
          </button>
        </div>
      </div>
    </article>
  );
}
