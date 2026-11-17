'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import type { Testimonial } from '@/lib/catalog-types';

const AUTO_ADVANCE_MS = 6000;

export function Testimonials({ items }: { items: Testimonial[] }) {
  const { t, loc } = useStore();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  // Restarts the timer whenever a dot is clicked
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      timer = setInterval(() => show(index => (index + 1) % items.length), AUTO_ADVANCE_MS);
    };
    const stop = () => timer && clearInterval(timer);
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [items.length, cycle]);

  function show(next: number | ((index: number) => number)) {
    setVisible(false);
    setTimeout(() => {
      setActive(next);
      setVisible(true);
    }, 200);
  }

  const current = items[active];
  if (!current) return null;

  return (
    <section className="testimonials-section section-padding" id="testimonials-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('social.eyebrow')}</span>
          <h2>{t('social.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>
        <div className="testimonials-slider-container reveal">
          <div
            className="testimonial-quote-large"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}
          >
            “{loc(current.quote)}”
          </div>
          <div className="testimonial-author-meta">
            <div className="testimonial-author-name">{current.author}</div>
            <div className="testimonial-author-location">
              {loc(current.location)} • {current.product}
            </div>
          </div>
          <div className="testimonial-nav-dots">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`nav-dot${index === active ? ' is-active' : ''}`}
                aria-label={t('testimonials.dotLabel', { n: index + 1 })}
                aria-current={index === active}
                onClick={() => {
                  show(index);
                  setCycle(c => c + 1);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
