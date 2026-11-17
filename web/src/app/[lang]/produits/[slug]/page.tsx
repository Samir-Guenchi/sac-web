import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { PageShell } from '@/components/site/PageShell';
import { getCatalog } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';
import { pick } from '@/lib/i18n/translate';

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map(product => ({ slug: product.id }));
}

async function findProduct(slug: string) {
  const catalog = await getCatalog();
  return { catalog, product: catalog.products.find(p => p.id === slug) };
}

export async function generateMetadata({ params }: PageProps<'/[lang]/produits/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await findProduct(slug);
  if (!product) return {};
  const locale = await getLocale();
  const description = pick(product.shortDescription, locale);
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description, images: [product.primaryImage] }
  };
}

export default function ProductPage({ params }: PageProps<'/[lang]/produits/[slug]'>) {
  return (
    <PageShell className="product-page">
      {/* The slug is URL data: resolve it inside a boundary so navigation stays instant */}
      <Suspense fallback={<div className="page-skeleton" aria-busy="true" />}>
        <ProductContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function ProductContent({ params }: Pick<PageProps<'/[lang]/produits/[slug]'>, 'params'>) {
  const { slug } = await params;
  const { catalog, product } = await findProduct(slug);
  if (!product) notFound();
  const locale = await getLocale();
  const t = await getT(locale);
  const category = catalog.categories.find(c => c.id === product.categoryId);

  return (
    <>
      <Breadcrumbs
        label={t('product.breadcrumb')}
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('collections.all'), href: `/${locale}/collections` },
          ...(category ? [{ label: pick(category.name, locale), href: `/${locale}/collections/${category.id}` }] : []),
          { label: product.name }
        ]}
      />
      <ProductDetail productId={product.id} />
    </>
  );
}
