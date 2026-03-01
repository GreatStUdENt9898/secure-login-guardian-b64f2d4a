// Rule-based anomaly detection engine

import type { UserProfile } from './storage';
import type { BehavioralData } from './behaviorCollector';

export interface AnomalyResult {
  anomalies: string[];
  riskScore: number;
  action: 'allowed' | 'flagged' | 'blocked';
}

interface RuleResult {
  triggered: boolean;
  name: string;
  weight: number;
}

// Rule 1: Unusual login hour (outside typical ±3 hours)
function checkLoginHour(data: BehavioralData, profile: UserProfile): RuleResult {
  const diff = Math.abs(data.loginHour - profile.typicalLoginHour);
  const hourDiff = Math.min(diff, 24 - diff);
  return {
    triggered: hourDiff > 3,
    name: `Unusual login time (${data.loginHour}:00 vs typical ${profile.typicalLoginHour}:00)`,
    weight: 25,
  };
}

// Rule 2: Different browser
function checkBrowser(data: BehavioralData, profile: UserProfile): RuleResult {
  return {
    triggered: data.browser !== profile.typicalBrowser,
    name: `Different browser detected (${data.browser} vs ${profile.typicalBrowser})`,
    weight: 20,
  };
}

// Rule 3: Different device type
function checkDevice(data: BehavioralData, profile: UserProfile): RuleResult {
  return {
    triggered: data.device !== profile.typicalDevice,
    name: `Different device type (${data.device} vs ${profile.typicalDevice})`,
    weight: 30,
  };
}

// Rule 4: Multiple failed attempts
function checkFailedAttempts(profile: UserProfile): RuleResult {
  return {
    triggered: profile.failedAttempts >= 2,
    name: `Multiple failed login attempts (${profile.failedAttempts} recent failures)`,
    weight: 35,
  };
}

// Rule 5: Late night login (midnight to 5am)
function checkLateNight(data: BehavioralData): RuleResult {
  return {
    triggered: data.loginHour >= 0 && data.loginHour < 5,
    name: 'Late night login attempt (12am–5am)',
    weight: 15,
  };
}

export function detectAnomalies(data: BehavioralData, profile: UserProfile): AnomalyResult {
  const rules: RuleResult[] = [
    checkLoginHour(data, profile),
    checkBrowser(data, profile),
    checkDevice(data, profile),
    checkFailedAttempts(profile),
    checkLateNight(data),
  ];

  const triggered = rules.filter(r => r.triggered);
  const anomalies = triggered.map(r => r.name);
  const rawScore = triggered.reduce((sum, r) => sum + r.weight, 0);

  // Factor in trust score (higher trust = lower risk)
  const trustFactor = 1 - (profile.trustScore / 100) * 0.3;
  const riskScore = Math.min(100, Math.round(rawScore * trustFactor));

  let action: AnomalyResult['action'] = 'allowed';
  if (riskScore >= 70) action = 'blocked';
  else if (riskScore >= 40) action = 'flagged';

  return { anomalies, riskScore, action };
}

// Update trust score based on login outcome
export function calculateNewTrustScore(currentScore: number, loginSuccess: boolean, riskScore: number): number {
  if (loginSuccess && riskScore < 30) {
    return Math.min(100, currentScore + 2);
  } else if (loginSuccess && riskScore >= 30) {
    return Math.max(0, currentScore - 1);
  } else {
    return Math.max(0, currentScore - 5);
  }
}
