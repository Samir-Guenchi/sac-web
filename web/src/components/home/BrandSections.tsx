import Link from 'next/link';
import { Eye, Flourish, PicassoFace, Profile, Waves } from '@/components/art/LineArt';
import type { Catalog } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n/config';
import { pick, type TFunction } from '@/lib/i18n/translate';

/** One cover per collection: its own image, else its first bag's photo. */
export function collectionCovers(catalog: Catalog) {
  return catalog.categories.map(category => {
    const items = catalog.products.filter(p => p.categoryId === category.id);
    return { ...category, count: items.length, cover: category.image ?? items[0]?.primaryImage ?? catalog.settings.media.craftImage };
  });
}

/** Collections as Moorish arches: shop by mood. */
export function MoodArches({ t, catalog, locale }: { t: TFunction; catalog: Catalog; locale: Locale }) {
  const home = `/${locale}`;
  return (
    <section className="moods-section section-padding" id="moods-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('moods.eyebrow')}</span>
          <h2>{t('moods.title')}</h2>
          <Flourish className="brand-flourish" />
          <p className="section-lede">{t('moods.text')}</p>
        </div>
        <div className="moods-grid">
          {collectionCovers(catalog).map((c, i) => (
            <Link key={c.id} href={`${home}/collections/${c.id}`} className="mood-card reveal" style={{ '--i': i } as React.CSSProperties}>
              <span className="mood-arch">
                <img src={c.cover} alt="" loading="lazy" />
              </span>
              <span className="mood-name">{pick(c.name, locale)}</span>
              <span className="mood-meta">{t(c.count === 1 ? 'collections.countOne' : 'collections.countMany', { count: c.count })}</span>
              <span className="mood-cta">{t('moods.cta')}</span>
            </Link>
          ))}
        </div>
        <div className="moods-footer reveal">
          <Link href={`${home}/lookbook`} className="link-underline">
            {t('moods.lookbook')}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Picasso-blue band: art, creativity, confidence. */
export function UniverseBand({ t, locale }: { t: TFunction; locale: Locale }) {
  const items = [
    [Profile, 1],
    [Waves, 2],
    [Eye, 3]
  ] as const;
  return (
    <section className="universe-band" id="universe-section">
      <PicassoFace className="universe-band-face" />
      <div className="container">
        <div className="universe-band-head reveal">
          <span className="eyebrow">{t('universeBand.eyebrow')}</span>
          <h2>{t('universeBand.title')}</h2>
          <p className="universe-band-words">{t('universeBand.words')}</p>
        </div>
        <div className="universe-band-grid">
          {items.map(([Art, n]) => (
            <div key={n} className="universe-band-item reveal" style={{ '--i': n } as React.CSSProperties}>
              <Art className="universe-band-icon" />
              <h3>{t(`universeBand.item${n}Title`)}</h3>
              <p>{t(`universeBand.item${n}Text`)}</p>
            </div>
          ))}
        </div>
        <div className="universe-band-cta reveal">
          <Link href={`/${locale}/univers`} className="btn-outline-light">
            {t('universeBand.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The art of giving: the Picasso-blue packaging. */
export function GiftTeaser({ t, locale }: { t: TFunction; locale: Locale }) {
  return (
    <section className="gift-teaser section-padding" id="gift-section">
      <div className="container gift-teaser-grid">
        <div className="gift-teaser-visual reveal">
          <span className="gift-teaser-halo" aria-hidden="true" />
          <img src="/assets/images/branding/ecrin-zaphira.svg" alt={t('giftTeaser.imageAlt')} loading="lazy" />
        </div>
        <div className="gift-teaser-text reveal">
          <span className="eyebrow">{t('giftTeaser.eyebrow')}</span>
          <h2>{t('giftTeaser.title')}</h2>
          <Flourish className="brand-flourish brand-flourish-start" />
          <p>{t('giftTeaser.text')}</p>
          <div className="gift-teaser-actions">
            <Link href={`/${locale}/cadeaux`} className="btn-hermes-black">
              {t('giftTeaser.cta')}
            </Link>
            <Link href={`/${locale}/lookbook`} className="link-underline">
              {t('giftTeaser.cta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Thin gold bar showing how far the visitor has scrolled (CSS scroll timeline). */
export function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}
