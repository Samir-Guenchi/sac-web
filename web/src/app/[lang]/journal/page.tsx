import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { Flourish, PicassoFace } from '@/components/art/LineArt';
import { PageShell } from '@/components/site/PageShell';
import { getJournal } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('journalPage.metaTitle'), description: t('journalPage.metaDescription') };
}

/** The Journal: stories of the house (edited in Admin → Journal & testimonials). */
export default async function JournalPage() {
  const locale = await getLocale();
  const [t, entries] = await Promise.all([getT(locale), getJournal()]);
  const home = `/${locale}`;
  const [featured, ...rest] = entries;

  return (
    <PageShell className="journal-page">
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: home }, { label: t('journalPage.metaTitle') }]} />

      <header className="journal-hero">
        <PicassoFace className="journal-hero-art reveal" />
        <span className="eyebrow">{t('journalPage.eyebrow')}</span>
        <h1>{t('journalPage.title')}</h1>
        <Flourish className="brand-flourish" />
        <p>{t('journalPage.text')}</p>
      </header>

      {featured && (
        <Link href={`${home}/journal/${featured.id}`} className="journal-featured reveal">
          <span className="journal-featured-image reveal-image reveal">
            <img src={featured.image} alt="" />
          </span>
          <span className="journal-featured-text">
            <span className="journal-meta">
              {pick(featured.tag, locale)} · {pick(featured.date, locale)}
            </span>
            <span className="journal-featured-title">{pick(featured.title, locale)}</span>
            <span className="journal-featured-excerpt">{pick(featured.excerpt, locale)}</span>
            <span className="link-underline">{t('journalPage.read')}</span>
          </span>
        </Link>
      )}

      <div className="journal-masonry">
        {rest.map((entry, i) => (
          <Link key={entry.id} href={`${home}/journal/${entry.id}`} className="journal-tile reveal" style={{ '--i': i } as React.CSSProperties}>
            <span className="journal-tile-image">
              <img src={entry.image} alt="" loading="lazy" />
            </span>
            <span className="journal-meta">
              {pick(entry.tag, locale)} · {pick(entry.readTime, locale)}
            </span>
            <span className="journal-tile-title">{pick(entry.title, locale)}</span>
            <span className="journal-tile-excerpt">{pick(entry.excerpt, locale)}</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
