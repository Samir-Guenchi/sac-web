import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { OrderTracking } from '@/components/site/OrderTracking';
import { PageShell } from '@/components/site/PageShell';
import { getLocale, getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('tracking.title'), robots: { index: false } };
}

export default async function TrackingPage() {
  const locale = await getLocale();
  const t = await getT(locale);
  return (
    <PageShell className="info-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('tracking.title') }]} />
      <OrderTracking />
    </PageShell>
  );
}
