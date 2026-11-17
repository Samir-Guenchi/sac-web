import type { Metadata } from 'next';
import { PanierView } from '@/components/panier/PanierView';
import { getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('panier.stepCart'), robots: { index: false } };
}

export default function PanierPage() {
  return (
    <div className="panier-page">
      <PanierView />
    </div>
  );
}
