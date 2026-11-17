import type { TFunction } from '@/lib/i18n/translate';

export function BrandPromise({ t }: { t: TFunction }) {
  return (
    <section className="brand-promise-section" id="brand-promise-section" aria-labelledby="brand-promise-heading">
      <div className="container">
        <h2 className="sr-only" id="brand-promise-heading">{t('promise.heading')}</h2>
        <div className="promise-grid">
          {/* Promise 1: HANDMADE */}
          <div className="promise-card reveal">
            <div className="promise-icon-wrapper">
              <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 7.5c-1.4-1.6-3.5-1.9-5-.7-1.5 1.2-1.7 3.5-.4 5 1.6 1.9 5.4 4.7 5.4 4.7s3.8-2.8 5.4-4.7c1.3-1.5 1.1-3.8-.4-5-1.5-1.2-3.6-.9-5 .7z" />
                <path d="M8 13.5c-1.8 2.2-2.2 5.2-1 8 1.2 2.8 3.8 4.8 6.8 5.2" />
                <path d="M11 15.5c-1.2 1.8-1.2 4 0 5.8" />
                <path d="M24 13.5c1.8 2.2 2.2 5.2 1 8-1.2 2.8-3.8 4.8-6.8 5.2" />
                <path d="M21 15.5c1.2 1.8 1.2 4 0 5.8" />
              </svg>
            </div>
            <h3 className="promise-title">{t('promise.handmade')}</h3>
            <p className="promise-desc">{t('promise.handmadeDesc')}</p>
          </div>
          {/* Promise 2: PREMIUM MATERIALS */}
          <div className="promise-card reveal reveal-delay-1">
            <div className="promise-icon-wrapper">
              <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="16" cy="16" r="9.5" />
                <path d="M21.5 12a7.5 7.5 0 0 1 1.5 4.8c0 4.1-3.4 7.5-7.5 7.5-2 0-3.8-.8-5.1-2" />
              </svg>
            </div>
            <h3 className="promise-title">{t('promise.materials')}</h3>
            <p className="promise-desc">{t('promise.materialsDesc')}</p>
          </div>
          {/* Promise 3: MADE FOR YOU */}
          <div className="promise-card reveal reveal-delay-2">
            <div className="promise-icon-wrapper">
              <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.5 6.5a2.12 2.12 0 0 1 3 3l-12.5 12.5-4 1 1-4 12.5-12.5z" />
                <path d="M19.5 9.5l3 3" />
                <line x1="8" y1="25" x2="24" y2="25" />
              </svg>
            </div>
            <h3 className="promise-title">{t('promise.custom')}</h3>
            <p className="promise-desc">{t('promise.customDesc')}</p>
          </div>
          {/* Promise 4: TIMELESS ELEGANCE */}
          <div className="promise-card reveal reveal-delay-3">
            <div className="promise-icon-wrapper">
              <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.5 22.5h21l-2.2-11.5-4.8 5.8-3.5-7.8-3.5 7.8-4.8-5.8L5.5 22.5z" />
                <line x1="7" y1="25" x2="25" y2="25" />
              </svg>
            </div>
            <h3 className="promise-title">{t('promise.timeless')}</h3>
            <p className="promise-desc">{t('promise.timelessDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
