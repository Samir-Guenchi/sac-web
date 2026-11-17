import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { products } from '@/db/schema';
import { dzd } from '@/components/admin/Fields';

export default async function ProductsPage() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name));
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          Add product
        </Link>
      </div>
      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Collection (FR)</th>
              <th className="num">Price</th>
              <th>Order</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(product => (
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
                <td>{product.collection.fr}</td>
                <td className="num">{dzd(product.priceDzd)}</td>
                <td>{product.sortOrder}</td>
                <td>{product.active ? 'Yes' : 'Hidden'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
