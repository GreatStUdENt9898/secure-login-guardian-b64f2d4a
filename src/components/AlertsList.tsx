import { type SecurityAlert } from '@/lib/storage';
import { AlertTriangle, ShieldAlert, ShieldX, Info, CheckCircle } from 'lucide-react';

interface AlertsListProps {
  alerts: SecurityAlert[];
  onResolve?: (id: string) => void;
}

const severityConfig = {
  low: { icon: Info, color: 'text-muted-foreground', border: 'border-border' },
  medium: { icon: AlertTriangle, color: 'text-warning', border: 'border-warning/30' },
  high: { icon: ShieldAlert, color: 'text-destructive', border: 'border-destructive/30' },
  critical: { icon: ShieldX, color: 'text-destructive', border: 'border-destructive/50' },
};

export function AlertsList({ alerts, onResolve }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="cyber-card text-center text-muted-foreground py-8">
        <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No security alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        const Icon = config.icon;
        return (
          <div
            key={alert.id}
            className={`cyber-card flex items-start gap-3 border ${config.border} ${alert.resolved ? 'opacity-50' : ''}`}
          >
            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono uppercase font-semibold ${config.color}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-foreground mt-1">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.email}</p>
            </div>
            {!alert.resolved && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 flex-shrink-0"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Resolve
              </button>
            )}
            {alert.resolved && (
              <span className="text-xs text-success flex items-center gap-1 flex-shrink-0">
                <CheckCircle className="h-3.5 w-3.5" />
                Resolved
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
