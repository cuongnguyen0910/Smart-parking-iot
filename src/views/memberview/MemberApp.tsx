import React, { useState } from 'react';
import { Screen } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import History from './screens/History';
import Payments from './screens/Payments';
import Settings from './screens/Settings';
import Support from './screens/Support';
import Login from './screens/Login';
import ExitPayment from './screens/ExitPayment';

export default function MemberApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  if (currentScreen === 'login') {
    return <Login onLogin={() => setCurrentScreen('dashboard')} onVisitor={() => setCurrentScreen('exit')} />;
  }

  if (currentScreen === 'exit') {
    return (
      <div className="min-h-screen bg-background-light p-8 overflow-y-auto">
        <ExitPayment onBack={() => setCurrentScreen('login')} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      <main className="ml-72 flex-1 p-8 min-h-screen overflow-y-auto">
        {currentScreen === 'dashboard' && <Dashboard />}
        {currentScreen === 'history' && <History />}
        {currentScreen === 'payments' && <Payments />}
        {currentScreen === 'support' && <Support />}
        {currentScreen === 'settings' && <Settings onLogout={() => setCurrentScreen('login')} />}
      </main>
    </div>
  );
}
