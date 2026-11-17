import type { Metadata } from 'next';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function AdminLoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-card admin-login-card">
        <img src="/assets/images/branding/logo-zaphira.svg" alt="ZAPHIRA" className="admin-login-logo" />
        <h1>Back office</h1>
        <AdminLoginForm />
      </div>
    </main>
  );
}
