'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { OptionKind } from '@/db/schema';
import { Flourish, PicassoFace } from '@/components/art/LineArt';
import { useStore } from '@/components/store/StoreProvider';
import { bespokePriceDzd, findOption, normalizeMonogram, type BespokeSelection } from '@/lib/pricing';

/** The house configuration shown first (falls back to the first active option). */
const PREFERRED: Record<OptionKind, string> = { color: 'azur', material: 'tresse', pearls: 'perles', chain: 'or' };

const PILL_GROUPS: Array<{ kind: 'pearls' | 'chain'; step: number; title: string }> = [
  { kind: 'pearls', step: 3, title: 'studio.groupPearls' },
  { kind: 'chain', step: 4, title: 'studio.groupChain' }
];

/**
 * Bespoke atelier: the client composes a handmade bag (colour, stitch, finishing touch,
 * strap, embroidered initials). The preview shows a real Zaphira bag in the chosen colour.
 */
export function Customizer() {
  const { t, loc, locale, catalog, price, cart } = useStore();

  const [selection, setSelection] = useState<BespokeSelection>(() => {
    const initial = (kind: OptionKind) =>
      catalog.options[kind].find(o => o.id === PREFERRED[kind])?.id ?? catalog.options[kind][0]?.id ?? '';
    return { color: initial('color'), material: initial('material'), pearls: initial('pearls'), chain: initial('chain'), monogram: '' };
  });

  const choose = (kind: OptionKind, id: string) => setSelection(current => ({ ...current, [kind]: id }));
  const name = (kind: OptionKind) => loc(findOption(catalog, kind, selection[kind])?.name);
  const color = findOption(catalog, 'color', selection.color);
  const stitch = findOption(catalog, 'material', selection.material);
  const total = bespokePriceDzd(catalog, selection);
  const monogram = normalizeMonogram(selection.monogram);
  const preview = color?.imageUrl ?? catalog.products[0]?.primaryImage;
  // The bag in the photo, when it is one of ours
  const model = catalog.products.find(p => p.primaryImage === preview || p.gallery.includes(preview ?? ''));
  const extra = (amount: number) => (amount > 0 ? `+${price(amount)}` : t('studio.included'));

  return (
    <section className="atelier-section section-padding" id="customizer-section">
      <PicassoFace className="atelier-deco" />
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('customizer.eyebrow')}</span>
          <h2>{t('customizer.heading')}</h2>
          <Flourish className="brand-flourish atelier-flourish" />
          <p className="atelier-intro">{t('customizer.subtext')}</p>
        </div>

        <div className="atelier-studio reveal">
          {/* Preview */}
          <div className="atelier-preview">
            <div className="atelier-arch">
              {preview && <img key={preview} src={preview} alt={t('studio.previewAlt', { color: name('color') })} className="atelier-photo" />}
              {monogram && (
                <span className="atelier-monogram" aria-hidden="true">
                  {monogram}
                </span>
              )}
              {stitch?.imageUrl && (
                <span className="atelier-stitch-medallion" title={name('material')}>
                  <img key={stitch.imageUrl} src={stitch.imageUrl} alt="" />
                </span>
              )}
            </div>
            <p className="atelier-caption">
              {model ? (
                <>
                  {t('studio.shownModel', { name: model.name })}{' '}
                  <Link href={`/${locale}/produits/${model.id}`}>{t('studio.seeModel')}</Link>
                </>
              ) : (
                t('studio.renderCaption')
              )}
            </p>
          </div>

          {/* Options */}
          <div className="atelier-controls">
            <fieldset className="atelier-step">
              <legend>
                <span className="atelier-step-num">1</span>
                {t('studio.groupColor')}
                <span className="atelier-step-value">{name('color')}</span>
              </legend>
              <div className="swatches-grid atelier-swatches" role="radiogroup" aria-label={t('studio.groupColor')}>
                {catalog.options.color.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selection.color === option.id}
                    className={`color-swatch-btn${selection.color === option.id ? ' is-active' : ''}`}
                    style={{ backgroundColor: option.hex ?? undefined }}
                    title={loc(option.name)}
                    aria-label={loc(option.name)}
                    onClick={() => choose('color', option.id)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="atelier-step">
              <legend>
                <span className="atelier-step-num">2</span>
                {t('studio.groupMaterial')}
                <span className="atelier-step-value">{name('material')}</span>
              </legend>
              <div className="atelier-tiles" role="radiogroup" aria-label={t('studio.groupMaterial')}>
                {catalog.options.material.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selection.material === option.id}
                    className={`atelier-tile${selection.material === option.id ? ' is-active' : ''}`}
                    title={loc(option.description)}
                    onClick={() => choose('material', option.id)}
                  >
                    <span className="atelier-tile-img">{option.imageUrl ? <img src={option.imageUrl} alt="" loading="lazy" /> : null}</span>
                    <span className="atelier-tile-name">{loc(option.name)}</span>
                    <span className="atelier-tile-price">{extra(option.priceModifierDzd)}</span>
                  </button>
                ))}
              </div>
              {stitch?.description && <p className="atelier-hint">{loc(stitch.description)}</p>}
            </fieldset>

            {PILL_GROUPS.map(group => (
              <fieldset className="atelier-step" key={group.kind}>
                <legend>
                  <span className="atelier-step-num">{group.step}</span>
                  {t(group.title)}
                  <span className="atelier-step-value">{name(group.kind)}</span>
                </legend>
                <div className="atelier-pills" role="radiogroup" aria-label={t(group.title)}>
                  {catalog.options[group.kind].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selection[group.kind] === option.id}
                      className={`atelier-pill${selection[group.kind] === option.id ? ' is-active' : ''}`}
                      title={loc(option.description)}
                      onClick={() => choose(group.kind, option.id)}
                    >
                      <span>{loc(option.name)}</span>
                      <small>{extra(option.priceModifierDzd)}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}

            <fieldset className="atelier-step">
              <legend>
                <span className="atelier-step-num">5</span>
                {t('studio.groupMonogram')}
                <span className="atelier-step-value">+{price(catalog.settings.monogramCostDzd)}</span>
              </legend>
              <div className="atelier-monogram-field">
                <input
                  type="text"
                  className="monogram-input"
                  maxLength={3}
                  placeholder={t('studio.monogramPlaceholder')}
                  aria-label={t('studio.groupMonogram')}
                  value={selection.monogram}
                  onChange={event => setSelection(current => ({ ...current, monogram: normalizeMonogram(event.target.value) }))}
                />
                <span>{t('studio.monogramHint')}</span>
              </div>
            </fieldset>

            <div className="customizer-pricing-box atelier-summary">
              <div className="atelier-summary-head">
                <span>{t('studio.selectedConfig')}</span>
                <span className="atelier-summary-badge">{t('studio.atelierReady')}</span>
              </div>
              <dl className="atelier-summary-list">
                {(
                  [
                    ['studio.labelColor', name('color')],
                    ['studio.labelMaterial', name('material')],
                    ['studio.labelPearls', name('pearls')],
                    ['studio.labelChain', name('chain')],
                    ['studio.labelMonogram', monogram ? t('studio.embossed', { mono: monogram }) : t('studio.none')]
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt>{t(label)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="atelier-summary-total">
                <span className="pricing-label">{t('customizer.basePriceLabel')}</span>
                <span className="pricing-amount" aria-live="polite">
                  {total !== null ? price(total) : '—'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full atelier-cta"
                disabled={total === null || !cart.hydrated}
                onClick={() => cart.add({ type: 'bespoke', selection, quantity: 1 })}
              >
                {t('customizer.btnCreate')}
              </button>
              <p className="atelier-summary-note">{t('studio.madeToOrder')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
