import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/admin.css';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--admin-font' });

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Zaphira Admin' },
  robots: { index: false, follow: false }
};

/** Root layout for the back office (separate from the storefront's [lang] root layout). */
export default function AdminRootLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
