import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { GalleryField } from '@/components/admin/MediaFields';
import { deleteProduct, saveProduct } from '../../actions';

/** /admin/products/new creates a product; any other id edits it. */
// Back-office page behind a login: reads URL data and renders on demand (no instant-navigation shell)
export const instant = false;

export default async function ProductEditPage({ params }: PageProps<'/admin/products/[id]'>) {
  const { id } = await params;
  const isNew = id === 'new';
  const [product, cats] = await Promise.all([
    isNew ? null : db.query.products.findFirst({ where: eq(products.id, id) }),
    db.select().from(categories).orderBy(asc(categories.sortOrder))
  ]);
  if (!isNew && !product) notFound();

  return (
    <div className="admin-page">
      <p>
        <Link href="/admin/products">← Products</Link>
        {product && (
          <>
            {' · '}
            <a href={`/fr/produits/${product.id}`} target="_blank" rel="noreferrer">
              View in shop ↗
            </a>
          </>
        )}
      </p>
      <h1>{product ? product.name : 'New product'}</h1>

      <ActionForm action={saveProduct} submitLabel={product ? 'Save product' : 'Create product'} className="admin-card">
        {product && <input type="hidden" name="existingId" value={product.id} />}
        <div className="admin-grid-3">
          <Field label="Name (not translated)">
            <input name="name" defaultValue={product?.name ?? ''} required maxLength={80} />
          </Field>
          {isNew && (
            <Field label="Id in URLs & orders" hint="Lowercase letters, numbers, dashes. Can't be changed later.">
              <input name="id" pattern="[a-z0-9\-]+" placeholder="e.g. rose-de-blida" />
            </Field>
          )}
          <Field label="Collection">
            <select name="categoryId" defaultValue={product?.categoryId ?? ''}>
              <option value="">— none —</option>
              {cats.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name.fr}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (DZD)">
            <input name="priceDzd" type="number" min={1} step={1} defaultValue={product?.priceDzd ?? ''} required />
          </Field>
          <Field label="Badge colour">
            <select name="badgeClass" defaultValue={product?.badgeClass ?? 'badge-champagne'}>
              <option value="badge-champagne">Champagne</option>
              <option value="badge-charcoal">Charcoal</option>
              <option value="badge-rose">Rose</option>
            </select>
          </Field>
          <Field label="Display order" hint="Lower numbers appear first.">
            <input name="sortOrder" type="number" min={0} step={1} defaultValue={product?.sortOrder ?? 0} />
          </Field>
          <label className="admin-check">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? false} /> Visible in the shop
          </label>
        </div>

        <GalleryField name="gallery" label="Photos (the first one is the main photo)" defaultValue={product?.gallery ?? []} folder="products" />

        <LocalizedField name="collection" label="Collection line on the card" value={product?.collection} />
        <LocalizedField name="tag" label="Badge text" value={product?.tag} />
        <LocalizedField name="shortDescription" label="Short description" value={product?.shortDescription} multiline />
        <LocalizedField name="fullDescription" label="Full description" value={product?.fullDescription} multiline />
        <LocalizedField name="materials" label="Materials" value={product?.materials} />
        <LocalizedField name="dimensions" label="Dimensions" value={product?.dimensions} />
        <LocalizedField name="hardware" label="Hardware" value={product?.hardware} />
      </ActionForm>

      {product && (
        <section className="admin-card admin-danger">
          <h2>Delete product</h2>
          <p className="admin-muted">Only possible if it was never ordered. To take it off the shop, untick “Visible in the shop” instead.</p>
          <ActionForm action={deleteProduct} submitLabel="Delete permanently">
            <input type="hidden" name="id" value={product.id} />
          </ActionForm>
        </section>
      )}
    </div>
  );
}
