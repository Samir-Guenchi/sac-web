import { loadCatalog } from '@/lib/catalog';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field } from '@/components/admin/Fields';
import { MediaField } from '@/components/admin/MediaFields';
import { saveSettings } from '../actions';

export default async function SettingsPage() {
  const { settings } = await loadCatalog();
  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <ActionForm action={saveSettings} submitLabel="Save settings" className="admin-card">
        <h2>Customer service</h2>
        <p className="admin-muted">Shown on the bag page and the contact page. The WhatsApp button appears on the shop as soon as a dial number is set. Leave “dial number” empty to show the text without a link.</p>
        <div className="admin-grid-2">
          <Field label="WhatsApp — shown as">
            <input name="whatsapp.display" defaultValue={settings.contact.whatsapp.display} />
          </Field>
          <Field label="WhatsApp — dial number" hint="International format, e.g. +213550000000">
            <input name="whatsapp.tel" defaultValue={settings.contact.whatsapp.tel ?? ''} dir="ltr" />
          </Field>
          <Field label="Phone — shown as">
            <input name="phone.display" defaultValue={settings.contact.phone.display} />
          </Field>
          <Field label="Phone — dial number">
            <input name="phone.tel" defaultValue={settings.contact.phone.tel ?? ''} dir="ltr" />
          </Field>
        </div>

        <h2>Social networks</h2>
        <p className="admin-muted">Full profile links (https://…). Empty ones are hidden in the footer.</p>
        <div className="admin-grid-3">
          <Field label="Instagram">
            <input name="social.instagram" defaultValue={settings.social.instagram} placeholder="https://instagram.com/…" dir="ltr" />
          </Field>
          <Field label="Facebook">
            <input name="social.facebook" defaultValue={settings.social.facebook} placeholder="https://facebook.com/…" dir="ltr" />
          </Field>
          <Field label="TikTok">
            <input name="social.tiktok" defaultValue={settings.social.tiktok} placeholder="https://tiktok.com/@…" dir="ltr" />
          </Field>
        </div>

        <h2>Home page media</h2>
        <div className="admin-grid-2">
          <MediaField name="media.heroVideo" label="Banner video" kind="video" defaultValue={settings.media.heroVideo} folder="media" hint="MP4 (H.264), ideally under 10 MB." />
          <MediaField name="media.heroPoster" label="Image shown while the video loads" defaultValue={settings.media.heroPoster} folder="media" />
          <MediaField name="media.craftImage" label="Craftsmanship section image" defaultValue={settings.media.craftImage} folder="media" />
          <MediaField name="media.heritageImage" label="Heritage section image" defaultValue={settings.media.heritageImage} folder="media" />
        </div>

        <h2>Bespoke pricing</h2>
        <div className="admin-grid-3">
          <Field label="Base price (DZD)">
            <input name="basePriceDzd" type="number" min={1} defaultValue={settings.basePriceDzd} required />
          </Field>
          <Field label="Monogram (DZD)">
            <input name="monogramCostDzd" type="number" min={0} defaultValue={settings.monogramCostDzd} required />
          </Field>
        </div>

        <h2>Display currencies</h2>
        <p className="admin-muted">Prices shown in EUR/USD are converted from DZD with these rates. Orders are always charged in DZD.</p>
        <div className="admin-grid-3">
          <Field label="DZD for 1 EUR">
            <input name="rates.EUR" type="number" min={1} defaultValue={settings.rates.EUR} required />
          </Field>
          <Field label="DZD for 1 USD">
            <input name="rates.USD" type="number" min={1} defaultValue={settings.rates.USD} required />
          </Field>
        </div>
      </ActionForm>
    </div>
  );
}
