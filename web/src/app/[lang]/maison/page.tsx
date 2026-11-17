import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t('about.metaTitle'),
    description: t('about.metaDescription'),
    openGraph: { title: t('about.metaTitle'), description: t('about.metaDescription'), images: ['/assets/images/editorial/algeria-heritage.jpg'] }
  };
}

/** "À propos" page. All text is in the `about` section of Admin → Site texts. */
export default async function MaisonPage() {
  const locale = await getLocale();
  const [t, catalog] = await Promise.all([getT(locale), getCatalog()]);
  const { media } = catalog.settings;
  const home = `/${locale}`;

  const steps = [1, 2, 3, 4, 5] as const;
  const commitments = [
    [1, 'M12 3c-2 3-6 4-6 9a6 6 0 0 0 12 0c0-5-4-6-6-9Z'],
    [2, 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'],
    [3, 'M2 7h12v9H2zM14 10h4l3 3v3h-7M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'],
    [4, 'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.3A8 8 0 1 1 21 12Z']
  ] as const;

  // One cover per collection: its own image, else its first bag's photo
  const collections = catalog.categories.map(category => ({
    ...category,
    cover: category.image ?? catalog.products.find(p => p.categoryId === category.id)?.primaryImage ?? media.craftImage
  }));

  return (
    <PageShell className="about-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: home }, { label: t('about.metaTitle') }]} />

      <section className="about-hero">
        <img src={media.heritageImage} alt="" className="about-hero-image" />
        <div className="about-hero-text">
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h1>{t('about.heroTitle')}</h1>
          <p>{t('about.heroText')}</p>
        </div>
      </section>

      <blockquote className="about-manifesto">{t('about.manifesto')}</blockquote>

      <section className="about-split" id="legende">
        <div className="about-split-text">
          <span className="eyebrow">{t('about.legendEyebrow')}</span>
          <h2>{t('about.legendTitle')}</h2>
          <p>{t('about.legendText1')}</p>
          <p>{t('about.legendText2')}</p>
        </div>
        <div className="about-split-image reveal reveal-image">
          <img src={media.heroPoster} alt="" loading="lazy" />
        </div>
      </section>

      <section className="about-split about-split-reverse" id="atelier">
        <div className="about-split-text">
          <span className="eyebrow">{t('about.atelierEyebrow')}</span>
          <h2>{t('about.atelierTitle')}</h2>
          <p>{t('about.atelierText1')}</p>
          <p>{t('about.atelierText2')}</p>
        </div>
        <div className="about-split-image reveal reveal-image">
          <img src={media.craftImage} alt={t('media.craftAlt')} loading="lazy" />
        </div>
      </section>

      <section className="about-steps" id="savoir-faire">
        <header className="about-section-head">
          <span className="eyebrow">{t('about.stepsEyebrow')}</span>
          <h2>{t('about.stepsTitle')}</h2>
        </header>
        <ol>
          {steps.map(n => (
            <li key={n} className="reveal">
              <span className="about-step-number">{String(n).padStart(2, '0')}</span>
              <h3>{t(`about.step${n}Title`)}</h3>
              <p>{t(`about.step${n}Text`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-commitments">
        <header className="about-section-head">
          <span className="eyebrow">{t('about.commitEyebrow')}</span>
          <h2>{t('about.commitTitle')}</h2>
        </header>
        <div className="about-commitments-grid">
          {commitments.map(([n, icon]) => (
            <div key={n} className="about-commitment reveal">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
              <h3>{t(`about.commit${n}Title`)}</h3>
              <p>{t(`about.commit${n}Text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {collections.length > 0 && (
        <section className="about-collections">
          <header className="about-section-head">
            <span className="eyebrow">{t('about.collectionsEyebrow')}</span>
            <h2>{t('about.collectionsTitle')}</h2>
          </header>
          <div className="about-collections-grid">
            {collections.map(c => (
              <Link key={c.id} href={`${home}/collections/${c.id}`} className="about-collection-card reveal">
                <img src={c.cover} alt="" loading="lazy" />
                <span className="about-collection-name">{pick(c.name, locale)}</span>
                <span className="about-collection-cta">{t('about.discover')} →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="about-cta">
        <h2>{t('about.ctaTitle')}</h2>
        <p>{t('about.ctaText')}</p>
        <div className="about-cta-actions">
          <Link href={`${home}#customizer-section`} className="btn-hermes-black">
            {t('about.ctaBespoke')}
          </Link>
          <Link href={`${home}/pages/contact`} className="btn-continue-shopping about-cta-secondary">
            {t('about.ctaContact')}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
