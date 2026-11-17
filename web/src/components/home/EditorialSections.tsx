import type { SiteMedia } from '@/lib/catalog-types';
import type { TFunction } from '@/lib/i18n/translate';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { StoryButton } from './StoryButton';

export function EditorialSections({ t, media, locale }: { t: TFunction; media: SiteMedia; locale: Locale }) {
  return (
    <>
      <section className="editorial-story-section section-padding" id="craftsmanship-section">
        <div className="container editorial-grid">
          {/* Macro Craftsmanship Image */}
          <div className="editorial-image-frame reveal">
            <img src={media.craftImage} alt={t('media.craftAlt')} loading="lazy" />
          </div>
          {/* Story Narrative */}
          <div className="editorial-content reveal reveal-delay-2">
            <span className="eyebrow">{t('craft.eyebrow')}</span>
            <h2 className="editorial-quote">{t('craft.quote')}</h2>
            <p className="editorial-text">{t('craft.text')}</p>
            <StoryButton className="btn btn-outline">{t('craft.cta')}</StoryButton>
          </div>
        </div>
      </section>
      {/* SECTION 07 — ALGERIA HERITAGE */}
      <section className="heritage-section section-padding" id="heritage-section">
        <div className="container heritage-grid">
          {/* Heritage Narrative */}
          <div className="heritage-content reveal">
            <span className="eyebrow eyebrow-dark">{t('heritage.eyebrow')}</span>
            <h2 className="heritage-headline">{t('heritage.headline')}</h2>
            <p className="heritage-desc">{t('heritage.desc')}</p>
            <Link href={`/${locale}/maison`} className="btn btn-outline-light">{t('heritage.cta')}</Link>
          </div>
          {/* Heritage Visual */}
          <div className="heritage-image-frame reveal reveal-delay-2">
            <img src={media.heritageImage} alt={t('media.heritageAlt')} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
