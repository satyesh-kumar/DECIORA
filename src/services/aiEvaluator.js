// DECIORA AI Decision Evaluation Service
// Evaluates commander decisions under uncertainty, incomplete information, and degraded communications.
// Core principle: Evaluates decision rationality at the MOMENT of execution, avoiding hindsight bias.

export function evaluateDecision({
  scenario,
  decision,
  decisionTimeSeconds,
  availableInformation = [],
  communicationState = {},
  unviewedReportsCount = 0
}) {
  const chosenDecision = scenario.decisions.find(d => d.id === decision.id) || decision;

  // 1. Base Decision Quality Score (Max 30 pts)
  // Reflects inherent rationality based on information known at that instant
  let decisionQuality = chosenDecision.qualityScore || 24;

  // 2. Information Usage Score (Max 20 pts)
  // Evaluates whether commander digested conflicting reports vs jumped to conclusions
  let infoUsage = 18;
  const conflictPresent = availableInformation.some(r => r.isConflict);
  if (conflictPresent) {
    if (chosenDecision.id.includes('recon') || chosenDecision.id.includes('triangulate')) {
      infoUsage = 20; // Actively sought resolution to contradiction
    } else if (chosenDecision.id.includes('checkpoint') || chosenDecision.id.includes('south')) {
      infoUsage = 12; // Acted unilaterally on one report while ignoring the other
    } else {
      infoUsage = 16;
    }
  }
  if (unviewedReportsCount > 0) {
    infoUsage = Math.max(8, infoUsage - (unviewedReportsCount * 3));
  }

  // 3. Risk Management Score (Max 20 pts)
  let riskMgmt = 18;
  if (chosenDecision.riskProfile.toLowerCase().includes('high') || chosenDecision.riskProfile.toLowerCase().includes('reckless')) {
    riskMgmt = 11;
  } else if (chosenDecision.riskProfile.toLowerCase().includes('low') || chosenDecision.riskProfile.toLowerCase().includes('prudence')) {
    riskMgmt = 20;
  } else if (chosenDecision.riskProfile.toLowerCase().includes('conservative')) {
    riskMgmt = 17;
  }

  // 4. Decision Time Score (Max 15 pts)
  // Optimal window is 10s - 25s. Under 5s is rash; over deadline incurs penalty.
  let decisionTimeScore = 13;
  if (decisionTimeSeconds < 6) {
    decisionTimeScore = 9; // Impulsive decision before digesting telemetry
  } else if (decisionTimeSeconds <= 18) {
    decisionTimeScore = 15; // Optimal cognitive pacing
  } else if (decisionTimeSeconds <= 26) {
    decisionTimeScore = 12;
  } else {
    decisionTimeScore = 8; // Excessive delay under operational countdown
  }

  // 5. Communication Protocol & Degradation Adaptation (Max 15 pts)
  let commScore = 13;
  if (communicationState.level >= 3) {
    // Under degraded comms, verifying or using fallback protocols is rewarded
    if (chosenDecision.id.includes('recon') || chosenDecision.id.includes('fallback') || chosenDecision.id.includes('triangulate')) {
      commScore = 15;
    } else if (chosenDecision.id.includes('advance') || chosenDecision.id.includes('checkpoint')) {
      commScore = 9; // Dispatched mobile elements without secure radio link
    }
  }

  // Total Score Calculation (Max 100)
  const totalScore = Math.min(100, Math.max(40, Math.round(
    decisionQuality + infoUsage + riskMgmt + decisionTimeScore + commScore
  )));

  // Generate Qualitative AI Analysis
  const strengths = [];
  const weaknesses = [];

  if (infoUsage >= 17) {
    strengths.push('Demonstrated high situational awareness by cross-referencing multi-source sensor reports.');
  }
  if (riskMgmt >= 17) {
    strengths.push('Maintained disciplined force protection without reckless exposure under unknown contact parameters.');
  }
  if (decisionTimeScore >= 13) {
    strengths.push(`Paced decision deliberately (${decisionTimeSeconds.toFixed(1)}s), balancing urgency with cognitive verification.`);
  }
  if (commScore >= 14) {
    strengths.push('Adapted command directive appropriately to degraded communication envelope.');
  }

  if (decisionTimeSeconds < 6) {
    weaknesses.push('Decision committed too rapidly (<6s); did not allow sufficient transmission window for delayed telemetry.');
  } else if (decisionTimeSeconds > 26) {
    weaknesses.push('Command hesitation under countdown increased vulnerability window.');
  }
  if (infoUsage < 15) {
    weaknesses.push('Over-relied on single sensor feed without accounting for logged conflicting pings.');
  }
  if (riskMgmt < 15) {
    weaknesses.push('Committed assets directly into unverified sector without reconnaissance buffer.');
  }

  // Default fallbacks if empty
  if (strengths.length === 0) {
    strengths.push('Maintained command presence and selected a coherent course of action.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Consider testing alternative pacing under severe signal severance scenarios.');
  }

  // Tactical Recommendation
  let recommendation = '';
  if (totalScore >= 85) {
    recommendation = 'Exemplary command execution. Continue practicing rapid multi-source triangulation to further compress response time while keeping risk minimal.';
  } else if (totalScore >= 75) {
    recommendation = 'Sound decision-making under uncertainty. To achieve top-tier readiness, prioritize active verification (drones/sensors) before maneuvering ground detachments.';
  } else {
    recommendation = 'Avoid reactive maneuvers during signal degradation. Emphasize pre-planned contingency protocols and verify conflicting intelligence before committing personnel.';
  }

  // Narrative summary based on outcome vs rationality
  let summary = '';
  if (chosenDecision.outcomeType === 'success') {
    summary = `The decision to "${chosenDecision.title}" was highly information-aware and proactive. It directly addressed sensor ambiguity while shielding personnel from blind contact.`;
  } else if (chosenDecision.outcomeType === 'defensible_suboptimal') {
    summary = `The decision was defensible given the conflicting intelligence available at T+${Math.round(decisionTimeSeconds)}s. While it successfully averted immediate peril, passive posture surrendered observation initiative.`;
  } else {
    summary = `The decision accepted excessive tactical risk under degraded communications. Committing to an unverified report without reconnaissance resulted in operational disorientation.`;
  }

  return {
    score: totalScore,
    breakdown: {
      decisionQuality: Math.round(decisionQuality),
      decisionQualityMax: 30,
      informationUsage: Math.round(infoUsage),
      informationUsageMax: 20,
      riskManagement: Math.round(riskMgmt),
      riskManagementMax: 20,
      decisionTime: Math.round(decisionTimeScore),
      decisionTimeMax: 15,
      communication: Math.round(commScore),
      communicationMax: 15
    },
    summary,
    strengths,
    weaknesses,
    recommendation,
    chosenDecision,
    decisionTimeSeconds,
    outcomeNarrative: chosenDecision.outcomeNarrative,
    outcomeType: chosenDecision.outcomeType
  };
}
