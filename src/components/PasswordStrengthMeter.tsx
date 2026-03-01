import { checkPasswordStrength } from '@/lib/passwordStrength';
import { Shield, Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthColors = {
  weak: 'bg-destructive',
  fair: 'bg-warning',
  good: 'bg-primary',
  strong: 'bg-success',
};

const strengthLabels = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { rules, strength, metCount, total } = checkPasswordStrength(password);
  const percentage = (metCount / total) * 100;

  if (!password) return null;

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          Password Strength
        </div>
        <span className={`text-sm font-mono font-semibold ${
          strength === 'strong' ? 'text-success' :
          strength === 'good' ? 'text-primary' :
          strength === 'fair' ? 'text-warning' : 'text-destructive'
        }`}>
          {strengthLabels[strength]}
        </span>
      </div>

      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${strengthColors[strength]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <ul className="space-y-1">
        {rules.map((rule) => (
          <li key={rule.label} className="flex items-center gap-2 text-xs">
            {rule.met ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={rule.met ? 'text-foreground' : 'text-muted-foreground'}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
