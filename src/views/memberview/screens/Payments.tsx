import React from 'react';
import { 
  Bell, 
  QrCode, 
  Bike, 
  Car, 
  Edit2, 
  LogIn, 
  LogOut, 
  CreditCard,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Payments() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Parking & Vehicles</h2>
          <p className="text-slate-500 text-sm">Manage your parking plans and vehicle information.</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600">
          <Bell size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-widest">Active Parking Plan</p>
                <h3 className="text-4xl font-extrabold tracking-tight">Monthly Pass</h3>
                <div className="flex items-center gap-4 mt-4">
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs">Zone: Central Lot A</div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">59-X3 123.45</div>
                </div>
                <p className="text-blue-100/80 text-sm mt-6 flex items-center gap-1">
                  <Calendar size={14} /> Valid until: 30 Sep 2024
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center">
                <Car size={32} />
              </div>
            </div>
            <div className="mt-10">
              <button className="w-full bg-white text-primary font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                <RefreshCw size={20} /> Extend Plan Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <QrCode size={20} className="text-primary" /> Quick Renewal
          </h3>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-40 h-40 bg-white p-2 rounded-xl border-4 border-primary/10">
              <img 
                alt="QR Code" 
                className="w-full h-full" 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HCMUT-SMART-PARKING-RENEWAL" 
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-center text-slate-500">Scan to top-up parking balance or quick-renew your current plan</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Wallets</p>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-pink-50 rounded-lg flex items-center justify-center border border-pink-100 cursor-pointer">
                <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center text-white font-black text-[8px]">MoMo</div>
              </div>
              <div className="flex-1 h-10 bg-sky-50 rounded-lg flex items-center justify-center border border-sky-100 cursor-pointer">
                <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center text-white font-black text-[8px]">ZP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">My Vehicles</h3>
            <button className="text-primary text-sm font-bold hover:underline">+ Add Vehicle</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-primary/30 shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Bike size={30} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">Honda Winner X</p>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">PRIMARY</span>
                </div>
                <p className="text-lg font-mono font-bold text-primary">59-X3 123.45</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <Edit2 size={18} />
              </button>
            </div>
            <div className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-primary/20 transition-all cursor-pointer shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <Car size={30} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Toyota Vios</p>
                <p className="text-lg font-mono font-bold text-slate-500">51-A 999.99</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <Edit2 size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-slate-500 text-sm font-medium hover:text-primary transition-colors">View History</button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {[
                { type: 'Entry', loc: 'Central Lot A', time: 'Today, 07:30 AM', status: 'Parked', icon: LogIn, color: 'blue' },
                { type: 'Exit', loc: 'Central Lot A', time: 'Yesterday, 05:45 PM', status: 'Closed', icon: LogOut, color: 'slate' },
                { type: 'Plan Renewal', loc: '30 Days', time: 'Aug 30, 10:20 AM', status: '- ₫ 150.000', icon: CreditCard, color: 'green' },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className={`w-10 h-10 rounded-full bg-${act.color}-100 text-${act.color}-600 flex items-center justify-center`}>
                    <act.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{act.type}: {act.loc}</p>
                    <p className="text-xs text-slate-500">{act.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${act.color === 'green' ? 'text-green-600' : act.color === 'blue' ? 'text-blue-600' : 'text-slate-400'}`}>
                      {act.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
