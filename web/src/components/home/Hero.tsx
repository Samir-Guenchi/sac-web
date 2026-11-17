'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';

export function Hero() {
  const { t, catalog } = useStore();
  const { heroVideo, heroPoster } = catalog.settings.media;
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const scrollTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section hero-section-hermes" id="hero-section">
      <div className="hero-video-wrapper">
        {/* key: a new video from the admin replaces the element instead of keeping the old source */}
        <video key={heroVideo} ref={video} className="hero-bg-video" autoPlay loop muted playsInline preload="auto" poster={heroPoster}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-video-overlay-hermes"></div>
      </div>

      <div className="hermes-hero-content-wrapper">
        <div className="hermes-hero-content hero-animate">
          <h1 className="hermes-hero-title">
            <em>{t('hero.title')}</em>
          </h1>
          <p className="hermes-hero-description">
            <em>{t('hero.desc')}</em>
          </p>
          <div className="hermes-hero-actions">
            <a href="#customizer-section" className="hermes-hero-link" onClick={scrollTo('customizer-section')}>
              {t('hero.ctaPrimary')}
            </a>
            <a href="#collection-section" className="hermes-hero-link" onClick={scrollTo('collection-section')}>
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </div>

      <div className="hermes-video-controls">
        <button
          type="button"
          className="hermes-control-btn"
          aria-label={t('hero.toggleSound')}
          aria-pressed={!muted}
          onClick={() => {
            if (!video.current) return;
            video.current.muted = !video.current.muted;
            setMuted(video.current.muted);
          }}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="hermes-control-btn"
          aria-label={t('hero.togglePlay')}
          aria-pressed={!playing}
          onClick={() => {
            if (!video.current) return;
            if (video.current.paused) {
              void video.current.play();
              setPlaying(true);
            } else {
              video.current.pause();
              setPlaying(false);
            }
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
