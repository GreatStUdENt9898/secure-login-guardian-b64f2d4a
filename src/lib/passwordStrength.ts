export function checkPasswordStrength(password: string) {
  const rules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const metCount = rules.filter(r => r.met).length;
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (metCount >= 5) strength = 'strong';
  else if (metCount >= 4) strength = 'good';
  else if (metCount >= 3) strength = 'fair';

  return { rules, strength, metCount, total: rules.length };
}
