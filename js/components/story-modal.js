/**
 * ZAPHIRA — Brand Story & Atelier Deep Dive Modal
 */

import { t } from '../utils/i18n.js';
import { escapeHtml } from '../utils/escape.js';

const tx = key => escapeHtml(t(`story.${key}`));

export function initStoryModal() {
  const backdrop = document.getElementById('story-backdrop');
  const wrapper = document.getElementById('story-modal-wrapper');
  if (!backdrop || !wrapper) return;

  function openStory() {
    backdrop.classList.add('is-active');
    wrapper.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    renderStoryContent();
  }

  function closeStory() {
    backdrop.classList.remove('is-active');
    wrapper.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  document.addEventListener('story:open', openStory);
  backdrop.addEventListener('click', closeStory);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('is-active')) {
      closeStory();
    }
  });

  // Also bind buttons on page
  const craftStoryBtn = document.getElementById('craft-story-btn');
  const heritageStoryBtn = document.getElementById('heritage-story-btn');
  if (craftStoryBtn) craftStoryBtn.addEventListener('click', openStory);
  if (heritageStoryBtn) heritageStoryBtn.addEventListener('click', openStory);

  function renderStoryContent() {
    wrapper.innerHTML = `
      <button class="modal-close-btn" id="story-close-btn" aria-label="${tx('close')}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="padding: var(--space-8); max-height: 85vh; overflow-y: auto;">
        <div style="text-align: center; max-width: 680px; margin: 0 auto var(--space-8) auto;">
          <div class="eyebrow">${tx('eyebrow')}</div>
          <h2 style="font-size: 2.5rem; margin-bottom: var(--space-4);">${tx('title')}</h2>
          <p style="font-size: var(--text-sm); line-height: 1.7; color: var(--text-secondary); font-weight: 300;">
            ${tx('intro')}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-bottom: var(--space-8);">
          <div style="border-radius: var(--radius-xs); overflow: hidden; border: 1px solid var(--border-champagne);">
            <img src="assets/images/editorial/algeria-heritage.jpg" alt="${tx('imgHeritage')}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="border-radius: var(--radius-xs); overflow: hidden; border: 1px solid var(--border-champagne);">
            <img src="assets/images/editorial/craftsmanship-macro.jpg" alt="${tx('imgAtelier')}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); font-size: var(--text-sm); line-height: 1.8; color: var(--text-secondary); font-weight: 300; margin-bottom: var(--space-8);">
          <div>
            <h3 style="font-size: 1.25rem; margin-bottom: var(--space-2); color: var(--color-charcoal);">${tx('atelierTitle')}</h3>
            <p>
              ${tx('atelierText')}
            </p>
          </div>
          <div>
            <h3 style="font-size: 1.25rem; margin-bottom: var(--space-2); color: var(--color-charcoal);">${tx('personalTitle')}</h3>
            <p>
              ${tx('personalText')}
            </p>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-subtle); padding-top: var(--space-6);">
          <button type="button" class="btn btn-primary" id="story-create-cta">
            ${tx('cta')}
          </button>
        </div>
      </div>
    `;

    const closeBtn = wrapper.querySelector('#story-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeStory);

    const createCta = wrapper.querySelector('#story-create-cta');
    if (createCta) {
      createCta.addEventListener('click', () => {
        closeStory();
        const customizerSec = document.getElementById('customizer-section');
        if (customizerSec) customizerSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}
