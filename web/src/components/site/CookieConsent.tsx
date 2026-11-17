'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from '@/lib/consent';

/**
 * Cookie banner (first visit) and preferences panel (any time, from the
 * "Cookie settings" footer link). "Reject all" is as easy as "Accept all".
 */
export function CookieConsent() {
  const { t, locale } = useStore();
  const [showBanner, setShowBanner] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = readConsent();
    /* eslint-disable react-hooks/set-state-in-effect -- reads the consent cookie once after hydration */
    setShowBanner(!current);
    setAnalytics(current?.analytics ?? false);
    setMarketing(current?.marketing ?? false);
    /* eslint-enable react-hooks/set-state-in-effect */
    const open = () => {
      const latest = readConsent();
      setAnalytics(latest?.analytics ?? false);
      setMarketing(latest?.marketing ?? false);
      setShowPanel(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (!showPanel) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setShowPanel(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showPanel]);

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setShowBanner(false);
    setShowPanel(false);
  };

  return (
    <>
      {showBanner && !showPanel && (
        <div className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title">
          <div className="consent-banner-text">
            <h2 id="consent-title">{t('consent.title')}</h2>
            <p>
              {t('consent.text')} <Link href={`/${locale}/pages/confidentialite`}>{t('consent.policy')}</Link>
            </p>
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-btn" onClick={() => setShowPanel(true)}>
              {t('consent.customize')}
            </button>
            <button type="button" className="consent-btn" onClick={() => decide({ analytics: false, marketing: false })}>
              {t('consent.rejectAll')}
            </button>
            <button type="button" className="consent-btn consent-btn-primary" onClick={() => decide({ analytics: true, marketing: true })}>
              {t('consent.acceptAll')}
            </button>
          </div>
        </div>
      )}

      {showPanel && (
        <>
          <div className="consent-backdrop" onClick={() => setShowPanel(false)} />
          <div className="consent-panel" role="dialog" aria-modal="true" aria-labelledby="consent-panel-title">
            <h2 id="consent-panel-title">{t('consent.panelTitle')}</h2>
            <p className="consent-panel-intro">{t('consent.panelIntro')}</p>

            <ConsentRow title={t('consent.necessaryTitle')} text={t('consent.necessaryText')} checked disabled label={t('consent.alwaysOn')} />
            <ConsentRow title={t('consent.analyticsTitle')} text={t('consent.analyticsText')} checked={analytics} onChange={setAnalytics} />
            <ConsentRow title={t('consent.marketingTitle')} text={t('consent.marketingText')} checked={marketing} onChange={setMarketing} />

            <div className="consent-actions">
              <button type="button" className="consent-btn" onClick={() => decide({ analytics: false, marketing: false })}>
                {t('consent.rejectAll')}
              </button>
              <button type="button" className="consent-btn" onClick={() => decide({ analytics, marketing })}>
                {t('consent.save')}
              </button>
              <button type="button" className="consent-btn consent-btn-primary" onClick={() => decide({ analytics: true, marketing: true })}>
                {t('consent.acceptAll')}
              </button>
            </div>
            <Link href={`/${locale}/pages/confidentialite`} className="consent-policy-link" onClick={() => setShowPanel(false)}>
              {t('consent.policy')}
            </Link>
          </div>
        </>
      )}
    </>
  );
}

function ConsentRow({
  title,
  text,
  checked,
  disabled,
  label,
  onChange
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="consent-row">
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <label className="consent-switch">
        <input type="checkbox" role="switch" checked={checked} disabled={disabled} aria-label={title} onChange={event => onChange?.(event.target.checked)} />
        <span aria-hidden="true" />
        {label && <small>{label}</small>}
      </label>
    </div>
  );
}

/** Footer link that reopens the preferences panel. */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className ?? 'cookie-settings-link'} onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT))}>
      {label}
    </button>
  );
}
