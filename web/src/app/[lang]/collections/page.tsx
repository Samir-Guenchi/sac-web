import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { CollectionView } from '@/components/catalog/CollectionView';
import { PageShell } from '@/components/site/PageShell';
import { getLocale, getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('collections.all') };
}

export default async function AllCollectionsPage() {
  const locale = await getLocale();
  const t = await getT(locale);
  return (
    <PageShell className="collection-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('collections.all') }]} />
      <CollectionView categoryId={null} />
    </PageShell>
  );
}
