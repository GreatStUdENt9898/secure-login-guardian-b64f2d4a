// Storage utility for user data, login history, and alerts

export interface UserProfile {
  email: string;
  passwordHash: string;
  registeredAt: string;
  typicalLoginHour: number;
  typicalBrowser: string;
  typicalDevice: string;
  trustScore: number;
  failedAttempts: number;
  lastFailedAt: string | null;
  alertEmailSent: boolean;
}

export interface LoginRecord {
  id: string;
  email: string;
  timestamp: string;
  browser: string;
  device: string;
  loginHour: number;
  success: boolean;
  riskScore: number;
  anomalies: string[];
  action: 'allowed' | 'flagged' | 'blocked';
}

export interface SecurityAlert {
  id: string;
  email: string;
  timestamp: string;
  type: 'failed_attempts' | 'high_risk' | 'anomaly' | 'blocked';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

const USERS_KEY = 'aitd_users';
const LOGINS_KEY = 'aitd_logins';
const ALERTS_KEY = 'aitd_alerts';
const SESSION_KEY = 'aitd_session';

// Simple hash function (NOT for production - demo only)
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export function getUsers(): Record<string, UserProfile> {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveUser(email: string, profile: UserProfile) {
  const users = getUsers();
  users[email.toLowerCase()] = profile;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser(email: string): UserProfile | null {
  const users = getUsers();
  return users[email.toLowerCase()] || null;
}

export function getLoginHistory(): LoginRecord[] {
  const data = localStorage.getItem(LOGINS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addLoginRecord(record: LoginRecord) {
  const history = getLoginHistory();
  history.unshift(record);
  // Keep last 100 records
  localStorage.setItem(LOGINS_KEY, JSON.stringify(history.slice(0, 100)));
}

export function getAlerts(): SecurityAlert[] {
  const data = localStorage.getItem(ALERTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addAlert(alert: SecurityAlert) {
  const alerts = getAlerts();
  alerts.unshift(alert);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 50)));
}

export function resolveAlert(id: string) {
  const alerts = getAlerts();
  const updated = alerts.map(a => a.id === id ? { ...a, resolved: true } : a);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
}

export function setSession(email: string) {
  localStorage.setItem(SESSION_KEY, email);
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
