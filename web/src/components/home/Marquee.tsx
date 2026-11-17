import type { TFunction } from '@/lib/i18n/translate';

const ITEMS = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;

/** Slow scrolling ribbon of the house's promises (pauses on hover). */
export function Marquee({ t }: { t: TFunction }) {
  const group = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {ITEMS.map(key => (
        <span key={key} className="marquee-item">
          {t(`marquee.${key}`)}
        </span>
      ))}
    </div>
  );
  // Two identical groups so the loop is seamless; the copy is hidden from screen readers
  return (
    <section className="marquee" aria-label={ITEMS.map(key => t(`marquee.${key}`)).join(' · ')}>
      <div className="marquee-track">
        {group(false)}
        {group(true)}
        {group(true)}
        {group(true)}
      </div>
    </section>
  );
}
