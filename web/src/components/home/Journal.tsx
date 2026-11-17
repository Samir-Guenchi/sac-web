'use client';

import Link from 'next/link';
import { useStore } from '@/components/store/StoreProvider';
import type { JournalEntry } from '@/lib/catalog-types';

/** Latest stories; each opens its article on /journal/[id]. */
export function Journal({ entries }: { entries: JournalEntry[] }) {
  const { t, loc, locale } = useStore();
  const home = `/${locale}`;

  return (
    <section className="journal-section section-padding" id="journal-section">
      <div className="container">
        <div className="section-header centered reveal">
          <span className="eyebrow">{t('journal.eyebrow')}</span>
          <h2>{t('journal.heading')}</h2>
          <div className="gold-accent-line centered"></div>
        </div>
        <div className="journal-grid">
          {entries.slice(0, 4).map((entry, i) => (
            <article className="journal-card reveal" key={entry.id} style={{ '--i': i } as React.CSSProperties}>
              <Link href={`${home}/journal/${entry.id}`} className="journal-card-button" aria-label={loc(entry.title)}>
                <img src={entry.image} alt="" loading="lazy" />
                <div className="journal-card-overlay">
                  <span className="journal-tag">
                    {loc(entry.tag)} • {loc(entry.readTime)}
                  </span>
                  <h3 className="journal-title">{loc(entry.title)}</h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="collection-see-all reveal">
          <Link href={`${home}/journal`} className="btn-hermes-black">
            {t('journalPage.seeAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
