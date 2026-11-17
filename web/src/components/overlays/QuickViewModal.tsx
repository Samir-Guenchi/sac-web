'use client';

import { useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { MAX_LINE_QUANTITY } from '@/lib/pricing';
import { Modal } from './Modal';

export function QuickViewModal() {
  const { t, catalog, ui } = useStore();
  const product = catalog.products.find(p => p.id === ui.quickViewId);

  return (
    <Modal open={!!product} onClose={ui.closeQuickView} label={product?.name ?? ''} closeLabel={t('quickview.close')}>
      {/* key resets image & quantity when another product opens */}
      {product && <QuickViewBody key={product.id} productId={product.id} />}
    </Modal>
  );
}

function QuickViewBody({ productId }: { productId: string }) {
    const { t, loc, catalog, price, cart, ui } = useStore();
    const p = catalog.products.find(item => item.id === productId)!;
    const [image, setImage] = useState(p.primaryImage);
    const [quantity, setQuantity] = useState(1);
    const label = `${t('collection.addToBag')} • ${price(p.priceDzd * quantity)}`;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--space-8)', padding: 'var(--space-8)' }} className="quickview-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-xs)', overflow: 'hidden', backgroundColor: 'var(--color-ivory-surface)', border: '1px solid var(--border-subtle)' }}>
            <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {p.gallery.map(src => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(src)}
                aria-pressed={image === src}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  border: `1px solid ${image === src ? 'var(--color-champagne-dark)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="caption" style={{ color: 'var(--color-champagne-dark)', marginBottom: 'var(--space-1)' }}>
              {loc(p.collection)}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{p.name}</h2>
            <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-4)', color: 'var(--color-charcoal)' }}>{price(p.priceDzd)}</div>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontWeight: 300 }}>{loc(p.fullDescription)}</p>
            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)'
              }}
            >
              {(['materials', 'dimensions', 'hardware'] as const).map(field => (
                <div key={field}>
                  <strong style={{ textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t(`quickview.${field}`)}</strong> {loc(p[field])}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="cart-qty-control" style={{ padding: '4px 8px' }}>
                <button type="button" className="cart-qty-btn" aria-label={t('quickview.decrease')} onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  -
                </button>
                <span className="cart-qty-value">{quantity}</span>
                <button type="button" className="cart-qty-btn" aria-label={t('quickview.increase')} onClick={() => setQuantity(q => Math.min(MAX_LINE_QUANTITY, q + 1))}>
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                disabled={!cart.hydrated}
                onClick={() => {
                  cart.add({ type: 'product', productId: p.id, quantity });
                  ui.closeQuickView();
                }}
              >
                {label}
              </button>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>{t('quickview.deliveryNote')}</div>
          </div>
        </div>
      </div>
    );
  }
