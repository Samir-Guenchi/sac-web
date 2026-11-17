import Link from 'next/link';
import { getLocale, getT } from '@/lib/i18n/server';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getT(locale);
  return (
    <main className="not-found-page">
      <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" />
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <div className="not-found-actions">
        <Link href={`/${locale}`} className="btn-hermes-black">
          {t('notFound.home')}
        </Link>
        <Link href={`/${locale}/collections`} className="btn-continue-shopping">
          {t('collections.all')}
        </Link>
      </div>
    </main>
  );
}
