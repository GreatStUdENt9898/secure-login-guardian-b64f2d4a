import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, LogIn, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import {
  getUser, saveUser, setSession, addLoginRecord, addAlert, generateId, simpleHash,
} from '@/lib/storage';
import { collectBehavioralData } from '@/lib/behaviorCollector';
import { detectAnomalies, calculateNewTrustScore } from '@/lib/anomalyDetection';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ action: string; anomalies: string[]; riskScore: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLastResult(null);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const user = getUser(trimmedEmail);

      if (!user) {
        toast({ title: 'Error', description: 'Account not found', variant: 'destructive' });
        return;
      }

      const behaviorData = collectBehavioralData();
      const passwordCorrect = simpleHash(password) === user.passwordHash;

      if (!passwordCorrect) {
        // Increment failed attempts
        const newFailed = user.failedAttempts + 1;
        saveUser(trimmedEmail, {
          ...user,
          failedAttempts: newFailed,
          lastFailedAt: new Date().toISOString(),
          trustScore: calculateNewTrustScore(user.trustScore, false, 50),
        });

        addLoginRecord({
          id: generateId(),
          email: trimmedEmail,
          timestamp: new Date().toISOString(),
          browser: behaviorData.browser,
          device: behaviorData.device,
          loginHour: behaviorData.loginHour,
          success: false,
          riskScore: 50,
          anomalies: ['Incorrect password'],
          action: 'blocked',
        });

        // Alert after 3 failed attempts
        if (newFailed >= 3 && !user.alertEmailSent) {
          addAlert({
            id: generateId(),
            email: trimmedEmail,
            timestamp: new Date().toISOString(),
            type: 'failed_attempts',
            message: `⚠️ 3+ failed login attempts detected. Alert email would be sent to ${trimmedEmail}. Account may be under attack.`,
            severity: 'critical',
            resolved: false,
          });

          saveUser(trimmedEmail, {
            ...user,
            failedAttempts: newFailed,
            lastFailedAt: new Date().toISOString(),
            trustScore: calculateNewTrustScore(user.trustScore, false, 50),
            alertEmailSent: true,
          });

          toast({
            title: '🚨 Security Alert',
            description: `3 failed attempts! Alert email sent to ${trimmedEmail}`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Wrong Password',
            description: `Attempt ${newFailed} of 3 before alert is triggered`,
            variant: 'destructive',
          });
        }

        setLastResult({ action: 'blocked', anomalies: ['Incorrect password'], riskScore: 50 });
        return;
      }

      // Password correct — run anomaly detection
      const result = detectAnomalies(behaviorData, user);
      setLastResult(result);

      const newTrust = calculateNewTrustScore(user.trustScore, true, result.riskScore);

      // Reset failed attempts on success
      saveUser(trimmedEmail, {
        ...user,
        failedAttempts: 0,
        alertEmailSent: false,
        trustScore: newTrust,
        typicalLoginHour: behaviorData.loginHour,
        typicalBrowser: behaviorData.browser,
        typicalDevice: behaviorData.device,
      });

      addLoginRecord({
        id: generateId(),
        email: trimmedEmail,
        timestamp: new Date().toISOString(),
        browser: behaviorData.browser,
        device: behaviorData.device,
        loginHour: behaviorData.loginHour,
        success: true,
        riskScore: result.riskScore,
        anomalies: result.anomalies,
        action: result.action,
      });

      if (result.anomalies.length > 0) {
        addAlert({
          id: generateId(),
          email: trimmedEmail,
          timestamp: new Date().toISOString(),
          type: result.action === 'blocked' ? 'blocked' : 'anomaly',
          message: `Anomalies detected: ${result.anomalies.join(', ')}`,
          severity: result.riskScore >= 70 ? 'high' : 'medium',
          resolved: false,
        });
      }

      if (result.action === 'blocked') {
        toast({
          title: 'Access Blocked',
          description: 'Suspicious activity detected. Login denied.',
          variant: 'destructive',
        });
        return;
      }

      if (result.action === 'flagged') {
        toast({
          title: '⚠️ Flagged Login',
          description: 'Some anomalies detected but access granted.',
        });
      }

      setSession(trimmedEmail);
      navigate('/dashboard');
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
            <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">Your behavior is your identity</p>
          </div>

          <form onSubmit={handleLogin} className="cyber-card space-y-4">
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
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Checking...' : 'Sign In'}
            </button>
          </form>

          {lastResult && (
            <div className={`mt-4 cyber-card animate-fade-in-up ${
              lastResult.action === 'blocked' ? 'border-destructive/50' :
              lastResult.action === 'flagged' ? 'border-warning/50' : 'border-success/50'
            } border`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-4 w-4 ${
                  lastResult.action === 'blocked' ? 'text-destructive' :
                  lastResult.action === 'flagged' ? 'text-warning' : 'text-success'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  Risk Score: <span className="font-mono">{lastResult.riskScore}</span>
                </span>
                <span className={`text-xs font-mono uppercase ml-auto ${
                  lastResult.action === 'blocked' ? 'text-destructive' :
                  lastResult.action === 'flagged' ? 'text-warning' : 'text-success'
                }`}>
                  {lastResult.action}
                </span>
              </div>
              {lastResult.anomalies.length > 0 && (
                <ul className="space-y-1">
                  {lastResult.anomalies.map((a, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-warning mt-0.5">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
