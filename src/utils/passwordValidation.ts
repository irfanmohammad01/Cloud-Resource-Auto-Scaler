export type PasswordRuleKey =
  | 'minLength'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special';

export type PasswordRuleResult = Record<PasswordRuleKey, boolean>;

/**
 * Validate password rules.
 *
 * Keep this pure and cheap so it can run on every keystroke.
 */
export function validatePasswordRules(password: string): PasswordRuleResult {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    // "Special character" = anything that is NOT a letter or number.
    special: /[^A-Za-z0-9]/.test(password),
  };
}

/**
 * Convenience boolean for "all rules satisfied".
 */
export function isPasswordValid(password: string): boolean {
  const rules = validatePasswordRules(password);
  return Object.values(rules).every(Boolean);
}

