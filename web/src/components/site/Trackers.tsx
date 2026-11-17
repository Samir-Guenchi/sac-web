'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { CONSENT_EVENT, readConsent, type Consent } from '@/lib/consent';

/**
 * Loads Google Analytics 4 and the Meta Pixel only when (1) an ID is set in
 * Admin → Settings and (2) the visitor accepted the matching cookie category.
 * Nothing is requested from Google or Meta before consent.
 */
export function Trackers() {
  const { catalog } = useStore();
  const { gaMeasurementId, metaPixelId } = catalog.settings.tracking;
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  return (
    <>
      {consent?.analytics && gaMeasurementId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaMeasurementId)},{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent?.marketing && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
