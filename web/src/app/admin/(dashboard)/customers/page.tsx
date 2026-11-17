import { count, desc, eq, sql, sum } from 'drizzle-orm';
import { db } from '@/db';
import { orders, user } from '@/db/schema';
import { dateTime, dzd } from '@/components/admin/Fields';

export default async function CustomersPage() {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      verified: user.emailVerified,
      newsletter: user.newsletterOptIn,
      locale: user.locale,
      createdAt: user.createdAt,
      orderCount: count(orders.id),
      spent: sum(orders.totalDzd)
    })
    .from(user)
    .leftJoin(orders, eq(orders.userId, user.id))
    .where(sql`${user.role} is null or ${user.role} != 'admin'`)
    .groupBy(user.id)
    .orderBy(desc(user.createdAt))
    .limit(500);

  return (
    <div className="admin-page">
      <h1>Customers</h1>
      <p className="admin-muted">Accounts created on the shop. Guest orders are listed under Orders only.</p>
      <section className="admin-card">
        {rows.length === 0 ? (
          <p className="admin-muted">No customer accounts yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Verified</th>
                <th>Newsletter</th>
                <th className="num">Orders</th>
                <th className="num">Spent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td dir="ltr">{row.phone}</td>
                  <td>{dateTime(row.createdAt)}</td>
                  <td>{row.verified ? 'Yes' : 'No'}</td>
                  <td>{row.newsletter ? 'Yes' : '—'}</td>
                  <td className="num">{row.orderCount}</td>
                  <td className="num">{dzd(Number(row.spent ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
