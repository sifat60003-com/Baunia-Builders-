import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Building2, LogIn, User, ArrowLeft, ShieldCheck, Users } from 'lucide-react';
import { LoginView } from '../auth/LoginView';

type PortalView = 'home' | 'member_search' | 'login';

export const PublicPortal: React.FC = () => {
  const { members, settings, receipts } = useApp();
  const [currentView, setCurrentView] = useState<PortalView>('home');
  
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedMember, setSearchedMember] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    const query = searchPhone.trim();
    const cleanDigits = query.replace(/[^0-9]/g, '');

    const found = members.find(m => {
      const mobDigits = (m.mobile || '').replace(/[^0-9]/g, '');
      const altDigits = (m.altMobile || '').replace(/[^0-9]/g, '');
      const memberNoStr = String(m.memberNo || '');

      return (
        m.mobile === query ||
        m.altMobile === query ||
        (cleanDigits.length > 0 && mobDigits === cleanDigits) ||
        (cleanDigits.length > 0 && altDigits === cleanDigits) ||
        (cleanDigits.length > 0 && memberNoStr === cleanDigits) ||
        (m.mobile && m.mobile.includes(query))
      );
    });

    setSearchedMember(found || null);
    setHasSearched(true);
  };

  // Helper to calculate actual deposit from receipts and member profile
  const getMemberTotalDeposit = (member: any) => {
    if (!member) return 0;

    const memberReceipts = receipts.filter(r => 
      r.memberId === member.id && 
      r.status !== 'cancelled'
    );

    const receiptsDeposit = memberReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const profileDeposit = Number(member.currentDeposit) || Number(member.openingBalance) || 0;

    return Math.max(receiptsDeposit, profileDeposit);
  };

  if (currentView === 'login') {
    return <LoginView onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 transform -rotate-3">
            <Building2 className="w-5 h-5 text-white transform rotate-3" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base sm:text-lg leading-tight tracking-tight">{settings.nameBn}</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">অফিসিয়াল পোর্টাল</p>
          </div>
        </div>
        
        {currentView === 'member_search' && (
          <button 
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">অ্যাডমিন লগইন</span>
            <span className="sm:hidden">লগইন</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        
        {currentView === 'home' && (
          <div className="w-full max-w-2xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">স্বাগতম!</h2>
              <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto">
                অনুগ্রহ করে আপনার প্রয়োজনীয় পোর্টালটি নির্বাচন করুন।
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
              {/* Member Button */}
              <button
                onClick={() => setCurrentView('member_search')}
                className="group flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-3xl border-2 border-transparent hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/10 transition-all cursor-pointer shadow-xl shadow-slate-200/50"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Users className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">সদস্য</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">জমা টাকার পরিমাণ দেখুন</p>
                </div>
              </button>

              {/* Admin Button */}
              <button
                onClick={() => setCurrentView('login')}
                className="group flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-3xl border-2 border-transparent hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 transition-all cursor-pointer shadow-xl shadow-slate-200/50"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300">
                  <ShieldCheck className="w-10 h-10 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">অ্যাডমিন</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">ড্যাশবোর্ড প্যানেলে লগইন</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {currentView === 'member_search' && (
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-2">
              <button 
                onClick={() => {
                  setCurrentView('home');
                  setHasSearched(false);
                  setSearchPhone('');
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg transition text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                ফিরে যান
              </button>
            </div>
            
            <div className="p-6 sm:p-8 pt-2">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transform rotate-3">
                  <Search className="w-8 h-8 transform -rotate-3" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">সদস্য অনুসন্ধান</h2>
                <p className="text-slate-500 text-sm font-medium">আপনার জমা করা টাকার পরিমাণ দেখতে রেজিস্টার্ড মোবাইল নম্বর দিয়ে অনুসন্ধান করুন</p>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-3 mb-6">
                <input 
                  type="tel"
                  placeholder="মোবাইল নম্বর (যেমন: 01XXXXXXXXX)"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-medium text-center text-lg transition-all"
                />
                <button 
                  type="submit"
                  disabled={!searchPhone.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <Search className="w-5 h-5" />
                  অনুসন্ধান করুন
                </button>
              </form>

              {hasSearched && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                  {searchedMember ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-emerald-100/50">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-emerald-950 text-lg sm:text-xl leading-tight">{searchedMember.nameBn}</h3>
                          <p className="text-emerald-700 text-sm font-medium mt-0.5">সদস্য নং: {searchedMember.memberNo}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100/50">
                          <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">মোট শেয়ার</p>
                          <p className="font-extrabold text-slate-800 text-2xl">{searchedMember.shareQty}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100/50">
                          <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">মোট জমা</p>
                          <p className="font-extrabold text-emerald-600 text-2xl">
                            ৳ {getMemberTotalDeposit(searchedMember).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                         <p className="text-[11px] text-emerald-600/70 font-medium">* শুধু অনুমোদিত রশিদগুলোর হিসাব দেখানো হয়েছে</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm">
                      <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-rose-800 text-lg mb-1">সদস্য পাওয়া যায়নি</p>
                      <p className="text-sm text-rose-600/80 font-medium">এই মোবাইল নম্বর দিয়ে কোনো সদস্য রেজিস্টার করা নেই। দয়া করে সঠিক নম্বরটি দিন।</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
