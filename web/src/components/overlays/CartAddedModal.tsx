'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { describeLine } from '@/lib/cart-display';

/** The single confirmation shown after any add-to-bag; leads to the bag page. */
export function CartAddedModal() {
  const { t, loc, locale, catalog, ui } = useStore();
  const line = ui.lastAdded;
  const open = !!line;
  const { dismissAdded } = ui;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && dismissAdded();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, dismissAdded]);

  const info = line ? describeLine(line, catalog, loc, t) : null;

  return (
    <div className={`cart-added-modal-wrapper${open ? ' is-active' : ''}`} aria-hidden={!open}>
      <div className="cart-added-backdrop" onClick={dismissAdded} />
      <div className="cart-added-card reveal-modal" role="dialog" aria-modal="true" aria-labelledby="cart-added-title">
        <button type="button" className="cart-added-close-btn" aria-label={t('cartAdded.close')} onClick={dismissAdded}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="cart-added-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h3 className="cart-added-title" id="cart-added-title">
          {t('cartAdded.title')}
        </h3>
        <div className="cart-added-item-preview">
          {info && (
            <div className="cart-added-item-info">
              <img src={info.image} alt={info.name} className="cart-added-thumb" />
              <div className="cart-added-details">
                <span className="cart-added-name">{info.name}</span>
                {line?.type === 'bespoke' && <span className="cart-added-sub">{t('cartAdded.bespokeSub')}</span>}
              </div>
            </div>
          )}
        </div>
        <div className="cart-added-actions">
          <Link href={`/${locale}/panier`} className="btn-hermes-black" onClick={dismissAdded}>
            {t('cartAdded.viewBag')}
          </Link>
        </div>
      </div>
    </div>
  );
}
