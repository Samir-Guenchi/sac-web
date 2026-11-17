import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { journalEntries, testimonials } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { GalleryField, MediaField } from '@/components/admin/MediaFields';
import { saveJournalEntry, saveTestimonial } from '../actions';

type Entry = typeof journalEntries.$inferSelect;
type Quote = typeof testimonials.$inferSelect;

export default async function ContentPage() {
  const [entries, quotes] = await Promise.all([
    db.select().from(journalEntries).orderBy(asc(journalEntries.sortOrder)),
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder))
  ]);

  return (
    <div className="admin-page">
      <h1>Journal & testimonials</h1>

      <section className="admin-card">
        <h2>Journal</h2>
        {entries.map(entry => (
          <details key={entry.id} className="admin-details">
            <summary>
              <strong>{entry.title.fr}</strong> {!entry.published && <span className="admin-badge admin-badge-cancelled">hidden</span>}
            </summary>
            <JournalForm entry={entry} />
          </details>
        ))}
        <details className="admin-details">
          <summary>
            <strong>+ Add an article</strong>
          </summary>
          <JournalForm entry={null} />
        </details>
      </section>

      <section className="admin-card">
        <h2>Testimonials</h2>
        {quotes.map(quote => (
          <details key={quote.id} className="admin-details">
            <summary>
              <strong>{quote.author}</strong> <span className="admin-muted">· {quote.product}</span>{' '}
              {!quote.published && <span className="admin-badge admin-badge-cancelled">hidden</span>}
            </summary>
            <TestimonialForm quote={quote} />
          </details>
        ))}
        <details className="admin-details">
          <summary>
            <strong>+ Add a testimonial</strong>
          </summary>
          <TestimonialForm quote={null} />
        </details>
      </section>
    </div>
  );
}

function JournalForm({ entry }: { entry: Entry | null }) {
  return (
    <ActionForm action={saveJournalEntry} submitLabel={entry ? 'Save' : 'Add'}>
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <LocalizedField name="title" label="Title" value={entry?.title} />
      <LocalizedField name="tag" label="Category" value={entry?.tag} />
      <LocalizedField name="excerpt" label="Excerpt" value={entry?.excerpt} multiline />
      <LocalizedField name="readTime" label="Reading time" value={entry?.readTime} />
      <LocalizedField name="date" label="Season / date" value={entry?.date} />
      <LocalizedField name="body" label="Full story (blank line = new paragraph, “## ” = subtitle, “- ” = list item)" value={entry?.body} multiline required={false} />
      <MediaField name="image" label="Cover image" defaultValue={entry?.image} folder="journal" />
      <GalleryField name="gallery" label="Story photos (shown in the article)" defaultValue={entry?.gallery ?? []} folder="journal" />
      <div className="admin-grid-3">
        <Field label="Display order">
          <input name="sortOrder" type="number" min={0} defaultValue={entry?.sortOrder ?? 99} />
        </Field>
        <label className="admin-check">
          <input type="checkbox" name="published" defaultChecked={entry?.published ?? true} /> Published
        </label>
      </div>
    </ActionForm>
  );
}

function TestimonialForm({ quote }: { quote: Quote | null }) {
  return (
    <ActionForm action={saveTestimonial} submitLabel={quote ? 'Save' : 'Add'}>
      {quote && <input type="hidden" name="id" value={quote.id} />}
      <LocalizedField name="quote" label="Quote" value={quote?.quote} multiline />
      <LocalizedField name="location" label="Location" value={quote?.location} />
      <div className="admin-grid-3">
        <Field label="Author">
          <input name="author" defaultValue={quote?.author ?? ''} required />
        </Field>
        <Field label="Product">
          <input name="product" defaultValue={quote?.product ?? ''} />
        </Field>
        <Field label="Display order">
          <input name="sortOrder" type="number" min={0} defaultValue={quote?.sortOrder ?? 99} />
        </Field>
        <label className="admin-check">
          <input type="checkbox" name="published" defaultChecked={quote?.published ?? true} /> Published
        </label>
      </div>
    </ActionForm>
  );
}
