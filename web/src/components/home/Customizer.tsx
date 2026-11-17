'use client';

import { useState } from 'react';
import type { OptionKind } from '@/db/schema';
import { useStore } from '@/components/store/StoreProvider';
import { bespokePriceDzd, findOption, normalizeMonogram, type BespokeSelection } from '@/lib/pricing';

/** The house configuration shown first (falls back to the first active option). */
const PREFERRED: Record<OptionKind, string> = { color: 'ivory', material: 'organza', pearls: 'medium', chain: 'gold' };

const GROUPS: Array<{ kind: Exclude<OptionKind, 'color'>; title: string }> = [
  { kind: 'material', title: 'studio.groupMaterial' },
  { kind: 'pearls', title: 'studio.groupPearls' },
  { kind: 'chain', title: 'studio.groupChain' }
];

export function Customizer() {
  const { t, loc, catalog, price, cart } = useStore();

  const [selection, setSelection] = useState<BespokeSelection>(() => {
    const initial = (kind: OptionKind) =>
      catalog.options[kind].find(o => o.id === PREFERRED[kind])?.id ?? catalog.options[kind][0]?.id ?? '';
    return { color: initial('color'), material: initial('material'), pearls: initial('pearls'), chain: initial('chain'), monogram: '' };
  });

  const choose = (kind: OptionKind, id: string) => setSelection(current => ({ ...current, [kind]: id }));
  const name = (kind: OptionKind) => loc(findOption(catalog, kind, selection[kind])?.name);
  const color = findOption(catalog, 'color', selection.color);
  const total = bespokePriceDzd(catalog, selection);
  const monogram = normalizeMonogram(selection.monogram);

  return (
    <section className="customizer-section section-padding" id="customizer-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('customizer.eyebrow')}</span>
          <h2>{t('customizer.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>

        <div className="customizer-studio reveal">
          {/* Left: summary & CTA */}
          <div className="customizer-info-col">
            <div>
              <div className="caption" style={{ color: 'var(--color-champagne-dark)', marginBottom: 'var(--space-2)' }}>
                {t('studio.serviceCaption')}
              </div>
              <h3 className="customizer-heading">{t('studio.creationHeading')}</h3>
              <p className="customizer-subtext">{t('customizer.subtext')}</p>
              <div className="customizer-specs-card">
                <div className="specs-card-title">
                  <span>{t('studio.selectedConfig')}</span>
                  <span className="badge badge-champagne" style={{ fontSize: '0.6rem' }}>
                    {t('studio.atelierReady')}
                  </span>
                </div>
                <div className="specs-list">
                  {(
                    [
                      ['studio.labelColor', name('color')],
                      ['studio.labelMaterial', name('material')],
                      ['studio.labelPearls', name('pearls')],
                      ['studio.labelChain', name('chain')],
                      ['studio.labelMonogram', monogram ? t('studio.embossed', { mono: monogram }) : t('studio.none')]
                    ] as const
                  ).map(([label, value]) => (
                    <div className="specs-row" key={label}>
                      <span className="specs-label">{t(label)}</span>
                      <span className="specs-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="customizer-pricing-box">
              <div className="pricing-label">{t('customizer.basePriceLabel')}</div>
              <div className="pricing-amount" aria-live="polite">
                {total !== null ? price(total) : '—'}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                disabled={total === null || !cart.hydrated}
                onClick={() => cart.add({ type: 'bespoke', selection, quantity: 1 })}
              >
                {t('customizer.btnCreate')}
              </button>
            </div>
          </div>

          {/* Centre: live preview */}
          <div className="customizer-preview-col">
            <div className="preview-stage-container">
              <div className="bag-preview-canvas">
                <img className="bag-layer-base" src={color?.imageUrl ?? '/assets/images/products/product-pearl-ivory.jpg'} alt={t('studio.creationHeading')} />
                <div className={`bag-layer-monogram${monogram ? ' is-visible' : ''}`}>{monogram}</div>
              </div>
            </div>
            <div className="preview-controls-bar">
              <span className="caption" style={{ color: 'var(--color-taupe)' }}>
                {t('studio.renderCaption')}
              </span>
            </div>
          </div>

          {/* Right: options */}
          <div className="customizer-controls-col">
            <div className="option-group">
              <div className="option-group-header">
                <span className="option-group-title">{t('studio.groupColor')}</span>
                <span className="option-group-selected-val">{name('color')}</span>
              </div>
              <div className="swatches-grid" role="radiogroup" aria-label={t('studio.groupColor')}>
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
            </div>

            {GROUPS.map(group => (
              <div className="option-group" key={group.kind}>
                <div className="option-group-header">
                  <span className="option-group-title">{t(group.title)}</span>
                  <span className="option-group-selected-val">{name(group.kind)}</span>
                </div>
                <div className="options-pills-row" role="radiogroup" aria-label={t(group.title)}>
                  {catalog.options[group.kind].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selection[group.kind] === option.id}
                      className={`option-pill-btn${selection[group.kind] === option.id ? ' is-active' : ''}`}
                      title={loc(option.description)}
                      onClick={() => choose(group.kind, option.id)}
                    >
                      {loc(option.name)}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="option-group">
              <div className="option-group-header">
                <span className="option-group-title">{t('studio.groupMonogram')}</span>
                <span className="badge badge-champagne" style={{ fontSize: '0.6rem' }}>
                  +{price(catalog.settings.monogramCostDzd)}
                </span>
              </div>
              <div className="monogram-input-box">
                <input
                  type="text"
                  className="input-luxury monogram-input"
                  maxLength={3}
                  placeholder={t('studio.monogramPlaceholder')}
                  aria-label={t('studio.groupMonogram')}
                  value={selection.monogram}
                  onChange={event => setSelection(current => ({ ...current, monogram: normalizeMonogram(event.target.value) }))}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{t('studio.monogramHint')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
