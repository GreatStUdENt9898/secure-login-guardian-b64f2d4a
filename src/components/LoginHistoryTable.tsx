import { type LoginRecord } from '@/lib/storage';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface LoginHistoryTableProps {
  records: LoginRecord[];
}

export function LoginHistoryTable({ records }: LoginHistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="cyber-card text-center text-muted-foreground py-8">
        <p className="text-sm">No login history yet</p>
      </div>
    );
  }

  return (
    <div className="cyber-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">Time</th>
              <th className="text-left p-3 text-muted-foreground font-medium">User</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Browser</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Device</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Risk</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-mono text-xs">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
                <td className="p-3 text-foreground">{record.email}</td>
                <td className="p-3 text-muted-foreground">{record.browser}</td>
                <td className="p-3 text-muted-foreground">{record.device}</td>
                <td className="p-3">
                  <span className={`font-mono font-semibold ${
                    record.riskScore >= 70 ? 'text-destructive' :
                    record.riskScore >= 40 ? 'text-warning' : 'text-success'
                  }`}>
                    {record.riskScore}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    {record.action === 'allowed' && <CheckCircle className="h-4 w-4 text-success" />}
                    {record.action === 'flagged' && <AlertTriangle className="h-4 w-4 text-warning" />}
                    {record.action === 'blocked' && <XCircle className="h-4 w-4 text-destructive" />}
                    <span className={`text-xs font-medium capitalize ${
                      record.action === 'allowed' ? 'text-success' :
                      record.action === 'flagged' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {record.action}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
