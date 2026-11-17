import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { TFunction } from '@/lib/i18n/translate';

export function SiteFooter({ t, locale }: { t: TFunction; locale: Locale }) {
  const home = `/${locale}`;
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
              <Link href={`${home}#collection-section`} className="footer-link">{t('links.collection')}</Link>
              <Link href={`${home}#customizer-section`} className="footer-link">{t('links.customize')}</Link>
              <Link href={`${home}#collection-section`} className="footer-link">{t('links.newArrivals')}</Link>
              <Link href={`${home}#collection-section`} className="footer-link">{t('links.eveningPearls')}</Link>
            </div>
          </div>
          {/* About Links */}
          <div>
            <div className="footer-col-title">{t('footer.about')}</div>
            <div className="footer-links">
              <Link href={`${home}#craftsmanship-section`} className="footer-link">{t('links.ourStory')}</Link>
              <Link href={`${home}#craftsmanship-section`} className="footer-link">{t('links.craftsmanship')}</Link>
              <Link href={`${home}#heritage-section`} className="footer-link">{t('links.princess')}</Link>
              <Link href={`${home}#journal-section`} className="footer-link">{t('links.journal')}</Link>
            </div>
          </div>
          {/* Customer Care */}
          <div>
            <div className="footer-col-title">{t('footer.customerCare')}</div>
            <div className="footer-links">
              <Link href={`${home}#newsletter-section`} className="footer-link">{t('links.contactAtelier')}</Link>
              <Link href={`${home}#newsletter-section`} className="footer-link">{t('links.wilayas')}</Link>
              <Link href={`${home}#newsletter-section`} className="footer-link">{t('links.worldwide')}</Link>
              <Link href={`${home}#newsletter-section`} className="footer-link">{t('links.care')}</Link>
            </div>
          </div>
          {/* Follow */}
          <div>
            <div className="footer-col-title">{t('footer.follow')}</div>
            <div className="footer-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                Facebook
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                Pinterest
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-hallmark">{t('footer.hallmark')}</div>
          <div>{t('links.copyright')}</div>
        </div>
      </div>
    </footer>
  );
}
