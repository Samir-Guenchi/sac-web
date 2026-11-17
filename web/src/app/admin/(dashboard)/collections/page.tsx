import { asc, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { MediaField } from '@/components/admin/MediaFields';
import { saveCategory } from '../actions';

type Category = typeof categories.$inferSelect;

export default async function CollectionsPage() {
  const rows = await db
    .select({ category: categories, productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  return (
    <div className="admin-page">
      <h1>Collections</h1>
      <p className="admin-muted">Collections appear in the “Maroquinerie” menu and on /collections. Assign products to a collection on each product page.</p>
      <section className="admin-card">
        {rows.map(({ category, productCount }) => (
          <details key={category.id} className="admin-details">
            <summary>
              <strong>{category.name.fr}</strong> <span className="admin-muted">· {category.id} · {productCount} products</span>
              {!category.active && <span className="admin-badge admin-badge-cancelled">hidden</span>}
            </summary>
            <CategoryForm category={category} />
          </details>
        ))}
        <details className="admin-details">
          <summary>
            <strong>+ Add a collection</strong>
          </summary>
          <CategoryForm category={null} />
        </details>
      </section>
    </div>
  );
}

function CategoryForm({ category }: { category: Category | null }) {
  return (
    <ActionForm action={saveCategory} submitLabel={category ? 'Save' : 'Add'}>
      {category && <input type="hidden" name="existingId" value={category.id} />}
      <div className="admin-grid-3">
        {!category && (
          <Field label="Id (address)" hint="Lowercase, e.g. ete-2027. Can't be changed later.">
            <input name="id" pattern="[a-z0-9\-]+" />
          </Field>
        )}
        <Field label="Display order">
          <input name="sortOrder" type="number" min={0} defaultValue={category?.sortOrder ?? 99} />
        </Field>
        <label className="admin-check">
          <input type="checkbox" name="active" defaultChecked={category?.active ?? true} /> Shown in the shop
        </label>
      </div>
      <LocalizedField name="name" label="Name" value={category?.name} />
      <LocalizedField name="description" label="Description (collection page)" value={category?.description} multiline required={false} />
      <MediaField name="image" label="Menu image (optional)" defaultValue={category?.image} folder="collections" />
    </ActionForm>
  );
}
