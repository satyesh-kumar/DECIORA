import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CommanderDashboard from './pages/Dashboard';
import Scenarios from './pages/Scenarios';
import Simulator from './pages/Simulator';
import Results from './pages/Results';
import AAR from './pages/AAR';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import InstructorDashboard from './pages/InstructorDashboard';

import { SCENARIOS, DEMO_USERS, INITIAL_TRAINING_HISTORY } from './services/mockData';
import { api } from './services/api';
import { sound } from './services/soundSystem';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(DEMO_USERS.commander);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [sessionResult, setSessionResult] = useState(INITIAL_TRAINING_HISTORY[0]);

  // Load user on startup
  useEffect(() => {
    const savedUser = api.getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  // Quick Demo Access Handler
  const handleLoginDemo = (role = 'commander') => {
    const demoUser = DEMO_USERS[role] || DEMO_USERS.commander;
    setUser(demoUser);
    if (role === 'instructor') {
      setCurrentPage('instructor');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Switch role directly from navbar
  const handleSwitchRole = (role) => {
    const nextUser = DEMO_USERS[role] || DEMO_USERS.commander;
    setUser(nextUser);
    if (role === 'instructor') {
      setCurrentPage('instructor');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Start a scenario simulation
  const handleSelectScenario = (scen) => {
    setSelectedScenario(scen);
    setCurrentPage('simulator');
  };

  // Complete simulation -> Go to Results Debrief
  const handleScenarioComplete = (result) => {
    setSessionResult(result);
    setCurrentPage('results');
  };

  // View AAR for a session
  const handleViewAAR = (session) => {
    setSessionResult(session);
    const scen = SCENARIOS.find(s => s.id === session.scenarioId) || SCENARIOS[0];
    setSelectedScenario(scen);
    setCurrentPage('aar');
  };

  // Logout
  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex flex-col font-sans selection:bg-[var(--accent-cyan)]/30 selection:text-white">
      
      {/* Global Navigation (Visible on all pages except full-screen Simulator and Login) */}
      {currentPage !== 'simulator' && currentPage !== 'login' && (
        <Navbar
          user={user}
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      )}

      {/* Main Page Router */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'landing' && (
          <Landing
            onStartTraining={() => setCurrentPage('scenarios')}
            onLoginDemo={handleLoginDemo}
            onGoLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'login' && (
          <Login
            onLoginSuccess={(role) => handleLoginDemo(role)}
            onGoLanding={() => setCurrentPage('landing')}
          />
        )}

        {currentPage === 'dashboard' && (
          <CommanderDashboard
            user={user}
            onStartTraining={() => setCurrentPage('scenarios')}
            onSelectScenario={handleSelectScenario}
            onViewAAR={handleViewAAR}
          />
        )}

        {currentPage === 'scenarios' && (
          <Scenarios
            onSelectScenario={handleSelectScenario}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'simulator' && (
          <Simulator
            scenario={selectedScenario}
            onScenarioComplete={handleScenarioComplete}
            onExit={() => setCurrentPage('scenarios')}
          />
        )}

        {currentPage === 'results' && (
          <Results
            sessionData={sessionResult}
            onOpenAAR={() => setCurrentPage('aar')}
            onRestart={() => setCurrentPage('simulator')}
            onGoDashboard={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'aar' && (
          <AAR
            sessionData={sessionResult}
            scenario={selectedScenario}
            onExit={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'leaderboard' && (
          <Leaderboard
            onBack={() => setCurrentPage('dashboard')}
            onStartTraining={() => setCurrentPage('scenarios')}
          />
        )}

        {currentPage === 'history' && (
          <History
            onBack={() => setCurrentPage('dashboard')}
            onViewAAR={handleViewAAR}
            onStartTraining={() => setCurrentPage('scenarios')}
          />
        )}

        {currentPage === 'instructor' && (
          <InstructorDashboard
            onViewTraineeAAR={(trainee) => {
              setCurrentPage('history');
            }}
          />
        )}
      </div>

    </div>
  );
}
