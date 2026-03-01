import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, AlertTriangle, Activity } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { RiskGauge, TrustScore } from '@/components/ScoreGauges';
import { LoginHistoryTable } from '@/components/LoginHistoryTable';
import { AlertsList } from '@/components/AlertsList';
import {
  getSession, clearSession, getUser, getLoginHistory, getAlerts, resolveAlert as resolveAlertStorage,
  type LoginRecord, type SecurityAlert,
} from '@/lib/storage';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [trustScore, setTrustScore] = useState(70);
  const [lastRisk, setLastRisk] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUserEmail(session);

    const user = getUser(session);
    if (user) setTrustScore(user.trustScore);

    const history = getLoginHistory();
    setLoginHistory(history.filter(h => h.email === session));

    const lastLogin = history.find(h => h.email === session && h.success);
    if (lastLogin) setLastRisk(lastLogin.riskScore);

    setAlerts(getAlerts().filter(a => a.email === session));
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleResolve = (id: string) => {
    resolveAlertStorage(id);
    setAlerts(getAlerts().filter(a => a.email === userEmail));
  };

  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
  const totalLogins = loginHistory.length;
  const successRate = totalLogins > 0
    ? Math.round((loginHistory.filter(l => l.success).length / totalLogins) * 100)
    : 100;

  return (
    <AppLayout userEmail={userEmail} onLogout={handleLogout}>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your account's behavioral security</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="cyber-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total Logins</span>
            </div>
            <div className="text-2xl font-mono font-bold text-foreground">{totalLogins}</div>
          </div>
          <div className="cyber-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Success Rate</span>
            </div>
            <div className="text-2xl font-mono font-bold text-success">{successRate}%</div>
          </div>
          <div className="cyber-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Active Alerts</span>
            </div>
            <div className={`text-2xl font-mono font-bold ${unresolvedAlerts > 0 ? 'text-destructive' : 'text-foreground'}`}>
              {unresolvedAlerts}
            </div>
          </div>
          <div className="cyber-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Security Level</span>
            </div>
            <div className={`text-2xl font-mono font-bold ${
              trustScore >= 70 ? 'text-success' : trustScore >= 40 ? 'text-warning' : 'text-destructive'
            }`}>
              {trustScore >= 70 ? 'Good' : trustScore >= 40 ? 'Fair' : 'Low'}
            </div>
          </div>
        </div>

        {/* Gauges */}
        <div className="grid md:grid-cols-2 gap-4">
          <TrustScore score={trustScore} />
          <RiskGauge score={lastRisk} label="Last Login Risk" />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Security Alerts</h2>
            <AlertsList alerts={alerts.slice(0, 5)} onResolve={handleResolve} />
          </div>
        )}

        {/* Login History */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Logins</h2>
          <LoginHistoryTable records={loginHistory.slice(0, 10)} />
        </div>
      </div>
    </AppLayout>
  );
}
