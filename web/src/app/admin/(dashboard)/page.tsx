import Link from 'next/link';
import { and, count, desc, gte, inArray, ne, sql, sum } from 'drizzle-orm';
import { db } from '@/db';
import { newsletterSubscribers, orders, user } from '@/db/schema';
import { codpilotEnabled } from '@/lib/codpilot';
import { StatusBadge, dateTime, dzd } from '@/components/admin/Fields';

export default async function AdminOverview() {
  const [[pending], [revenue], [customers], [subscribers], recent] = await Promise.all([
    db.select({ n: count() }).from(orders).where(inArray(orders.status, ['pending', 'confirmed'])),
    db
      .select({ total: sum(orders.totalDzd), n: count() })
      .from(orders)
      .where(and(gte(orders.createdAt, sql`(unixepoch() - 30 * 86400) * 1000`), ne(orders.status, 'cancelled'))),
    db.select({ n: count() }).from(user).where(sql`${user.role} is null or ${user.role} != 'admin'`),
    db.select({ n: count() }).from(newsletterSubscribers),
    db.query.orders.findMany({ orderBy: desc(orders.createdAt), limit: 8 })
  ]);

  return (
    <div className="admin-page">
      <h1>Overview</h1>
      {!codpilotEnabled() && (
        <p className="admin-notice">
          CodPilot hand-off is not configured yet. Orders are saved here; set <code>CODPILOT_API_URL</code> and <code>CODPILOT_API_KEY</code> to forward them.
        </p>
      )}
      <div className="admin-kpis">
        <Kpi label="Orders to handle" value={String(pending.n)} href="/admin/orders?status=pending" />
        <Kpi label="Revenue, last 30 days" value={dzd(Number(revenue.total ?? 0))} />
        <Kpi label="Orders, last 30 days" value={String(revenue.n)} />
        <Kpi label="Customer accounts" value={String(customers.n)} href="/admin/customers" />
        <Kpi label="Newsletter subscribers" value={String(subscribers.n)} />
      </div>

      <section className="admin-card">
        <h2>Latest orders</h2>
        {recent.length === 0 ? (
          <p className="admin-muted">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(order => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>{dateTime(order.createdAt)}</td>
                  <td>
                    {order.firstName} {order.lastName}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="num">{dzd(order.totalDzd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="admin-kpi-value">{value}</span>
      <span className="admin-kpi-label">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="admin-kpi">
      {body}
    </Link>
  ) : (
    <div className="admin-kpi">{body}</div>
  );
}
