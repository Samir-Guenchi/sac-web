'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { OptionKind } from '@/db/schema';
import { Flourish, PicassoFace } from '@/components/art/LineArt';
import { useStore } from '@/components/store/StoreProvider';
import { bespokePriceDzd, findOption, normalizeMonogram, type BespokeSelection } from '@/lib/pricing';

/** The house configuration shown first (falls back to the first active option). */
const PREFERRED: Record<OptionKind, string> = { color: 'azur', material: 'tresse', pearls: 'perles', chain: 'or' };

const STEPS = [
  { key: 'color', title: 'studio.groupColor' },
  { key: 'material', title: 'studio.groupMaterial' },
  { key: 'pearls', title: 'studio.groupPearls' },
  { key: 'chain', title: 'studio.groupChain' },
  { key: 'monogram', title: 'studio.groupMonogram' }
] as const;

/**
 * Bespoke atelier: the client composes a handmade bag one step at a time
 * (colour, stitch, finishing touch, strap, initials). The large photo follows her
 * latest choice: a real Zaphira bag in that colour or made with that stitch.
 */
export function Customizer() {
  const { t, loc, locale, catalog, price, cart } = useStore();

  const [selection, setSelection] = useState<BespokeSelection>(() => {
    const initial = (kind: OptionKind) =>
      catalog.options[kind].find(o => o.id === PREFERRED[kind])?.id ?? catalog.options[kind][0]?.id ?? '';
    return { color: initial('color'), material: initial('material'), pearls: initial('pearls'), chain: initial('chain'), monogram: '' };
  });
  const [step, setStep] = useState(0);
  // Which photo is large: the chosen colour's or the chosen stitch's
  const [focus, setFocus] = useState<'color' | 'material'>('color');

  const choose = (kind: OptionKind, id: string) => {
    setSelection(current => ({ ...current, [kind]: id }));
    if (kind === 'color' || kind === 'material') setFocus(kind);
  };
  const name = (kind: OptionKind) => loc(findOption(catalog, kind, selection[kind])?.name);
  const color = findOption(catalog, 'color', selection.color);
  const stitch = findOption(catalog, 'material', selection.material);
  const total = bespokePriceDzd(catalog, selection);
  const monogram = normalizeMonogram(selection.monogram);
  const extra = (amount: number) => (amount > 0 ? `+${price(amount)}` : t('studio.included'));

  const views = [
    { id: 'color' as const, src: color?.imageUrl, label: name('color') },
    { id: 'material' as const, src: stitch?.imageUrl, label: name('material') }
  ].filter((view): view is { id: 'color' | 'material'; src: string; label: string } => Boolean(view.src));
  const preview = views.find(view => view.id === focus) ?? views[0];
  // The bag in the photo, when it is one of ours
  const model = preview && catalog.products.find(p => p.primaryImage === preview.src || p.gallery.includes(preview.src));
  const current = STEPS[step];

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
            <div className="atelier-frame">
              {preview && <img key={preview.src} src={preview.src} alt={t('studio.previewAlt', { color: name('color') })} className="atelier-photo" />}
              {monogram && (
                <span className="atelier-monogram" aria-hidden="true">
                  {monogram}
                </span>
              )}
              <span className="atelier-frame-label">{preview?.label}</span>
              {views.length > 1 && (
                <div className="atelier-views" role="group" aria-label={t('studio.views')}>
                  {views.map(view => (
                    <button
                      key={view.id}
                      type="button"
                      className={`atelier-view${view.id === preview?.id ? ' is-active' : ''}`}
                      aria-pressed={view.id === preview?.id}
                      onClick={() => setFocus(view.id)}
                    >
                      <img src={view.src} alt="" />
                      <span>{t(view.id === 'color' ? 'studio.labelColor' : 'studio.labelMaterial')}</span>
                    </button>
                  ))}
                </div>
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

          {/* Steps */}
          <div className="atelier-panel">
            <ol className="atelier-tabs" style={{ '--progress': `${(step / (STEPS.length - 1)) * 100}%` } as React.CSSProperties}>
              {STEPS.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    className={`atelier-tab${i === step ? ' is-current' : ''}${i < step ? ' is-done' : ''}`}
                    aria-current={i === step ? 'step' : undefined}
                    onClick={() => setStep(i)}
                  >
                    <span className="atelier-tab-num">{i + 1}</span>
                    <span className="atelier-tab-label">{t(s.title)}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="atelier-step" key={current.key}>
              <div className="atelier-step-head">
                <h3>{t(current.title)}</h3>
                <span>{current.key === 'monogram' ? `+${price(catalog.settings.monogramCostDzd)}` : name(current.key)}</span>
              </div>

              {current.key === 'color' && (
                <div className="swatches-grid atelier-swatches" role="radiogroup" aria-label={t('studio.groupColor')}>
                  {catalog.options.color.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selection.color === option.id}
                      className={`atelier-swatch${selection.color === option.id ? ' is-active' : ''}`}
                      onClick={() => choose('color', option.id)}
                    >
                      <span className="color-swatch-btn" style={{ backgroundColor: option.hex ?? undefined }} aria-hidden="true" />
                      <span className="atelier-swatch-name">{loc(option.name)}</span>
                    </button>
                  ))}
                </div>
              )}

              {current.key === 'material' && (
                <>
                  <div className="atelier-tiles" role="radiogroup" aria-label={t('studio.groupMaterial')}>
                    {catalog.options.material.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selection.material === option.id}
                        className={`atelier-tile${selection.material === option.id ? ' is-active' : ''}`}
                        onClick={() => choose('material', option.id)}
                      >
                        <span className="atelier-tile-img">{option.imageUrl ? <img src={option.imageUrl} alt="" loading="lazy" /> : null}</span>
                        <span className="atelier-tile-name">{loc(option.name)}</span>
                        <span className="atelier-tile-price">{extra(option.priceModifierDzd)}</span>
                      </button>
                    ))}
                  </div>
                  {stitch?.description && <p className="atelier-hint">{loc(stitch.description)}</p>}
                </>
              )}

              {(current.key === 'pearls' || current.key === 'chain') && (
                <div className="atelier-list" role="radiogroup" aria-label={t(current.title)}>
                  {catalog.options[current.key].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selection[current.key] === option.id}
                      className={`atelier-row${selection[current.key] === option.id ? ' is-active' : ''}`}
                      onClick={() => choose(current.key, option.id)}
                    >
                      <span className="atelier-row-dot" aria-hidden="true" />
                      <span className="atelier-row-text">
                        <strong>{loc(option.name)}</strong>
                        {option.description && <small>{loc(option.description)}</small>}
                      </span>
                      <span className="atelier-row-price">{extra(option.priceModifierDzd)}</span>
                    </button>
                  ))}
                </div>
              )}

              {current.key === 'monogram' && (
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
              )}

              <div className="atelier-step-nav">
                <button type="button" className="link-underline" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
                  {t('studio.previous')}
                </button>
                {step < STEPS.length - 1 && (
                  <button type="button" className="atelier-next" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
                    {t('studio.next', { step: t(STEPS[step + 1].title) })}
                  </button>
                )}
              </div>
            </div>

            <div className="customizer-pricing-box atelier-summary">
              <ul className="atelier-chips" aria-label={t('studio.selectedConfig')}>
                {(['color', 'material', 'pearls', 'chain'] as const).map(kind => (
                  <li key={kind}>{name(kind)}</li>
                ))}
                {monogram && <li>{t('studio.embossed', { mono: monogram })}</li>}
              </ul>
              <div className="atelier-summary-row">
                <div>
                  <span className="pricing-label">{t('customizer.basePriceLabel')}</span>
                  <span className="pricing-amount" aria-live="polite">
                    {total !== null ? price(total) : '—'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary atelier-cta"
                  disabled={total === null || !cart.hydrated}
                  onClick={() => cart.add({ type: 'bespoke', selection, quantity: 1 })}
                >
                  {t('customizer.btnCreate')}
                </button>
              </div>
              <p className="atelier-summary-note">{t('studio.madeToOrder')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
