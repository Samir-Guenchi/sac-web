'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useStore } from '@/components/store/StoreProvider';
import { PASSWORD_RULES, PHONE_PATTERN, isAdult, passwordOk } from '@/lib/account-rules';
import { authClient } from '@/lib/auth-client';

type Step = 'start' | 'register' | 'verify';

const PREFIXES = [
  ['+213', 'DZ +213'],
  ['+33', 'FR +33'],
  ['+971', 'AE +971'],
  ['+44', 'GB +44']
] as const;

/** Maps Better Auth / hook error codes to dictionary keys. */
function errorKey(code: string | undefined): string {
  switch (code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
      return 'account.errWrongCredentials';
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return 'account.errExists';
    case 'INVALID_OTP':
    case 'OTP_EXPIRED':
    case 'TOO_MANY_ATTEMPTS':
      return 'account.errCode';
    case 'PASSWORD_POLICY':
      return 'account.errPassword';
    case 'UNDERAGE':
      return 'account.errAge';
    case 'PHONE_INVALID':
      return 'account.errPhone';
    default:
      return code === 'TOO_MANY_REQUESTS' || code?.includes('RATE') ? 'account.errRateLimit' : 'errors.generic';
  }
}

export function AuthFlow() {
  const { t, locale } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>('start');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(task: () => Promise<{ error?: { code?: string; status?: number } | null }>, onSuccess: () => void) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { error: failure } = await task();
      if (failure) {
        setError(t(errorKey(failure.status === 429 ? 'TOO_MANY_REQUESTS' : failure.code)));
        return failure;
      }
      onSuccess();
    } catch {
      setError(t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function sendCode() {
    await run(
      () => authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' }),
      () => setNotice(t('account.codeSent', { email }))
    );
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(
      () => authClient.signIn.email({ email, password }),
      () => router.refresh()
    ).then(failure => {
      // Account exists but the email was never confirmed: send a fresh code
      if (failure?.code === 'EMAIL_NOT_VERIFIED') {
        setStep('verify');
        void sendCode();
      }
    });
  }

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (name: string) => String(form.get(name) ?? '').trim();
    const [day, month, year] = [get('birthDay'), get('birthMonth'), get('birthYear')];
    const birthDate = day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
    const phone = `${get('phonePrefix')} ${get('phone')}`;

    if (!passwordOk(password)) return setError(t('account.errPassword'));
    if (!PHONE_PATTERN.test(phone)) return setError(t('account.errPhone'));
    if (birthDate && !isAdult(birthDate)) return setError(t('account.errAge'));

    void run(
      () =>
        authClient.signUp.email({
          email,
          password,
          name: `${get('firstName')} ${get('lastName')}`,
          civility: get('civility'),
          firstName: get('firstName'),
          lastName: get('lastName'),
          phone,
          birthDate: birthDate || undefined,
          newsletterOptIn: form.get('newsletter') === 'on',
          locale
        }),
      () => {
        setStep('verify');
        setNotice(t('account.codeSent', { email }));
      }
    );
  }

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(
      () => authClient.emailOtp.verifyEmail({ email, otp: code.trim() }),
      // Verification signs the customer in; reload the server view
      () => router.refresh()
    );
  }

  const feedback = (
    <>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          {notice}
        </p>
      )}
    </>
  );

  if (step === 'start') {
    return (
      <div className="compte-step-1-view">
        <div className="compte-step-1-card">
          <h1 className="compte-heading-title">{t('compte.title')}</h1>

          <form onSubmit={signIn} aria-labelledby="signin-title">
            <h2 className="compte-col-title" id="signin-title">
              {t('account.signInTitle')}
            </h2>
            <UnderlineField id="signin-email" label={t('compte.email')} hint={t('compte.emailHint')}>
              <input type="email" className="hermes-underline-input" id="signin-email" placeholder={t('compte.emailPlaceholder')} autoComplete="email" dir="ltr" required value={email} onChange={event => setEmail(event.target.value)} />
            </UnderlineField>
            <UnderlineField id="signin-password" label={t('compte.password')}>
              <input type="password" className="hermes-underline-input" id="signin-password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
            </UnderlineField>
            {feedback}
            <button type="submit" className="btn-hermes-black" style={{ marginTop: 10 }} disabled={busy}>
              {t('account.signIn')}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 32, paddingTop: 24 }}>
            <h2 className="compte-col-title">{t('account.newClient')}</h2>
            <p className="compte-intro-text">{t('account.newClientIntro')}</p>
            <button
              type="button"
              className="btn-hermes-black"
              style={{ background: 'transparent', color: 'var(--color-charcoal)', border: '1px solid var(--color-charcoal)' }}
              onClick={() => {
                setError(null);
                setStep('register');
              }}
            >
              {t('account.createAccount')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="compte-step-1-view">
        <form className="compte-step-1-card" onSubmit={verify}>
          <h1 className="compte-heading-title">{t('account.verifyTitle')}</h1>
          <p className="compte-intro-text">{t('account.verifyIntro', { email })}</p>
          <UnderlineField id="compte-code" label={t('compte.code')} hint={t('compte.codeHint')}>
            <input
              type="text"
              className="hermes-underline-input"
              id="compte-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              dir="ltr"
              required
              value={code}
              onChange={event => setCode(event.target.value.replace(/\D/g, ''))}
            />
          </UnderlineField>
          {feedback}
          <button type="submit" className="btn-hermes-black" style={{ marginTop: 10 }} disabled={busy}>
            {t('account.verify')}
          </button>
          <button type="button" className="btn-send-code" style={{ marginTop: 16 }} disabled={busy} onClick={() => void sendCode()}>
            {t('account.resendCode')}
          </button>
        </form>
      </div>
    );
  }

  // step === 'register'
  const rules: Array<[keyof typeof PASSWORD_RULES, string]> = [
    ['len', 'compte.critLen'],
    ['num', 'compte.critNum'],
    ['maj', 'compte.critMaj'],
    ['min', 'compte.critMin'],
    ['spe', 'compte.critSpe']
  ];
  const thisYear = new Date().getFullYear();

  return (
    <div className="compte-step-2-view" style={{ display: 'block' }}>
      <div className="compte-header-note">{t('compte.required')}</div>
      <form onSubmit={register}>
        <div className="compte-two-columns-grid">
          <div className="compte-col-left">
            <h2 className="compte-col-title">{t('compte.loginTitle')}</h2>
            <UnderlineField id="register-email" label={t('compte.email')} hint={t('compte.emailHint')}>
              <input type="email" className="hermes-underline-input" id="register-email" placeholder={t('compte.emailPlaceholder')} autoComplete="email" dir="ltr" required value={email} onChange={event => setEmail(event.target.value)} />
            </UnderlineField>
            <UnderlineField id="compte-password" label={t('compte.password')}>
              <input type="password" className="hermes-underline-input" id="compte-password" autoComplete="new-password" required value={password} onChange={event => setPassword(event.target.value)} aria-describedby="pwd-criteria" />
            </UnderlineField>
            <div className="pwd-criteria-box" id="pwd-criteria">
              <div className="pwd-criteria-title">{t('compte.pwdIntro')}</div>
              <div className="pwd-criteria-grid">
                {rules.map(([rule, label]) => (
                  <div key={rule} className={`pwd-criterion${PASSWORD_RULES[rule](password) ? ' is-valid' : ''}`}>
                    {t(label)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="compte-col-right">
            <h2 className="compte-col-title">{t('compte.personalTitle')}</h2>
            <UnderlineField id="compte-civility" label={t('compte.civility')}>
              <select className="hermes-select-input" id="compte-civility" name="civility" required defaultValue="Mme">
                <option value="Mme">{t('compte.mrs')}</option>
                <option value="M.">{t('compte.mr')}</option>
              </select>
            </UnderlineField>
            <UnderlineField id="compte-firstname" label={t('compte.firstName')}>
              <input type="text" className="hermes-underline-input" id="compte-firstname" name="firstName" placeholder={t('compte.firstNamePlaceholder')} autoComplete="given-name" required maxLength={80} />
            </UnderlineField>
            <UnderlineField id="compte-lastname" label={t('compte.lastName')}>
              <input type="text" className="hermes-underline-input" id="compte-lastname" name="lastName" placeholder={t('compte.lastNamePlaceholder')} autoComplete="family-name" required maxLength={80} />
            </UnderlineField>
            <UnderlineField id="compte-phone-number" label={t('compte.phone')} hint={t('compte.phoneHint')}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12 }}>
                <select className="hermes-select-input" name="phonePrefix" aria-label={t('compte.phone')} defaultValue="+213" dir="ltr">
                  {PREFIXES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input type="tel" className="hermes-underline-input" id="compte-phone-number" name="phone" placeholder="0550 12 34 56" autoComplete="tel-national" dir="ltr" required />
              </div>
            </UnderlineField>
            <UnderlineField id="birth-day" label={t('compte.birthDate')} hint={t('compte.birthHint')}>
              <div className="birth-date-row">
                <select className="hermes-select-input" id="birth-day" name="birthDay" defaultValue="" aria-label={t('compte.day')}>
                  <option value="">{t('compte.day')}</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select className="hermes-select-input" name="birthMonth" defaultValue="" aria-label={t('compte.month')}>
                  <option value="">{t('compte.month')}</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {t(`compte.month${i + 1}`)}
                    </option>
                  ))}
                </select>
                <select className="hermes-select-input" name="birthYear" defaultValue="" aria-label={t('compte.year')}>
                  <option value="">{t('compte.year')}</option>
                  {Array.from({ length: thisYear - 18 - 1930 + 1 }, (_, i) => thisYear - 18 - i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </UnderlineField>
          </div>
        </div>

        <div className="compte-consent-row">
          {/* Marketing consent must be opt-in, so it starts unchecked */}
          <input type="checkbox" id="compte-newsletter-optin" name="newsletter" />
          <label htmlFor="compte-newsletter-optin">{t('compte.consent')}</label>
        </div>

        <div style={{ maxWidth: 320, margin: '0 auto' }}>{feedback}</div>
        <button type="submit" className="btn-hermes-black" style={{ maxWidth: 320, margin: '16px auto 0', display: 'block' }} disabled={busy}>
          {t('compte.submit')}
        </button>
        <button type="button" className="btn-send-code" style={{ display: 'block', margin: '16px auto 0' }} onClick={() => setStep('start')}>
          {t('panier.back')}
        </button>
      </form>
    </div>
  );
}

function UnderlineField({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="hermes-underline-group">
      <label className="hermes-underline-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <span className="hermes-input-hint">{hint}</span>}
    </div>
  );
}
