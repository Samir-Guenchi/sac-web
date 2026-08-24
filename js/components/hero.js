/**
 * ZAPHIRA — Hero Interactions
 */

export function initHero() {
  const ctaCreate = document.getElementById('hero-cta-create');
  const ctaExplore = document.getElementById('hero-cta-explore');
  const videoEl = document.getElementById('hero-video-el');
  const soundToggleBtn = document.getElementById('hero-video-sound-toggle');
  const playToggleBtn = document.getElementById('hero-video-play-toggle');

  // Smooth scroll triggers
  if (ctaCreate) {
    ctaCreate.addEventListener('click', (e) => {
      e.preventDefault();
      const customizerSec = document.getElementById('customizer-section');
      if (customizerSec) {
        customizerSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (ctaExplore) {
    ctaExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const collectionSec = document.getElementById('collection-section');
      if (collectionSec) {
        collectionSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Hermes Video Sound Toggle
  if (soundToggleBtn && videoEl) {
    const iconMuted = soundToggleBtn.querySelector('.icon-sound-muted');
    const iconOn = soundToggleBtn.querySelector('.icon-sound-on');

    soundToggleBtn.addEventListener('click', () => {
      videoEl.muted = !videoEl.muted;
      if (videoEl.muted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconOn) iconOn.style.display = 'none';
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconOn) iconOn.style.display = 'block';
      }
    });
  }

  // Hermes Video Play/Pause Toggle
  if (playToggleBtn && videoEl) {
    const iconPause = playToggleBtn.querySelector('.icon-pause');
    const iconPlay = playToggleBtn.querySelector('.icon-play');

    playToggleBtn.addEventListener('click', () => {
      if (videoEl.paused) {
        videoEl.play();
        if (iconPause) iconPause.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
      } else {
        videoEl.pause();
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
      }
    });
  }
}
