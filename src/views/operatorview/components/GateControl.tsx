import React from 'react';
import { 
  Search, 
  Bell, 
  DoorOpen, 
  DoorClosed, 
  Lock, 
  AlertCircle,
  Video,
  Signal,
  History,
  ChevronRight,
  Mail,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function GateControl() {
  const gates = [
    { 
      id: 'A', 
      name: 'Main Entrance', 
      zone: 'North Campus', 
      status: 'Online', 
      img: 'https://picsum.photos/seed/gateA_live/600/400',
      recTime: '10:45:22'
    },
    { 
      id: 'B', 
      name: 'Staff Parking', 
      zone: 'East Tower', 
      status: 'Alert', 
      img: 'https://picsum.photos/seed/gateB_live/600/400',
      alert: 'Obstruction Detected'
    },
    { 
      id: 'C', 
      name: 'Library Exit', 
      zone: 'Central Hub', 
      status: 'Offline', 
      img: '' 
    },
    { 
      id: 'D', 
      name: 'Dormitory Entry', 
      zone: 'Residential', 
      status: 'Online', 
      img: 'https://picsum.photos/seed/gateD_live/600/400'
    },
  ];

  const history = [
    { action: 'Gate A Opened Manually', user: 'By Operator Nguyen Van A', time: '10:42 AM', type: 'open' },
    { action: 'Gate B Emergency Locked', user: 'Auto-lock: Obstruction Sensor', time: '10:35 AM', type: 'lock' },
    { action: 'Gate D Closed Manually', user: 'By Admin System', time: '10:15 AM', type: 'close' },
    { action: 'Gate A Opened Manually', user: 'By Operator Nguyen Van A', time: '09:58 AM', type: 'open' },
    { action: 'Gate A Closed Manually', user: 'By Operator Nguyen Van A', time: '09:55 AM', type: 'close' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-black tracking-tight">Gate Control Center</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Live System</span>
          </div>
          <p className="text-slate-500 text-sm">Monitor and override gate mechanisms in real-time across the HCMUT campus.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">All Gates</button>
          <button className="px-6 py-2 text-slate-500 hover:text-primary rounded-lg text-sm font-bold transition-colors">Entrance</button>
          <button className="px-6 py-2 text-slate-500 hover:text-primary rounded-lg text-sm font-bold transition-colors">Exit</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Gate Panels Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {gates.map((gate) => (
            <div 
              key={gate.id} 
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${
                gate.status === 'Alert' ? 'border-2 border-amber-400' : 'border-slate-200'
              } ${gate.status === 'Offline' ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-sm">{gate.name} - Gate {gate.id}</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Zone: {gate.zone}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  gate.status === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                  gate.status === 'Alert' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {gate.status === 'Online' && <div className="size-2 rounded-full bg-emerald-500"></div>}
                  {gate.status === 'Alert' && <AlertCircle size={12} />}
                  {gate.status}
                </div>
              </div>

              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                {gate.status === 'Offline' ? (
                  <div className="text-center">
                    <Signal className="text-slate-400 mx-auto mb-2" size={48} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Connection Lost</p>
                  </div>
                ) : (
                  <>
                    <img 
                      src={gate.img} 
                      alt={gate.name} 
                      className={`w-full h-full object-cover opacity-80 ${gate.status === 'Alert' ? 'brightness-50' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Video className="text-white/50" size={40} />
                    </div>
                    {gate.recTime && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white font-mono">REC {gate.recTime}</div>
                    )}
                    {gate.alert && (
                      <div className="absolute inset-0 flex items-center justify-center border-4 border-amber-400">
                        <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse uppercase tracking-widest">
                          {gate.alert}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    disabled={gate.status === 'Offline' || gate.status === 'Alert'}
                    className={`flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all ${
                      (gate.status === 'Offline' || gate.status === 'Alert') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
                    }`}
                  >
                    <DoorOpen size={18} /> Open
                  </button>
                  <button 
                    disabled={gate.status === 'Offline'}
                    className={`flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-all ${
                      gate.status === 'Offline' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200'
                    }`}
                  >
                    <DoorClosed size={18} /> Close
                  </button>
                  <button 
                    disabled={gate.status === 'Offline'}
                    className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      gate.status === 'Alert' 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } ${gate.status === 'Offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Lock size={18} /> Emergency Lock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History Sidebar Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <History size={16} className="text-primary" /> Manual Override History
              </h4>
              <button className="text-[10px] font-bold text-primary hover:underline">Clear</button>
            </div>
            <div className="p-4 flex-1 space-y-5 overflow-y-auto max-h-[600px]">
              {history.map((item, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    item.type === 'open' ? 'bg-primary/10 text-primary' :
                    item.type === 'lock' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {item.type === 'open' ? <DoorOpen size={14} /> : 
                     item.type === 'lock' ? <Lock size={14} /> : 
                     <DoorClosed size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">{item.action}</p>
                    <p className="text-[10px] text-slate-500">{item.user}</p>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors">
                View Detailed Log Report
              </button>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-2xl text-white shadow-lg shadow-primary/20">
            <h5 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Cpu size={16} /> System Snapshot
            </h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Total Gates Active</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Alerts Pending</span>
                <span className="font-bold bg-white text-primary px-2 py-0.5 rounded-full">01</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Manual Actions (Today)</span>
                <span className="font-bold">48</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
