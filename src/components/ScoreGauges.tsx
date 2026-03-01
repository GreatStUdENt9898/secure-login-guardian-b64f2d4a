import { Shield, Activity } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  label?: string;
}

export function RiskGauge({ score, label = 'Risk Score' }: RiskGaugeProps) {
  const color = score >= 70 ? 'text-destructive' : score >= 40 ? 'text-warning' : 'text-success';
  const glowClass = score >= 70 ? 'cyber-glow-destructive' : score >= 40 ? 'cyber-glow-warning' : 'cyber-glow-accent';

  return (
    <div className={`cyber-card text-center ${glowClass}`}>
      <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
        <Activity className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`text-5xl font-mono font-bold ${color} transition-colors duration-500`}>
        {score}
      </div>
      <div className="mt-2 text-xs text-muted-foreground font-mono">/ 100</div>
      <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            score >= 70 ? 'bg-destructive' : score >= 40 ? 'bg-warning' : 'bg-success'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface TrustScoreProps {
  score: number;
}

export function TrustScore({ score }: TrustScoreProps) {
  const color = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-destructive';

  return (
    <div className="cyber-card cyber-glow text-center">
      <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Trust Score</span>
      </div>
      <div className={`text-5xl font-mono font-bold ${color} transition-colors duration-500`}>
        {score}
      </div>
      <div className="mt-2 text-xs text-muted-foreground font-mono">/ 100</div>
      <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
