import React, { useState, useEffect } from 'react';
import {
  Car, Cpu, AlertTriangle, TrendingUp,
  RefreshCw, Search, Bell, MoreVertical, LogIn, Eye, LogOut, DollarSign, Plus, ChevronDown, ChevronUp,
  AlertCircle, Zap, Activity, Gauge
} from 'lucide-react';
import { useProfile } from '../../../shared/hooks/useProfile';
import { supabase } from '../../../shared/supabase';
import LiveVehicles from './LiveVehicles';
import OverrideGateModal from './OverrideGateModal';
import LostCardModal from './LostCardModal';
import ManualEntryModal from './ManualEntryModal';
import IncidentAlerts from './IncidentAlerts';
import GatewayStatusBanner from './GatewayStatusBanner';
import QuickStatsPanel from './QuickStatsPanel';

interface Gate {
  id: string;
  name: string;
  zone: string;
  status: 'Online' | 'Alert' | 'Offline';
  img: string;
  recTime?: string;
  alert?: string;
  lockState: 'open' | 'closed' | 'locked';
}

export default function Dashboard({ 
  onManualAction,
  gates,
  onGatesChange
}: { 
  onManualAction?: (actionType: 'lost_card' | 'manual_entry' | 'manual_exit' | 'override_gate' | 'manual_handling', actionData?: any) => void;
  gates?: Gate[];
  onGatesChange?: (gates: Gate[]) => void;
}) {
  const { profile } = useProfile();

  // KPI Data
  const [totalSlots, setTotalSlots] = useState(0);
  const [occupiedSlots, setOccupiedSlots] = useState(0);
  const [zones, setZones] = useState<any[]>([]);
  
  // Occupied Slots Table
  const [occupiedList, setOccupiedList] = useState<any[]>([]);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [showOccupiedSlots, setShowOccupiedSlots] = useState(false);
  const [showSystemInterventions, setShowSystemInterventions] = useState(false);
  // Slot Menu State
  const [openSlotMenuId, setOpenSlotMenuId] = useState<string | null>(null);
  const [slotMenuPosition, setSlotMenuPosition] = useState({ top: 0, left: 0 });
  
  // Card Stock & Transactions
  const [cardStockRemaining, setCardStockRemaining] = useState(42);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showManualHandlingModal, setShowManualHandlingModal] = useState(false);
  
  // Collapsible Sections
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showIncidents, setShowIncidents] = useState(true);
  
  // Issue Temp Card Modal (renamed to Visitor Pass)
  const [showVisitorPassModal, setShowVisitorPassModal] = useState(false);
  const [visitorPassTab, setVisitorPassTab] = useState<'issue' | 'return'>('issue');
  
  // System Intervention Modals
  const [showLostCardModal, setShowLostCardModal] = useState(false);
  const [showEmergencyOverrideModal, setShowEmergencyOverrideModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<{ id: string; name: string } | null>(null);
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'alert',
      title: 'Zone A - High Occupancy',
      message: 'Zone A is now 85% full',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false
    },
    {
      id: '2',
      type: 'incident',
      title: 'Gate 2 Offline',
      message: 'Exit gate 2 connection lost - manual override may be needed',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'Routine maintenance completed successfully',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true
    },
  ]);

  // Fetch dữ liệu thật
  const fetchData = async () => {
    setLoading(true);

    // 1. Tổng số slot
    const { count: total } = await supabase
      .from('parking_slots')
      .select('*', { count: 'exact', head: true });

    // 2. Số slot đang occupied
    const { count: occupied } = await supabase
      .from('parking_slots')
      .select('*', { count: 'exact', head: true })
      .eq('is_occupied', true);

    // 3. Zone summary
    const { data: zoneData } = await supabase
      .from('parking_slots')
      .select('zone, is_occupied');

    // 4. Danh sách slot đang đỗ (cho Recent Logs)
    let query = supabase
      .from('parking_slots')
      .select('slot_number, zone')
      .eq('is_occupied', true);
    
    // Limit to 4 unless showAllSlots is true
    if (!showAllSlots) {
      query = query.limit(4);
    }
    
    const { data: occupiedData } = await query;

    setTotalSlots(total || 0);
    setOccupiedSlots(occupied || 0);
    setZones(zoneData || []);
    setOccupiedList(occupiedData || []);
    setLoading(false);
  };

  // Realtime: khi có xe vào/ra (bất kỳ slot nào thay đổi) → tự update
  useEffect(() => {
    fetchData();
    
    // Initialize recent transactions
    setRecentTransactions([
      { id: 1, plate: 'AAA-0001', exitTime: '11:30 AM', cardType: 'Registered', vehicleType: 'Car', amount: '₫10,000', status: 'Paid' },
      { id: 2, plate: 'BBB-0002', exitTime: '11:15 AM', cardType: 'Temporary', vehicleType: 'Motorbike', amount: '₫5,000', status: 'Paid' },
      { id: 3, plate: 'CCC-0003', exitTime: '11:00 AM', cardType: 'Registered', vehicleType: 'Motorbike', amount: '₫5,000', status: 'Paid' },
      { id: 4, plate: 'DDD-0004', exitTime: '10:50 AM', cardType: 'Temporary', vehicleType: 'Car', amount: 'Refunded', status: 'Returned' },
      { id: 5, plate: 'EEE-0005', exitTime: '10:35 AM', cardType: 'Registered', vehicleType: 'Car', amount: '₫10,000', status: 'Pending' },
      { id: 6, plate: 'FFF-0006', exitTime: '10:20 AM', cardType: 'Temporary', vehicleType: 'Motorbike', amount: '₫5,000', status: 'Paid' },
      { id: 7, plate: 'GGG-0007', exitTime: '10:05 AM', cardType: 'Registered', vehicleType: 'Car', amount: '₫10,000', status: 'Paid' },
    ]);

    const channel = supabase
      .channel('parking-slots-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parking_slots' },
        () => {
          fetchData(); // tự refresh ngay lập tức
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showAllSlots]);

  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Notification Handlers
  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    if (type === 'alert') return <AlertTriangle size={16} className="text-orange-500" />;
    if (type === 'incident') return <AlertTriangle size={16} className="text-red-500" />;
    return <Bell size={16} className="text-blue-500" />;
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Close notification panel when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationButton = document.querySelector('[aria-label="notification-button"]');
      const notificationPanel = document.querySelector('[aria-label="notification-panel"]');
      
      if (
        showNotifications &&
        !notificationButton?.contains(event.target as Node) &&
        !notificationPanel?.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  // KPI Cards - Real Data
  const kpis = [
    {
      title: 'Total Occupancy',
      value: `${occupiedSlots} / ${totalSlots}`,
      trend: `${occupancyRate}%`,
      icon: Car,
      color: 'primary',
      progress: occupancyRate
    },
    {
      title: 'Total Slots',
      value: `${totalSlots}`,
      trend: 'All zones',
      icon: Cpu,
      color: 'emerald',
      sub: 'Updated realtime'
    },
    {
      title: 'Empty Slots',
      value: `${totalSlots - occupiedSlots}`,
      trend: 'Available now',
      icon: AlertTriangle,
      color: 'orange'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Topbar */}
      <header className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search plates, ticket ID, or card ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
            cardStockRemaining < 5 
              ? 'bg-red-50 border-red-200' 
              : cardStockRemaining < 10 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="text-sm">
              <p className={`text-xs font-medium ${
                cardStockRemaining < 5 
                  ? 'text-red-600' 
                  : cardStockRemaining < 10 
                  ? 'text-yellow-600' 
                  : 'text-slate-500'
              }`}>Card Stock</p>
              <p className={`text-lg font-bold ${
                cardStockRemaining < 5 
                  ? 'text-red-600' 
                  : cardStockRemaining < 10 
                  ? 'text-yellow-600' 
                  : 'text-purple-600'
              }`}>{cardStockRemaining} {cardStockRemaining < 5 ? '⚠' : cardStockRemaining < 10 ? '!' : ''}</p>
            </div>
          </div>
          {cardStockRemaining < 10 && (
            <button 
              onClick={() => alert('Restock request sent to procurement team')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                cardStockRemaining < 5 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
              title="Request urgent restock"
            >
              Request Restock
            </button>
          )}
          
          <button 
            onClick={() => setShowVisitorPassModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
            title="Issue temporary parking card for guests/visitors"
          >
            <Plus size={18} /> Visitor Pass
          </button>
          
          <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 max-h-96 overflow-hidden flex flex-col"
              aria-label="notification-panel"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                              <p className="text-sm text-slate-600 mt-0.5">{notif.message}</p>
                            </div>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                              title="Dismiss notification"
                            >
                              <span className="text-lg leading-none">×</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            {formatNotificationTime(notif.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    onClick={() => {
                      setNotifications([]);
                      setShowNotifications(false);
                    }}
                    className="text-xs text-slate-600 hover:text-primary font-semibold transition-colors"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{profile?.full_name || 'Operator'}</p>
              <p className="text-xs text-slate-500">{profile?.role || 'Operator'}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden flex items-center justify-center bg-primary/10 text-primary">
              {profile?.full_name ? (
                <span className="font-bold text-sm">
                  {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              ) : (
                <img src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Data Status Section - Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gate Busy</p>
              <p className="text-2xl font-bold text-slate-800">{occupiedSlots}</p>
            </div>
            <div className="text-4xl font-bold text-red-100">🚗</div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Currently occupied</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gate Idle</p>
              <p className="text-2xl font-bold text-slate-800">{totalSlots - occupiedSlots}</p>
            </div>
            <div className="text-4xl font-bold text-green-100">✓</div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Available slots</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-slate-800">{occupancyRate}%</p>
            </div>
            <div className="text-4xl font-bold text-blue-100">📊</div>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full transition-all ${occupancyRate > 80 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <GatewayStatusBanner gates={gates} />

      {/* Incidents & Alerts - Collapsible */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold">Incidents & Alerts</h2>
          </div>
          {showIncidents ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showIncidents && (
          <div className="p-6 pt-0">
            <IncidentAlerts onRefresh={fetchData} />
          </div>
        )}
      </div>

      {/* Live Zone Occupancy - MOVED BEFORE QUICK ACTION ITEMS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gauge className="text-blue-600" size={20} />
            <div>
              <h2 className="text-xl font-bold">Live Zone Occupancy</h2>
              <p className="text-sm text-slate-500 mt-1">Quick overview of parking availability by zone</p>
            </div>
          </div>
          <button onClick={fetchData} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from(new Set(zones.map(z => z.zone))).slice(0, 2).map((zoneName, idx) => {
            const zoneSlots = zones.filter(z => z.zone === zoneName);
            const occ = zoneSlots.filter(z => z.is_occupied).length;
            const empty = zoneSlots.length - occ;
            const rate = zoneSlots.length > 0 ? Math.round((occ / zoneSlots.length) * 100) : 0;
            const isHighOccupancy = rate > 80;
            
            return (
              <div key={idx} className={`rounded-2xl shadow-sm border overflow-hidden ${
                isHighOccupancy 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${isHighOccupancy ? 'text-red-700' : 'text-slate-800'}`}>Zone {zoneName}</h3>
                    <span className={`text-3xl font-bold ${isHighOccupancy ? 'text-red-600' : 'text-emerald-600'}`}>
                      {rate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full transition-all ${isHighOccupancy ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm font-semibold ${isHighOccupancy ? 'text-red-700' : 'text-slate-700'}`}>
                    {occ}/{zoneSlots.length} slots • {empty} empty
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Stats - Collapsible */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3">
            <Gauge className="text-green-600" size={20} />
            <h2 className="text-lg font-bold">Quick Action Items</h2>
          </div>
          {showQuickActions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showQuickActions && (
          <div className="p-6 pt-0">
            <QuickStatsPanel />
          </div>
        )}
      </div>

      {/* Live Vehicles */}
      <LiveVehicles
        searchQuery={searchQuery}
        onSelectVehicle={(vehicle) => console.log('Selected vehicle:', vehicle)}
      />

      {/* System Interventions - Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowSystemInterventions(!showSystemInterventions)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={20} />
            <h2 className="text-lg font-bold">System Interventions</h2>
          </div>
          {showSystemInterventions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showSystemInterventions && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowLostCardModal(true)}
              className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all hover:shadow-md text-left group"
              title="Report lost/damaged parking card and issue temporary pass"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="text-xl">🔑</div>
                <p className="text-sm font-bold text-red-800 group-hover:text-red-900">Lost Card Report</p>
              </div>
              <p className="text-xs text-red-600 mt-1">Report lost/damaged card & issue temporary pass</p>
              <p className="text-[10px] text-red-500 mt-2 font-semibold">Fee: ₫20,000</p>
            </button>
            <button
              onClick={() => setShowEmergencyOverrideModal(true)}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all hover:shadow-md text-left group"
              title="Override gate during emergency only - requires supervisor code"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="text-xl">🚨</div>
                <p className="text-sm font-bold text-orange-800 group-hover:text-orange-900">Emergency Override</p>
              </div>
              <p className="text-xs text-orange-600 mt-1">Force gate open in emergencies only (fire, obstruction, safety)</p>
              <p className="text-[10px] text-orange-500 mt-2 font-semibold">Requires supervisor code</p>
            </button>
            <button
              onClick={() => setShowManualHandlingModal(true)}
              className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all hover:shadow-md text-left group"
              title="Create manual exit when card reader or plate scanner fails"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="text-xl">📤</div>
                <p className="text-sm font-bold text-amber-800 group-hover:text-amber-900">Manual Exit</p>
              </div>
              <p className="text-xs text-amber-600 mt-1">Create exit when card reader or plate scanner fails</p>
              <p className="text-[10px] text-amber-500 mt-2 font-semibold">Charge: Motorbike ₫5k / Car ₫10k</p>
            </button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setShowOccupiedSlots(!showOccupiedSlots)}
          className="w-full p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Car className="text-slate-600" size={20} />
            <h2 className="text-lg font-bold">Currently Occupied Slots</h2>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              {occupiedList.length} slots
            </span>
          </div>
          {showOccupiedSlots ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showOccupiedSlots && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Slot Number</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {occupiedList.length > 0 ? (
                  occupiedList.map((slot, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold text-slate-800">{slot.slot_number}</td>
                      <td className="px-6 py-4 text-slate-500">{slot.zone}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <LogIn size={14} /> Occupied
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setSlotMenuPosition({
                              top: rect.bottom + window.scrollY,
                              left: rect.left + window.scrollX
                            });
                            setOpenSlotMenuId(openSlotMenuId === slot.slot_number ? null : slot.slot_number);
                          }}
                          className="text-slate-400 hover:text-primary transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">No occupied slots right now</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Slot Action Menu - Outside Container */}
      {openSlotMenuId && (
        <div 
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1"
          style={{
            top: `${slotMenuPosition.top}px`,
            left: `${slotMenuPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`View details for slot ${openSlotMenuId}`);
              setOpenSlotMenuId(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700 transition-colors"
          >
            <Eye size={16} /> View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onManualAction) onManualAction('manual_exit', { slot: openSlotMenuId });
              setOpenSlotMenuId(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-orange-600 transition-colors"
          >
            <LogOut size={16} /> Force Exit
          </button>
          <div className="border-t border-slate-100 my-1"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Payment Status for Slot ${openSlotMenuId}`);
              setOpenSlotMenuId(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-600 transition-colors"
          >
            <DollarSign size={16} /> Check Payment
          </button>
        </div>
      )}

      {/* Recent Transactions - LIMITED TO 5 ROWS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Activity className="text-purple-600" size={20} />
            <div>
              <h2 className="text-lg font-bold mb-1">Recent Transactions</h2>
              <p className="text-sm text-slate-500">Latest 5 vehicles exited, cards returned, payments collected</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">License Plate</th>
                <th className="px-6 py-4">Exit Time</th>
                <th className="px-6 py-4">Card Type</th>
                <th className="px-6 py-4">Vehicle Type</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 5).map((txn, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-6 py-4 font-bold text-slate-800">{txn.plate}</td>
                    <td className="px-6 py-4 text-slate-600">{txn.exitTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        txn.cardType === 'Registered'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {txn.cardType === 'Registered' ? '👤 Registered' : '👤 Temporary'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <span className="text-sm font-semibold">{txn.vehicleType}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{txn.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        txn.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : txn.status === 'Returned'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => alert(`Action for ${txn.plate}`)}
                        className="text-primary hover:text-primary-dark transition-colors"
                        title="View details"
                      >
                        →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close menu backdrop - Outside Container */}
      {openSlotMenuId && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setOpenSlotMenuId(null)}
        />
      )}

      {/* Modals */}
      <OverrideGateModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        gateId={selectedGate?.id}
        gateName={selectedGate?.name}
      />
      <LostCardModal isOpen={showLostCardModal} onClose={() => setShowLostCardModal(false)} />
      <ManualEntryModal
        isOpen={showManualHandlingModal}
        onClose={() => setShowManualHandlingModal(false)}
        onSuccess={(data) => {
          // Add transaction to recent transactions
          if (onManualAction) onManualAction('manual_exit', data);
          setShowManualHandlingModal(false);
        }}
      />

      {/* Visitor Pass Modal (renamed from Issue Temp Card) */}
      {showVisitorPassModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Visitor Pass</h2>
                  <p className="text-sm text-slate-500 mt-1">Auto-issued temporary parking card</p>
                </div>
                <div className={`text-center px-3 py-2 rounded-lg ${
                  cardStockRemaining < 5 
                    ? 'bg-red-100 text-red-700' 
                    : cardStockRemaining < 10 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  <p className="text-xs uppercase font-semibold">Available</p>
                  <p className="text-lg font-bold">{cardStockRemaining}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0">
              <button
                onClick={() => setVisitorPassTab('issue')}
                className={`flex-1 py-4 px-4 font-semibold text-center transition-colors border-b-2 ${
                  visitorPassTab === 'issue'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-800'
                }`}
              >
                Issue Card
              </button>
              <button
                onClick={() => setVisitorPassTab('return')}
                className={`flex-1 py-4 px-4 font-semibold text-center transition-colors border-b-2 ${
                  visitorPassTab === 'return'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-800'
                }`}
              >
                Return Card
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {visitorPassTab === 'issue' ? (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <strong>License Plate:</strong> AAA-0001 (Scanned)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option>Motorbike / E-Motorbike - ₫5,000</option>
                      <option>Car - ₫10,000</option>
                    </select>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs text-emerald-700">
                      <strong>Fee:</strong> One-time payment per visit (entry to exit)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <strong>License Plate:</strong> AAA-0001 (Scanned)
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Fee Paid:</strong> ₫5,000 (Motorbike)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Refund Method</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Mobile Payment</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowVisitorPassModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (visitorPassTab === 'issue') {
                    if (cardStockRemaining > 0) {
                      setCardStockRemaining(cardStockRemaining - 1);
                      alert(`✓ Visitor pass issued! Remaining stock: ${cardStockRemaining - 1}`);
                      setShowVisitorPassModal(false);
                    } else {
                      alert('⚠ No cards available in stock!');
                    }
                  } else {
                    setCardStockRemaining(cardStockRemaining + 1);
                    alert(`✓ Card returned successfully! Stock updated: ${cardStockRemaining + 1}`);
                    setShowVisitorPassModal(false);
                  }
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  visitorPassTab === 'issue' && cardStockRemaining === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={visitorPassTab === 'issue' && cardStockRemaining === 0}
              >
                {visitorPassTab === 'issue' ? 'Issue Pass' : 'Return Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lost Card Modal */}
      {showLostCardModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 text-red-700">Lost Card Report</h2>
              <p className="text-sm text-slate-500 mt-1">Process refund & issue new card</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-slate-600"><strong>License Plate:</strong> AAA-0001 (Scanned)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none">
                  <option>Motorbike / E-Motorbike - ₫5,000</option>
                  <option>Car - ₫10,000</option>
                </select>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700"><strong>Action:</strong> Auto-refund + Issue new card (no charge)</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowLostCardModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Lost card processed: Refund issued ₫5,000-10,000 + New card issued');
                  setShowLostCardModal(false);
                }}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Gate Override Modal */}
      {showEmergencyOverrideModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 text-orange-700">Emergency Override</h2>
              <p className="text-sm text-slate-500 mt-1">Manual gate control</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Gate</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                  <option>Gate 1 (Entry)</option>
                  <option>Gate 2 (Exit)</option>
                  <option>Gate 3 (Entry)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                  <option>Power Loss</option>
                  <option>Equipment Malfunction</option>
                  <option>Emergency Exit</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-700"><strong>Note:</strong> Action logged with timestamp for audit trail</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setShowEmergencyOverrideModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Gate opened manually - Event logged for audit');
                  setShowEmergencyOverrideModal(false);
                }}
                className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Open Gate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Exit Modal - REMOVED, now using ManualEntryModal simplified version */}
    </div>
  );
}