import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getCatalog } from '@/lib/catalog';
import { CookieSettingsLink } from './CookieConsent';
import type { TFunction } from '@/lib/i18n/translate';

export async function SiteFooter({ t, locale }: { t: TFunction; locale: Locale }) {
  const home = `/${locale}`;
  const page = (slug: string) => `${home}/pages/${slug}`;
  const { social } = (await getCatalog()).settings;
  const socials = (
    [
      ['Instagram', social.instagram],
      ['Facebook', social.facebook],
      ['TikTok', social.tiktok]
    ] as const
  ).filter(([, url]) => url);
  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Summary */}
          <div className="footer-brand-col">
            <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" className="footer-logo-img" />
            <p className="footer-brand-tagline">{t('footer.brandDesc')}</p>
          </div>
          {/* Shop Links */}
          <div>
            <div className="footer-col-title">{t('footer.shop')}</div>
            <div className="footer-links">
              <Link href={`${home}/collections`} className="footer-link">{t('links.collection')}</Link>
              <Link href={`${home}#customizer-section`} className="footer-link">{t('links.customize')}</Link>
              <Link href={`${home}/lookbook`} className="footer-link">{t('nav.lookbook')}</Link>
              <Link href={`${home}/cadeaux`} className="footer-link">{t('nav.gifts')}</Link>
            </div>
          </div>
          {/* About Links */}
          <div>
            <div className="footer-col-title">{t('footer.about')}</div>
            <div className="footer-links">
              <Link href={`${home}/maison`} className="footer-link">{t('links.ourStory')}</Link>
              <Link href={`${home}/maison#savoir-faire`} className="footer-link">{t('links.craftsmanship')}</Link>
              <Link href={`${home}/univers`} className="footer-link">{t('nav.universe')}</Link>
              <Link href={`${home}/journal`} className="footer-link">{t('links.journal')}</Link>
            </div>
          </div>
          {/* Customer Care */}
          <div>
            <div className="footer-col-title">{t('footer.customerCare')}</div>
            <div className="footer-links">
              <Link href={page('contact')} className="footer-link">{t('links.contactAtelier')}</Link>
              <Link href={page('livraison-retours')} className="footer-link">{t('links.wilayas')}</Link>
              <Link href={`${home}/suivi`} className="footer-link">{t('tracking.title')}</Link>
              <Link href={page('faq')} className="footer-link">{t('compte.faq')}</Link>
              <Link href={page('entretien')} className="footer-link">{t('links.care')}</Link>
            </div>
          </div>
          {/* Follow (hidden until social links are set in Admin → Settings) */}
          <div hidden={socials.length === 0}>
            <div className="footer-col-title">{t('footer.follow')}</div>
            <div className="footer-links">
              {socials.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="footer-link">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <nav className="footer-legal" aria-label={t('links.legalNav')}>
          <Link href={page('cgv')}>{t('compte.terms')}</Link>
          <Link href={page('confidentialite')}>{t('links.privacyCookies')}</Link>
          <Link href={page('mentions-legales')}>{t('links.legalNotice')}</Link>
          <Link href={page('accessibilite')}>{t('links.accessibility')}</Link>
          <CookieSettingsLink label={t('consent.manage')} />
        </nav>
        <div className="footer-bottom">
          <div className="footer-hallmark">{t('footer.hallmark')}</div>
          <div>{t('links.copyright')}</div>
        </div>
      </div>
    </footer>
  );
}
