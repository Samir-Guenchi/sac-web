'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { MAX_LINE_QUANTITY } from '@/lib/pricing';
import { ProductCard } from './ProductCard';

/** Product page body: gallery, purchase box, detail accordions, related bags. */
export function ProductDetail({ productId }: { productId: string }) {
  const { t, loc, locale, catalog, price, cart } = useStore();
  const product = catalog.products.find(p => p.id === productId)!;
  const [image, setImage] = useState(product.primaryImage);
  const [quantity, setQuantity] = useState(1);
  const category = catalog.categories.find(c => c.id === product.categoryId);
  const related = catalog.products.filter(p => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4);
  const contact = catalog.settings.contact.whatsapp;

  const sections: Array<[string, string]> = [
    ['product.description', loc(product.fullDescription)],
    ['product.details', `${t('quickview.materials')} ${loc(product.materials)}\n${t('quickview.dimensions')} ${loc(product.dimensions)}\n${t('quickview.hardware')} ${loc(product.hardware)}`],
    ['product.delivery', t('product.deliveryText')],
    ['product.care', t('product.careText')]
  ];

  return (
    <>
      <div className="product-page-grid">
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img src={image} alt={product.name} />
          </div>
          {product.gallery.length > 1 && (
            <div className="product-gallery-thumbs">
              {product.gallery.map((src, index) => (
                <button key={src} type="button" aria-label={`${product.name} ${index + 1}`} aria-pressed={image === src} className={image === src ? 'is-active' : ''} onClick={() => setImage(src)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-buy">
          {category && (
            <Link href={`/${locale}/collections/${category.id}`} className="product-buy-collection">
              {loc(category.name)}
            </Link>
          )}
          <h1 className="product-buy-title">{product.name}</h1>
          <p className="product-buy-short">{loc(product.shortDescription)}</p>
          <div className="product-buy-price">{price(product.priceDzd)}</div>

          <div className="product-buy-actions">
            <div className="cart-qty-control" style={{ padding: '4px 8px' }}>
              <button type="button" className="cart-qty-btn" aria-label={t('quickview.decrease')} onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                -
              </button>
              <span className="cart-qty-value">{quantity}</span>
              <button type="button" className="cart-qty-btn" aria-label={t('quickview.increase')} onClick={() => setQuantity(q => Math.min(MAX_LINE_QUANTITY, q + 1))}>
                +
              </button>
            </div>
            <button type="button" className="btn-hermes-black" disabled={!cart.hydrated} onClick={() => cart.add({ type: 'product', productId: product.id, quantity })}>
              {t('collection.addToBag')}
            </button>
          </div>

          <ul className="product-buy-promises">
            <li>{t('panier.freeDelivery')}</li>
            <li>{t('product.handmade')}</li>
            <li>{t('panier.securePayment')}</li>
          </ul>

          {contact.tel && (
            <a className="product-buy-advice" href={`https://wa.me/${contact.tel.replace(/\D/g, '')}?text=${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">
              {t('product.askAdvisor')}
            </a>
          )}

          <div className="product-accordions">
            {sections.map(([title, body], index) => (
              <details key={title} open={index === 0}>
                <summary>{t(title)}</summary>
                <p>{body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="product-related" aria-labelledby="related-title">
          <h2 id="related-title">{t('product.related')}</h2>
          <div className="collection-grid">
            {related.map(item => (
              <ProductCard key={item.id} product={item} reveal={false} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
