'use client';

import { useStore } from '@/components/store/StoreProvider';
import type { JournalEntry } from '@/lib/catalog-types';

export function Journal({ entries }: { entries: JournalEntry[] }) {
  const { t, loc, ui } = useStore();

  return (
    <section className="journal-section section-padding" id="journal-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('journal.eyebrow')}</span>
          <h2>{t('journal.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>
        <div className="journal-grid">
          {entries.map(entry => (
            <article className="journal-card reveal" key={entry.id}>
              <button type="button" className="journal-card-button" onClick={() => ui.setStoryOpen(true)} aria-label={loc(entry.title)}>
                <img src={entry.image} alt={loc(entry.title)} loading="lazy" />
                <div className="journal-card-overlay">
                  <span className="journal-tag">
                    {loc(entry.tag)} • {loc(entry.readTime)}
                  </span>
                  <h3 className="journal-title">{loc(entry.title)}</h3>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
