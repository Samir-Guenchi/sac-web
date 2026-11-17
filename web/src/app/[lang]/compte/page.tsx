import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { desc, eq } from 'drizzle-orm';
import { AuthFlow } from '@/components/compte/AuthFlow';
import { SignOutButton } from '@/components/compte/SignOutButton';
import { SiteHeader } from '@/components/site/SiteHeader';
import { db } from '@/db';
import { orders } from '@/db/schema';
import type { Locale } from '@/lib/i18n/config';
import { getLocale, getT } from '@/lib/i18n/server';
import type { TFunction } from '@/lib/i18n/translate';
import { formatPrice, DEFAULT_RATES } from '@/lib/money';
import { getSessionUser } from '@/lib/session';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('compte.title'), robots: { index: false } };
}

export default async function ComptePage() {
  const locale = await getLocale();
  const t = await getT(locale);

  return (
    <div className="compte-page">
      <SiteHeader />
      <main className="compte-main">
        <div className="compte-container">
          {/* Reads the session cookie, so it streams in behind the boundary */}
          <Suspense fallback={<div className="compte-step-1-view" aria-busy="true" style={{ minHeight: 400 }} />}>
            <AccountSection locale={locale} t={t} />
          </Suspense>
        </div>
      </main>
      <CompteFooter t={t} locale={locale} />
    </div>
  );
}

async function AccountSection({ locale, t }: { locale: Locale; t: TFunction }) {
  const user = await getSessionUser();
  if (!user) return <AuthFlow />;

  const history = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: desc(orders.createdAt),
    limit: 20,
    columns: { id: true, createdAt: true, status: true, totalDzd: true }
  });
  const dateFormat = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : locale, { dateStyle: 'medium' });

  return (
    <div className="compte-step-1-view">
      <div className="compte-step-1-card" style={{ maxWidth: 720 }}>
        <h1 className="compte-heading-title">{t('compte.title')}</h1>
        <p className="compte-intro-text">{t('account.welcome', { name: user.firstName || user.name })}</p>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 16px', fontSize: '0.875rem', marginBottom: 32 }}>
          <dt style={{ color: 'var(--text-muted)' }}>{t('compte.email')}</dt>
          <dd dir="ltr" style={{ textAlign: 'start' }}>
            {user.email}
          </dd>
          {user.phone && (
            <>
              <dt style={{ color: 'var(--text-muted)' }}>{t('compte.phone')}</dt>
              <dd dir="ltr" style={{ textAlign: 'start' }}>
                {user.phone}
              </dd>
            </>
          )}
        </dl>

        <h2 className="compte-col-title">{t('account.ordersTitle')}</h2>
        {history.length === 0 ? (
          <p className="compte-intro-text">{t('account.noOrders')}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: 32 }}>
            <thead>
              <tr style={{ textAlign: 'start', color: 'var(--text-muted)' }}>
                <th style={{ textAlign: 'start', padding: '8px 0' }}>{t('account.orderRef')}</th>
                <th style={{ textAlign: 'start' }}>{t('account.orderDate')}</th>
                <th style={{ textAlign: 'start' }}>{t('account.orderStatus')}</th>
                <th style={{ textAlign: 'end' }}>{t('panier.total')}</th>
              </tr>
            </thead>
            <tbody>
              {history.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td dir="ltr" style={{ padding: '10px 0', textAlign: 'start' }}>
                    #{order.id}
                  </td>
                  <td>{dateFormat.format(order.createdAt)}</td>
                  <td>{t(`orderStatus.${order.status}`)}</td>
                  <td style={{ textAlign: 'end' }}>{formatPrice(order.totalDzd, 'DZD', DEFAULT_RATES)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <SignOutButton label={t('account.signOut')} />
      </div>
    </div>
  );
}

function CompteFooter({ t, locale }: { t: TFunction; locale: Locale }) {
  const home = `/${locale}`;
  const columns: Array<[string, Array<[string, string]>]> = [
    ['compte.footerServices', [['compte.contactUs', `${home}#newsletter-section`], ['compte.faq', `${home}#newsletter-section`], ['compte.bespoke', `${home}#customizer-section`]]],
    ['compte.footerOrders', [['compte.payment', `${home}/panier`], ['compte.delivery', `${home}/panier`], ['compte.tracking', `${home}/compte`]]],
    ['compte.footerHouse', [['compte.princessStory', `${home}#heritage-section`], ['compte.atelier', `${home}#craftsmanship-section`], ['compte.journal', `${home}#journal-section`]]],
    ['compte.footerLegal', [['compte.terms', '#'], ['compte.privacy', '#'], ['compte.copyright', '#']]]
  ];
  return (
    <footer className="compte-footer">
      <div className="container">
        <div className="compte-footer-grid">
          {columns.map(([title, links]) => (
            <div className="compte-footer-col" key={title}>
              <h3>{t(title)}</h3>
              {links.map(([label, href]) => (
                <Link key={label} href={href}>
                  {t(label)}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
