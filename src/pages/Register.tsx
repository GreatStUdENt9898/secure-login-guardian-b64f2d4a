import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { AppLayout } from '@/components/AppLayout';
import { saveUser, getUser, simpleHash, generateId } from '@/lib/storage';
import { collectBehavioralData } from '@/lib/behaviorCollector';
import { checkPasswordStrength } from '@/lib/passwordStrength';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail || !password) {
        toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
        return;
      }

      if (getUser(trimmedEmail)) {
        toast({ title: 'Error', description: 'Account already exists', variant: 'destructive' });
        return;
      }

      const { strength } = checkPasswordStrength(password);
      if (strength === 'weak') {
        toast({ title: 'Weak Password', description: 'Please create a stronger password', variant: 'destructive' });
        return;
      }

      if (password !== confirmPassword) {
        toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
        return;
      }

      const behaviorData = collectBehavioralData();

      saveUser(trimmedEmail, {
        email: trimmedEmail,
        passwordHash: simpleHash(password),
        registeredAt: new Date().toISOString(),
        typicalLoginHour: behaviorData.loginHour,
        typicalBrowser: behaviorData.browser,
        typicalDevice: behaviorData.device,
        trustScore: 70,
        failedAttempts: 0,
        lastFailedAt: null,
        alertEmailSent: false,
      });

      toast({ title: 'Account Created', description: 'You can now sign in' });
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 cyber-glow">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Register with behavioral security protection</p>
          </div>

          <form onSubmit={handleRegister} className="cyber-card space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
