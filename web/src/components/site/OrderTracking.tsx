'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { trackOrder, type TrackedOrder } from '@/app/[lang]/suivi/actions';
import { useStore } from '@/components/store/StoreProvider';

/** Steps shown on the progress line; cancelled/returned are shown as a note instead. */
const STEPS = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered'] as const;

export function OrderTracking() {
  const { t, locale, price } = useStore();
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await trackOrder({ orderId: String(form.get('orderId')), email: String(form.get('email')) });
      setOrder(result);
      setNotFound(!result);
    });
  }

  const reached = order ? STEPS.indexOf(order.status as (typeof STEPS)[number]) : -1;

  return (
    <div className="tracking">
      <header className="collection-hero">
        <h1>{t('tracking.title')}</h1>
        <p>{t('tracking.intro')}</p>
      </header>

      <form className="tracking-form" onSubmit={onSubmit}>
        <label>
          {t('tracking.orderId')}
          <input name="orderId" placeholder="ZPH-123456" required dir="ltr" autoComplete="off" />
        </label>
        <label>
          {t('compte.email')}
          <input name="email" type="email" required dir="ltr" autoComplete="email" />
        </label>
        <button type="submit" className="btn-hermes-black" disabled={pending}>
          {t('tracking.submit')}
        </button>
      </form>

      {notFound && (
        <p className="form-error" role="alert" style={{ textAlign: 'center' }}>
          {t('tracking.notFound')}
        </p>
      )}

      {order && (
        <section className="tracking-result" aria-live="polite">
          <h2 dir="ltr">#{order.id}</h2>
          <p>
            {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : locale, { dateStyle: 'long' }).format(new Date(order.createdAt))} · {price(order.totalDzd)}
          </p>
          {reached >= 0 ? (
            <ol className="tracking-steps">
              {STEPS.map((step, index) => (
                <li key={step} className={index <= reached ? 'is-done' : ''} aria-current={index === reached ? 'step' : undefined}>
                  {t(`orderStatus.${step}`)}
                </li>
              ))}
            </ol>
          ) : (
            <p className="tracking-note">{t(`orderStatus.${order.status}`)}</p>
          )}
          <ul className="tracking-items">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.quantity} × {item.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
