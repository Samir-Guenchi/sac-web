import Link from 'next/link';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/compte/SignOutButton';
import { requireAdmin } from '@/lib/session';

const NAV = [
  ['/admin', 'Overview'],
  ['/admin/orders', 'Orders'],
  ['/admin/products', 'Products'],
  ['/admin/options', 'Bespoke options'],
  ['/admin/customers', 'Customers'],
  ['/admin/content', 'Journal & testimonials'],
  ['/admin/settings', 'Settings']
] as const;

export default function DashboardLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" />
        </Link>
        <nav aria-label="Admin">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="admin-nav-link">
              {label}
            </Link>
          ))}
        </nav>
        <a href="/" className="admin-nav-link admin-nav-muted" target="_blank" rel="noreferrer">
          View shop ↗
        </a>
      </aside>
      <div className="admin-main">
        {/* Every admin page checks the session and role on the server before rendering */}
        <Suspense fallback={<p className="admin-muted">Loading…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </div>
    </div>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="admin-topbar">
        <span className="admin-muted">{admin.email}</span>
        <SignOutButton label="Sign out" className="admin-btn" redirectTo="/admin/login" />
      </header>
      {children}
    </>
  );
}
