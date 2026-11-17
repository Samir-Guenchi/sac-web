'use client';

import { useState, useTransition } from 'react';
import { subscribeToNewsletter } from '@/app/[lang]/actions';
import { useStore } from '@/components/store/StoreProvider';

export function Newsletter() {
  const { t, locale, ui } = useStore();
  const [email, setEmail] = useState('');
  const [pending, startTransition] = useTransition();

  return (
    <section className="newsletter-section section-padding" id="newsletter-section">
      <div className="container">
        <div className="newsletter-box reveal">
          <span className="eyebrow">{t('newsletter.eyebrow')}</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 'var(--space-3)' }}>{t('newsletter.heading')}</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 440, marginBottom: 'var(--space-4)', lineHeight: 1.6, fontWeight: 300 }}>
            {t('newsletter.desc')}
          </p>
          <form
            className="newsletter-form"
            onSubmit={event => {
              event.preventDefault();
              startTransition(async () => {
                const result = await subscribeToNewsletter({ email, locale });
                if (result.ok) {
                  ui.toast(t('toast.newsletterTitle'), t('toast.newsletterMsg'));
                  setEmail('');
                } else {
                  ui.toast(t('errors.title'), t('errors.invalidEmail'));
                }
              });
            }}
          >
            <input
              type="email"
              required
              className="input-luxury"
              placeholder={t('newsletter.placeholder')}
              aria-label={t('newsletter.placeholder')}
              value={email}
              onChange={event => setEmail(event.target.value)}
              dir="ltr"
            />
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {t('newsletter.btn')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
