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

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../shared/supabase';

export default function MemberApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const navigate = useNavigate();

  const handlePostLogin = async (user: any) => {
    console.log('Post login started for user:', user);
    // Fetch profile to check role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      alert(`Lỗi khi lấy thông tin quyền: ${error.message}. ID của bạn là ${user.id}`);
      setCurrentScreen('dashboard');
      return;
    }

    console.log('Fetched profile:', profile);
    alert(`Đăng nhập thành công! Quyền của bạn là: ${profile?.role}`);

    if (profile?.role === 'admin') {
      window.location.href = '/admin'; // Force full page reload to avoid router issues
    } else if (profile?.role === 'operator') {
      window.location.href = '/operator'; // Force full page reload to avoid router issues
    } else {
      setCurrentScreen('dashboard');
    }
  };

  if (currentScreen === 'login') {
    return <Login onLogin={handlePostLogin} onVisitor={() => setCurrentScreen('exit')} />;
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
        {currentScreen === 'settings' && (
          <Settings
            onLogout={async () => {
              await supabase.auth.signOut();
              setCurrentScreen('login');
              navigate('/'); // Ensure we are back at root
            }}
          />
        )}
      </main>
    </div>
  );
}
