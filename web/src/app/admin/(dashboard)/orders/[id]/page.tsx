import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orderItems, orders, ORDER_STATUSES } from '@/db/schema';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, StatusBadge, dateTime, dzd } from '@/components/admin/Fields';
import { WILAYAS } from '@/lib/wilayas';
import { retryCodpilot, updateOrder } from '../../actions';

export default async function OrderDetailPage({ params }: PageProps<'/admin/orders/[id]'>) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const wilaya = order.wilayaCode === 'intl' ? 'International' : WILAYAS.find(w => w.code === order.wilayaCode)?.name;

  return (
    <div className="admin-page">
      <p>
        <Link href="/admin/orders">← Orders</Link>
      </p>
      <h1>
        Order {order.id} <StatusBadge status={order.status} />
      </h1>
      <p className="admin-muted">
        Placed {dateTime(order.createdAt)} · last updated {dateTime(order.updatedAt)} · site language {order.locale.toUpperCase()}
      </p>

      <div className="admin-columns">
        <section className="admin-card">
          <h2>Items</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="num">Qty</th>
                <th className="num">Unit</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-item">
                      {item.image && <img src={item.image} alt="" />}
                      <div>
                        <strong>{item.name}</strong>
                        {item.specs?.labels && (
                          <div className="admin-muted">
                            {[item.specs.labels.color, item.specs.labels.material, item.specs.labels.pearls, item.specs.labels.chain].filter(Boolean).join(' · ')}
                          </div>
                        )}
                        {item.specs?.monogram && <div>Monogram: « {item.specs.monogram} »</div>}
                      </div>
                    </div>
                  </td>
                  <td className="num">{item.quantity}</td>
                  <td className="num">{dzd(item.unitPriceDzd)}</td>
                  <td className="num">{dzd(item.unitPriceDzd * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Shipping</td>
                <td className="num">{order.shippingDzd ? dzd(order.shippingDzd) : 'Free'}</td>
              </tr>
              <tr>
                <th colSpan={3}>Total</th>
                <th className="num">{dzd(order.totalDzd)}</th>
              </tr>
            </tfoot>
          </table>
          {order.giftMessage && (
            <p>
              <strong>Gift message:</strong> {order.giftMessage}
            </p>
          )}
        </section>

        <div>
          <section className="admin-card">
            <h2>Customer & delivery</h2>
            <dl className="admin-dl">
              <dt>Name</dt>
              <dd>
                {order.firstName} {order.lastName}
              </dd>
              <dt>Phone</dt>
              <dd dir="ltr">
                <a href={`tel:${order.phone.replace(/[^\d+]/g, '')}`}>{order.phone}</a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${order.email}`}>{order.email}</a>
              </dd>
              <dt>Wilaya</dt>
              <dd>
                {order.wilayaCode} {wilaya ? `– ${wilaya}` : ''}
              </dd>
              <dt>Address</dt>
              <dd>{order.address}</dd>
              <dt>Payment</dt>
              <dd>{{ cod: 'Cash on delivery', cib: 'CIB / Edahabia', card: 'International card' }[order.paymentMethod]}</dd>
              <dt>Account</dt>
              <dd>{order.userId ? 'Signed-in customer' : 'Guest checkout'}</dd>
            </dl>
          </section>

          <section className="admin-card">
            <h2>Update</h2>
            <ActionForm action={updateOrder} submitLabel="Save">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Status">
                <select name="status" defaultValue={order.status}>
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Internal note" hint="Only visible to the team.">
                <textarea name="adminNote" rows={3} defaultValue={order.adminNote ?? ''} maxLength={2000} />
              </Field>
            </ActionForm>
          </section>

          <section className="admin-card">
            <h2>CodPilot</h2>
            <p>
              <StatusBadge status={`cp-${order.codpilotStatus}`} /> {order.codpilotRef && <span className="admin-muted">ref {order.codpilotRef}</span>}
            </p>
            {order.codpilotError && <p className="admin-error">{order.codpilotError}</p>}
            {order.codpilotStatus !== 'sent' && (
              <ActionForm action={retryCodpilot} submitLabel="Send to CodPilot">
                <input type="hidden" name="id" value={order.id} />
              </ActionForm>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
