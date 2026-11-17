import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { SearchResults } from '@/components/catalog/SearchResults';
import { PageShell } from '@/components/site/PageShell';
import { getLocale, getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('search.resultsPage'), robots: { index: false } };
}

export default async function SearchPage() {
  const locale = await getLocale();
  const t = await getT(locale);
  return (
    <PageShell className="collection-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('search.resultsPage') }]} />
      {/* Reads ?q= from the URL, so it renders behind a boundary */}
      <Suspense fallback={<p className="collection-empty">…</p>}>
        <SearchResults />
      </Suspense>
    </PageShell>
  );
}
