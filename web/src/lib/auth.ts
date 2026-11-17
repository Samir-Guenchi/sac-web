import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, emailOTP } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { sendEmail } from './email';
import { isLocale, type Locale } from './i18n/config';
import { createTranslator, type Dictionary } from './i18n/translate';
import { signUpProblem } from './account-rules';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import('@/messages/fr.json').then(m => m.default as Dictionary),
  en: () => import('@/messages/en.json').then(m => m.default as Dictionary),
  ar: () => import('@/messages/ar.json').then(m => m.default as Dictionary)
};

async function emailTranslator(email: string) {
  const row = await db.query.user.findFirst({ columns: { locale: true }, where: eq(schema.user.email, email) });
  const locale: Locale = isLocale(row?.locale) ? row.locale : 'fr';
  return createTranslator(await dictionaries[locale]());
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  emailAndPassword: {
    enabled: true,
    // Accounts must confirm their email with the 6-digit code before signing in
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128
  },
  emailVerification: {
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      civility: { type: 'string', required: false, input: true },
      firstName: { type: 'string', required: false, input: true },
      lastName: { type: 'string', required: false, input: true },
      phone: { type: 'string', required: false, input: true },
      birthDate: { type: 'string', required: false, input: true },
      newsletterOptIn: { type: 'boolean', required: false, defaultValue: false, input: true },
      locale: { type: 'string', required: false, input: true }
    }
  },
  hooks: {
    // Same rules as the sign-up form, enforced on the server for direct API calls too
    before: createAuthMiddleware(async ctx => {
      if (ctx.path !== '/sign-up/email') return;
      const problem = signUpProblem(ctx.body as Record<string, unknown>);
      if (problem) throw new APIError('BAD_REQUEST', { message: problem, code: problem });
    })
  },
  rateLimit: {
    enabled: true,
    storage: 'database',
    modelName: 'rateLimit',
    window: 60,
    max: 30,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/email-otp/send-verification-otp': { window: 60, max: 3 },
      '/email-otp/verify-email': { window: 60, max: 10 }
    }
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      // Use the code-based flow (as on the original compte page) instead of links
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp }) {
        const t = await emailTranslator(email);
        await sendEmail({
          to: email,
          subject: t('auth.otpSubject'),
          text: t('auth.otpBody', { code: otp })
        });
      }
    }),
    admin({ defaultRole: 'user', adminRoles: ['admin'] }),
    // Lets Server Actions set auth cookies; must stay last
    nextCookies()
  ]
});

export type Session = typeof auth.$Infer.Session;
