import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your administrative profile and system preferences.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">Profile Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                  <span className="material-symbols-outlined text-4xl">person</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <div>
                <h4 className="font-bold text-lg">Nguyen Duy Dang</h4>
                <p className="text-sm text-slate-500">Super Administrator • ID: #HCMUT-001</p>
                <p className="text-xs text-slate-400 mt-1">nguyenduydang225@gmail.com</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" defaultValue="Nguyen Duy Dang" type="text"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" defaultValue="nguyenduydang225@gmail.com" type="email"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" defaultValue="+84 123 456 789" type="tel"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" defaultValue="Infrastructure Management" type="text"/>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">Save Changes</button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">System Configuration</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Dark Mode</p>
                  <p className="text-xs text-slate-500">Enable dark theme for the entire dashboard.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox"/>
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div>
                  <p className="text-sm font-bold">System Notifications</p>
                  <p className="text-xs text-slate-500">Receive alerts for hardware malfunctions and peak occupancy.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox"/>
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined">language</span>
                </div>
                <div>
                  <p className="text-sm font-bold">System Language</p>
                  <p className="text-xs text-slate-500">Choose your preferred language for the interface.</p>
                </div>
              </div>
              <select className="bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-0">
                <option>English (US)</option>
                <option>Vietnamese (VN)</option>
                <option>French (FR)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-rose-100">
            <h3 className="font-bold text-lg text-rose-900">Security & Privacy</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-rose-100 hover:border-rose-300 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account security credentials.</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-rose-100 hover:border-rose-300 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">ENABLED</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
