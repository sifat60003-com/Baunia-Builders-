import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, User, LogIn, ArrowLeft } from 'lucide-react';
import defaultLogo from '../../assets/images/baunia_builders_logo_1787932825880.jpg';

interface LoginViewProps {
  onBack?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack }) => {
  const { users, setCurrentUser, settings, showToast, setIsAuthenticated } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const rawLogo = settings.logoUrl;
  const logoSrc = (rawLogo && !rawLogo.includes('1787927051112')) ? rawLogo : defaultLogo;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      // In this demo, phone number or username and password (which is same as username for demo) are checked
      const user = users.find(u => 
        (u.phone === cleanUser || u.email === cleanUser || (u as any).username === cleanUser)
      );

      if (user && cleanPass === cleanUser) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        try {
          localStorage.setItem('BAUNIA_BUILDERS_AUTH_SESSION_V2', JSON.stringify({
            isAuthenticated: true,
            userId: user.id,
            role: user.role,
            user: user
          }));
        } catch (e) {}
        showToast('লগইন সফল হয়েছে!', 'success');
      } else {
        showToast('ভুল ইউজার আইডি বা পাসওয়ার্ড', 'error');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] selection:bg-blue-600 selection:text-white">
      {onBack && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm border border-slate-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl shadow-blue-900/10 ring-2 ring-slate-200/80 flex items-center justify-center overflow-hidden">
            <img 
              src={logoSrc} 
              alt="বাউনিয়া বিল্ডার্স লোগো" 
              onError={(e) => { e.currentTarget.src = defaultLogo; }}
              className="w-full h-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {settings.nameBn}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          প্রশাসনিক ড্যাশবোর্ড প্যানেল
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700">
                ইউজার আইডি (User / Phone)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">
                পাসওয়ার্ড (Password)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-slate-50 font-mono"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    লগইন করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
