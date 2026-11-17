import Link from 'next/link';
import { and, desc, eq, like, or } from 'drizzle-orm';
import { db } from '@/db';
import { orders, ORDER_STATUSES, type OrderStatus } from '@/db/schema';
import { StatusBadge, dateTime, dzd } from '@/components/admin/Fields';

export default async function OrdersPage({ searchParams }: PageProps<'/admin/orders'>) {
  const params = await searchParams;
  const status = ORDER_STATUSES.includes(params.status as OrderStatus) ? (params.status as OrderStatus) : null;
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 80) : '';

  const rows = await db.query.orders.findMany({
    // and() ignores undefined conditions
    where: and(
      status ? eq(orders.status, status) : undefined,
      q ? or(like(orders.id, `%${q}%`), like(orders.email, `%${q}%`), like(orders.phone, `%${q}%`), like(orders.lastName, `%${q}%`)) : undefined
    ),
    orderBy: desc(orders.createdAt),
    limit: 200
  });

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      <form className="admin-filters" method="get">
        <select name="status" defaultValue={status ?? ''}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <input type="search" name="q" placeholder="Order, email, phone or name" defaultValue={q} />
        <button type="submit" className="admin-btn">
          Filter
        </button>
      </form>

      <section className="admin-card">
        {rows.length === 0 ? (
          <p className="admin-muted">No orders match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Wilaya</th>
                <th>Payment</th>
                <th>Status</th>
                <th>CodPilot</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(order => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>{dateTime(order.createdAt)}</td>
                  <td>
                    {order.firstName} {order.lastName}
                  </td>
                  <td dir="ltr">{order.phone}</td>
                  <td>{order.wilayaCode}</td>
                  <td>{order.paymentMethod.toUpperCase()}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <StatusBadge status={`cp-${order.codpilotStatus}`} />
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
