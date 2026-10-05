import { useEffect } from 'react';

/**
 * Custom hook to dynamically maintain the browser tab title and favicon state
 * Provides immediate situational awareness in the browser tab bar
 */
export function useDynamicTitle(currentPage, scenario = null, isRunning = false, commLevel = 1) {
  useEffect(() => {
    let baseTitle = 'DECIORA | Military Decision Training Simulator';

    switch (currentPage) {
      case 'landing':
        baseTitle = 'DECIORA | Strategic Command Simulator — PS26048';
        break;
      case 'dashboard':
        baseTitle = 'Command Console | DECIORA Operational Readiness';
        break;
      case 'scenarios':
        baseTitle = 'Mission Catalog | DECIORA Tactical Operations';
        break;
      case 'simulator':
        if (scenario) {
          const status = !isRunning ? '[PAUSED]' : commLevel >= 4 ? '🔴 [BLACKOUT]' : commLevel >= 2 ? '⚠️ [DEGRADED]' : '🟢 [ACTIVE]';
          baseTitle = `${status} ${scenario.title} | DECIORA`;
        } else {
          baseTitle = 'Live Simulator | DECIORA';
        }
        break;
      case 'results':
        baseTitle = 'Mission Debrief & Scorecard | DECIORA';
        break;
      case 'aar':
        baseTitle = 'After Action Review (AAR) | DECIORA';
        break;
      case 'instructor':
        baseTitle = 'Instructor Command Center | DECIORA Cohort Analytics';
        break;
      case 'leaderboard':
        baseTitle = 'Command Leaderboard & Rankings | DECIORA';
        break;
      case 'history':
        baseTitle = 'Training Dossier & Logs | DECIORA';
        break;
      case 'login':
        baseTitle = 'Security Clearance Sign-In | DECIORA';
        break;
      default:
        baseTitle = 'DECIORA | Decision-Making Under Uncertainty';
    }

    document.title = baseTitle;

    // Out-of-focus tab notification
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = `[STANDBY] DECIORA Command Terminal`;
      } else {
        document.title = baseTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPage, scenario, isRunning, commLevel]);
}
