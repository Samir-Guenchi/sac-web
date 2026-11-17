import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';
import { getPublishedPages } from '@/lib/content';
import { LOCALES } from '@/lib/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
  const [catalog, pages] = await Promise.all([getCatalog(), getPublishedPages()]);
  const paths = [
    '',
    '/collections',
    ...catalog.categories.map(c => `/collections/${c.id}`),
    ...catalog.products.map(p => `/produits/${p.id}`),
    ...pages.map(p => `/pages/${p.slug}`)
  ];
  return paths.map(path => ({
    url: `${site}/fr${path}`,
    alternates: { languages: Object.fromEntries(LOCALES.map(locale => [locale, `${site}/${locale}${path}`])) }
  }));
}
