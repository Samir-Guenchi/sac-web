'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LOCALE_COOKIE, LOCALES, isLocale } from '@/lib/i18n/config';
import { CURRENCIES, isCurrency } from '@/lib/money';
import { useStore } from '@/components/store/StoreProvider';
import { Dropdown } from './Dropdown';

// The leather-goods menu is built from the collections in the database (see LeatherMenu)
const MEGA_MENU = [
  {
    key: 'catCustom',
    section: 'customizer-section',
    image: '/assets/images/editorial/journal-3.jpg',
    featured: 'customFeatured',
    links: [
      ['customBag', 'customizer-section'],
      ['customColors', 'customizer-section'],
      ['customPearls', 'customizer-section'],
      ['customMonogram', 'customizer-section']
    ]
  },
  {
    key: 'catCraft',
    section: 'craftsmanship-section',
    image: '/assets/images/editorial/craftsmanship-macro.jpg',
    featured: 'craftFeatured',
    links: [
      ['craftHandmade', 'craftsmanship-section'],
      ['craftPleating', 'craftsmanship-section'],
      ['craftPearls', 'craftsmanship-section'],
      ['craftHeritage', 'maison#legende']
    ]
  },
  {
    key: 'catJournal',
    section: 'journal-section',
    image: '/assets/images/editorial/journal-4.jpg',
    featured: 'journalFeatured',
    links: [
      ['journalAll', 'journal-section'],
      ['journalStyling', 'journal-section'],
      ['journalPearls', 'journal-section']
    ]
  },
  {
    key: 'catGifts',
    section: 'collection-section',
    image: '/assets/images/editorial/journal-1.jpg',
    featured: 'giftsFeatured',
    links: [
      ['giftsWomen', 'collection-section'],
      ['giftsBespoke', 'customizer-section'],
      ['giftsBox', 'newsletter-section']
    ]
  }
] as const;

const MOBILE_LINKS = [
  ['home', 'hero-section'],
  ['collection', 'collection-section'],
  ['customize', 'customizer-section'],
  ['story', 'maison'],
  ['journal', 'journal-section'],
  ['contact', 'newsletter-section']
] as const;

export function SiteHeader() {
  const { locale, t, loc, catalog, currency, setCurrency, cart, ui } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);
  const previousCount = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const home = `/${locale}`;
  const section = (id: string) => (id.startsWith('maison') ? `${home}/${id}` : `${home}#${id}`);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hide while reading downwards, come back as soon as the visitor scrolls up
      if (Math.abs(y - lastY) > 6) setHidden(y > lastY && y > 220);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bounce the bag counter when an item is added (not on first load)
  useEffect(() => {
    if (!cart.hydrated) return;
    if (previousCount.current !== null && cart.count > previousCount.current) {
      // Replay the CSS bounce on the same element (re-keying it left stale copies behind)
      const el = badge.current;
      if (el) {
        el.classList.remove('is-bump');
        void el.offsetWidth;
        el.classList.add('is-bump');
      }
    }
    previousCount.current = cart.count;
  }, [cart.count, cart.hydrated]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function switchLanguage(next: string) {
    if (!isLocale(next) || next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(/^\/(fr|en|ar)(?=\/|$)/, '');
    // Each language has its own root layout: a full load avoids keeping the previous language's tree around
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load is intended (root layout changes)
    window.location.assign(`/${next}${rest}${window.location.search}${window.location.hash}`);
  }

  return (
    <>
      <header className={`site-header site-header-hermes${scrolled ? ' is-scrolled' : ''}${hidden && !mobileOpen ? ' is-hidden' : ''}`} id="site-header" onFocusCapture={() => setHidden(false)}>
        <div className="header-top-bar">
          <div className="container header-top-container">
            <div className="header-top-left">
              <form
                className="hermes-search-bar"
                role="search"
                onSubmit={event => {
                  event.preventDefault();
                  ui.setSearchOpen(true);
                }}
              >
                <button type="button" className="hermes-search-btn-icon" aria-label={t('nav.search')} onClick={() => ui.setSearchOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <input
                  type="text"
                  className="hermes-search-input"
                  placeholder={t('nav.searchPlaceholder')}
                  aria-label={t('nav.search')}
                  readOnly
                  onFocus={event => {
                    event.currentTarget.blur();
                    ui.setSearchOpen(true);
                  }}
                />
              </form>
            </div>

            <div className="header-top-center">
              <Link href={home} className="brand-logo-link" aria-label="Zaphira">
                <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" className="brand-logo-img" />
              </Link>
            </div>

            <div className="header-top-right">
              <div className="currency-lang-group">
                <Dropdown
                  className="zd-pill"
                  label="Currency"
                  align="end"
                  value={currency}
                  onChange={code => isCurrency(code) && setCurrency(code)}
                  options={CURRENCIES.map(code => ({ value: code, label: code, hint: code === 'DZD' ? 'دج' : code === 'EUR' ? '€' : '$' }))}
                />
                <span className="currency-lang-divider" aria-hidden="true" />
                <Dropdown
                  className="zd-pill"
                  label="Language"
                  align="end"
                  value={locale}
                  onChange={switchLanguage}
                  options={LOCALES.map(code => ({ value: code, label: code.toUpperCase(), hint: { fr: 'Français', en: 'English', ar: 'العربية' }[code] }))}
                />
              </div>

              <Link href={`${home}/compte`} className="hermes-utility-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="utility-label">{t('nav.account')}</span>
              </Link>

              <Link href={`${home}/panier`} className="hermes-utility-link bag-badge-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="utility-label">{t('nav.bag')}</span>
                {cart.count > 0 && (
                  <span ref={badge} className="bag-badge" style={{ display: 'flex' }}>
                    {cart.count}
                  </span>
                )}
              </Link>

              <button type="button" className="btn-icon mobile-menu-btn" aria-label={t('nav.home')} aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="header-nav-bar">
          <div className="container header-categories-container">
            <nav className="nav-menu-hermes" aria-label="Main">
              <div className="nav-item-hermes">
                <Link href={`${home}/collections`} className="nav-link-hermes">
                  {t('nav.catLeather')}
                </Link>
                <div className="mega-menu-drawer">
                  <div className="container mega-menu-container">
                    <div className="mega-menu-featured">
                      <img src={catalog.categories[0]?.image ?? catalog.products[0]?.primaryImage ?? '/assets/images/products/product-pearl-ivory.jpg'} alt="" />
                      <span className="mega-featured-label">{t('menu.leatherFeatured')}</span>
                    </div>
                    <div className="mega-menu-links">
                      <Link href={`${home}/collections`} className="mega-link-item">
                        {t('collections.all')}
                      </Link>
                      {catalog.categories.map(category => (
                        <Link key={category.id} href={`${home}/collections/${category.id}`} className="mega-link-item">
                          {loc(category.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {MEGA_MENU.map(category => (
                <div className="nav-item-hermes" key={category.key}>
                  <Link href={section(category.section)} className="nav-link-hermes">
                    {t(`nav.${category.key}`)}
                  </Link>
                  <div className="mega-menu-drawer">
                    <div className="container mega-menu-container">
                      <div className="mega-menu-featured">
                        <img src={category.image} alt="" />
                        <span className="mega-featured-label">{t(`menu.${category.featured}`)}</span>
                      </div>
                      <div className="mega-menu-links">
                        {category.links.map(([label, target]) => (
                          <Link key={label} href={section(target)} className="mega-link-item">
                            {t(`menu.${label}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="nav-item-hermes">
                <Link href={`${home}/maison`} className="nav-link-hermes">
                  {t('nav.catAbout')}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop${mobileOpen ? ' is-active' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-nav-drawer${mobileOpen ? ' is-open' : ''}`} aria-label="Menu" aria-hidden={!mobileOpen}>
        <div className="mobile-nav-header">
          <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" style={{ height: '72px', width: 'auto', objectFit: 'contain' }} />
          <button type="button" className="modal-close-btn" aria-label={t('quickview.close')} onClick={() => setMobileOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav-links">
          {MOBILE_LINKS.map(([label, target]) => (
            <Link key={label} href={section(target)} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              {t(`nav.${label}`)}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-footer">
          <div className="footer-hallmark" style={{ fontSize: '0.6875rem' }}>
            {t('menu.drawerHallmark')}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t('menu.drawerTagline')}</div>
        </div>
      </aside>
    </>
  );
}
