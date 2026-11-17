import { BrandPromise } from '@/components/home/BrandPromise';
import { CollectionGrid } from '@/components/home/CollectionGrid';
import { Customizer } from '@/components/home/Customizer';
import { EditorialSections } from '@/components/home/EditorialSections';
import { Hero } from '@/components/home/Hero';
import { Journal } from '@/components/home/Journal';
import { Newsletter } from '@/components/home/Newsletter';
import { Testimonials } from '@/components/home/Testimonials';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getCatalog, getJournal, getTestimonials } from '@/lib/catalog';
import { getLocale, getT } from '@/lib/i18n/server';

export default async function HomePage() {
  const locale = await getLocale();
  const [t, journal, testimonials, catalog] = await Promise.all([getT(locale), getJournal(), getTestimonials(), getCatalog()]);

  return (
    <>
      <a href="#main-content" className="sr-only">
        {t('menu.skip')}
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <BrandPromise t={t} />
        <Customizer />
        <CollectionGrid />
        <EditorialSections t={t} media={catalog.settings.media} />
        <Testimonials items={testimonials} />
        <Journal entries={journal} />
        <Newsletter />
      </main>
      <SiteFooter t={t} locale={locale} />
    </>
  );
}
