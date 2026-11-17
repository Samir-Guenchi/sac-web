import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, LocalizedField } from '@/components/admin/Fields';
import { saveProduct } from '../../actions';

/** /admin/products/new creates a product; any other id edits it. */
export default async function ProductEditPage({ params }: PageProps<'/admin/products/[id]'>) {
  const { id } = await params;
  const isNew = id === 'new';
  const product = isNew ? null : await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!isNew && !product) notFound();

  return (
    <div className="admin-page">
      <p>
        <Link href="/admin/products">← Products</Link>
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
              <input name="id" pattern="[a-z0-9-]+" placeholder="e.g. pearl-ivory" />
            </Field>
          )}
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
          <Field label="Display order">
            <input name="sortOrder" type="number" min={0} step={1} defaultValue={product?.sortOrder ?? 0} />
          </Field>
          <label className="admin-check">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Visible in the shop
          </label>
        </div>

        <LocalizedField name="collection" label="Collection" value={product?.collection} />
        <LocalizedField name="tag" label="Badge text" value={product?.tag} />
        <LocalizedField name="shortDescription" label="Short description (search)" value={product?.shortDescription} multiline />
        <LocalizedField name="fullDescription" label="Full description (quick view)" value={product?.fullDescription} multiline />
        <LocalizedField name="materials" label="Materials" value={product?.materials} />
        <LocalizedField name="dimensions" label="Dimensions" value={product?.dimensions} />
        <LocalizedField name="hardware" label="Hardware" value={product?.hardware} />

        <fieldset className="admin-localized">
          <legend>Images</legend>
          {product?.primaryImage && <img src={product.primaryImage} alt="" className="admin-preview" />}
          <div className="admin-grid-2">
            <Field label="Upload a new main image" hint="JPEG, PNG, WebP or AVIF, up to 8 MB.">
              <input type="file" name="primaryImageFile" accept="image/jpeg,image/png,image/webp,image/avif" />
            </Field>
            <Field label="…or main image URL">
              <input name="primaryImage" defaultValue={product?.primaryImage ?? ''} />
            </Field>
            <Field label="Gallery (one image URL per line)">
              <textarea name="gallery" rows={4} defaultValue={product?.gallery.join('\n') ?? ''} />
            </Field>
            <Field label="Add a gallery image">
              <input type="file" name="galleryFile" accept="image/jpeg,image/png,image/webp,image/avif" />
            </Field>
          </div>
        </fieldset>
      </ActionForm>
    </div>
  );
}
