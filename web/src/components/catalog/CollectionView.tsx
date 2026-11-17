'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { ProductCard } from './ProductCard';

type Sort = 'featured' | 'priceAsc' | 'priceDesc';

/** Collection page: collection tabs, product count, sorting, grid. `categoryId` null = all bags. */
export function CollectionView({ categoryId }: { categoryId: string | null }) {
  const { t, loc, locale, catalog } = useStore();
  const [sort, setSort] = useState<Sort>('featured');
  const category = catalog.categories.find(c => c.id === categoryId);

  const items = useMemo(() => {
    const list = catalog.products.filter(p => !categoryId || p.categoryId === categoryId);
    if (sort === 'priceAsc') return [...list].sort((a, b) => a.priceDzd - b.priceDzd);
    if (sort === 'priceDesc') return [...list].sort((a, b) => b.priceDzd - a.priceDzd);
    return list;
  }, [catalog.products, categoryId, sort]);

  return (
    <>
      <header className="collection-hero">
        <h1>{category ? loc(category.name) : t('collections.all')}</h1>
        {category?.description && <p>{loc(category.description)}</p>}
      </header>

      <nav className="collection-tabs" aria-label={t('collections.navLabel')}>
        <Link href={`/${locale}/collections`} aria-current={!categoryId ? 'page' : undefined}>
          {t('collections.all')}
        </Link>
        {catalog.categories.map(c => (
          <Link key={c.id} href={`/${locale}/collections/${c.id}`} aria-current={c.id === categoryId ? 'page' : undefined}>
            {loc(c.name)}
          </Link>
        ))}
      </nav>

      <div className="collection-toolbar">
        <span>{t(items.length === 1 ? 'collections.countOne' : 'collections.countMany', { count: items.length })}</span>
        <label>
          {t('collections.sortLabel')}{' '}
          <select value={sort} onChange={event => setSort(event.target.value as Sort)}>
            <option value="featured">{t('collections.sortFeatured')}</option>
            <option value="priceAsc">{t('collections.sortPriceAsc')}</option>
            <option value="priceDesc">{t('collections.sortPriceDesc')}</option>
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <p className="collection-empty">{t('collections.empty')}</p>
      ) : (
        <div className="collection-grid">
          {items.map(product => (
            <ProductCard key={product.id} product={product} reveal={false} />
          ))}
        </div>
      )}
    </>
  );
}
