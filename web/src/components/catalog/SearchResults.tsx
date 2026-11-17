'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { searchProducts } from '@/lib/search';
import { ProductCard } from './ProductCard';

export function SearchResults() {
  const { t, catalog } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = (params.get('q') ?? '').trim();
  const [value, setValue] = useState(q);
  const results = searchProducts(catalog, q);

  return (
    <>
      <header className="collection-hero">
        <h1>{q ? t('search.resultsFor', { query: q }) : t('search.resultsPage')}</h1>
        <form
          role="search"
          className="search-page-form"
          onSubmit={event => {
            event.preventDefault();
            router.replace(`${pathname}?q=${encodeURIComponent(value.trim())}`);
          }}
        >
          <input type="search" value={value} onChange={event => setValue(event.target.value)} placeholder={t('search.placeholder')} aria-label={t('search.label')} />
          <button type="submit" className="btn-hermes-black">
            {t('nav.search')}
          </button>
        </form>
      </header>
      {q && (
        <div className="collection-toolbar">
          <span>{t(results.length === 1 ? 'collections.countOne' : 'collections.countMany', { count: results.length })}</span>
        </div>
      )}
      {q && results.length === 0 && <p className="collection-empty">{t('search.noResults', { query: q })}</p>}
      <div className="collection-grid">
        {results.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
