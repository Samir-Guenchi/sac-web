/** Account rules shared by the sign-up form (live checklist) and the auth server hook. */

export const PASSWORD_RULES = {
  len: (pw: string) => pw.length >= 10,
  num: (pw: string) => /\d/.test(pw),
  maj: (pw: string) => /[A-Z]/.test(pw),
  min: (pw: string) => /[a-z]/.test(pw),
  spe: (pw: string) => /[^A-Za-z0-9]/.test(pw)
} as const;

export const passwordOk = (pw: string) => Object.values(PASSWORD_RULES).every(rule => rule(pw));

export const PHONE_PATTERN = /^\+?[\d\s().-]{8,20}$/;

export function isAdult(birthDate: string, today = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const eighteenth = new Date(Date.UTC(year + 18, month - 1, day));
  return eighteenth.getTime() <= today.getTime();
}

/** Returns an error code for an invalid sign-up body, or null when it's acceptable. */
export function signUpProblem(body: Record<string, unknown>): string | null {
  const str = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');
  if (!passwordOk(str('password'))) return 'PASSWORD_POLICY';
  if (!str('firstName') || !str('lastName')) return 'NAME_REQUIRED';
  if (!PHONE_PATTERN.test(str('phone'))) return 'PHONE_INVALID';
  if (str('birthDate') && !isAdult(str('birthDate'))) return 'UNDERAGE';
  return null;
}
