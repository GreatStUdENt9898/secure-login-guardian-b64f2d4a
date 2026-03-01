import { Link } from 'react-router-dom';
import { Shield, Lock, Activity, Bell } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

const Index = () => {
  return (
    <AppLayout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="max-w-2xl text-center animate-fade-in-up">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 cyber-glow">
            <Shield className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            AI Theft Detection
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Behavioral identity protection that analyzes your login patterns to detect unauthorized access.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
            <div className="cyber-card text-center py-4">
              <Lock className="h-5 w-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Smart Auth</span>
            </div>
            <div className="cyber-card text-center py-4">
              <Activity className="h-5 w-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Risk Scoring</span>
            </div>
            <div className="cyber-card text-center py-4">
              <Bell className="h-5 w-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Alert System</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
