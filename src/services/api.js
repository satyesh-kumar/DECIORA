// DECIORA API Service with automatic Seamless Fallback to Mock Data Engine
import { SCENARIOS, DEMO_USERS, COHORT_TRAINEES, INITIAL_TRAINING_HISTORY, INSTRUCTOR_ANALYTICS, LEADERBOARD_DATA } from './mockData';
import { evaluateDecision, evaluateDecisionAsync } from './aiEvaluator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage keys for persistent demo sessions
const STORAGE_KEYS = {
  USER: 'deciora_current_user',
  TOKEN: 'deciora_auth_token',
  HISTORY: 'deciora_training_history',
  AAR_RESPONSES: 'deciora_aar_reflections'
};

// Safe localStorage helpers
function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const api = {
  // Authentication
  async login(email, password, role = 'commander') {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.TOKEN, data.token);
        setStored(STORAGE_KEYS.USER, data.user);
        return data;
      }
    } catch {
      // Backend not running -> fallback to demo user
    }

    // Fallback login
    const user = DEMO_USERS[role] || DEMO_USERS.commander;
    const token = `demo_jwt_token_${user.id}_${Date.now()}`;
    setStored(STORAGE_KEYS.TOKEN, token);
    setStored(STORAGE_KEYS.USER, user);
    return { token, user, isDemo: true };
  },

  async loginAsDemo(role = 'commander') {
    const user = DEMO_USERS[role] || DEMO_USERS.commander;
    const token = `demo_jwt_token_${user.id}_${Date.now()}`;
    setStored(STORAGE_KEYS.TOKEN, token);
    setStored(STORAGE_KEYS.USER, user);
    return { token, user, isDemo: true };
  },

  getCurrentUser() {
    return getStored(STORAGE_KEYS.USER, DEMO_USERS.commander);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Scenarios
  async getScenarios() {
    try {
      const res = await fetch(`${API_BASE}/scenarios`);
      if (res.ok) return await res.json();
    } catch {}
    return SCENARIOS;
  },

  async getScenarioById(id) {
    try {
      const res = await fetch(`${API_BASE}/scenarios/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
  },

  // Training Sessions & Decision Submission
  async submitDecision({ scenarioId, decisionId, decisionTimeSeconds, availableInformation, communicationState }) {
    const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
    const decision = scenario.decisions.find(d => d.id === decisionId) || scenario.decisions[0];

    const evaluation = await evaluateDecisionAsync({
      scenario,
      decision,
      decisionTimeSeconds,
      availableInformation,
      communicationState
    });

    const sessionRecord = {
      id: `sess_${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: evaluation.score,
      decisionTimeSec: parseFloat(decisionTimeSeconds.toFixed(1)),
      commLevelMax: `Level ${communicationState.level || 3} (${communicationState.statusText || 'Unstable'})`,
      decisionChosen: decision.title,
      outcome: evaluation.chosenDecision.outcomeNarrative,
      outcomeQuality: evaluation.chosenDecision.outcomeType,
      scoreBreakdown: evaluation.breakdown,
      evaluation
    };

    // Store in history
    const history = getStored(STORAGE_KEYS.HISTORY, INITIAL_TRAINING_HISTORY);
    const updatedHistory = [sessionRecord, ...history];
    setStored(STORAGE_KEYS.HISTORY, updatedHistory);

    try {
      const token = getStored(STORAGE_KEYS.TOKEN);
      await fetch(`${API_BASE}/training/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionRecord)
      });
    } catch {}

    return sessionRecord;
  },

  async getTrainingHistory() {
    try {
      const res = await fetch(`${API_BASE}/training/history`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored(STORAGE_KEYS.HISTORY, INITIAL_TRAINING_HISTORY);
  },

  async getSessionById(sessionId) {
    const history = await this.getTrainingHistory();
    return history.find(s => s.id === sessionId) || history[0];
  },

  // AAR Reflections
  async saveAARReflection(sessionId, reflectionData) {
    const allReflections = getStored(STORAGE_KEYS.AAR_RESPONSES, {});
    allReflections[sessionId] = {
      ...reflectionData,
      submittedAt: new Date().toISOString()
    };
    setStored(STORAGE_KEYS.AAR_RESPONSES, allReflections);

    try {
      await fetch(`${API_BASE}/aar/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reflectionData)
      });
    } catch {}
    return allReflections[sessionId];
  },

  async getAARReflection(sessionId) {
    const allReflections = getStored(STORAGE_KEYS.AAR_RESPONSES, {});
    return allReflections[sessionId] || null;
  },

  // Instructor Analytics & Cohort
  async getInstructorAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      if (res.ok) return await res.json();
    } catch {}
    return INSTRUCTOR_ANALYTICS;
  },

  async getTrainees() {
    try {
      const res = await fetch(`${API_BASE}/users/trainees`);
      if (res.ok) return await res.json();
    } catch {}
    return COHORT_TRAINEES;
  },

  async getLeaderboard() {
    try {
      const res = await fetch(`${API_BASE}/users/leaderboard`);
      if (res.ok) return await res.json();
    } catch {}
    return LEADERBOARD_DATA;
  }
};
