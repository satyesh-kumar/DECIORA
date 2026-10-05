// DECIORA AI Decision Evaluation Service
// Evaluates commander decisions under uncertainty, incomplete information, and degraded communications.
// Core principle: Evaluates decision rationality at the MOMENT of execution, avoiding hindsight bias.
// Supports live Google Gemini API evaluation with seamless fallback to deterministic simulation logic.

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
  let decisionQuality = chosenDecision.qualityScore || 24;

  // 2. Information Usage Score (Max 20 pts)
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
  let decisionTimeScore = 13;
  if (decisionTimeSeconds < 6) {
    decisionTimeScore = 9;
  } else if (decisionTimeSeconds <= 18) {
    decisionTimeScore = 15;
  } else if (decisionTimeSeconds <= 26) {
    decisionTimeScore = 12;
  } else {
    decisionTimeScore = 8;
  }

  // 5. Communication Protocol & Degradation Adaptation (Max 15 pts)
  let commScore = 13;
  if (communicationState.level >= 3) {
    if (chosenDecision.id.includes('recon') || chosenDecision.id.includes('fallback') || chosenDecision.id.includes('triangulate')) {
      commScore = 15;
    } else if (chosenDecision.id.includes('advance') || chosenDecision.id.includes('checkpoint')) {
      commScore = 9;
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

  if (strengths.length === 0) {
    strengths.push('Maintained command presence and selected a coherent course of action.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Consider testing alternative pacing under severe signal severance scenarios.');
  }

  let recommendation = '';
  if (totalScore >= 85) {
    recommendation = 'Exemplary command execution. Continue practicing rapid multi-source triangulation to further compress response time while keeping risk minimal.';
  } else if (totalScore >= 75) {
    recommendation = 'Sound decision-making under uncertainty. To achieve top-tier readiness, prioritize active verification (drones/sensors) before maneuvering ground detachments.';
  } else {
    recommendation = 'Avoid reactive maneuvers during signal degradation. Emphasize pre-planned contingency protocols and verify conflicting intelligence before committing personnel.';
  }

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
    isLiveGemini: false,
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

// Live Gemini API Evaluator with seamless fallback
export async function evaluateDecisionAsync(params) {
  const localEval = evaluateDecision(params);
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiKey || !geminiKey.trim()) {
    return localEval;
  }

  try {
    const prompt = `You are a military decision-making simulation evaluator for PS26048 (abstract fictional training simulator, no real-world combat/targeting instructions).
Evaluate the commander's decision under degraded communications based on the information available at that exact moment without hindsight bias.

Scenario: "${params.scenario?.title}" (${params.scenario?.objective})
Available Reports: ${JSON.stringify(params.availableInformation.map(r => ({ source: r.source, message: r.message, confidence: r.confidence, delay: r.delaySeconds })))}
Communication State: Signal ${params.communicationState?.signalPercent}%, Status: ${params.communicationState?.statusText}
Commander Decision: "${params.decision?.title}" - ${params.decision?.description}
Decision Latency: ${params.decisionTimeSeconds?.toFixed(1) || 15} seconds

Respond ONLY with valid JSON with this exact schema:
{
  "summary": "1-2 sentence assessment",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["area for improvement 1"],
  "recommendation": "1 actionable command recommendation"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          ...localEval,
          isLiveGemini: true,
          summary: parsed.summary || localEval.summary,
          strengths: parsed.strengths?.length ? parsed.strengths : localEval.strengths,
          weaknesses: parsed.weaknesses?.length ? parsed.weaknesses : localEval.weaknesses,
          recommendation: parsed.recommendation || localEval.recommendation
        };
      }
    }
  } catch (err) {
    // If network fails or quota is exhausted, seamlessly fallback to local evaluation
  }

  return localEval;
}
