import Link from 'next/link';
import { db } from '@/db';
import { contentOverrides } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { LANG_NAMES, LANGS } from '../form-utils';
import { baseMessages, flattenMessages } from '../messages';
import { saveTexts } from '../actions';

/** Friendly names for the dictionary sections (others show their key). */
const SECTION_NAMES: Record<string, string> = {
  hero: 'Home — video banner',
  promise: 'Home — promises',
  customizer: 'Home — bespoke studio (titles)',
  studio: 'Home — bespoke studio (details)',
  collection: 'Home — collection',
  craft: 'Home — craftsmanship',
  heritage: 'Home — heritage',
  social: 'Home — testimonials',
  journal: 'Home — journal',
  newsletter: 'Home — newsletter',
  nav: 'Menu',
  menu: 'Menu — drop-downs',
  footer: 'Footer',
  links: 'Footer — links',
  panier: 'Bag & checkout',
  checkout: 'Checkout messages',
  compte: 'Account page',
  account: 'Account messages',
  product: 'Product page',
  collections: 'Collection pages',
  search: 'Search',
  tracking: 'Order tracking',
  widgets: 'Cookie notice & WhatsApp',
  meta: 'Search engines (title & description)',
  auth: 'Verification email',
  errors: 'Error messages',
  orderStatus: 'Order statuses',
  quickview: 'Quick view',
  cartAdded: 'Added-to-bag card',
  toast: 'Pop-up messages',
  testimonials: 'Testimonials (accessibility)',
  story: 'Heritage story pop-up',
  media: 'Image descriptions',
  notFound: 'Page not found',
  about: 'About page (La Maison)',
  consent: 'Cookie banner & settings'
};

// Back-office page behind a login: reads URL data and renders on demand (no instant-navigation shell)
export const instant = false;

export default async function TextsPage({ searchParams }: PageProps<'/admin/texts'>) {
  const params = await searchParams;
  const sections = Object.keys(baseMessages.fr);
  const section = typeof params.section === 'string' && sections.includes(params.section) ? params.section : 'hero';

  const base = Object.fromEntries(LANGS.map(lang => [lang, flattenMessages(baseMessages[lang])])) as Record<(typeof LANGS)[number], Record<string, string>>;
  const keys = Object.keys(base.fr).filter(key => key.startsWith(`${section}.`));
  const overrides = await db.select().from(contentOverrides);
  const current = (lang: string, key: string) => overrides.find(o => o.locale === lang && o.key === key)?.value ?? base[lang as 'fr'][key] ?? '';
  const customised = new Set(overrides.map(o => o.key.split('.')[0]));

  return (
    <div className="admin-page">
      <h1>Site texts</h1>
      <p className="admin-muted">Every label of the shop, in the three languages. Changes appear immediately. Clear a field (or put the original text back) to return to the default.</p>
      <div className="admin-texts">
        <nav className="admin-texts-nav" aria-label="Sections">
          {sections.map(key => (
            <Link key={key} href={`/admin/texts?section=${key}`} aria-current={key === section ? 'page' : undefined}>
              {SECTION_NAMES[key] ?? key}
              {customised.has(key) && <span className="admin-dot" title="Customised" />}
            </Link>
          ))}
        </nav>
        <ActionForm action={saveTexts} submitLabel="Save texts" className="admin-card" key={section}>
          <h2>{SECTION_NAMES[section] ?? section}</h2>
          <input type="hidden" name="keys" value={keys.join(',')} />
          {keys.map(key => {
            const long = base.fr[key].length > 70;
            return (
              <fieldset key={key} className="admin-localized">
                <legend>
                  <code>{key}</code>
                </legend>
                <div className="admin-localized-grid">
                  {LANGS.map(lang => (
                    <label key={lang} className="admin-localized-item">
                      <span className="admin-lang">{LANG_NAMES[lang]}</span>
                      {long ? (
                        <textarea name={`${lang}:${key}`} defaultValue={current(lang, key)} rows={3} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
                      ) : (
                        <input name={`${lang}:${key}`} defaultValue={current(lang, key)} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </ActionForm>
      </div>
    </div>
  );
}
