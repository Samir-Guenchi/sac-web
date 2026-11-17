'use client';

import { useStore } from '@/components/store/StoreProvider';
import { Modal } from './Modal';

export function StoryModal() {
  const { t, ui } = useStore();
  const close = () => ui.setStoryOpen(false);

  return (
    <Modal open={ui.storyOpen} onClose={close} label={t('story.title')} closeLabel={t('story.close')}>
      <div style={{ padding: 'var(--space-8)', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto var(--space-8) auto' }}>
          <div className="eyebrow">{t('story.eyebrow')}</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>{t('story.title')}</h2>
          <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-secondary)', fontWeight: 300 }}>{t('story.intro')}</p>
        </div>

        <div className="story-image-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          {(
            [
              ['/assets/images/editorial/algeria-heritage.jpg', 'story.imgHeritage'],
              ['/assets/images/editorial/craftsmanship-macro.jpg', 'story.imgAtelier']
            ] as const
          ).map(([src, alt]) => (
            <div key={src} style={{ borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid var(--border-champagne)' }}>
              <img src={src} alt={t(alt)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <div
          className="story-text-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', fontSize: 'var(--text-sm)', lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, marginBottom: 'var(--space-8)' }}
        >
          {(
            [
              ['story.atelierTitle', 'story.atelierText'],
              ['story.personalTitle', 'story.personalText']
            ] as const
          ).map(([title, text]) => (
            <div key={title}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)', color: 'var(--color-charcoal)' }}>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              close();
              document.getElementById('customizer-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('story.cta')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
