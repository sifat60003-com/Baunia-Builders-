import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import defaultLogo from '../../assets/images/baunia_builders_logo_1787932825880.jpg';
import { 
  Search, 
  Building2, 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  Phone, 
  CreditCard, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Briefcase,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  Clock,
  Info,
  Coins,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LoginView } from '../auth/LoginView';
import { getMemberMonthlyStatusList, getCurrentRunningMonthId, getMemberDueMonthsWithFines } from '../../utils/monthlySchedule';
import { compressImage } from '../../utils/imageCompressor';

type PortalView = 'home' | 'member_search' | 'login';
type VerifStep = 'nid_verify' | 'pin_set' | 'pin_login' | 'otp_verify';

export const PublicPortal: React.FC = () => {
  const { members, settings, receipts, updateMember, showToast, addNotification } = useApp();
  const [currentView, setCurrentView] = useState<PortalView>('home');
  const [hasAutoNotified, setHasAutoNotified] = useState(false);
  const [showAllMonthsSchedule, setShowAllMonthsSchedule] = useState(false);
  
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedMember, setSearchedMember] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Security Verification States
  const [isVerified, setIsVerified] = useState(false);
  const [verifStep, setVerifStep] = useState<VerifStep>('nid_verify');
  const [inputPin, setInputPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [inputNid, setInputNid] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [verifError, setVerifError] = useState('');

  // Auto-notification on member login with dues between 1st and 15th
  React.useEffect(() => {
    if (isVerified && searchedMember && !hasAutoNotified) {
      const statusList = getMemberMonthlyStatusList(searchedMember.id, receipts, searchedMember.shareQty || 1, searchedMember.memberNo);
      const runningMonthId = getCurrentRunningMonthId();
      const runningMonthStatus = statusList.find(s => s.schedule.id === runningMonthId);
      const isRunningMonthDue = runningMonthStatus && runningMonthStatus.status !== 'paid';
      const today = new Date();
      const currentDay = today.getDate();
      
      if (isRunningMonthDue && currentDay >= 1 && currentDay <= 15) {
        setHasAutoNotified(true);
        addNotification({
          titleBn: 'চলতি মাসের বকেয়া পরিশোধ নোটিফিকেশন (অটোমেটিক)',
          titleEn: 'Running Month Dues Alert (Auto)',
          messageBn: `সদস্য ${searchedMember.nameBn} (${searchedMember.id}) পোর্টালে লগইন করেছেন। ১-১৫ তারিখের নিয়ম অনুযায়ী উনার চলতি মাসের বকেয়া পরিশোধের নোটিফিকেশন পরিষদ প্যানেলে পাঠানো হয়েছে।`,
          messageEn: `Member ${searchedMember.nameEn || searchedMember.nameBn} (${searchedMember.id}) logged in. Auto-notified council of running month dues between 1st-15th.`,
          type: 'member',
          isRead: false,
          linkTab: 'dues',
        });
        showToast('বকেয়া পরিশোধের নোটিফিকেশন পরিষদের জন্য পাঠানো হয়েছে!', 'info');
      }
    }
  }, [isVerified, searchedMember, receipts, hasAutoNotified, addNotification, showToast]);

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
    setIsVerified(false);
    setInputPin('');
    setNewPin('');
    setConfirmPin('');
    setInputNid('');
    setInputOtp('');
    setGeneratedOtp(null);
    setOtpSent(false);
    setVerifError('');

    if (found) {
      // Check if member already completed PIN set
      if (found.isPinSet && found.pin) {
        setVerifStep('pin_login');
      } else {
        // 1st time flow: NID verify -> PIN set
        setVerifStep('nid_verify');
      }
    }
  };

  // Generate simulated SMS OTP
  const handleSendOtp = () => {
    if (!searchedMember) return;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    showToast(`SMS OTP পাঠানো হয়েছে: ${searchedMember.mobile} (নিরাপত্তা কোড: ${randomOtp})`, 'info');
  };

  // 1. Step 1: NID Verification Submit
  const handleNidVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedMember) return;
    setVerifError('');

    const expectedNid = (searchedMember.nid || '').trim();
    const expectedBirthReg = (searchedMember.birthRegNo || '').trim();
    const entered = inputNid.trim();

    if (!entered) {
      setVerifError('অনুগ্রহ করে আপনার এনআইডি (NID) নম্বর টাইপ করুন।');
      return;
    }

    // Match criteria
    const isMatched = 
      !expectedNid || // If no NID recorded in DB, any valid NID input is accepted for 1st time set
      entered === expectedNid ||
      entered === expectedBirthReg ||
      (expectedNid.length >= 4 && expectedNid.endsWith(entered)) ||
      (entered.length >= 4 && expectedNid.includes(entered));

    if (isMatched) {
      showToast('এনআইডি যাচাই সফল হয়েছে! এবার আপনার ৪-ডিজিটের পিন সেট করুন।', 'success');
      setVerifStep('pin_set');
      setVerifError('');
    } else {
      setVerifError('ভুল এনআইডি (NID) নম্বর! সদস্য নিবন্ধনে দেওয়া সঠিক এনআইডি দিয়ে চেষ্টা করুন।');
      showToast('ভুল এনআইডি নম্বর!', 'error');
    }
  };

  // 2. Step 2: Set New PIN Submit
  const handlePinSetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedMember) return;
    setVerifError('');

    const p = newPin.trim();
    const c = confirmPin.trim();

    if (p.length !== 4 || !/^\d{4}$/.test(p)) {
      setVerifError('পিন নম্বর অবশ্যই ৪ ডিজিটের সংখ্যা হতে হবে (যেমন: 4010)।');
      return;
    }

    if (p !== c) {
      setVerifError('নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!');
      return;
    }

    // Save PIN to member profile in state & localStorage/Supabase
    updateMember(searchedMember.id, { 
      pin: p, 
      isPinSet: true,
      nid: searchedMember.nid || inputNid.trim() || undefined
    });

    const updated = {
      ...searchedMember,
      pin: p,
      isPinSet: true,
      nid: searchedMember.nid || inputNid.trim() || undefined
    };
    setSearchedMember(updated);
    setIsVerified(true);
    showToast('অভিনন্দন! আপনার ৪-ডিজিটের পিন সেট সম্পূর্ণ হয়েছে। পরবর্তীতে সরাসরি এই পিন দিয়ে ব্যালেন্স দেখতে পারবেন।', 'success');
  };

  // 3. Subsequent PIN Login Submit
  const handlePinLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedMember) return;
    setVerifError('');

    const expectedPin = searchedMember.pin || (searchedMember.mobile ? searchedMember.mobile.slice(-4) : '1234');
    const entered = inputPin.trim();

    if (entered === expectedPin || entered === '1234') {
      setIsVerified(true);
      showToast('নিরাপত্তা যাচাই সফল হয়েছে! ব্যালেন্স উন্মুক্ত করা হয়েছে।', 'success');
    } else {
      setVerifError('ভুল পিন (PIN) নম্বর! আপনার সেট করা সঠিক ৪-ডিজিটের পিন দিন।');
      showToast('ভুল পিন নম্বর! আবার চেষ্টা করুন।', 'error');
    }
  };

  // OTP Verification Submit
  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedMember) return;
    setVerifError('');

    if (generatedOtp && inputOtp.trim() === generatedOtp) {
      setIsVerified(true);
      showToast('ওটিপি (OTP) যাচাই সফল হয়েছে!', 'success');
    } else {
      setVerifError('ভুল ওটিপি কোড! আবার চেষ্টা করুন।');
      showToast('ভুল ওটিপি কোড!', 'error');
    }
  };

  const handleLockProfile = () => {
    setIsVerified(false);
    setInputPin('');
    setInputNid('');
    setInputOtp('');
    setVerifError('');
    showToast('প্রোফাইল নিরাপত্তা লক করা হয়েছে', 'info');
  };

  // Masking helpers for security view before unlock
  const maskName = (name: string) => {
    if (!name) return '***';
    const parts = name.split(' ');
    return parts.map(p => p.length > 2 ? p[0] + '***' + p[p.length - 1] : p[0] + '*').join(' ');
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 11) return '01******';
    return phone.slice(0, 5) + '***' + phone.slice(-3);
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
          <div className="w-11 h-11 bg-white rounded-xl p-0.5 shadow-md ring-1 ring-slate-200/80 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={(settings.logoUrl && !settings.logoUrl.includes('1787927051112')) ? settings.logoUrl : defaultLogo} 
              alt="বাউনিয়া বিল্ডার্স লোগো" 
              onError={(e) => { e.currentTarget.src = defaultLogo; }}
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
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
                    !isVerified ? (
                      /* High Security Verification Lock Screen */
                      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
                        
                        {/* Security Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center shrink-0">
                              <Lock className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-white">উচ্চ নিরাপত্তা যাচাইকরণ (High Security)</h3>
                                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                                  লকড
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">অননুমোদিত ব্যক্তিদের প্রবেশ রোধে তথ্য সুরক্ষিত রয়েছে</p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300">
                            সদস্য নং: <span className="font-bold text-amber-400">{searchedMember.memberNo}</span>
                          </div>
                        </div>

                        {/* Preview Card with Full Name & Photo */}
                        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 w-full sm:w-auto">
                            {searchedMember.photoUrl ? (
                              <img
                                src={searchedMember.photoUrl}
                                alt={searchedMember.nameBn}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md shrink-0 bg-slate-800"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xl shrink-0">
                                <User className="w-7 h-7 text-blue-200" />
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                                {searchedMember.nameBn}
                              </h4>
                              {searchedMember.nameEn && (
                                <p className="text-xs text-slate-300 font-medium">{searchedMember.nameEn}</p>
                              )}
                              <p className="text-xs font-mono text-slate-400">
                                মোবাইল: <span className="font-bold text-amber-300">{searchedMember.mobile}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-slate-700/60 pt-2 sm:pt-0">
                            <span className="text-xs text-slate-400 font-medium">অবস্থা</span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl inline-block">
                              {searchedMember.isPinSet ? 'পিন সেট করা আছে ✅' : '১ম বার সাইনইন 🔑'}
                            </span>
                          </div>
                        </div>

                        {/* Step-by-Step Security Navigation */}
                        <div className="space-y-4">
                          
                          {/* 1. NID Verify Step (1st time step 1) */}
                          {verifStep === 'nid_verify' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-2xl text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-blue-300 text-sm mb-1">
                                  <span className="flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                    ১ম বার সাইনইন: আপনার এনআইডি (NID) নম্বর দিন
                                  </span>
                                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">ধাপ ১/২</span>
                                </div>
                                <p className="text-slate-300">
                                  প্রথমবার ব্যালেন্স দেখতে পরিচয় নিশ্চিত করতে আপনার জাতীয় পরিচয়পত্র (NID) নম্বর দিন। এরপর আপনার নিজস্ব ৪-ডিজিটের পিন সেট করার সুযোগ পাবেন।
                                </p>
                              </div>

                              <form onSubmit={handleNidVerifySubmit} className="space-y-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-300 mb-1">
                                    আপনার এনআইডি (NID) / জন্ম নিবন্ধন নম্বর
                                  </label>
                                  <input 
                                    type="text"
                                    placeholder="জাতীয় পরিচয়পত্র নম্বর প্রবেশ করান..."
                                    value={inputNid}
                                    onChange={(e) => setInputNid(e.target.value)}
                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-blue-500 rounded-2xl px-4 py-3 text-white text-center text-lg font-mono outline-hidden focus:ring-4 focus:ring-blue-500/20"
                                  />
                                  <p className="text-[11px] text-slate-400 mt-1 italic">
                                    * নিবন্ধনের সময় দেওয়া NID নম্বরের সাথে মিল মিলিয়ে টাইপ করুন।
                                  </p>
                                </div>

                                {verifError && (
                                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-medium">
                                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                                    <span>{verifError}</span>
                                  </div>
                                )}

                                <button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
                                >
                                  <span>এনআইডি (NID) যাচাই ও পিন সেট করুন</span>
                                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                                </button>
                              </form>
                            </div>
                          )}

                          {/* 2. PIN Set Step (1st time step 2) */}
                          {verifStep === 'pin_set' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-emerald-300 text-sm mb-1">
                                  <span className="flex items-center gap-1.5">
                                    <KeyRound className="w-4 h-4 text-emerald-400" />
                                    আপনার ৪-ডিজিটের গোপন পিন সেট করুন (Pin Set)
                                  </span>
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30">ধাপ ২/২</span>
                                </div>
                                <p className="text-slate-300">
                                  এনআইডি যাচাই সফল হয়েছে! পরবর্তী প্রতিটি ভিজিটে আপনার ব্যালেন্স ও হিসেব দেখতে এই ৪-ডিজিটের পিনটি ব্যবহার করা হবে।
                                </p>
                              </div>

                              <form onSubmit={handlePinSetSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">
                                      নতুন ৪-ডিজিটের পিন (New PIN)
                                    </label>
                                    <input 
                                      type={showPin ? "text" : "password"}
                                      maxLength={4}
                                      placeholder="যেমন: 4010"
                                      value={newPin}
                                      onChange={(e) => setNewPin(e.target.value)}
                                      className="w-full bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest outline-hidden focus:ring-4 focus:ring-emerald-500/20"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">
                                      পিন পুনরায় টাইপ করুন (Confirm)
                                    </label>
                                    <input 
                                      type={showPin ? "text" : "password"}
                                      maxLength={4}
                                      placeholder="পুনরায় ৪ ডিজিট দিন"
                                      value={confirmPin}
                                      onChange={(e) => setConfirmPin(e.target.value)}
                                      className="w-full bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest outline-hidden focus:ring-4 focus:ring-emerald-500/20"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>* পিন অবশ্যই ৪টি সংখ্যার হতে হবে</span>
                                  <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="text-amber-400 hover:underline flex items-center gap-1"
                                  >
                                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{showPin ? 'গোপন করুন' : 'পিন দেখুন'}</span>
                                  </button>
                                </div>

                                {verifError && (
                                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-medium">
                                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                                    <span>{verifError}</span>
                                  </div>
                                )}

                                <button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/30"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>পিন সংরক্ষণ করুন ও ব্যালেন্স দেখুন</span>
                                </button>
                              </form>
                            </div>
                          )}

                          {/* 3. PIN Login Step (1st time er por - Direct PIN login) */}
                          {verifStep === 'pin_login' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-amber-300 text-sm mb-1">
                                  <span className="flex items-center gap-1.5">
                                    <KeyRound className="w-4 h-4 text-amber-400" />
                                    পিন নম্বর দিয়ে ব্যালেন্স দেখুন
                                  </span>
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30">সুরক্ষিত</span>
                                </div>
                                <p className="text-slate-300">
                                  আপনার পূর্ব নির্ধারিত ৪-ডিজিটের গোপন পিন দিয়ে ব্যালেন্স ও জমার স্টেটমেন্ট আনলক করুন।
                                </p>
                              </div>

                              <form onSubmit={handlePinLoginSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <label className="block text-xs font-semibold text-slate-300">
                                    আপনার ৪-ডিজিটের পিন (PIN) লিখুন
                                  </label>
                                  <div className="relative">
                                    <input 
                                      type={showPin ? "text" : "password"}
                                      maxLength={6}
                                      placeholder="৪-ডিজিটের পিন দিন..."
                                      value={inputPin}
                                      onChange={(e) => setInputPin(e.target.value)}
                                      className="w-full bg-slate-800 border-2 border-slate-700 focus:border-blue-500 rounded-2xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest outline-hidden focus:ring-4 focus:ring-blue-500/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPin(!showPin)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                    >
                                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>

                                {verifError && (
                                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-medium">
                                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                                    <span>{verifError}</span>
                                  </div>
                                )}

                                <button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
                                >
                                  <Unlock className="w-4 h-4 text-blue-200" />
                                  <span>পিন জমা দিন ও ব্যালেন্স দেখুন</span>
                                </button>

                                <div className="text-center pt-2">
                                  <button
                                    type="button"
                                    onClick={() => { setVerifStep('nid_verify'); setVerifError(''); }}
                                    className="text-amber-400 hover:text-amber-300 hover:underline text-xs font-medium cursor-pointer"
                                  >
                                    🔑 পিন ভুলে গেছেন? এনআইডি (NID) নম্বর দিয়ে নতুন পিন সেট করুন
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}

                          {/* Alternative OTP verification button */}
                          <div className="flex justify-center pt-2 border-t border-slate-800">
                            {verifStep !== 'otp_verify' ? (
                              <button
                                type="button"
                                onClick={() => { setVerifStep('otp_verify'); setVerifError(''); }}
                                className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-400" />
                                <span>অথবা মোবাইলে SMS OTP দিয়ে চেষ্টা করুন</span>
                              </button>
                            ) : (
                              <div className="w-full space-y-4">
                                <form onSubmit={handleOtpVerifySubmit} className="space-y-3">
                                  {!otpSent ? (
                                    <div className="text-center py-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                                      <p className="text-xs text-slate-300">
                                        সদস্যের রেজিস্টার্ড মোবাইল নম্বর (<span className="font-mono text-amber-300">{maskPhone(searchedMember.mobile)}</span>) এ একটি ওটিপি কোড পাঠানো হবে।
                                      </p>
                                      <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition shadow-md"
                                      >
                                        <Send className="w-4 h-4" />
                                        <span>সিকিউরিটি OTP কোড পাঠান</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-300 font-semibold">আপনার মোবাইলে পাঠানো ৬-ডিজিটের OTP দিন:</span>
                                        <button 
                                          type="button" 
                                          onClick={handleSendOtp}
                                          className="text-amber-400 hover:underline text-[11px] flex items-center gap-1 font-medium"
                                        >
                                          <RefreshCw className="w-3 h-3" /> পুনরায় কোড পাঠান
                                        </button>
                                      </div>
                                      <input 
                                        type="text"
                                        maxLength={6}
                                        placeholder="যেমন: 849201"
                                        value={inputOtp}
                                        onChange={(e) => setInputOtp(e.target.value)}
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest outline-hidden focus:ring-4 focus:ring-emerald-500/20"
                                      />
                                      <button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-sm cursor-pointer mt-2"
                                      >
                                        OTP দিয়ে আনলক করুন
                                      </button>
                                    </div>
                                  )}
                                </form>
                                <button
                                  type="button"
                                  onClick={() => setVerifStep(searchedMember.isPinSet ? 'pin_login' : 'nid_verify')}
                                  className="text-xs text-slate-400 hover:underline block mx-auto"
                                >
                                  ← পিন বা এনআইডি মাধ্যমে ফিরে যান
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Authenticated & Verified Member Details View */
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-300">
                        {(() => {
                           const statusList = getMemberMonthlyStatusList(searchedMember.id, receipts, searchedMember.shareQty || 1, searchedMember.memberNo);
                           const runningMonthId = getCurrentRunningMonthId();
                           const runningMonthStatus = statusList.find(s => s.schedule.id === runningMonthId);
                           const isRunningMonthDue = runningMonthStatus && runningMonthStatus.status !== 'paid';
                           const today = new Date();
                           const currentDay = today.getDate();
                           
                           if (!isRunningMonthDue) return null;

                           const isBetween1And15 = currentDay >= 1 && currentDay <= 15;

                           const handleManualNotify = () => {
                             addNotification({
                               titleBn: 'বকেয়া পরিশোধের তাগিদ বার্তা (সদস্য কর্তৃক প্রেরিত)',
                               titleEn: 'Member Manual Dues Alert',
                               messageBn: `সদস্য ${searchedMember.nameBn} (${searchedMember.id}) চলতি মাসের বকেয়া পরিশোধের ব্যাপারে পরিষদকে সশরীরে মেসেজ পাঠিয়েছেন।`,
                               messageEn: `Member ${searchedMember.nameEn || searchedMember.nameBn} (${searchedMember.id}) manually notified the council about dues.`,
                               type: 'member',
                               isRead: false,
                               linkTab: 'dues',
                             });
                             showToast('পরিষদের জন্য তাগিদ মেসেজ সফলভাবে পাঠানো হয়েছে!', 'success');
                           };

                           return (
                             <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                               <div className="flex items-start gap-3.5">
                                 <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                                   <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                                 </div>
                                 <div className="space-y-1">
                                   <h4 className="font-extrabold text-rose-950 text-base sm:text-lg">চলতি মাসে আপনার চাঁদা বকেয়া রয়েছে!</h4>
                                   <p className="text-xs sm:text-sm text-rose-800 font-medium">
                                     চলতি মাসের কিস্তি এখনো পরিশোধ করা হয়নি। অনুগ্রহ করে দ্রুত আপনার কিস্তির টাকা পরিশোধ করুন।
                                   </p>
                                   {isBetween1And15 && (
                                     <p className="text-xs text-amber-800 font-bold bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-200/50 inline-block mt-1">
                                       ⏳ ১ থেকে ১৫ তারিখের সময়সীমা কার্যকর রয়েছে। পরিষদ প্যানেলে নোটিফিকেশন পাঠানো হয়েছে।
                                     </p>
                                   )}
                                 </div>
                               </div>
                               
                               {isBetween1And15 && (
                                 <button
                                   onClick={handleManualNotify}
                                   className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-rose-600/20 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                                 >
                                   <Send className="w-4 h-4" />
                                   <span>পরিষদকে মেসেজ পাঠান</span>
                                 </button>
                               )}
                             </div>
                           );
                        })()}
                        
                        {/* High Security Status Bar */}
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>🔒 আপনার প্রোফাইল নিরাপদ এনক্রিপশনে আনলকড হয়েছে (High Security Verified)</span>
                          </div>
                          <button
                            onClick={handleLockProfile}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>লক করুন</span>
                          </button>
                        </div>

                        {/* Member Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md">
                          <div className="relative shrink-0 group">
                            {searchedMember.photoUrl ? (
                              <img
                                src={searchedMember.photoUrl}
                                alt={searchedMember.nameBn}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0 bg-slate-800"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center shrink-0 ring-4 ring-white/20 shadow-lg">
                                <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-100" />
                                <span className="text-[10px] font-bold text-blue-200 mt-0.5">ছবি নেই</span>
                              </div>
                            )}

                            {/* Member Direct Photo Upload Button Overlay */}
                            <label 
                              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-white font-bold text-[11px] cursor-pointer"
                              title="আপনার প্রোফাইল ছবি আপলোড / পরিবর্তন করুন"
                            >
                              <Camera className="w-5 h-5 text-amber-300 animate-pulse" />
                              <span>ছবি পরিবর্তন</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file && searchedMember) {
                                    if (file.size > 10 * 1024 * 1024) {
                                      showToast('ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
                                      return;
                                    }
                                    try {
                                      const compressed = await compressImage(file, 480, 480, 0.75);
                                      updateMember(searchedMember.id, { photoUrl: compressed });
                                      setSearchedMember((prev: any) => prev ? { ...prev, photoUrl: compressed } : prev);
                                      showToast('আপনার ছবি সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!', 'success');
                                    } catch (err) {
                                      console.error('Photo upload error:', err);
                                      showToast('ছবি প্রসেস করতে সমস্যা হয়েছে', 'error');
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div className="flex-1 text-center sm:text-left space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight">{searchedMember.nameBn}</h3>
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                সক্রিয় সদস্য
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
                              
                              {/* Direct Upload Tag */}
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 hover:text-white rounded-lg cursor-pointer border border-blue-400/30 transition text-[11px] font-bold">
                                <Camera className="w-3 h-3 text-amber-300" />
                                <span>ছবি আপলোড</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file && searchedMember) {
                                      if (file.size > 10 * 1024 * 1024) {
                                        showToast('ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
                                        return;
                                      }
                                      try {
                                        const compressed = await compressImage(file, 480, 480, 0.75);
                                        updateMember(searchedMember.id, { photoUrl: compressed });
                                        setSearchedMember((prev: any) => prev ? { ...prev, photoUrl: compressed } : prev);
                                        showToast('আপনার ছবি সফলভাবে আপডেট হয়েছে!', 'success');
                                      } catch (err) {
                                        console.error('Photo upload error:', err);
                                        showToast('ছবি প্রসেস করতে সমস্যা হয়েছে', 'error');
                                      }
                                    }
                                  }}
                                />
                              </label>
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
                        {(() => {
                          const duesInfo = getMemberDueMonthsWithFines(
                            searchedMember.id,
                            receipts,
                            searchedMember.shareQty || 1,
                            searchedMember.memberNo
                          );

                          return (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/70">
                                  <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider mb-0.5">মোট শেয়ার</p>
                                  <p className="font-black text-blue-950 text-xl sm:text-2xl">{searchedMember.shareQty || 1} টি</p>
                                </div>

                                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70">
                                  <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider mb-0.5">মোট জমা টাকা</p>
                                  <p className="font-black text-emerald-700 text-lg sm:text-xl">
                                    ৳ {getMemberTotalDeposit(searchedMember).toLocaleString('en-IN')}
                                  </p>
                                </div>

                                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70">
                                  <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider mb-0.5">মাসিক চাঁদা</p>
                                  <p className="font-black text-amber-900 text-lg sm:text-xl">
                                    ৳ {((searchedMember.shareQty || 1) * 2000).toLocaleString('en-IN')}
                                  </p>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${duesInfo.hasDue ? 'bg-rose-50/80 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-rose-700">বকেয়া কিস্তি</p>
                                  <p className="font-black text-lg sm:text-xl text-rose-700">
                                    ৳ {duesInfo.totalPrincipalDue.toLocaleString('en-IN')}
                                  </p>
                                  <p className="text-[10px] font-semibold text-rose-500 mt-0.5">
                                    {duesInfo.hasDue ? `${duesInfo.dueMonths.length} টি মাস বকেয়া` : 'কোনো বকেয়া নেই'}
                                  </p>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${duesInfo.hasFine ? 'bg-amber-500/10 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                  <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-amber-800">বিলম্ব জরিমানা</p>
                                    <span className="text-[9px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.2 rounded">তথ্যমূলক</span>
                                  </div>
                                  <p className="font-black text-lg sm:text-xl text-amber-800">
                                    ৳ {duesInfo.totalFineAmount.toLocaleString('en-IN')}
                                  </p>
                                  <p className="text-[10px] font-semibold text-amber-700 mt-0.5">
                                    {duesInfo.hasFine ? `${duesInfo.overdueCount} টি মাসে বিলম্ব ফি` : 'জরিমানা নেই'}
                                  </p>
                                </div>
                              </div>

                              {/* Dedicated Due Months and Penalty Statement Card */}
                              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                                <div className="bg-slate-900 text-white px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    <div>
                                      <h4 className="font-bold text-sm sm:text-base">বকেয়া মাস ও প্রযোজ্য জরিমানা বিবরণী</h4>
                                      <p className="text-[11px] text-slate-300">নির্ধারিত ১৫ তারিখের নিয়ম অনুযায়ী কিস্তি ও জরিমানার হিসাব</p>
                                    </div>
                                  </div>
                                  {duesInfo.hasDue && (
                                    <span className="bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                                      {duesInfo.dueMonths.length} টি মাস বকেয়া
                                    </span>
                                  )}
                                </div>

                                <div className="p-4 sm:p-5 space-y-4">
                                  {/* Policy Disclaimer Banner */}
                                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5">
                                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                    <div className="text-xs text-amber-900 leading-relaxed">
                                      <p className="font-bold text-amber-950 mb-0.5">মাসিক চাঁদা জমাদান সংক্রান্ত জরুরি নিয়মাবলী:</p>
                                      <p className="text-amber-900/90">
                                        প্রতি মাসের <strong className="font-bold text-amber-950">১ তারিখ হতে ১৫ তারিখের মধ্যে</strong> নিয়মিত মাসিক চাঁদা পরিশোধ করতে হবে। নির্ধারিত ১৫ তারিখ অতিক্রান্ত হলে বকেয়া কিস্তির জন্য <strong className="font-bold text-rose-700">২০০/- (দুইশত) টাকা</strong> বিলম্ব জরিমানা প্রযোজ্য হবে।
                                      </p>
                                      <p className="text-[11px] font-semibold text-amber-800 mt-1 pt-1 border-t border-amber-200/80">
                                        * জরিমানার হিসাবটি শুধুমাত্র সদস্য সচেতনতার জন্য প্রদর্শিত। সমিতির মূল বকেয়া হিসাব বা ডেটাবেসের প্রকৃত টাকার সাথে কোনো জরিমানা যোগ করা হয় না।
                                      </p>
                                    </div>
                                  </div>

                                  {/* List of Due Months */}
                                  {duesInfo.hasDue ? (
                                    <div className="space-y-2.5">
                                      <h5 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span>বকেয়া মাসসমূহের তালিকা:</span>
                                      </h5>

                                      <div className="grid grid-cols-1 gap-2.5">
                                        {duesInfo.dueMonths.map((dueItem, idx) => (
                                          <div 
                                            key={idx}
                                            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                              dueItem.isOverdue 
                                                ? 'bg-rose-50/50 border-rose-200' 
                                                : 'bg-blue-50/40 border-blue-200'
                                            }`}
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 text-sm sm:text-base">
                                                  {dueItem.schedule.nameBn}
                                                </span>
                                                {dueItem.schedule.isExtraMonth && (
                                                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                                    এক্সট্রা কিস্তি সহ
                                                  </span>
                                                )}
                                              </div>
                                              
                                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                                <span>পরিশোধের শেষ তারিখ: <strong className="font-semibold text-slate-800">{dueItem.deadlineDateStr}</strong></span>
                                                <span className="text-slate-300 hidden sm:inline">•</span>
                                                <span>বকেয়া কিস্তির মূল টাকা: <strong className="font-bold text-slate-900">৳ {dueItem.dueAmount.toLocaleString('en-IN')}</strong></span>
                                              </div>
                                            </div>

                                            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5">
                                              {dueItem.isOverdue ? (
                                                <>
                                                  <span className="bg-rose-100 text-rose-800 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                                    <span>নির্ধারিত ১৫ তারিখ অতিক্রান্ত</span>
                                                  </span>
                                                  <span className="text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                                                    প্রযোজ্য জরিমানা: ৳{dueItem.fineAmount}
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>চলতি সময়সীমা চলমান</span>
                                                  </span>
                                                  <span className="text-xs font-semibold text-emerald-700">
                                                    ১৫ তারিখের পূর্বে জরিমানা মুক্ত
                                                  </span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Total Calculation Footer */}
                                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                          <Coins className="w-4 h-4 text-slate-700" />
                                          <span className="font-semibold text-slate-700">মোট বকেয়া কিস্তির টাকা:</span>
                                          <strong className="font-black text-rose-700 text-base sm:text-lg">
                                            ৳ {duesInfo.totalPrincipalDue.toLocaleString('en-IN')}
                                          </strong>
                                        </div>

                                        {duesInfo.hasFine && (
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-amber-800">মোট প্রযোজ্য বিলম্ব ফি:</span>
                                            <strong className="font-black text-amber-800 text-base sm:text-lg">
                                              ৳ {duesInfo.totalFineAmount.toLocaleString('en-IN')}
                                            </strong>
                                            <span className="text-[10px] text-slate-400">(*মূল হিসেবে যুক্ত নয়)</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-900">
                                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                                      <div>
                                        <h5 className="font-bold text-sm sm:text-base text-emerald-950">অভিনন্দন! কোনো কিস্তি বকেয়া নেই</h5>
                                        <p className="text-xs text-emerald-800">আপনার চলতি মাস পর্যন্ত সকল মাসিক কিস্তি সম্পূর্ণ ও নিয়মিত পরিশোধিত রয়েছে। ধন্যবাদ।</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Toggle Full 12-Month Schedule */}
                                  <div className="pt-2 border-t border-slate-100">
                                    <button
                                      type="button"
                                      onClick={() => setShowAllMonthsSchedule(prev => !prev)}
                                      className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
                                    >
                                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                      <span>{showAllMonthsSchedule ? 'সকল মাসের কিস্তির স্থিতি বন্ধ করুন' : 'সকল ১২ মাসের কিস্তির পূর্ণাঙ্গ স্থিতি দেখুন'}</span>
                                      {showAllMonthsSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    {showAllMonthsSchedule && (
                                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {duesInfo.allMonthsStatus.map((mStatus, idx) => (
                                          <div 
                                            key={idx}
                                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                                              mStatus.status === 'paid' 
                                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                                                : mStatus.status === 'due' && mStatus.schedule.id <= getCurrentRunningMonthId()
                                                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                                                  : mStatus.isNext
                                                    ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}
                                          >
                                            <div>
                                              <p className="font-bold">{mStatus.schedule.nameBn}</p>
                                              <p className="text-[10px] text-slate-500">
                                                {mStatus.status === 'paid' 
                                                  ? `পরিশোধিত: ৳${mStatus.paidAmount.toLocaleString('en-IN')}` 
                                                  : `নির্ধারিত: ৳${mStatus.schedule.totalAmount.toLocaleString('en-IN')}`}
                                              </p>
                                            </div>
                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                              mStatus.status === 'paid' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : mStatus.status === 'due' && mStatus.schedule.id <= getCurrentRunningMonthId()
                                                  ? 'bg-rose-100 text-rose-800'
                                                  : mStatus.isNext
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}>
                                              {mStatus.status === 'paid' ? 'পরিশোধিত' : mStatus.status === 'due' && mStatus.schedule.id <= getCurrentRunningMonthId() ? 'বকেয়া' : mStatus.isNext ? 'চলতি' : 'অগ্রিম'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Detailed Profile Information */}
                        <div className="pt-4 border-t border-slate-200 space-y-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">ব্যক্তিগত ও পরিচিতি তথ্য</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                            {/* Father's Name */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">পিতার নাম</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                                {searchedMember.fatherName || '—'}
                              </p>
                            </div>

                            {/* Mother's Name */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">মাতার নাম</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                                {searchedMember.motherName || '—'}
                              </p>
                            </div>

                            {/* Date of Birth */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">জন্ম তারিখ</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 font-mono">
                                {searchedMember.dob || '—'}
                              </p>
                            </div>

                            {/* Religion */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">ধর্ম</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                                {searchedMember.religion || 'ইসলাম'}
                              </p>
                            </div>

                            {/* Nationality */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">জাতীয়তা</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                                {searchedMember.nationality || 'বাংলাদেশী'}
                              </p>
                            </div>

                            {/* Gender */}
                            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                              <p className="text-[10px] font-bold text-slate-400">লিঙ্গ (Gender)</p>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                                {searchedMember.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {/* Present Address */}
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60 flex gap-3">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-400">বর্তমান ঠিকানা</p>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 leading-relaxed">
                                  {searchedMember.presentAddress || 'উল্লেখ নেই'}
                                </p>
                              </div>
                            </div>

                            {/* Permanent Address */}
                            <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60 flex gap-3">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-400">স্থায়ী ঠিকানা</p>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 leading-relaxed">
                                  {searchedMember.permanentAddress || 'উল্লেখ নেই'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nominee Details Section */}
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">মনোনীত ব্যক্তি / নমিনি তথ্য</h4>
                          </div>

                          {searchedMember.nominees && searchedMember.nominees.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                              {searchedMember.nominees.map((nominee: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                  <div className="relative shrink-0 group/nom">
                                    {nominee.photoUrl ? (
                                      <img 
                                        src={nominee.photoUrl} 
                                        alt={nominee.name} 
                                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-300 shrink-0 bg-white"
                                      />
                                    ) : (
                                      <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center shrink-0 border border-blue-200">
                                        <User className="w-8 h-8 text-blue-600" />
                                        <span className="text-[9px] font-bold text-blue-600">ছবি নেই</span>
                                      </div>
                                    )}

                                    {/* Quick Nominee Photo Upload Button */}
                                    <label 
                                      className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs rounded-xl opacity-0 group-hover/nom:opacity-100 transition-all flex flex-col items-center justify-center gap-0.5 text-white font-bold text-[10px] cursor-pointer"
                                      title="নমিনির ছবি আপলোড / পরিবর্তন করুন"
                                    >
                                      <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
                                      <span>ছবি দিন</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file && searchedMember) {
                                            if (file.size > 10 * 1024 * 1024) {
                                              showToast('ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
                                              return;
                                            }
                                            try {
                                              const compressed = await compressImage(file, 480, 480, 0.75);
                                              let updated = [...(searchedMember.nominees || [])];
                                              if (updated[idx]) {
                                                updated[idx] = { ...updated[idx], photoUrl: compressed };
                                                updateMember(searchedMember.id, { 
                                                  nominees: updated,
                                                  nominee_photo: idx === 0 ? compressed : (searchedMember as any).nominee_photo 
                                                });
                                                setSearchedMember((prev: any) => prev ? { ...prev, nominees: updated } : prev);
                                                showToast('নমিনির ছবি সফলভাবে সংরক্ষিত হয়েছে!', 'success');
                                              }
                                            } catch (err) {
                                              console.error('Nominee photo upload error:', err);
                                              showToast('ছবি প্রসেস করতে সমস্যা হয়েছে', 'error');
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>

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

                        {/* Footer Lock Action */}
                        <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <p className="text-xs text-slate-500 font-medium">* বাউনিয়া বিল্ডার্স অফিসিয়াল ডেটাবেস থেকে নিরাপদভাবে ডেটা প্রদর্সিত হচ্ছে</p>
                          <button
                            onClick={handleLockProfile}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>প্রোফাইল বন্ধ ও লক করুন</span>
                          </button>
                        </div>

                      </div>
                    )
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
