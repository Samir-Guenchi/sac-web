import type { Localized } from '@/db/schema';
import { LANG_NAMES, LANGS } from '@/app/admin/(dashboard)/form-utils';

/** One input per language; French is required, English/Arabic fall back to French when empty. */
export function LocalizedField({
  name,
  label,
  value,
  multiline = false,
  required = true
}: {
  name: string;
  label: string;
  value?: Localized | null;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <fieldset className="admin-localized">
      <legend>{label}</legend>
      <div className="admin-localized-grid">
        {LANGS.map(lang => (
          <label key={lang} className="admin-localized-item">
            <span className="admin-lang">{LANG_NAMES[lang]}</span>
            {multiline ? (
              <textarea name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} rows={3} dir={lang === 'ar' ? 'rtl' : 'ltr'} required={required && lang === 'fr'} />
            ) : (
              <input name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} dir={lang === 'ar' ? 'rtl' : 'ltr'} required={required && lang === 'fr'} />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {hint && <small className="admin-muted">{hint}</small>}
    </label>
  );
}

const BADGE_LABELS: Record<string, string> = {
  in_production: 'in production',
  'cp-disabled': 'not configured',
  'cp-pending': 'sending',
  'cp-sent': 'sent',
  'cp-failed': 'failed'
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-badge admin-badge-${status}`}>{BADGE_LABELS[status] ?? status}</span>;
}

export const dzd = (amount: number) => `${amount.toLocaleString('en-US')} DZD`;
export const dateTime = (date: Date) => new Intl.DateTimeFormat('fr-DZ', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Algiers' }).format(date);
