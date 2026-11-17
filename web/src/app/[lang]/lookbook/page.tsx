import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { Flourish, Waves } from '@/components/art/LineArt';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import type { Product } from '@/lib/catalog-types';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('lookbook.metaTitle'), description: t('lookbook.metaDescription') };
}

const TILES = 5;

/** One photo per bag first, then the bags' other photos, up to five tiles. */
function lookTiles(products: Product[]) {
  const tiles = products.slice(0, TILES).map(product => ({ product, image: product.primaryImage }));
  for (const product of products) {
    for (const image of product.gallery) {
      if (tiles.length >= TILES) return tiles;
      if (!tiles.some(tile => tile.image === image)) tiles.push({ product, image });
    }
  }
  return tiles;
}

/** Editorial lookbook: one chapter per collection, built from the live catalogue. */
export default async function LookbookPage() {
  const locale = await getLocale();
  const [t, catalog] = await Promise.all([getT(locale), getCatalog()]);
  const home = `/${locale}`;
  const looks = catalog.categories
    .map((category, i) => ({ category, n: i + 1, items: lookTiles(catalog.products.filter(p => p.categoryId === category.id)) }))
    .filter(look => look.items.length > 0);
  // Chapter copy exists for the first four collections; later ones use their own description
  const copy = (n: number, key: 'Title' | 'Text', fallback: string) => (n <= 4 ? t(`lookbook.look${n}${key}`) : fallback);

  return (
    <PageShell className="lookbook-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: home }, { label: t('lookbook.metaTitle') }]} />

      <header className="lookbook-hero">
        <span className="eyebrow">{t('lookbook.eyebrow')}</span>
        <h1>{t('lookbook.heroTitle')}</h1>
        <Waves className="lookbook-hero-waves" />
        <p>{t('lookbook.heroText')}</p>
      </header>

      {looks.map(({ category, n, items }) => (
        <section key={category.id} className={`look look-${((n - 1) % 2) + 1}`}>
          <header className="look-head reveal">
            <span className="look-number">{String(n).padStart(2, '0')}</span>
            <div>
              <span className="eyebrow">{pick(category.name, locale)}</span>
              <h2>{copy(n, 'Title', pick(category.name, locale))}</h2>
              <p>{copy(n, 'Text', pick(category.description, locale))}</p>
            </div>
          </header>
          <div className="look-mosaic">
            {items.map(({ product, image }, i) => (
              <Link key={image} href={`${home}/produits/${product.id}`} className="look-tile reveal reveal-image" style={{ '--i': i } as React.CSSProperties}>
                <img src={image} alt={product.name} loading="lazy" />
                <span className="look-tile-caption">
                  <span>{product.name}</span>
                  <span className="look-tile-cta">{t('lookbook.shopLook')}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="look-foot reveal">
            <Link href={`${home}/collections/${category.id}`} className="link-underline">
              {t('lookbook.seeCollection', { name: pick(category.name, locale) })}
            </Link>
          </div>
        </section>
      ))}

      <section className="lookbook-closing reveal">
        <Flourish className="brand-flourish" />
        <h2>{t('lookbook.closingTitle')}</h2>
        <p>{t('lookbook.closingText')}</p>
        <Link href={`${home}#customizer-section`} className="btn-hermes-black">
          {t('lookbook.closingCta')}
        </Link>
      </section>
    </PageShell>
  );
}
