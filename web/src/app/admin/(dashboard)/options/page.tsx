import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { customizerOptions, OPTION_KINDS, type OptionKind } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { MediaField } from '@/components/admin/MediaFields';
import { saveOption } from '../actions';

const TITLES: Record<OptionKind, string> = { color: 'Colours', material: 'Materials', pearls: 'Pearls', chain: 'Chains' };

type OptionRow = typeof customizerOptions.$inferSelect;

export default async function OptionsPage() {
  const rows = await db.select().from(customizerOptions).orderBy(asc(customizerOptions.sortOrder));
  return (
    <div className="admin-page">
      <h1>Bespoke options</h1>
      <p className="admin-muted">
        The bespoke price is the base price (Settings) plus each chosen option’s price change, plus the monogram cost. Hidden options disappear from the customizer; existing orders keep their details.
      </p>
      {OPTION_KINDS.map(kind => (
        <section className="admin-card" key={kind}>
          <h2>{TITLES[kind]}</h2>
          {rows
            .filter(row => row.kind === kind)
            .map(option => (
              <details key={option.id} className="admin-details">
                <summary>
                  {kind === 'color' && option.hex && <span className="admin-swatch" style={{ background: option.hex }} />}
                  <strong>{option.name.fr}</strong> <span className="admin-muted">· {option.id}</span>
                  <span className="admin-muted"> · +{option.priceModifierDzd.toLocaleString('en-US')} DZD</span>
                  {!option.active && <span className="admin-badge admin-badge-cancelled">hidden</span>}
                </summary>
                <OptionForm kind={kind} option={option} />
              </details>
            ))}
          <details className="admin-details">
            <summary>
              <strong>+ Add {TITLES[kind].toLowerCase().replace(/s$/, '')}</strong>
            </summary>
            <OptionForm kind={kind} option={null} />
          </details>
        </section>
      ))}
    </div>
  );
}

function OptionForm({ kind, option }: { kind: OptionKind; option: OptionRow | null }) {
  return (
    <ActionForm action={saveOption} submitLabel={option ? 'Save' : 'Add'}>
      <input type="hidden" name="kind" value={kind} />
      {option && <input type="hidden" name="existingId" value={option.id} />}
      <div className="admin-grid-3">
        {!option && (
          <Field label="Id" hint="Lowercase, e.g. emerald. Can't be changed later.">
            <input name="id" pattern="[a-z0-9\-]+" />
          </Field>
        )}
        <Field label="Price change (DZD)">
          <input name="priceModifierDzd" type="number" min={0} step={100} defaultValue={option?.priceModifierDzd ?? 0} required />
        </Field>
        <Field label="Display order">
          <input name="sortOrder" type="number" min={0} defaultValue={option?.sortOrder ?? 99} />
        </Field>
        {kind === 'color' && (
          <Field label="Swatch colour">
            <input name="hex" type="color" defaultValue={option?.hex ?? '#F7F2E8'} />
          </Field>
        )}
        <label className="admin-check">
          <input type="checkbox" name="active" defaultChecked={option?.active ?? true} /> Available
        </label>
      </div>
      <LocalizedField name="name" label="Name" value={option?.name} />
      {kind !== 'color' && <LocalizedField name="description" label="Description (tooltip)" value={option?.description} required={false} />}
      {kind === 'color' && <MediaField name="imageUrl" label="Preview image in the bespoke studio" defaultValue={option?.imageUrl} folder="options" />}
    </ActionForm>
  );
}
