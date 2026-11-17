import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { Arch, Eye, Flourish, OliveBranch, PicassoFace, Profile, Sun, Waves } from '@/components/art/LineArt';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('universe.metaTitle'), description: t('universe.metaDescription') };
}

const PALETTE = [
  ['#1F3F6E', 'palette1'],
  ['#5E86A8', 'palette2'],
  ['#E8D9BF', 'palette3'],
  ['#C9A46A', 'palette4'],
  ['#DDA3A9', 'palette5']
] as const;

/** The Zaphira universe: Picasso & the Mediterranean (texts in Admin → Site texts → universe). */
export default async function UniversePage() {
  const locale = await getLocale();
  const [t, catalog] = await Promise.all([getT(locale), getCatalog()]);
  const home = `/${locale}`;
  const photo = (id: string, fallback: string) => catalog.products.find(p => p.id === id)?.primaryImage ?? fallback;
  const chapters = [
    { n: 1, Art: Profile, image: photo('perle-dazur', catalog.settings.media.heroPoster) },
    { n: 2, Art: Waves, image: photo('tipaza', catalog.settings.media.craftImage) },
    { n: 3, Art: Eye, image: photo('djurdjura', catalog.settings.media.heritageImage) }
  ];

  return (
    <PageShell className="universe-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: home }, { label: t('universe.metaTitle') }]} />

      <section className="universe-hero full-bleed">
        <PicassoFace className="universe-hero-face" />
        <Sun className="universe-hero-sun" />
        <div className="universe-hero-text">
          <span className="eyebrow">{t('universe.eyebrow')}</span>
          <h1>{t('universe.heroTitle')}</h1>
          <p className="universe-words">{t('universe.words')}</p>
          <p>{t('universe.heroText')}</p>
        </div>
      </section>

      <blockquote className="universe-manifesto reveal">
        <OliveBranch className="universe-manifesto-art" />
        {t('universe.manifesto')}
      </blockquote>

      {chapters.map(({ n, Art, image }) => (
        <section key={n} className={`universe-chapter${n % 2 === 0 ? ' is-reverse' : ''}`}>
          <div className="universe-chapter-visual reveal reveal-image">
            <img src={image} alt="" loading="lazy" />
          </div>
          <div className="universe-chapter-text reveal">
            <Art className="universe-chapter-art" />
            <span className="eyebrow">{t(`universe.ch${n}Eyebrow`)}</span>
            <h2>{t(`universe.ch${n}Title`)}</h2>
            <p>{t(`universe.ch${n}Text`)}</p>
          </div>
        </section>
      ))}

      <section className="universe-palette full-bleed">
        <div className="container">
          <header className="universe-section-head reveal">
            <span className="eyebrow">{t('universe.paletteEyebrow')}</span>
            <h2>{t('universe.paletteTitle')}</h2>
            <Flourish className="brand-flourish" />
          </header>
          <div className="universe-swatches">
            {PALETTE.map(([hex, key], i) => (
              <div key={key} className="universe-swatch reveal" style={{ '--i': i, '--swatch': hex } as React.CSSProperties}>
                <span className="universe-swatch-color" />
                <strong>{t(`universe.${key}Name`)}</strong>
                <span>{t(`universe.${key}Text`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="universe-motifs">
        <header className="universe-section-head reveal">
          <span className="eyebrow">{t('universe.motifsEyebrow')}</span>
          <h2>{t('universe.motifsTitle')}</h2>
          <p>{t('universe.motifsText')}</p>
        </header>
        <div className="universe-motif-grid">
          {[PicassoFace, Waves, Eye, OliveBranch, Arch, Sun].map((Motif, i) => (
            <div key={i} className="universe-motif reveal" style={{ '--i': i } as React.CSSProperties}>
              <Motif />
            </div>
          ))}
        </div>
      </section>

      <section className="universe-cta reveal">
        <h2>{t('universe.ctaTitle')}</h2>
        <div className="universe-cta-actions">
          <Link href={`${home}/collections`} className="btn-hermes-black">
            {t('universe.ctaShop')}
          </Link>
          <Link href={`${home}/lookbook`} className="link-underline">
            {t('universe.ctaLookbook')}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
