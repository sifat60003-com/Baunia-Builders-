import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Building2, 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  Phone, 
  CreditCard, 
  MapPin, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Briefcase
} from 'lucide-react';
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
      <header className="bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-200 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10">
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
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shadow-xs"
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
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => {
                  setCurrentView('home');
                  setHasSearched(false);
                  setSearchPhone('');
                }}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                ফিরে যান
              </button>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                সদস্য পোর্টাল
              </span>
            </div>
            
            <div className="p-5 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 transform rotate-3">
                  <Search className="w-7 h-7 transform -rotate-3" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">সদস্য তথ্য ও জমা অনুসন্ধান</h2>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">আপনার জমা করা টাকা, শেয়ার ও নমিনি তথ্য দেখতে মোবাইল বা সদস্য নম্বর দিয়ে অনুসন্ধান করুন</p>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 mb-8 max-w-xl mx-auto">
                <input 
                  type="tel"
                  placeholder="মোবাইল বা সদস্য নম্বর (যেমন: 01833...)"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-2xl px-4 py-3 focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 font-medium text-center sm:text-left text-base transition-all font-mono"
                />
                <button 
                  type="submit"
                  disabled={!searchPhone.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>অনুসন্ধান করুন</span>
                </button>
              </form>

              {hasSearched && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  {searchedMember ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
                      
                      {/* Member Profile Header */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md">
                        {searchedMember.photoUrl ? (
                          <img
                            src={searchedMember.photoUrl}
                            alt={searchedMember.nameBn}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0 bg-slate-800"
                          />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 ring-4 ring-white/20 shadow-lg">
                            <User className="w-10 h-10 sm:w-12 sm:h-12" />
                          </div>
                        )}

                        <div className="flex-1 text-center sm:text-left space-y-1">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight">{searchedMember.nameBn}</h3>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              সক্রিয় সদস্য
                            </span>
                          </div>

                          {searchedMember.nameEn && (
                            <p className="text-slate-300 text-xs font-medium">{searchedMember.nameEn}</p>
                          )}

                          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                            <span className="bg-white/10 px-2.5 py-1 rounded-lg font-mono font-bold text-amber-300">
                              সদস্য নং: {searchedMember.memberNo || searchedMember.id}
                            </span>
                            {searchedMember.joinDate && (
                              <span className="flex items-center gap-1 text-slate-300">
                                <Calendar className="w-3.5 h-3.5" />
                                যোগদান: {searchedMember.joinDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Member Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* NID Number */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-500">এনআইডি (NID) নম্বর</p>
                            <p className="text-xs font-bold text-slate-800 font-mono truncate">
                              {searchedMember.nid || 'প্রদান করা হয়নি'}
                            </p>
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-500">মোবাইল নম্বর</p>
                            <p className="text-xs font-bold text-slate-800 font-mono truncate">
                              {searchedMember.mobile}
                            </p>
                          </div>
                        </div>

                        {/* Occupation */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-500">পেশা</p>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {searchedMember.occupation || 'ব্যবসায়ী'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Metrics Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/70">
                          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1">মোট শেয়ার</p>
                          <p className="font-black text-blue-950 text-2xl sm:text-3xl">{searchedMember.shareQty || 1} টি</p>
                        </div>

                        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70">
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">মোট জমা টাকা</p>
                          <p className="font-black text-emerald-700 text-xl sm:text-2xl">
                            ৳ {getMemberTotalDeposit(searchedMember).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="col-span-2 sm:col-span-1 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70">
                          <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">মাসিক চাঁদা</p>
                          <p className="font-black text-amber-900 text-xl sm:text-2xl">
                            ৳ {((searchedMember.shareQty || 1) * 2000).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Nominee Details Section */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">মনোনীত ব্যক্তি / নমিনি তথ্য</h4>
                        </div>

                        {searchedMember.nominees && searchedMember.nominees.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {searchedMember.nominees.map((nominee: any, idx: number) => (
                              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {nominee.photoUrl ? (
                                  <img 
                                    src={nominee.photoUrl} 
                                    alt={nominee.name} 
                                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-300 shrink-0 bg-white"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                    <User className="w-7 h-7" />
                                  </div>
                                )}

                                <div className="flex-1 space-y-1 w-full">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                                      {nominee.name || 'নমিনি নাম প্রদান করা হয়নি'}
                                    </h5>
                                    <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                                      শেয়ার অংশ: {nominee.percentage || 100}%
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                                    <div>
                                      <span className="font-medium text-slate-400">সম্পর্ক:</span>{' '}
                                      <span className="font-semibold text-slate-800">{nominee.relation || 'এন/এ'}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-slate-400">এনআইডি/জন্ম সনদ:</span>{' '}
                                      <span className="font-semibold text-slate-800 font-mono">{nominee.nidBirthReg || 'প্রদান করা হয়নি'}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-slate-400">মোবাইল:</span>{' '}
                                      <span className="font-semibold text-slate-800 font-mono">{nominee.mobile || 'প্রদান করা হয়নি'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                            কোনো নমিনির তথ্য অন্তর্ভুক্ত করা নেই।
                          </p>
                        )}
                      </div>

                      <div className="text-center pt-2">
                        <p className="text-[11px] text-slate-500 font-medium">* বাউনিয়া বিল্ডার্স অফিসিয়াল ডেটাবেস থেকে তথ্য প্রদর্সিত হচ্ছে</p>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center p-8 bg-rose-50 rounded-3xl border border-rose-200 shadow-sm max-w-lg mx-auto">
                      <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Users className="w-7 h-7" />
                      </div>
                      <p className="font-bold text-rose-800 text-lg mb-1">সদস্য পাওয়া যায়নি</p>
                      <p className="text-xs sm:text-sm text-rose-600/80 font-medium">এই নম্বর দিয়ে কোনো সদস্য পাওয়া যায়নি। দয়া করে সঠিক মোবাইল নম্বর বা সদস্য নং দিয়ে আবার চেষ্টা করুন।</p>
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
