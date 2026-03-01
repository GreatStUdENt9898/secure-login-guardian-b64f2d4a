// Collects behavioral and contextual data during login

export interface BehavioralData {
  loginHour: number;
  browser: string;
  device: string;
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  language: string;
  platform: string;
}

export function collectBehavioralData(): BehavioralData {
  const now = new Date();
  const ua = navigator.userAgent;

  return {
    loginHour: now.getHours(),
    browser: detectBrowser(ua),
    device: detectDevice(ua),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform || 'Unknown',
  };
}

function detectBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

function detectDevice(ua: string): string {
  if (/Mobi|Android/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}
