import { Shield, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  userEmail?: string | null;
  onLogout?: () => void;
}

export function AppLayout({ children, userEmail, onLogout }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background cyber-grid-bg">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center cyber-glow">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">
              AI Theft Detection
            </span>
          </Link>

          {userEmail && (
            <nav className="flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/audit"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/audit'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Audit Log
              </Link>
              <div className="ml-2 pl-2 border-l border-border flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
