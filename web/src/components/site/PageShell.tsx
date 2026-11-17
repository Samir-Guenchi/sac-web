import type { ReactNode } from 'react';
import { getLocale, getT } from '@/lib/i18n/server';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/** Header + main + footer used by every storefront page except home and the bag. */
export async function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  const locale = await getLocale();
  const t = await getT(locale);
  return (
    <>
      <a href="#main-content" className="sr-only">
        {t('menu.skip')}
      </a>
      <SiteHeader />
      <main id="main-content" className={`page-main ${className ?? ''}`}>
        <div className="container">{children}</div>
      </main>
      <SiteFooter t={t} locale={locale} />
    </>
  );
}
