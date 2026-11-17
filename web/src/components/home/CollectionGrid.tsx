'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useStore } from '@/components/store/StoreProvider';

/** Home page selection: the first eight bags, with a link to every collection. */
export function CollectionGrid() {
  const { t, locale, catalog } = useStore();

  return (
    <section className="collection-section section-padding" id="collection-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('collection.eyebrow')}</span>
          <h2>{t('collection.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>

        <div className="collection-grid">
          {catalog.products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="collection-see-all">
          <Link href={`/${locale}/collections`} className="btn-hermes-black">
            {t('collections.seeAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
