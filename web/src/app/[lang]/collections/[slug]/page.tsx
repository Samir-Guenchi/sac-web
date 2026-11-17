import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { CollectionView } from '@/components/catalog/CollectionView';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  return categories.map(category => ({ slug: category.id }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/collections/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCatalog()).categories.find(c => c.id === slug);
  if (!category) return {};
  const locale = await getLocale();
  return { title: pick(category.name, locale), description: pick(category.description, locale) };
}

export default function CollectionPage({ params }: PageProps<'/[lang]/collections/[slug]'>) {
  return (
    <PageShell className="collection-page">
      <Suspense fallback={<div className="page-skeleton" aria-busy="true" />}>
        <CollectionContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function CollectionContent({ params }: Pick<PageProps<'/[lang]/collections/[slug]'>, 'params'>) {
  const { slug } = await params;
  const category = (await getCatalog()).categories.find(c => c.id === slug);
  if (!category) notFound();
  const locale = await getLocale();
  const t = await getT(locale);

  return (
    <>
      <Breadcrumbs
        label={t('product.breadcrumb')}
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('collections.all'), href: `/${locale}/collections` },
          { label: pick(category.name, locale) }
        ]}
      />
      <CollectionView categoryId={category.id} />
    </>
  );
}
