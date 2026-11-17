import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense, ViewTransition } from 'react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { PageShell } from '@/components/site/PageShell';
import { RichText } from '@/components/site/RichText';
import { getCatalog } from '@/lib/catalog';
import { getPage, getPublishedPages } from '@/lib/content';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateStaticParams() {
  return (await getPublishedPages()).map(page => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/pages/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return page ? { title: pick(page.title, await getLocale()) } : {};
}

export default function InfoPage({ params }: PageProps<'/[lang]/pages/[slug]'>) {
  return (
    <PageShell className="info-page">
      <Suspense
        fallback={
          <ViewTransition exit="slide-down" default="none">
            <div className="page-skeleton" aria-busy="true" />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <InfoContent params={params} />
        </ViewTransition>
      </Suspense>
    </PageShell>
  );
}

async function InfoContent({ params }: Pick<PageProps<'/[lang]/pages/[slug]'>, 'params'>) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  const locale = await getLocale();
  const t = await getT(locale);
  const [all, catalog] = await Promise.all([getPublishedPages(), getCatalog()]);
  const contact = catalog.settings.contact;

  return (
    <>
      <Breadcrumbs label={t('product.breadcrumb')} items={[{ label: t('nav.home'), href: `/${locale}` }, { label: pick(page.title, locale) }]} />
      <div className="info-layout">
        <nav className="info-nav" aria-label={t('links.legalNav')}>
          {all.map(item => (
            <Link key={item.slug} href={`/${locale}/pages/${item.slug}`} aria-current={item.slug === slug ? 'page' : undefined}>
              {pick(item.title, locale)}
            </Link>
          ))}
          <Link href={`/${locale}/suivi`}>{t('tracking.title')}</Link>
        </nav>
        <article className="info-article">
          <h1>{pick(page.title, locale)}</h1>
          <RichText text={pick(page.body, locale)} />
          {slug === 'contact' && (
            <dl className="info-contact">
              <dt>{t('panier.serviceWhatsapp')}</dt>
              <dd dir="ltr">{contact.whatsapp.tel ? <a href={`https://wa.me/${contact.whatsapp.tel.replace(/\D/g, '')}`}>{contact.whatsapp.display}</a> : contact.whatsapp.display}</dd>
              <dt>{t('panier.servicePhone')}</dt>
              <dd dir="ltr">{contact.phone.tel ? <a href={`tel:${contact.phone.tel}`}>{contact.phone.display}</a> : contact.phone.display}</dd>
            </dl>
          )}
        </article>
      </div>
    </>
  );
}
