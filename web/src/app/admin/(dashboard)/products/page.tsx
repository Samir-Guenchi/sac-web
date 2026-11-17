import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { dzd } from '@/components/admin/Fields';
import { setProductVisibility } from '../actions';

// Back-office page behind a login: reads URL data and renders on demand (no instant-navigation shell)
export const instant = false;

export default async function ProductsPage({ searchParams }: PageProps<'/admin/products'>) {
  const params = await searchParams;
  const view = typeof params.view === 'string' ? params.view : 'all';
  const collection = typeof params.collection === 'string' ? params.collection : '';
  const [rows, cats] = await Promise.all([
    db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name)),
    db.select().from(categories).orderBy(asc(categories.sortOrder))
  ]);
  const catName = (id: string | null) => cats.find(c => c.id === id)?.name.fr ?? '—';
  const filtered = rows.filter(p => (view === 'visible' ? p.active : view === 'hidden' ? !p.active : true) && (!collection || p.categoryId === collection));
  const hiddenCount = rows.filter(p => !p.active).length;

  const href = (next: { view?: string; collection?: string }) => {
    const q = new URLSearchParams({ view: next.view ?? view, ...(next.collection ?? collection ? { collection: next.collection ?? collection } : {}) });
    return `/admin/products?${q}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          Add product
        </Link>
      </div>
      {hiddenCount > 0 && (
        <p className="admin-notice">
          {hiddenCount} product{hiddenCount > 1 ? 's are' : ' is'} hidden from the shop. Imported drafts stay hidden until you replace their photos with your own and click “Show”.
        </p>
      )}
      <div className="admin-filters">
        {[
          ['all', `All (${rows.length})`],
          ['visible', `Visible (${rows.length - hiddenCount})`],
          ['hidden', `Hidden (${hiddenCount})`]
        ].map(([key, label]) => (
          <Link key={key} href={href({ view: key })} className={`admin-btn${view === key ? ' admin-btn-primary' : ''}`}>
            {label}
          </Link>
        ))}
        <span className="admin-filters-sep" />
        <Link href={href({ collection: '' })} className={`admin-btn${!collection ? ' admin-btn-primary' : ''}`}>
          All collections
        </Link>
        {cats.map(c => (
          <Link key={c.id} href={href({ collection: c.id })} className={`admin-btn${collection === c.id ? ' admin-btn-primary' : ''}`}>
            {c.name.fr}
          </Link>
        ))}
      </div>
      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Collection</th>
              <th className="num">Price</th>
              <th>Photos</th>
              <th>In shop</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id}>
                <td>
                  <Link href={`/admin/products/${product.id}`} className="admin-item">
                    <img src={product.primaryImage} alt="" />
                    <span>
                      <strong>{product.name}</strong>
                      <span className="admin-muted"> · {product.id}</span>
                    </span>
                  </Link>
                </td>
                <td>{catName(product.categoryId)}</td>
                <td className="num">{dzd(product.priceDzd)}</td>
                <td>{product.gallery.length}</td>
                <td>
                  <ActionForm action={setProductVisibility} submitLabel={product.active ? 'Hide' : 'Show'} className="admin-inline-form">
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="active" value={product.active ? '0' : '1'} />
                    <span className={`admin-badge ${product.active ? 'admin-badge-delivered' : 'admin-badge-cancelled'}`}>{product.active ? 'visible' : 'hidden'}</span>
                  </ActionForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
