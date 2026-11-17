import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Flourish, PicassoFace } from '@/components/art/LineArt';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('gifts.metaTitle'), description: t('gifts.metaDescription') };
}

/** Budgets in DZD for the gift selection. */
const BUDGETS = [
  ['budget1', 0, 10000],
  ['budget2', 10000, 12000],
  ['budget3', 12000, Infinity]
] as const;

const PACK_ICONS = [
  'M3 8h18v12H3zM3 8l2-4h14l2 4M12 8v12',
  'M6 7h12l1 13H5zM9 7a3 3 0 0 1 6 0',
  'M4 5h16v14H4zM8 9h8M8 13h5',
  'M12 4c1.5 2.5 4 3.5 4 6.5a4 4 0 0 1-8 0C8 7.5 10.5 6.5 12 4ZM9 20h6'
];

/** The art of giving: the Picasso-blue packaging and a gift selection by budget. */
export default async function GiftsPage() {
  const locale = await getLocale();
  const [t, catalog] = await Promise.all([getT(locale), getCatalog()]);
  const home = `/${locale}`;

  return (
    <PageShell className="gifts-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: home }, { label: t('gifts.metaTitle') }]} />

      <section className="gifts-hero full-bleed">
        <div className="container gifts-hero-grid">
          <div className="gifts-hero-text">
            <span className="eyebrow">{t('gifts.eyebrow')}</span>
            <h1>{t('gifts.heroTitle')}</h1>
            <Flourish className="brand-flourish brand-flourish-start" />
            <p>{t('gifts.heroText')}</p>
          </div>
          <div className="gifts-hero-visual">
            <PicassoFace className="gifts-hero-face" />
            <img src="/assets/images/branding/ecrin-zaphira.svg" alt={t('giftTeaser.imageAlt')} />
          </div>
        </div>
      </section>

      <section className="gifts-pack" id="ecrin">
        <header className="universe-section-head reveal">
          <span className="eyebrow">{t('gifts.packEyebrow')}</span>
          <h2>{t('gifts.packTitle')}</h2>
        </header>
        <div className="gifts-pack-grid">
          {PACK_ICONS.map((icon, i) => (
            <div key={icon} className="gifts-pack-item reveal" style={{ '--i': i } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
              <h3>{t(`gifts.pack${i + 1}Title`)}</h3>
              <p>{t(`gifts.pack${i + 1}Text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gifts-selection">
        <header className="universe-section-head reveal">
          <span className="eyebrow">{t('gifts.budgetEyebrow')}</span>
          <h2>{t('gifts.budgetTitle')}</h2>
        </header>
        {BUDGETS.map(([key, min, max]) => {
          const items = catalog.products.filter(p => p.priceDzd >= min && p.priceDzd < max).slice(0, 4);
          if (items.length === 0) return null;
          return (
            <div key={key} className="gifts-budget">
              <h3 className="gifts-budget-title reveal">{t(`gifts.${key}`)}</h3>
              <div className="collection-grid">
                {items.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="gifts-bespoke full-bleed reveal">
        <div className="container gifts-bespoke-inner">
          <h2>{t('gifts.bespokeTitle')}</h2>
          <p>{t('gifts.bespokeText')}</p>
          <Link href={`${home}#customizer-section`} className="btn-outline-light">
            {t('gifts.bespokeCta')}
          </Link>
        </div>
      </section>

      <section className="gifts-note reveal">
        <h2>{t('gifts.noteTitle')}</h2>
        <p>{t('gifts.noteText')}</p>
      </section>
    </PageShell>
  );
}
