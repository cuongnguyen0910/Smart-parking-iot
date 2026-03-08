import React from 'react';
import { 
  Fingerprint, 
  UserPlus, 
  ArrowRight, 
  HelpCircle, 
  Languages, 
  Moon,
  ParkingCircle,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
  onVisitor: () => void;
}

export default function Login({ onLogin, onVisitor }: LoginProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background-light">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://picsum.photos/seed/campus/1200/800')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <ParkingCircle size={32} className="text-primary" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">HCMUT Smart Parking</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 rounded-2xl max-w-lg"
          >
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">Vibrant. Fast. Secure.</h1>
            <p className="text-white/90 text-lg leading-relaxed">Experience the next generation of campus mobility. Find your spot in seconds with our AI-powered parking management system.</p>
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">2.4k+</span>
                <span className="text-white/70 text-sm">Active Users</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">98%</span>
                <span className="text-white/70 text-sm">Accuracy Rate</span>
              </div>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Zap size={14} />
            Powered by HCMUT Tech Services
          </div>
        </div>
      </div>

      {/* Right Side: Login Controls */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
            <ParkingCircle size={24} className="text-white" />
          </div>
          <h2 className="text-slate-900 text-xl font-bold">Smart Parking</h2>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back!</h2>
            <p className="text-slate-500">Please sign in to access your parking dashboard.</p>
          </div>

          {/* Main Action: SSO Login */}
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg mb-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Fingerprint size={24} />
            Login with HCMUT SSO
          </button>

          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Secondary Action: Visitor */}
          <button 
            onClick={onVisitor}
            className="w-full group cursor-pointer bg-primary/5 hover:bg-primary/10 border border-primary/10 p-6 rounded-2xl transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <UserPlus size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Continue as Visitor</h3>
                  <p className="text-slate-500 text-sm leading-tight">Explore availability without an account</p>
                </div>
              </div>
              <ArrowRight size={24} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Footer Links */}
          <div className="mt-12 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <a className="text-primary hover:underline font-semibold flex items-center gap-1" href="#">
                <HelpCircle size={16} />
                Need help?
              </a>
              <a className="text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Languages size={20} />
              </button>
              <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Moon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
