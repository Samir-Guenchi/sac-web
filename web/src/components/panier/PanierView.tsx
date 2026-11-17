'use client';

import Link from 'next/link';
import { useState, useTransition, type FormEvent } from 'react';
import { submitOrder } from '@/app/[lang]/panier/actions';
import { useStore } from '@/components/store/StoreProvider';
import { describeLine } from '@/lib/cart-display';
import { unitPriceDzd } from '@/lib/pricing';
import { WILAYAS } from '@/lib/wilayas';
import { CookieSettingsLink } from '@/components/site/CookieConsent';

type Step = 1 | 2 | 3;
type Confirmation = { orderId: string; recipient: string; email: string; phone: string; address: string; gift: string };

export function PanierView() {
  const { t, loc, locale, catalog, price, cart } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [giftOn, setGiftOn] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [payment, setPayment] = useState<'cod' | 'cib' | 'card'>('cod');
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [pending, startTransition] = useTransition();

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nothing to check out (e.g. emptied in another tab)
  if (step === 2 && cart.hydrated && cart.lines.length === 0) setStep(1);

  const subtotal = price(cart.subtotalDzd);
  const contact = catalog.settings.contact;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const field = (name: string) => String(form.get(name) ?? '').trim();
    const input = {
      locale,
      email: field('email'),
      firstName: field('firstName'),
      lastName: field('lastName'),
      phone: field('phone'),
      wilayaCode: field('wilaya'),
      address: field('address'),
      paymentMethod: payment,
      giftMessage: giftOn ? giftMessage.trim() : undefined,
      lines: cart.lines.map(({ key: _key, ...line }) => line),
      expectedTotalDzd: cart.subtotalDzd
    };

    startTransition(async () => {
      const result = await submitOrder(input);
      if (!result.ok) {
        setError(t(`errors.${result.error}`));
        if (result.error !== 'invalid') goTo(1);
        return;
      }
      const wilaya = input.wilayaCode === 'intl' ? t('panier.international') : (() => {
        const w = WILAYAS.find(item => item.code === input.wilayaCode);
        return w ? `${w.code} - ${locale === 'ar' ? w.nameAr : w.name}` : input.wilayaCode;
      })();
      setConfirmation({
        orderId: result.orderId,
        recipient: `${input.firstName} ${input.lastName}`,
        email: input.email,
        phone: input.phone,
        address: `${input.address}, ${wilaya}`,
        gift: input.giftMessage ?? ''
      });
      cart.clear();
      goTo(3);
    });
  }

  const stepClass = (n: Step) => `step-item${n < step ? ' is-completed' : ''}${n === step ? ' is-active' : ''}`;

  return (
    <>
      <header className="panier-header">
        <div className="container">
          <div className="panier-top-nav">
            {step === 2 ? (
              <button type="button" className="panier-back-btn" onClick={() => goTo(1)}>
                <BackArrow />
                <span>{t('panier.back')}</span>
              </button>
            ) : (
              <Link href={`/${locale}`} className="panier-back-btn">
                <BackArrow />
                <span>{t('panier.back')}</span>
              </Link>
            )}
            <Link href={`/${locale}`} className="panier-logo-link" aria-label={t('panier.homeAria')}>
              <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" className="panier-logo-img" />
            </Link>
            <div></div>
          </div>
          <div className="panier-stepper" style={{ '--progress': `${((step * 2 - 1) / 6) * 100}%` } as React.CSSProperties}>
            <span className="panier-stepper-progress" aria-hidden="true" />
            {([1, 2, 3] as const).map(n => (
              <div className={stepClass(n)} key={n} aria-current={n === step ? 'step' : undefined}>
                <div className="step-dot"></div>
                <span className="step-label">{t(['panier.stepCart', 'panier.stepDelivery', 'panier.stepConfirm'][n - 1])}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="panier-main">
        <div className="container">
          {step === 1 && (
            <div className="step-view">
              <div className="panier-layout-grid">
                <div className="panier-left-col">
                  {error && (
                    <p className="form-error" role="alert" style={{ marginBottom: 16 }}>
                      {error}
                    </p>
                  )}
                  {cart.hydrated && cart.lines.length === 0 ? (
                    <div className="empty-cart-card" style={{ display: 'flex' }}>
                      <div className="empty-cart-icon">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </div>
                      <h1 className="empty-cart-text">{t('panier.emptyTitle')}</h1>
                      <Link href={`/${locale}`} className="btn-continue-shopping">
                        {t('panier.continueShopping')}
                      </Link>
                    </div>
                  ) : (
                    <div className="panier-panel">
                      <h1 className="panier-heading">{t(cart.count > 1 ? 'panier.countMany' : 'panier.countOne', { count: cart.count })}</h1>
                      <div className="panier-items-list">
                        {cart.lines.map(line => {
                          const info = describeLine(line, catalog, loc, t);
                          const unit = unitPriceDzd(catalog, line) ?? 0;
                          return (
                            <div className="panier-item-card" key={line.key}>
                              <div className="panier-item-image">
                                <img src={info.image} alt={info.name} />
                              </div>
                              <div className="panier-item-details">
                                <div>
                                  <h3 className="panier-item-title">{info.name}</h3>
                                  <div className="panier-item-meta">
                                    {info.specs.length === 0 ? (
                                      <>
                                        {info.collection || t('panier.houseLine')} • {t('panier.ref')} {info.reference}
                                      </>
                                    ) : (
                                      <>
                                        {info.specs.map(([label, value]) => (
                                          <span key={label}>
                                            {label} {value}
                                            <br />
                                          </span>
                                        ))}
                                        {info.monogram && (
                                          <span>
                                            {t('panier.specMonogram')} <strong>« {info.monogram} »</strong>
                                            <br />
                                          </span>
                                        )}
                                        {t('panier.ref')} {info.reference}
                                      </>
                                    )}
                                  </div>
                                </div>
                                <button type="button" className="panier-item-remove-btn" onClick={() => cart.remove(line.key)}>
                                  {t('panier.remove')}
                                </button>
                              </div>
                              <div className="panier-item-right">
                                <div className="panier-qty-box">
                                  <button type="button" className="panier-qty-btn" aria-label={t('panier.decrease')} onClick={() => cart.setQuantity(line.key, line.quantity - 1)}>
                                    -
                                  </button>
                                  <span className="panier-qty-val">{line.quantity}</span>
                                  <button type="button" className="panier-qty-btn" aria-label={t('panier.increase')} onClick={() => cart.setQuantity(line.key, line.quantity + 1)}>
                                    +
                                  </button>
                                </div>
                                <div className="panier-item-price">{price(unit * line.quantity)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="panier-totals-box">
                        <div className="panier-total-row">
                          <span>{t('panier.subtotal')}</span>
                          <span>{subtotal}</span>
                        </div>
                        <div className="panier-total-row">
                          <span>{t('panier.shipping')}</span>
                          {/* Delivery is complimentary everywhere (matches checkout and the badge) */}
                          <span style={{ color: 'var(--color-champagne-dark)', fontWeight: 600 }}>{t('panier.free')}</span>
                        </div>
                        <div className="panier-total-row grand-total">
                          <span>{t('panier.total')}</span>
                          <span>{subtotal}</span>
                        </div>
                      </div>

                      <div className="panier-gift-box">
                        <label className="panier-gift-header">
                          <input type="checkbox" checked={giftOn} onChange={event => setGiftOn(event.target.checked)} />
                          <span>{t('panier.gift')}</span>
                        </label>
                        {giftOn && (
                          <div>
                            <textarea
                              className="panier-gift-msg-field"
                              maxLength={500}
                              placeholder={t('panier.giftPlaceholder')}
                              value={giftMessage}
                              onChange={event => setGiftMessage(event.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <button type="button" className="btn-hermes-black" disabled={!cart.hydrated || cart.lines.length === 0} onClick={() => goTo(2)}>
                        {t('panier.order')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="panier-sidebar">
                  <div className="panier-sidebar-card">
                    <h2 className="panier-sidebar-title">{t('panier.boxTitle')}</h2>
                    <div className="panier-card-body panier-box-content">
                      <img src="/assets/images/branding/ecrin-zaphira.svg" alt="" className="panier-box-img" />
                      <p className="panier-box-text">{t('panier.boxText')}</p>
                    </div>
                  </div>
                  <div className="panier-sidebar-card">
                    <h2 className="panier-sidebar-title">{t('panier.serviceTitle')}</h2>
                    <div className="panier-card-body panier-service-block">
                      <p className="panier-service-text">{t('panier.serviceHours')}</p>
                      <div className="panier-service-line">
                        <span>{t('panier.serviceWhatsapp')}</span> <ContactNumber number={contact.whatsapp} />
                      </div>
                      <div className="panier-service-line">
                        <span>{t('panier.servicePhone')}</span> <ContactNumber number={contact.phone} />
                      </div>
                    </div>
                    <TrustBadges />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-view">
              <div className="panier-layout-grid">
                <form className="panier-left-col" onSubmit={onSubmit}>
                  <div className="checkout-section-box">
                    <h2 className="checkout-section-title">{t('panier.accountTitle')}</h2>
                    <div className="checkout-form-grid">
                      <Field id="checkout-email" label={t('panier.email')} full>
                        <input type="email" name="email" className="hermes-form-input" id="checkout-email" placeholder={t('panier.emailPlaceholder')} autoComplete="email" dir="ltr" required maxLength={254} />
                      </Field>
                    </div>
                  </div>

                  <div className="checkout-section-box">
                    <h2 className="checkout-section-title">{t('panier.addressTitle')}</h2>
                    <div className="checkout-form-grid">
                      <Field id="checkout-prenom" label={t('panier.firstName')}>
                        <input type="text" name="firstName" className="hermes-form-input" id="checkout-prenom" placeholder={t('panier.firstNamePlaceholder')} autoComplete="given-name" required maxLength={80} />
                      </Field>
                      <Field id="checkout-nom" label={t('panier.lastName')}>
                        <input type="text" name="lastName" className="hermes-form-input" id="checkout-nom" placeholder={t('panier.lastNamePlaceholder')} autoComplete="family-name" required maxLength={80} />
                      </Field>
                      <Field id="checkout-phone" label={t('panier.phone')}>
                        <input
                          type="tel"
                          name="phone"
                          className="hermes-form-input"
                          id="checkout-phone"
                          placeholder="05XX XX XX XX"
                          autoComplete="tel"
                          dir="ltr"
                          required
                          pattern="\+?[\d\s\(\)\.\-]{8,20}"
                        />
                      </Field>
                      <Field id="checkout-wilaya" label={t('panier.wilaya')}>
                        <select className="hermes-form-select" name="wilaya" id="checkout-wilaya" required defaultValue="">
                          <option value="">{t('panier.wilayaPlaceholder')}</option>
                          {WILAYAS.map(w => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {locale === 'ar' ? w.nameAr : w.name}
                            </option>
                          ))}
                          <option value="intl">{t('panier.international')}</option>
                        </select>
                      </Field>
                      <Field id="checkout-address" label={t('panier.address')} full>
                        <input type="text" name="address" className="hermes-form-input" id="checkout-address" placeholder={t('panier.addressPlaceholder')} autoComplete="street-address" required minLength={5} maxLength={300} />
                      </Field>
                    </div>
                  </div>

                  <div className="checkout-section-box">
                    <h2 className="checkout-section-title">{t('panier.paymentTitle')}</h2>
                    <div className="payment-methods-list" role="radiogroup">
                      {(['cod', 'cib', 'card'] as const).map(method => (
                        <label className={`payment-method-item${payment === method ? ' is-selected' : ''}`} key={method}>
                          <input type="radio" name="payment-method" value={method} checked={payment === method} onChange={() => setPayment(method)} />
                          <div>
                            <strong>{t(`panier.${method}`)}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>{t(`panier.${method}Desc`)}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {payment !== 'cod' && <p className="form-success">{t('checkout.onlinePaymentNote')}</p>}
                  </div>

                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <button type="submit" className="btn-hermes-black" disabled={pending}>
                    {pending ? t('checkout.placing') : t('panier.confirm')}
                  </button>
                </form>

                <div className="panier-sidebar">
                  <div className="panier-sidebar-card">
                    <h2 className="panier-sidebar-title">{t('panier.summaryTitle')}</h2>
                    <div className="panier-card-body">
                    <div className="panier-totals-box">
                      <div className="panier-total-row">
                        <span>{t('panier.subtotal')}</span>
                        <span>{subtotal}</span>
                      </div>
                      <div className="panier-total-row">
                        <span>{t('panier.expressShipping')}</span>
                        <span style={{ color: 'var(--color-champagne-dark)', fontWeight: 600 }}>{t('panier.free')}</span>
                      </div>
                      <div className="panier-total-row grand-total">
                        <span>{t('panier.totalDue')}</span>
                        <span>{subtotal}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.5, margin: 0 }}>{t('panier.terms')}</p>
                    </div>
                    <TrustBadges />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && confirmation && (
            <div className="step-view">
              <div className="order-success-card">
                <div className="order-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="order-success-title">{t('panier.successTitle')}</h2>
                <p className="order-success-desc">
                  {t('panier.successPre')} <strong dir="ltr">#{confirmation.orderId}</strong> {t('panier.successPost')}
                  <br />
                  {t('panier.successAtelier')}
                </p>
                <div style={{ backgroundColor: '#FAF6EE', padding: 20, borderRadius: 4, marginBottom: 30, textAlign: 'start' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: 8 }}>{t('panier.deliveryDetails')}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
                    {(
                      [
                        ['panier.recipient', confirmation.recipient],
                        ['panier.emailLabel', confirmation.email],
                        ['panier.phoneLabel', confirmation.phone],
                        ['panier.addressLabel', confirmation.address],
                        ['panier.giftLabel', confirmation.gift],
                        ['panier.status', t('panier.statusValue')]
                      ] as const
                    )
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label}>
                          <strong>{t(label)}</strong> {value}
                        </div>
                      ))}
                  </div>
                </div>
                <Link href={`/${locale}`} className="btn-hermes-black" style={{ display: 'inline-flex', width: 'auto', padding: '14px 36px' }}>
                  {t('panier.backHome')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="panier-footer">
        <div className="container">
          <nav aria-label={t('links.legalNav')}>
            <Link href={`/${locale}/pages/cgv`}>{t('compte.terms')}</Link>
            <Link href={`/${locale}/pages/confidentialite`}>{t('links.privacyCookies')}</Link>
            <Link href={`/${locale}/pages/mentions-legales`}>{t('links.legalNotice')}</Link>
            <Link href={`/${locale}/pages/accessibilite`}>{t('links.accessibility')}</Link>
            <CookieSettingsLink label={t('consent.manage')} />
          </nav>
          <span>{t('compte.copyright')}</span>
        </div>
      </footer>
    </>
  );
}

function TrustBadges() {
  const { t } = useStore();
  return (
    <div className="panier-trust-badges">
      <div className="panier-trust-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1" y="6" width="14" height="10" rx="1" />
          <path d="M15 9h4l3 3v4h-7" />
          <circle cx="5.5" cy="17.5" r="1.8" />
          <circle cx="18" cy="17.5" r="1.8" />
        </svg>
        <span>{t('panier.freeDelivery')}</span>
      </div>
      <div className="panier-trust-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 8h15l-3-3" />
          <path d="M20 16H5l3 3" />
        </svg>
        <span>{t('panier.returns')}</span>
      </div>
      <div className="panier-trust-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="10" width="16" height="11" rx="1.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M9.5 15.5l2 2 3.5-3.5" />
        </svg>
        <span>{t('panier.securePayment')}</span>
      </div>
    </div>
  );
}

function Field({ id, label, full, children }: { id: string; label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`hermes-form-group${full ? ' full-width' : ''}`}>
      <label className="hermes-form-label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactNumber({ number }: { number: { display: string; tel: string | null } }) {
  // A number without `tel` is a placeholder: shown, but not dialable
  return number.tel ? (
    <a href={`tel:${number.tel}`} className="panier-service-link" dir="ltr">
      {number.display}
    </a>
  ) : (
    <span className="panier-service-link" dir="ltr">
      {number.display}
    </span>
  );
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flip-rtl" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
