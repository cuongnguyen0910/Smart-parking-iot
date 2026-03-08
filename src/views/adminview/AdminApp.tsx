/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Users } from './pages/Users';
import { Audit } from './pages/Audit';
import { IoTMonitoring } from './pages/IoTMonitoring';
import { Signage } from './pages/Signage';
import { Settings } from './pages/Settings';

type Tab = 'dashboard' | 'pricing' | 'users' | 'audit' | 'iot' | 'signage' | 'settings';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pricing':
        return <Pricing />;
      case 'users':
        return <Users />;
      case 'audit':
        return <Audit />;
      case 'iot':
        return <IoTMonitoring />;
      case 'signage':
        return <Signage />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

