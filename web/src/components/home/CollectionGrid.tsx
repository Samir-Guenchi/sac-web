'use client';

import { useStore } from '@/components/store/StoreProvider';

export function CollectionGrid() {
  const { t, loc, catalog, price, cart, ui } = useStore();

  return (
    <section className="collection-section section-padding" id="collection-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('collection.eyebrow')}</span>
          <h2>{t('collection.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>

        <div className="collection-grid">
          {catalog.products.map(product => (
            <article className="product-card reveal" key={product.id}>
              <div className="product-image-container">
                <span className={`badge ${product.badgeClass} product-card-badge`}>{loc(product.tag)}</span>
                <img src={product.primaryImage} alt={product.name} loading="lazy" />
                <div className="product-overlay-actions">
                  <button type="button" className="btn btn-secondary btn-sm btn-full" onClick={() => ui.openQuickView(product.id)}>
                    {t('collection.quickView')}
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-material-tag">{loc(product.collection)}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                  <span className="product-price">{price(product.priceDzd)}</span>
                  <button
                    type="button"
                    className="btn-text"
                    disabled={!cart.hydrated}
                    onClick={() => cart.add({ type: 'product', productId: product.id, quantity: 1 })}
                  >
                    {t('collection.addToBag')} +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
