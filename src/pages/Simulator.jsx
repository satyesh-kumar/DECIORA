import React, { useState, useEffect, useRef } from 'react';
import CommandHeader from '../components/simulator/CommandHeader';
import MissionSidebar from '../components/simulator/MissionSidebar';
import ScenarioMap from '../components/map/ScenarioMap';
import InformationFeed from '../components/reports/InformationFeed';
import DecisionPanel from '../components/decisions/DecisionPanel';
import { api } from '../services/api';
import { sound } from '../services/soundSystem';
import { AlertTriangle, Radio, CheckCircle, Clock } from 'lucide-react';

export default function Simulator({ scenario, onScenarioComplete, onExit }) {
  // Scenario Clock & State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [toasts, setToasts] = useState([]);

  // Active Events & Reports
  const [receivedReports, setReceivedReports] = useState([]);
  const [communicationState, setCommunicationState] = useState({
    level: scenario?.communicationProfile?.initialLevel || 1,
    signalPercent: 100,
    statusText: 'COMMUNICATION STABLE'
  });

  // Decision State
  const [isDecisionRequired, setIsDecisionRequired] = useState(false);
  const [decisionRemaining, setDecisionRemaining] = useState(scenario?.decisionWindowSeconds || 30);
  const [decisionStartTime, setDecisionStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sound & Event Trigger Trackers to prevent duplicate triggers
  const triggeredEventsRef = useRef(new Set());

  // Toast Helper
  const addToast = (title, message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Main Simulation Timer Clock Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const nextTime = prev + 1;
        return nextTime;
      });
    }, 1000 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isRunning, speedMultiplier]);

  // Event Engine: Processes scheduled scenario events based on elapsedSeconds
  useEffect(() => {
    if (!scenario?.events) return;

    scenario.events.forEach((ev, idx) => {
      const eventKey = `${ev.type}_${ev.time}_${idx}`;
      if (elapsedSeconds >= ev.time && !triggeredEventsRef.current.has(eventKey)) {
        triggeredEventsRef.current.add(eventKey);

        // Handle Event Types
        if (ev.type === 'report') {
          sound.playReportNotification();
          setReceivedReports(prev => [...prev, ev]);
          addToast(
            ev.isConflict ? '⚠ CONFLICTING REPORT' : '📡 NEW INTEL REPORT',
            `${ev.source}: ${ev.message.substring(0, 55)}...`,
            ev.isConflict ? 'warning' : 'info'
          );

          if (ev.isConflict) {
            sound.playWarning();
          }
        } 
        else if (ev.type === 'comm_status') {
          setCommunicationState({
            level: ev.level,
            signalPercent: ev.signalPercent,
            statusText: ev.statusText,
            description: ev.description
          });

          if (ev.level >= 4) {
            sound.playCommLost();
            addToast('⚠ COMM BLACKOUT', 'All field tactical channels disconnected.', 'danger');
          } else if (ev.level >= 2) {
            sound.playWarning();
            addToast('⚠ SIGNAL DEGRADED', ev.description || 'Transmission delay increasing.', 'warning');
          }
        } 
        else if (ev.type === 'decision_trigger') {
          setIsDecisionRequired(true);
          setDecisionStartTime(elapsedSeconds);
          setDecisionRemaining(ev.deadlineSeconds || 30);
          sound.playWarning();
          addToast('⏱ DECISION REQUIRED', ev.prompt || 'Tactical directive selection window open.', 'warning');
        }
      }
    });
  }, [elapsedSeconds, scenario]);

  // Decision Countdown countdown loop
  useEffect(() => {
    if (!isDecisionRequired || !isRunning) return;

    const timer = setInterval(() => {
      setDecisionRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // If countdown expires, auto-commit default conservative posture
          handleDecisionSubmit(scenario.decisions[0], true);
          return 0;
        }
        if (prev === 10) {
          sound.playWarning();
          addToast('⏱ 10s REMAINING', 'Decision window closing rapidly.', 'warning');
        }
        return prev - 1;
      });
    }, 1000 / speedMultiplier);

    return () => clearInterval(timer);
  }, [isDecisionRequired, isRunning, speedMultiplier, scenario]);

  // Handle final decision submission
  const handleDecisionSubmit = async (chosenDecision, isTimedOut = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsRunning(false);

    const decisionTimeSeconds = decisionStartTime 
      ? elapsedSeconds - decisionStartTime 
      : 15;

    try {
      const sessionResult = await api.submitDecision({
        scenarioId: scenario.id,
        decisionId: chosenDecision.id,
        decisionTimeSeconds,
        availableInformation: receivedReports,
        communicationState
      });

      onScenarioComplete(sessionResult);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset simulation handler
  const handleReset = () => {
    triggeredEventsRef.current.clear();
    setElapsedSeconds(0);
    setReceivedReports([]);
    setIsDecisionRequired(false);
    setDecisionRemaining(scenario?.decisionWindowSeconds || 30);
    setCommunicationState({
      level: scenario?.communicationProfile?.initialLevel || 1,
      signalPercent: 100,
      statusText: 'COMMUNICATION STABLE'
    });
    setIsRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex flex-col font-sans relative">
      
      {/* HUD Telemetry Top Bar */}
      <CommandHeader
        scenario={scenario}
        elapsedSeconds={elapsedSeconds}
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(prev => !prev)}
        speedMultiplier={speedMultiplier}
        onToggleSpeed={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
        onReset={handleReset}
        onExit={onExit}
        communicationState={communicationState}
      />

      {/* Main Simulation Workspace Grid */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Mission Directives & Unit Telemetry (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MissionSidebar 
            scenario={scenario}
            communicationState={communicationState}
            elapsedSeconds={elapsedSeconds}
          />
        </div>

        {/* Center Column: Interactive Tactical Map + Bottom Decision Panel (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Tactical Map Container */}
          <ScenarioMap
            scenario={scenario}
            communicationState={communicationState}
            activeEvents={receivedReports}
          />

          {/* Decision Panel */}
          <DecisionPanel
            scenario={scenario}
            isDecisionRequired={isDecisionRequired}
            remainingSeconds={decisionRemaining}
            totalWindowSeconds={scenario?.decisionWindowSeconds || 30}
            onConfirmDecision={(dec) => handleDecisionSubmit(dec, false)}
            disabled={isSubmitting}
          />

        </div>

        {/* Right Column: Incoming Intelligence & Conflicting Feed (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[650px] lg:h-auto">
          <InformationFeed
            reports={receivedReports}
            communicationState={communicationState}
          />
        </div>

      </main>

      {/* Toast Notification Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-3 rounded-lg border backdrop-blur-md shadow-xl text-xs font-mono animate-in slide-in-from-right-5 duration-200 pointer-events-auto ${
              toast.type === 'danger' ? 'bg-red-950/90 border-red-500 text-red-200' :
              toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500 text-amber-200' :
              'bg-[#12263A]/90 border-[var(--accent-cyan)] text-sky-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-0.5">
              {toast.type === 'danger' ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> :
               toast.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
               <Radio className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />}
              <span>{toast.title}</span>
            </div>
            <div className="text-[11px] font-sans text-white/90">
              {toast.message}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
