import React from 'react';
import { 
  Search, 
  PlusCircle, 
  Bike, 
  Car, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard,
  Timer,
  Ban,
  ArrowRightLeft,
  Wallet,
  ExternalLink,
  Mail
} from 'lucide-react';

export default function ManualHandling() {
  const sessions = [
    { vehicle: '59P1-998.23', id: '2010884', time: '08:45 AM', gate: 'Gate A1', status: 'LOST CARD', type: 'bike' },
    { vehicle: '51H-123.45', id: 'Guest', time: '09:12 AM', gate: 'Gate B2', status: 'MANUAL REQ', type: 'car' },
  ];

  const logs = [
    { action: 'Manual Exit approved for 59X3-122.90', sub: 'Resolved by Operator 10293 • 5 mins ago', icon: CheckCircle, color: 'emerald' },
    { action: 'Temporary Pass issued for 2012903 (Staff)', sub: 'Loss of card reported • 14 mins ago', icon: CreditCard, color: 'slate' },
    { action: 'Emergency Gate Override triggered at Gate A1', sub: 'Fire Alarm test signal • 32 mins ago', icon: AlertTriangle, color: 'amber' },
  ];

  const stats = [
    { label: 'Lost Cards (Today)', value: '12', icon: Ban },
    { label: 'Manual Exits', value: '45', icon: ArrowRightLeft },
    { label: 'Lost Fee Total', value: '600k VND', icon: Wallet },
    { label: 'Avg Resolve Time', value: '2.4m', icon: Timer },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Manual Handling</h2>
          <p className="text-slate-500 mt-1">Resolve lost card issues and manual gate overrides for exceptions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition-colors">
            Help Docs
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-shadow shadow-md shadow-primary/20">
            Emergency Open
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Search & Forms */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Search Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Search className="text-primary" size={20} /> Find Active Session
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="License Plate or Student ID..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </section>

          {/* Issue Pass Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PlusCircle className="text-primary" size={20} /> Manual Entry / Override
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Vehicle License Plate</label>
                <input 
                  type="text" 
                  placeholder="e.g. 59P1-12345"
                  className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Student/Staff ID (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2010123"
                  className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Reason for Manual Handling</label>
                <select className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none">
                  <option>Lost RFID Card</option>
                  <option>Damaged RFID Card</option>
                  <option>Plate Recognition Failure</option>
                  <option>Guest / VIP Entry</option>
                  <option>Emergency Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Supervisor Override Code</label>
                <input 
                  type="password" 
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 tracking-widest focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button className="w-full py-3.5 rounded-xl border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
                  Issue Temp Pass
                </button>
                <button className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-shadow shadow-sm shadow-primary/20">
                  Manual Exit
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Active Sessions & Logs */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Active Exception Sessions */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Unresolved Entry Sessions</h3>
              <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">4 PENDING</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Entry Time</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((session, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            {session.type === 'bike' ? <Bike size={16} /> : <Car size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{session.vehicle}</p>
                            <p className="text-xs text-slate-500">ID: {session.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{session.time}</p>
                        <p className="text-xs text-slate-400">{session.gate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
                          session.status === 'LOST CARD' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <span className={`size-1.5 rounded-full ${session.status === 'LOST CARD' ? 'bg-red-600' : 'bg-blue-600'}`}></span>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary font-bold text-sm hover:underline">
                          {session.status === 'LOST CARD' ? 'Release Gate' : 'Mark Paid'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity Log */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6">Recent Activity Logs</h3>
            <div className="space-y-6">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    log.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    log.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <log.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm group-hover:text-primary transition-colors">
                      {log.action.split(log.action.includes('59X3') ? '59X3' : log.action.includes('2012903') ? '2012903' : 'Gate A1').map((part, index, array) => (
                        <React.Fragment key={index}>
                          {part}
                          {index < array.length - 1 && <span className="font-bold text-slate-900">
                            {log.action.includes('59X3') ? '59X3-122.90' : log.action.includes('2012903') ? '2012903' : 'Gate A1'}
                          </span>}
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{log.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
