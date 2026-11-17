import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Flourish } from '@/components/art/LineArt';
import { PageShell } from '@/components/site/PageShell';
import { RichText } from '@/components/site/RichText';
import { getCatalog, getJournal } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateStaticParams() {
  return (await getJournal()).map(entry => ({ id: String(entry.id) }));
}

async function findEntry(id: string) {
  return (await getJournal()).find(entry => String(entry.id) === id);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/journal/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const entry = await findEntry(id);
  if (!entry) return {};
  const locale = await getLocale();
  return { title: pick(entry.title, locale), description: pick(entry.excerpt, locale), openGraph: { images: [entry.image] } };
}

export default function StoryPage({ params }: PageProps<'/[lang]/journal/[id]'>) {
  return (
    <PageShell className="story-page">
      <Suspense fallback={<div className="page-skeleton" aria-busy="true" />}>
        <StoryContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function StoryContent({ params }: Pick<PageProps<'/[lang]/journal/[id]'>, 'params'>) {
  const { id } = await params;
  const locale = await getLocale();
  const [t, entries, catalog] = await Promise.all([getT(locale), getJournal(), getCatalog()]);
  const index = entries.findIndex(entry => String(entry.id) === id);
  if (index < 0) notFound();
  const entry = entries[index];
  const home = `/${locale}`;
  const photos = [entry.image, ...entry.gallery];
  // Bags that appear in the story's photos
  const products = catalog.products.filter(p => photos.some(photo => photo === p.primaryImage || p.gallery.includes(photo))).slice(0, 4);
  const next = entries[(index + 1) % entries.length];

  return (
    <article className="story">
      <Breadcrumbs
        label={t('product.breadcrumb')}
        items={[{ label: t('nav.home'), href: home }, { label: t('journalPage.metaTitle'), href: `${home}/journal` }, { label: pick(entry.title, locale) }]}
      />
      <header className="story-head">
        <span className="journal-meta">
          {pick(entry.tag, locale)} · {pick(entry.date, locale)} · {pick(entry.readTime, locale)}
        </span>
        <h1>{pick(entry.title, locale)}</h1>
        <Flourish className="brand-flourish" />
        <p className="story-lede">{pick(entry.excerpt, locale)}</p>
      </header>

      <figure className="story-cover reveal reveal-image">
        <img src={entry.image} alt="" />
      </figure>

      {entry.body && (
        <div className="story-body">
          <RichText text={pick(entry.body, locale)} />
        </div>
      )}

      {entry.gallery.length > 0 && (
        <div className={`story-gallery story-gallery-${Math.min(entry.gallery.length, 4)}`}>
          {entry.gallery.map((photo, i) => (
            <figure key={photo} className="story-photo reveal reveal-image" style={{ '--i': i } as React.CSSProperties}>
              <img src={photo} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <section className="story-products">
          <h2>{t('journalPage.shopStory')}</h2>
          <div className="collection-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {next && next.id !== entry.id && (
        <Link href={`${home}/journal/${next.id}`} className="story-next reveal">
          <span className="story-next-label">{t('journalPage.next')}</span>
          <span className="story-next-title">{pick(next.title, locale)}</span>
          <img src={next.image} alt="" loading="lazy" />
        </Link>
      )}
    </article>
  );
}
