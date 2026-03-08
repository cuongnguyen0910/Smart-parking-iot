import React from 'react';

export const Users: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Users & Privileges</h2>
          <p className="text-slate-500 mt-1">Manage system access, roles, and administrative permissions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-primary transition-colors">Export List</button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">Add New User</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-lg">System Administrators</h3>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">24 Total</span>
              </div>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64" placeholder="Search users..." type="text"/>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Alex Rivera', email: 'a.rivera@shell4.io', role: 'Super Admin', active: '2 mins ago', status: 'Active', color: 'indigo' },
                  { name: 'Sarah Chen', email: 's.chen@shell4.io', role: 'Security Lead', active: '14 mins ago', status: 'Active', color: 'emerald' },
                  { name: 'Marcus Thorne', email: 'm.thorne@shell4.io', role: 'IoT Technician', active: '2 hours ago', status: 'Inactive', color: 'amber' },
                  { name: 'Elena Vance', email: 'e.vance@shell4.io', role: 'Billing Admin', active: 'Yesterday', status: 'Active', color: 'rose' },
                  { name: 'David Kim', email: 'd.kim@shell4.io', role: 'Support Agent', active: '3 days ago', status: 'Suspended', color: 'slate' },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${user.color}-100 flex items-center justify-center text-${user.color}-600 font-bold text-sm`}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{user.active}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        user.status === 'Inactive' ? 'bg-slate-500/10 text-slate-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Role Management</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold">Super Admin</p>
                  <span className="text-[10px] font-bold text-primary">Full Access</span>
                </div>
                <p className="text-[10px] text-slate-500">Can manage all system settings, users, and billing.</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold">Security Lead</p>
                  <span className="text-[10px] font-bold text-emerald-600">IoT & Audit</span>
                </div>
                <p className="text-[10px] text-slate-500">Access to IoT monitoring, signage, and audit logs.</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold">Billing Admin</p>
                  <span className="text-[10px] font-bold text-rose-600">Finance Only</span>
                </div>
                <p className="text-[10px] text-slate-500">Can manage pricing plans and view revenue reports.</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 text-xs font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">Edit Role Permissions</button>
          </div>

          <div className="bg-gradient-to-br from-primary to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl mb-4">verified_user</span>
            <h4 className="font-bold text-lg leading-tight">Security Protocol</h4>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">Two-factor authentication (2FA) is currently mandatory for all Super Admin accounts.</p>
            <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">Review Security Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};
