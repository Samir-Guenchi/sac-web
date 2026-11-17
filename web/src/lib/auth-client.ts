'use client';

import { adminClient, emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/** Browser SDK: calls the rate-limited /api/auth endpoints. */
export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    adminClient(),
    // Mirrors user.additionalFields in lib/auth.ts (declared here to keep server code out of the bundle)
    inferAdditionalFields({
      user: {
        civility: { type: 'string', required: false },
        firstName: { type: 'string', required: false },
        lastName: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        birthDate: { type: 'string', required: false },
        newsletterOptIn: { type: 'boolean', required: false },
        locale: { type: 'string', required: false }
      }
    })
  ]
});
