import 'server-only';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends a transactional email through Resend. Without RESEND_API_KEY (local
 * development) the message is printed to the server console instead.
 */
export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  if (!resend) {
    console.info(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n${text}\n`);
    return;
  }
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error('EMAIL_FROM must be set when RESEND_API_KEY is configured');
  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) throw new Error(`Email delivery failed: ${error.message}`);
}
