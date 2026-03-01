import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { LoginHistoryTable } from '@/components/LoginHistoryTable';
import { AlertsList } from '@/components/AlertsList';
import {
  getSession, clearSession, getLoginHistory, getAlerts, resolveAlert as resolveAlertStorage,
  type LoginRecord, type SecurityAlert,
} from '@/lib/storage';

export default function AuditPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUserEmail(session);
    setLoginHistory(getLoginHistory());
    setAlerts(getAlerts());
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleResolve = (id: string) => {
    resolveAlertStorage(id);
    setAlerts(getAlerts());
  };

  return (
    <AppLayout userEmail={userEmail} onLogout={handleLogout}>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete security event history</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">All Security Alerts</h2>
          <AlertsList alerts={alerts} onResolve={handleResolve} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Full Login History</h2>
          <LoginHistoryTable records={loginHistory} />
        </div>
      </div>
    </AppLayout>
  );
}
