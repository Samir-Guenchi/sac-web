import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { savePage } from '../actions';

type Page = typeof pages.$inferSelect;

export default async function PagesAdmin() {
  const rows = await db.select().from(pages).orderBy(asc(pages.sortOrder));
  return (
    <div className="admin-page">
      <h1>Pages</h1>
      <p className="admin-muted">
        Delivery, FAQ, legal pages… shown at /fr/pages/&lt;address&gt; and linked from the footer. Formatting: an empty line starts a new paragraph, a line starting with “## ” is a heading, lines starting with “- ” are a bullet list.
      </p>
      <section className="admin-card">
        {rows.map(page => (
          <details key={page.slug} className="admin-details">
            <summary>
              <strong>{page.title.fr}</strong> <span className="admin-muted">· /pages/{page.slug}</span>
              {page.body.fr.includes('[À compléter') && <span className="admin-badge admin-badge-pending">to complete</span>}
              {!page.published && <span className="admin-badge admin-badge-cancelled">hidden</span>}
            </summary>
            <PageForm page={page} />
          </details>
        ))}
        <details className="admin-details">
          <summary>
            <strong>+ Add a page</strong>
          </summary>
          <PageForm page={null} />
        </details>
      </section>
    </div>
  );
}

function PageForm({ page }: { page: Page | null }) {
  return (
    <ActionForm action={savePage} submitLabel={page ? 'Save' : 'Add'}>
      {page && <input type="hidden" name="existingSlug" value={page.slug} />}
      <div className="admin-grid-3">
        {!page && (
          <Field label="Address" hint="Lowercase, e.g. boutiques">
            <input name="slug" pattern="[a-z0-9\-]+" />
          </Field>
        )}
        <Field label="Order in the menu">
          <input name="sortOrder" type="number" min={0} defaultValue={page?.sortOrder ?? 99} />
        </Field>
        <label className="admin-check">
          <input type="checkbox" name="published" defaultChecked={page?.published ?? true} /> Published
        </label>
      </div>
      <LocalizedField name="title" label="Title" value={page?.title} />
      <LocalizedField name="body" label="Content" value={page?.body} multiline />
    </ActionForm>
  );
}
