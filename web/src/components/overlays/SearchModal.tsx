'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { Modal } from './Modal';

const SUGGESTIONS = ['Pearl Ivory', 'Noir Prestige', 'Organza', 'Baroque'];

export function SearchModal() {
  const { t, loc, catalog, price, ui } = useStore();
  const [query, setQuery] = useState('');

  // Matches every language, so "perles" or "لؤلؤ" find the same bags as "pearls"
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog.products.filter(p =>
      [p.name, p.collection, p.materials, p.shortDescription]
        .flatMap(value => (typeof value === 'string' ? [value] : Object.values(value)))
        .some(text => text.toLowerCase().includes(q))
    );
  }, [query, catalog.products]);

  const close = () => {
    ui.setSearchOpen(false);
    setQuery('');
  };

  return (
    <Modal open={ui.searchOpen} onClose={close} label={t('search.label')} closeLabel={t('search.close')}>
      <div style={{ padding: 'var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="caption" style={{ color: 'var(--color-champagne-dark)', marginBottom: 'var(--space-2)' }}>
            {t('search.label')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-medium)', paddingBottom: 'var(--space-2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--text-muted)', marginInlineEnd: 'var(--space-3)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.label')}
              style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-charcoal)' }}
            />
          </div>
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
            {t('search.popular')}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            {SUGGESTIONS.map(suggestion => (
              <button key={suggestion} type="button" className="option-pill-btn" onClick={() => setQuery(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} aria-live="polite">
            {query.trim() && results.length === 0 && (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{t('search.noResults', { query: query.trim() })}</div>
            )}
            {results.map(p => (
              <button
                key={p.id}
                type="button"
                className="search-result-item"
                onClick={() => {
                  close();
                  ui.openQuickView(p.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'start'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <img src={p.primaryImage} alt="" style={{ width: 52, height: 65, objectFit: 'cover', borderRadius: 2 }} />
                  <span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', color: 'var(--color-charcoal)' }}>{p.name}</span>
                    <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {loc(p.collection)} • {loc(p.materials).split(/[,،]/)[0]}
                    </span>
                  </span>
                </span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{price(p.priceDzd)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
