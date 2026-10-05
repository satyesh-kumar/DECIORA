// DECIORA Mock Data & Scenario Repository
// Fictional, abstract tactical scenarios adhering strictly to safety constraints (no real-world warfare tactics or targets)

export const SCENARIOS = [
  {
    id: 'strategic-bridge',
    code: 'SCEN-01',
    title: 'Strategic Bridge',
    sector: 'Sector Delta-9 (River Kestrel)',
    difficulty: 'Medium',
    durationSeconds: 120,
    decisionWindowSeconds: 30,
    communicationProfile: {
      initialLevel: 1, // Normal
      degradesAt: 25,
      degradedLevel: 2, // Mild
      conflictAt: 45,
      conflictLevel: 3, // Moderate
      blackoutAt: 65,
      recoveryAt: 95,
      summary: 'Moderate Degradation & Intermittent Relay Delay'
    },
    objective: 'Determine the safest and most effective response to uncertain movement reported near Sector Bridge Alpha.',
    context: 'Forward patrol Vanguard is stationed 1.5km south of River Kestrel. Multiple conflicting radar and observer pings report convoy activity, but radio relay quality is rapidly deteriorating due to atmospheric magnetic interference.',
    mapConfig: {
      center: [52.12, 13.40],
      zoom: 14,
      fictionalGrid: 'SECTOR-D9',
      features: [
        { id: 'hq', name: 'Command HQ', type: 'hq', pos: [52.108, 13.385], label: 'HQ Echo' },
        { id: 'bridge', name: 'Sector Bridge Alpha', type: 'bridge', pos: [52.125, 13.405], label: 'Bridge Alpha' },
        { id: 'village', name: 'Village Orin (Neutral)', type: 'village', pos: [52.135, 13.390], label: 'Village Orin' },
        { id: 'checkpoint', name: 'Checkpoint Bravo', type: 'checkpoint', pos: [52.118, 13.418], label: 'CP Bravo' },
        { id: 'forest', name: 'Kestrel Ridge (Woodland)', type: 'forest', pos: [52.130, 13.425], label: 'Ridge Woods' },
        { id: 'relay', name: 'Signal Relay Alpha-4', type: 'relay', pos: [52.112, 13.410], label: 'Relay Tower A4' },
        { id: 'team-vanguard', name: 'Team Vanguard', type: 'unit', pos: [52.115, 13.398], label: 'Vanguard [●]' },
        { id: 'recon-falcon', name: 'UAV Falcon', type: 'recon', pos: [52.128, 13.395], label: 'Recon Falcon [◉]' },
        { id: 'uncertainty-zone', name: 'Uncertainty Zone ?', type: 'uncertainty', pos: [52.127, 13.412], radius: 600, label: 'Unverified Contact Area' }
      ]
    },
    events: [
      {
        time: 5,
        type: 'report',
        source: 'INTEL COMMS',
        category: 'intel',
        message: 'Preliminary satellite sensor logs indicate possible logistics movement 2.2km North of Bridge Alpha.',
        confidence: 72,
        delaySeconds: 2,
        reliability: 'Moderate',
        isConflict: false
      },
      {
        time: 25,
        type: 'comm_status',
        level: 2,
        signalPercent: 74,
        statusText: 'COMMUNICATION DEGRADED',
        description: 'Magnetic storm interference detected on Relay Tower A4. Expected transmission delays: 8-15 seconds.'
      },
      {
        time: 38,
        type: 'report',
        source: 'GROUND PATROL VANGUARD',
        category: 'ground',
        message: 'Visual observation reports dust plumes moving EAST along Kestrel Ridge flank. Unable to confirm vehicle types.',
        confidence: 64,
        delaySeconds: 12,
        reliability: 'Field Visual',
        isConflict: false
      },
      {
        time: 50,
        type: 'report',
        source: 'AIR SENSOR RAVEN',
        category: 'air',
        message: 'Thermal scanning detects clustered heat signatures heading NORTH directly towards Bridge Alpha approach.',
        confidence: 58,
        delaySeconds: 18,
        reliability: 'Sensor Only',
        isConflict: true,
        conflictWith: 'GROUND PATROL VANGUARD'
      },
      {
        time: 65,
        type: 'comm_status',
        level: 3,
        signalPercent: 42,
        statusText: 'COMMUNICATION UNSTABLE',
        description: 'Packet drop on primary downlink. High latency. RECON FALCON telemetry unreachable.'
      },
      {
        time: 75,
        type: 'decision_trigger',
        deadlineSeconds: 30,
        prompt: 'Critical decision required: Resolve the conflicting intel and formulate response before convoy reaches critical junction.'
      }
    ],
    decisions: [
      {
        id: 'opt_monitor',
        code: 'A',
        title: 'Continue Monitoring Situation',
        description: 'Hold current posture and wait for telemetry stabilization before committing any assets.',
        tacticalTradeoff: 'Avoids premature engagement or misdirected maneuvers, but risks losing observation initiative.',
        qualityScore: 22, // Out of 30
        riskProfile: 'Moderate passive risk',
        outcomeType: 'ambiguous',
        outcomeNarrative: 'The situation remained contained, but the convoy slipped into blind terrain unverified. High ambiguity persisted.'
      },
      {
        id: 'opt_recon',
        code: 'B',
        title: 'Request UAV Falcon Reconnaissance',
        description: 'Dispatch high-resolution optical drone toward the Eastern Ridge to verify ground visual report before moving personnel.',
        tacticalTradeoff: 'Resolves conflicting East vs North reports safely without exposing ground patrol Vanguard to potential ambush.',
        qualityScore: 29, // Out of 30 (Best decision given available uncertainty)
        riskProfile: 'Low tactical risk / High information leverage',
        outcomeType: 'success',
        outcomeNarrative: 'UAV Falcon confirmed neutral civil transport diverted East to avoid road obstruction. Conflicting air thermal ping was ambient pipeline heat. Zero casualties, complete sector clarity achieved.'
      },
      {
        id: 'opt_checkpoint',
        code: 'C',
        title: 'Advance Vanguard to Checkpoint Bravo',
        description: 'Deploy ground team immediately to intercept the bridge approach and establish active roadblock.',
        tacticalTradeoff: 'Aggressive posture based on single unverified air thermal ping. Exposes Vanguard if convoy flanked eastward.',
        qualityScore: 14, // Out of 30
        riskProfile: 'High operational risk under degraded communications',
        outcomeType: 'unfavorable',
        outcomeNarrative: 'Vanguard arrived at empty checkpoint while flank remained unmonitored. Team was exposed without radio cover.'
      },
      {
        id: 'opt_hold',
        code: 'D',
        title: 'Hold Defensive Perimeter & Fortify',
        description: 'Order Vanguard to dig in at current position and establish defensive sector watch.',
        tacticalTradeoff: 'Guarantees force protection, but leaves Bridge Alpha completely unobserved.',
        qualityScore: 20, // Defensible given uncertainty, but lacks proactivity
        riskProfile: 'Conservative defensive bias',
        outcomeType: 'defensible_suboptimal',
        outcomeNarrative: 'Team suffered zero risk, but command failed to resolve the intelligence discrepancy.'
      }
    ]
  },
  {
    id: 'communication-blackout',
    code: 'SCEN-02',
    title: 'Communication Blackout',
    sector: 'Sector Echo-4 (Salt Flats)',
    difficulty: 'Hard',
    durationSeconds: 110,
    decisionWindowSeconds: 25,
    communicationProfile: {
      initialLevel: 2, // Mild
      degradesAt: 20,
      degradedLevel: 4, // Severe Blackout
      conflictAt: 35,
      conflictLevel: 4,
      blackoutAt: 40,
      recoveryAt: 90,
      summary: 'Total Signal Severance (Electronic Interference)'
    },
    objective: 'Safely manage an isolated forward scout team when primary and backup radio frequencies suffer total electronic blackout.',
    context: 'Deep-recon squad Specter is surveying an anomalous radar contact in remote Sector Echo-4. A severe solar flux and electronic barrier severs satellite uplink at T+25.',
    mapConfig: {
      center: [48.85, 2.35],
      zoom: 14,
      fictionalGrid: 'SECTOR-E4',
      features: [
        { id: 'hq', name: 'Command Base Alpha', type: 'hq', pos: [48.84, 2.32], label: 'Base Alpha' },
        { id: 'relay', name: 'Relay Outpost 7', type: 'relay', pos: [48.855, 2.34], label: 'Relay 7 [OFFLINE]' },
        { id: 'specter', name: 'Patrol Specter', type: 'unit', pos: [48.865, 2.36], label: 'Specter [SILENT]' },
        { id: 'rally-point', name: 'Contingency Rally Point Omega', type: 'checkpoint', pos: [48.848, 2.335], label: 'Rally Omega' },
        { id: 'uncertainty', name: 'Blackout Deadzone', type: 'uncertainty', pos: [48.86, 2.355], radius: 800, label: 'No Signal Zone' }
      ]
    },
    events: [
      {
        time: 5,
        type: 'report',
        source: 'SPECTER TEAM',
        category: 'ground',
        message: 'Approaching sector survey marker 4. Signal strength fluctuating rapidly.',
        confidence: 81,
        delaySeconds: 1,
        reliability: 'Direct Feed',
        isConflict: false
      },
      {
        time: 20,
        type: 'comm_status',
        level: 4,
        signalPercent: 12,
        statusText: 'COMMUNICATION CRITICAL',
        description: 'Total carrier loss across VHF/UHF tactical bands. Downlink packet reception: 0%.'
      },
      {
        time: 32,
        type: 'report',
        source: 'SIGINT SENSOR',
        category: 'intel',
        message: '[CORRUPTED PACKET] ...contact bearing 180... high amplitude spike... carrier lost...',
        confidence: 32,
        delaySeconds: 14,
        reliability: 'Corrupted Fragment',
        isConflict: true
      },
      {
        time: 48,
        type: 'comm_status',
        level: 4,
        signalPercent: 0,
        statusText: 'COMMUNICATION BLACKOUT',
        description: 'COMPLETE RADIO SILENCE. Ground Team OFFLINE. Recon OFFLINE.'
      },
      {
        time: 60,
        type: 'decision_trigger',
        deadlineSeconds: 25,
        prompt: 'Total blackout persists. What command directive do you broadcast via emergency pulse beacon?'
      }
    ],
    decisions: [
      {
        id: 'opt_fallback',
        code: 'A',
        title: 'Broadcast Contingency Rally Protocol',
        description: 'Transmit pre-authorized emergency signal directing Specter to break contact and fall back to Rally Point Omega.',
        tacticalTradeoff: 'Protects isolated personnel under total blindness by relying on pre-briefed standing orders.',
        qualityScore: 28,
        riskProfile: 'High prudence / Low exposure',
        outcomeType: 'success',
        outcomeNarrative: 'Specter executed pre-briefed fallback to Rally Point Omega safely. Signal restored 40 minutes later with 100% asset preservation.'
      },
      {
        id: 'opt_dispatch_courier',
        code: 'B',
        title: 'Dispatch Second Scout Team to Re-establish Contact',
        description: 'Send a secondary patrol into the deadzone to locate Specter physically.',
        tacticalTradeoff: 'Risks sending a second friendly element into the same electronic deadzone without telemetry.',
        qualityScore: 16,
        riskProfile: 'Compounded uncertainty risk',
        outcomeType: 'unfavorable',
        outcomeNarrative: 'Secondary team also suffered blackout. Both units lost coordination and caused confusion.'
      },
      {
        id: 'opt_wait_carrier',
        code: 'C',
        title: 'Maintain Position & Await Orbital Uplink Window',
        description: 'Hold all movements and monitor frequencies until next scheduled satellite sweep in 15 minutes.',
        tacticalTradeoff: 'Avoids chaotic reaction, but leaves Specter unguided if facing immediate hazard.',
        qualityScore: 23,
        riskProfile: 'Calculated wait',
        outcomeType: 'defensible_suboptimal',
        outcomeNarrative: 'Specter held defensive position. When satellite passed, connection reconnected with minor disorientation.'
      },
      {
        id: 'opt_emergency_flare',
        code: 'D',
        title: 'Authorize High-Altitude Parachute Pyrotechnic Signal',
        description: 'Deploy visual flare rocket to signal general blind withdrawal.',
        tacticalTradeoff: 'High visibility to all sector parties; compromises sector covertness.',
        qualityScore: 18,
        riskProfile: 'Signature compromise',
        outcomeType: 'ambiguous',
        outcomeNarrative: 'Visual flare triggered rapid withdrawal but alerted all regional monitoring posts.'
      }
    ]
  },
  {
    id: 'conflicting-reports',
    code: 'SCEN-03',
    title: 'Conflicting Reports',
    sector: 'Sector Zeta-2 (Oasis Valley)',
    difficulty: 'Hard',
    durationSeconds: 125,
    decisionWindowSeconds: 30,
    communicationProfile: {
      initialLevel: 1,
      degradesAt: 20,
      degradedLevel: 3,
      conflictAt: 35,
      conflictLevel: 3,
      blackoutAt: 75,
      recoveryAt: 100,
      summary: 'Heavy Intelligence Discrepancy & Sensor Contradiction'
    },
    objective: 'Reconcile mutually contradictory intelligence reports between allied field observers, thermal sensors, and drone surveillance.',
    context: 'An unclassified vehicle formation is spotted approaching a key mountain gap. Ground observers claim three light scouting trucks moving West; automated airborne radar claims six heavy transports moving South.',
    mapConfig: {
      center: [34.05, -118.25],
      zoom: 14,
      fictionalGrid: 'SECTOR-Z2',
      features: [
        { id: 'hq', name: 'Sector Command Center', type: 'hq', pos: [34.03, -118.27], label: 'HQ Zeta' },
        { id: 'gap', name: 'Zeta Pass Checkpoint', type: 'checkpoint', pos: [34.06, -118.24], label: 'Zeta Pass' },
        { id: 'sensor-array', name: 'Seismic Array 4', type: 'relay', pos: [34.055, -118.26], label: 'Seismic A4' },
        { id: 'patrol-bravo', name: 'Allied Observer Post', type: 'unit', pos: [34.045, -118.23], label: 'Observer Bravo' },
        { id: 'uncertainty', name: 'Conflict Nexus', type: 'uncertainty', pos: [34.062, -118.245], radius: 700, label: 'Conflicting Sector' }
      ]
    },
    events: [
      {
        time: 8,
        type: 'report',
        source: 'OBSERVER BRAVO',
        category: 'ground',
        message: 'Visual spotter reports 3 light transport vehicles navigating WEST along Valley Floor.',
        confidence: 76,
        delaySeconds: 4,
        reliability: 'Observer Eyeball',
        isConflict: false
      },
      {
        time: 25,
        type: 'comm_status',
        level: 2,
        signalPercent: 68,
        statusText: 'COMMUNICATION DEGRADED',
        description: 'Repeater 2 bandwidth capped. Imagery downlink truncated.'
      },
      {
        time: 40,
        type: 'report',
        source: 'AUTOMATED AIR RADAR',
        category: 'air',
        message: 'Doppler scan calculates 6 large signatures moving SOUTH directly toward Zeta Pass.',
        confidence: 68,
        delaySeconds: 15,
        reliability: 'Synthetic Aperture Radar',
        isConflict: true,
        conflictWith: 'OBSERVER BRAVO'
      },
      {
        time: 55,
        type: 'report',
        source: 'SEISMIC BEACON 4',
        category: 'intel',
        message: 'Seismic vibrations match low-frequency harmonic generator / decoy tractor engine.',
        confidence: 52,
        delaySeconds: 20,
        reliability: 'Sub-surface Acoustic',
        isConflict: true
      },
      {
        time: 70,
        type: 'decision_trigger',
        deadlineSeconds: 30,
        prompt: 'Reports are directly conflicting. Do you commit resources West, reinforce South, or deploy cross-verification?'
      }
    ],
    decisions: [
      {
        id: 'opt_triangulate',
        code: 'A',
        title: 'Triangulate Seismic & Optical Feeds First',
        description: 'Synthesize acoustic harmonics with optical spotter before committing any mobile interceptors.',
        tacticalTradeoff: 'Takes 45 seconds of patience under tension, but prevents diversion toward acoustic decoy.',
        qualityScore: 30,
        riskProfile: 'Optimal Information Verification',
        outcomeType: 'success',
        outcomeNarrative: 'Analysis proved the Southern radar ping was an acoustic acoustic decoy. The real activity was light trucks West. Complete tactical success.'
      },
      {
        id: 'opt_south_reinforce',
        code: 'B',
        title: 'Commit All Forces South Toward Zeta Pass',
        description: 'Trust the automated radar count and seal Zeta Pass immediately.',
        tacticalTradeoff: 'Over-relies on synthetic radar which is vulnerable to seismic decoying.',
        qualityScore: 15,
        riskProfile: 'High decoy vulnerability',
        outcomeType: 'unfavorable',
        outcomeNarrative: 'Reinforcements rushed to Zeta Pass only to encounter empty ground with acoustic speaker beacons.'
      },
      {
        id: 'opt_split_force',
        code: 'C',
        title: 'Split Available Forces to Cover Both Vectors',
        description: 'Send half the detachment West and half South simultaneously.',
        tacticalTradeoff: 'Dilutes operational mass and doubles communication coordination strain.',
        qualityScore: 19,
        riskProfile: 'Force dilution',
        outcomeType: 'defensible_suboptimal',
        outcomeNarrative: 'Both sectors received minimal coverage, creating logistical confusion under degraded comms.'
      },
      {
        id: 'opt_hold_gap',
        code: 'D',
        title: 'Maintain Bottleneck Defense at Base Gate',
        description: 'Refuse outside maneuvers and defend base choke point.',
        tacticalTradeoff: 'Zero field exposure, but yields regional initiative to uncertain entities.',
        qualityScore: 22,
        riskProfile: 'Passive attrition',
        outcomeType: 'defensible_suboptimal',
        outcomeNarrative: 'Base secured, but transport convoy achieved unobserved transit without identification.'
      }
    ]
  },
  {
    id: 'incomplete-intelligence',
    code: 'SCEN-04',
    title: 'Incomplete Intelligence',
    sector: 'Sector Kodiak (Mountain Ridge)',
    difficulty: 'Medium',
    durationSeconds: 115,
    decisionWindowSeconds: 25,
    communicationProfile: {
      initialLevel: 2,
      degradesAt: 15,
      degradedLevel: 3,
      conflictAt: 40,
      conflictLevel: 3,
      blackoutAt: 60,
      recoveryAt: 85,
      summary: 'Partial Information & Heavy Sensor Occlusion'
    },
    objective: 'Navigate decision-making when dense cloud cover and terrain masking blind 70% of telemetry sensors.',
    context: 'Winter storm over Sector Kodiak limits aerial coverage. Only sporadic unconfirmed radio pings and thermal shadows are available.',
    mapConfig: {
      center: [64.83, -147.77],
      zoom: 13,
      fictionalGrid: 'SECTOR-KODIAK',
      features: [
        { id: 'hq', name: 'Northern Outpost Kodiak', type: 'hq', pos: [64.81, -147.79], label: 'Outpost Kodiak' },
        { id: 'ridge', name: 'Kodiak Ridge Pass', type: 'checkpoint', pos: [64.84, -147.75], label: 'Ridge Pass' },
        { id: 'team', name: 'Scout Kodiak 1', type: 'unit', pos: [64.825, -147.765], label: 'Kodiak-1' },
        { id: 'uncertainty', name: 'Storm Blindzone', type: 'uncertainty', pos: [64.835, -147.74], radius: 950, label: 'Cloud Obscured' }
      ]
    },
    events: [
      {
        time: 5,
        type: 'report',
        source: 'SATELLITE THERMAL',
        category: 'intel',
        message: 'Intermittent thermal signature detected through cloud break near Ridge Pass. Heading unverified.',
        confidence: 48,
        delaySeconds: 6,
        reliability: 'Cloud-Degraded',
        isConflict: false
      },
      {
        time: 25,
        type: 'comm_status',
        level: 3,
        signalPercent: 44,
        statusText: 'COMMUNICATION UNSTABLE',
        description: 'Severe weather ionospheric reflection. High transmission jitter.'
      },
      {
        time: 42,
        type: 'report',
        source: 'KODIAK-1 SQUAD',
        category: 'ground',
        message: 'Engine acoustic sounds audible in distance. Cannot ascertain heading due to mountain echo.',
        confidence: 54,
        delaySeconds: 16,
        reliability: 'Acoustic Echo',
        isConflict: false
      },
      {
        time: 60,
        type: 'decision_trigger',
        deadlineSeconds: 25,
        prompt: 'Information is incomplete. What action manages the terrain risk without overcommitting?'
      }
    ],
    decisions: [
      {
        id: 'opt_leapfrog_recon',
        code: 'A',
        title: 'Establish High-Ground Observation Post',
        description: 'Order Kodiak-1 to ascend Ridge Peak 400m to gain visual line of sight above cloud layer.',
        tacticalTradeoff: 'Exposes team to wind chill for 15 minutes, but guarantees clearing the intelligence fog safely.',
        qualityScore: 28,
        riskProfile: 'Measured reconnaissance risk',
        outcomeType: 'success',
        outcomeNarrative: 'Kodiak-1 gained ridge elevation and obtained clear visual identification of mountain rescue team.'
      },
      {
        id: 'opt_blind_advance',
        code: 'B',
        title: 'Rush Full Patrol Down Mountain Pass',
        description: 'Advance blind into the pass to confront whatever is generating the sound.',
        tacticalTradeoff: 'Dangerous risk of entering narrow defile without knowing contact identity or strength.',
        qualityScore: 12,
        riskProfile: 'Reckless hazard commitment',
        outcomeType: 'unfavorable',
        outcomeNarrative: 'Patrol got trapped in snow drift inside narrow pass without communication coverage.'
      },
      {
        id: 'opt_hold_and_beacon',
        code: 'C',
        title: 'Hold Position and Deploy Static Radar Transponder',
        description: 'Anchor Kodiak-1 at current treeline and activate automated perimeter transponder.',
        tacticalTradeoff: 'Protects squad completely, but defers information gathering.',
        qualityScore: 24,
        riskProfile: 'Defensive risk management',
        outcomeType: 'defensible_suboptimal',
        outcomeNarrative: 'Team maintained perfect integrity; situation resolved as weather cleared 2 hours later.'
      }
    ]
  }
];

// Demo Users for 1-Click Fast Login
export const DEMO_USERS = {
  commander: {
    id: 'usr_cmd_01',
    name: 'Commander Alpha',
    callsign: 'VANGUARD-ACTUAL',
    rank: 'Captain',
    role: 'commander',
    avatar: 'CA',
    email: 'commander@deciora.sim',
    readinessScore: 84,
    decisionAccuracy: 88,
    riskManagement: 91,
    informationUsage: 82,
    communicationProficiency: 76,
    decisionSpeed: 80,
    scenariosCompleted: 14,
    lastActive: '2026-10-05 18:00'
  },
  instructor: {
    id: 'usr_inst_01',
    name: 'Instructor Vance',
    callsign: 'OVERSIGHT-LEAD',
    rank: 'Colonel (Ret.)',
    role: 'instructor',
    avatar: 'IV',
    email: 'instructor@deciora.sim',
    traineesMonitored: 48,
    averageCohortScore: 81,
    scenariosSupervised: 126
  },
  admin: {
    id: 'usr_adm_01',
    name: 'System Admin Cole',
    callsign: 'SYS-ROOT',
    rank: 'Director of Simulation',
    role: 'admin',
    avatar: 'AC',
    email: 'admin@deciora.sim'
  }
};

// Cohort Trainees for Instructor Dashboard
export const COHORT_TRAINEES = [
  {
    id: 'trainee_01',
    name: 'Officer Alpha (Cmdr)',
    rank: 'Captain',
    overallScore: 88,
    accuracy: 92,
    speedScore: 84,
    avgDecisionTimeSec: 16.4,
    riskManagement: 91,
    infoUsage: 86,
    commCompliance: 82,
    scenariosCompleted: 12,
    status: 'ACTIVE',
    strengths: ['Risk mitigation under ambiguity', 'Cross-verifies conflicting reports'],
    weaknesses: ['Hesitation during total blackout'],
    recentSessions: [
      { scenario: 'Strategic Bridge', score: 87, date: 'Today', outcome: 'Optimal Identification' },
      { scenario: 'Conflicting Reports', score: 91, date: 'Yesterday', outcome: 'Decoy Neutralized' }
    ]
  },
  {
    id: 'trainee_02',
    name: 'Officer Bravo',
    rank: 'Lieutenant',
    overallScore: 81,
    accuracy: 84,
    speedScore: 78,
    avgDecisionTimeSec: 21.2,
    riskManagement: 82,
    infoUsage: 79,
    commCompliance: 84,
    scenariosCompleted: 10,
    status: 'ACTIVE',
    strengths: ['Strict radio protocol compliance', 'Thorough information usage'],
    weaknesses: ['Decision speed under time pressure'],
    recentSessions: [
      { scenario: 'Strategic Bridge', score: 82, date: '2 days ago', outcome: 'Defensible Suboptimal' },
      { scenario: 'Communication Blackout', score: 78, date: '3 days ago', outcome: 'Rally Achieved' }
    ]
  },
  {
    id: 'trainee_03',
    name: 'Officer Charlie',
    rank: 'Lieutenant',
    overallScore: 74,
    accuracy: 76,
    speedScore: 89,
    avgDecisionTimeSec: 11.5,
    riskManagement: 68,
    infoUsage: 69,
    commCompliance: 72,
    scenariosCompleted: 9,
    status: 'NEEDS_REVIEW',
    strengths: ['Rapid decisiveness under countdown'],
    weaknesses: ['Acts before verifying conflicting intelligence', 'Excessive risk acceptance'],
    recentSessions: [
      { scenario: 'Conflicting Reports', score: 68, date: 'Oct 3', outcome: 'Decoy Trap Triggered' },
      { scenario: 'Strategic Bridge', score: 79, date: 'Oct 1', outcome: 'Premature Roadblock' }
    ]
  },
  {
    id: 'trainee_04',
    name: 'Officer Delta',
    rank: 'Major',
    overallScore: 92,
    accuracy: 94,
    speedScore: 90,
    avgDecisionTimeSec: 14.8,
    riskManagement: 95,
    infoUsage: 91,
    commCompliance: 88,
    scenariosCompleted: 15,
    status: 'EXEMPLARY',
    strengths: ['Exceptional synthesis of partial data', 'Calm under communication blackout'],
    weaknesses: ['Minor telemetry bandwidth overuse'],
    recentSessions: [
      { scenario: 'Communication Blackout', score: 94, date: 'Yesterday', outcome: 'Flawless Contingency' },
      { scenario: 'Incomplete Intelligence', score: 90, date: 'Oct 2', outcome: 'High-Ground Secured' }
    ]
  },
  {
    id: 'trainee_05',
    name: 'Officer Echo',
    rank: 'Captain',
    overallScore: 79,
    accuracy: 81,
    speedScore: 76,
    avgDecisionTimeSec: 19.8,
    riskManagement: 80,
    infoUsage: 77,
    commCompliance: 80,
    scenariosCompleted: 11,
    status: 'ACTIVE',
    strengths: ['Solid defensive discipline'],
    weaknesses: ['Reluctant to deploy recon assets'],
    recentSessions: [
      { scenario: 'Strategic Bridge', score: 78, date: 'Oct 4', outcome: 'Passive Delay' }
    ]
  }
];

// Historical Sessions
export const INITIAL_TRAINING_HISTORY = [
  {
    id: 'sess_101',
    scenarioId: 'strategic-bridge',
    scenarioTitle: 'Strategic Bridge',
    date: '2026-10-05 14:32',
    score: 87,
    decisionTimeSec: 18.2,
    commLevelMax: 'Level 3 (Unstable)',
    decisionChosen: 'Request UAV Falcon Reconnaissance',
    outcome: 'Successful Identification',
    outcomeQuality: 'optimal',
    scoreBreakdown: {
      decisionQuality: 28,
      infoUsage: 18,
      riskMgmt: 18,
      decisionTime: 12,
      commProtocol: 11
    }
  },
  {
    id: 'sess_102',
    scenarioId: 'communication-blackout',
    scenarioTitle: 'Communication Blackout',
    date: '2026-10-04 11:15',
    score: 78,
    decisionTimeSec: 22.0,
    commLevelMax: 'Level 4 (Severe Blackout)',
    decisionChosen: 'Maintain Position & Await Orbital Uplink Window',
    outcome: 'Defensible Suboptimal',
    outcomeQuality: 'defensible',
    scoreBreakdown: {
      decisionQuality: 23,
      infoUsage: 15,
      riskMgmt: 16,
      decisionTime: 11,
      commProtocol: 13
    }
  },
  {
    id: 'sess_103',
    scenarioId: 'conflicting-reports',
    scenarioTitle: 'Conflicting Reports',
    date: '2026-10-02 16:45',
    score: 91,
    decisionTimeSec: 14.5,
    commLevelMax: 'Level 3 (Unstable)',
    decisionChosen: 'Triangulate Seismic & Optical Feeds First',
    outcome: 'Decoy Successfully Avoided',
    outcomeQuality: 'optimal',
    scoreBreakdown: {
      decisionQuality: 29,
      infoUsage: 19,
      riskMgmt: 19,
      decisionTime: 13,
      commProtocol: 11
    }
  }
];

// Leaderboard Data
export const LEADERBOARD_DATA = [
  { rank: '01', name: 'Commander Delta', callsign: 'TITAN-1', score: 92, accuracy: '94%', speed: '14.8s', risk: '95%', completed: 15 },
  { rank: '02', name: 'Commander Alpha (You)', callsign: 'VANGUARD-ACTUAL', score: 88, accuracy: '92%', speed: '16.4s', risk: '91%', completed: 14 },
  { rank: '03', name: 'Commander Bravo', callsign: 'GHOST-LEAD', score: 81, accuracy: '84%', speed: '21.2s', risk: '82%', completed: 10 },
  { rank: '04', name: 'Commander Echo', callsign: 'SHIELD-7', score: 79, accuracy: '81%', speed: '19.8s', risk: '80%', completed: 11 },
  { rank: '05', name: 'Commander Charlie', callsign: 'TALON-9', score: 74, accuracy: '76%', speed: '11.5s', risk: '68%', completed: 9 }
];

// Instructor Aggregate Analytics
export const INSTRUCTOR_ANALYTICS = {
  totalTrainees: 48,
  activeSessionsToday: 14,
  averageScore: 81.4,
  averageDecisionTime: '18.6s',
  averageAccuracy: '83.8%',
  scoreDistribution: [
    { range: '90-100', count: 8, label: 'Exemplary' },
    { range: '80-89', count: 24, label: 'Proficient' },
    { range: '70-79', count: 12, label: 'Developing' },
    { range: '<70', count: 4, label: 'Needs Intervention' }
  ],
  performanceByDegradation: [
    { level: 'Normal Comm (100% signal)', avgScore: 91, accuracy: 94, decisionTime: 12 },
    { level: 'Delayed Comm (75% signal)', avgScore: 84, accuracy: 87, decisionTime: 16 },
    { level: 'Conflicting Intel (45% signal)', avgScore: 76, accuracy: 78, decisionTime: 23 },
    { level: 'Signal Blackout (0-15% signal)', avgScore: 68, accuracy: 71, decisionTime: 27 }
  ],
  competencyRadar: [
    { subject: 'Decision Quality', cohort: 82, benchmark: 80, fullMark: 100 },
    { subject: 'Info Usage', cohort: 76, benchmark: 75, fullMark: 100 },
    { subject: 'Risk Management', cohort: 85, benchmark: 80, fullMark: 100 },
    { subject: 'Decision Speed', cohort: 79, benchmark: 75, fullMark: 100 },
    { subject: 'Comm Protocol', cohort: 78, benchmark: 80, fullMark: 100 }
  ]
};
