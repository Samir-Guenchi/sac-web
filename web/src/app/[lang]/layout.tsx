import type { Metadata } from 'next';
import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { StoreProvider } from '@/components/store/StoreProvider';
import { CartAddedModal } from '@/components/overlays/CartAddedModal';
import { QuickViewModal } from '@/components/overlays/QuickViewModal';
import { SearchModal } from '@/components/overlays/SearchModal';
import { StoryModal } from '@/components/overlays/StoryModal';
import { Toasts } from '@/components/overlays/Toasts';
import { RevealOnScroll } from '@/components/site/RevealOnScroll';
import { getCatalog } from '@/lib/catalog';
import { LOCALES, dirOf, isLocale } from '@/lib/i18n/config';
import { getDictionary, getT } from '@/lib/i18n/server';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/components.css';
import '@/styles/sections.css';
import '@/styles/customizer.css';
import '@/styles/panier.css';
import '@/styles/compte.css';
import '@/styles/catalog.css';
import '@/styles/responsive.css';
import '@/styles/fonts.css';
import '@/styles/app.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--nf-serif' });
const display = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--nf-display' });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--nf-sans' });
const arabicSerif = Amiri({ subsets: ['arabic'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--nf-arabic-serif' });
const arabicSans = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['300', '400', '500', '600', '700'], variable: '--nf-arabic-sans' });

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getT(lang);
  const site = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
  return {
    metadataBase: new URL(site),
    title: { default: t('meta.title'), template: `%s — ZAPHIRA` },
    description: t('meta.description'),
    alternates: { languages: Object.fromEntries(LOCALES.map(l => [l, `/${l}`])) },
    openGraph: { type: 'website', title: t('meta.title'), description: t('meta.description'), images: ['/assets/images/products/hero-bag.jpg'], locale: lang },
    twitter: { card: 'summary_large_image', title: t('meta.title'), description: t('meta.description'), images: ['/assets/images/products/hero-bag.jpg'] }
  };
}

export default async function StorefrontLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [dictionary, catalog] = await Promise.all([getDictionary(lang), getCatalog()]);

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={[serif.variable, display.variable, sans.variable, arabicSerif.variable, arabicSans.variable].join(' ')}
    >
      <body>
        <StoreProvider locale={lang} dictionary={dictionary} catalog={catalog}>
          {children}
          <QuickViewModal />
          <SearchModal />
          <StoryModal />
          <CartAddedModal />
          <Toasts />
          <RevealOnScroll />
        </StoreProvider>
      </body>
    </html>
  );
}
