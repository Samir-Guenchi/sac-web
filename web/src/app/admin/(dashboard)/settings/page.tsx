import { loadCatalog } from '@/lib/catalog';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field } from '@/components/admin/Fields';
import { saveSettings } from '../actions';

export default async function SettingsPage() {
  const { settings } = await loadCatalog();
  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <ActionForm action={saveSettings} submitLabel="Save settings" className="admin-card">
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

        <h2>Customer service (bag page)</h2>
        <p className="admin-muted">Leave “dial number” empty to show the text without making it a clickable phone link.</p>
        <div className="admin-grid-2">
          <Field label="WhatsApp — shown as">
            <input name="whatsapp.display" defaultValue={settings.contact.whatsapp.display} />
          </Field>
          <Field label="WhatsApp — dial number" hint="e.g. +213550000000">
            <input name="whatsapp.tel" defaultValue={settings.contact.whatsapp.tel ?? ''} dir="ltr" />
          </Field>
          <Field label="Phone — shown as">
            <input name="phone.display" defaultValue={settings.contact.phone.display} />
          </Field>
          <Field label="Phone — dial number">
            <input name="phone.tel" defaultValue={settings.contact.phone.tel ?? ''} dir="ltr" />
          </Field>
        </div>
      </ActionForm>
    </div>
  );
}
