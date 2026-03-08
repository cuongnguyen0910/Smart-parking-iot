import React from 'react';

export const Signage: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Signage Control</h2>
          <p className="text-slate-500 mt-1">Manage LED displays and real-time guidance signage across the campus.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-primary transition-colors">Broadcast Message</button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">Update All Displays</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Main Entrance Display (LED-01)</h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase">Live Preview</span>
            </div>
            <div className="p-8 bg-slate-900">
              <div className="aspect-video bg-black rounded-xl border-4 border-slate-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00ff00 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                <h4 className="text-primary text-5xl font-black tracking-tighter mb-4 text-center">WELCOME TO HCMUT</h4>
                <div className="flex gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Available Spaces</p>
                    <p className="text-emerald-400 text-6xl font-black font-mono">248</p>
                  </div>
                  <div className="w-px h-16 bg-slate-800"></div>
                  <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-primary text-6xl font-black">OPEN</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 overflow-hidden">
                  <div className="whitespace-nowrap animate-marquee text-primary/40 text-[10px] font-bold uppercase tracking-[0.3em]">
                    PLEASE DRIVE SLOWLY • OBSERVE PARKING RULES • CONTACT SECURITY FOR ASSISTANCE • HAVE A NICE DAY • 
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Brightness</label>
                <input className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" defaultValue="85"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Refresh Rate</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg text-xs font-bold px-2 py-1 focus:ring-0">
                  <option>Real-time (1s)</option>
                  <option>Balanced (5s)</option>
                  <option>Power Save (30s)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Power Mode</label>
                <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                  <button className="flex-1 py-1 text-[10px] font-bold bg-primary text-white rounded-md">AUTO</button>
                  <button className="flex-1 py-1 text-[10px] font-bold text-slate-500">ECO</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Active Signage Nodes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Display ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Content</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'LED-01', loc: 'Main Entrance', content: 'Welcome + Availability', status: 'Online' },
                    { id: 'LED-02', loc: 'Zone A Exit', content: 'Thank You + Traffic Info', status: 'Online' },
                    { id: 'LED-03', loc: 'Level 1 Ramp', content: 'Directional Guidance', status: 'Offline' },
                    { id: 'LED-04', loc: 'Level 2 Elevator', content: 'Safety Reminders', status: 'Online' },
                  ].map((node, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{node.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{node.loc}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 italic">{node.content}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                          node.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>{node.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Quick Content Editor</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Header Text</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" defaultValue="WELCOME TO HCMUT" type="text"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Marquee Message</label>
                <textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" defaultValue="PLEASE DRIVE SLOWLY • OBSERVE PARKING RULES • CONTACT SECURITY FOR ASSISTANCE"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theme Color</label>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-sm ring-2 ring-primary"></button>
                  <button className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></button>
                  <button className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-sm"></button>
                  <button className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-sm"></button>
                  <button className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-sm"></button>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">Push to Display</button>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h4 className="font-bold text-sm text-primary mb-2">Emergency Override</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">In case of emergency, use the global override to display evacuation routes on all campus signage.</p>
            <button className="w-full py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-600/20">ACTIVATE EMERGENCY MODE</button>
          </div>
        </div>
      </div>
    </div>
  );
};
