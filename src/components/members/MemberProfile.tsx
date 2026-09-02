import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Edit, 
  HandCoins, 
  Award, 
  Printer, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  CreditCard, 
  FileText, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  Download,
  Camera,
  Upload,
  Save,
  X,
  Plus,
  KeyRound,
  Sparkles,
  Check,
  ShieldAlert
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';
import { 
  MONTHLY_SCHEDULE, 
  getMemberScheduleSummary, 
  TOTAL_SCHEDULE_AMOUNT,
  isReceiptForMemberId 
} from '../../utils/monthlySchedule';
import { compressImage, uploadOptimizedPhoto, deletePhotoFromStorage } from '../../utils/imageCompressor';

export const MemberProfile: React.FC = () => {
  const { 
    members, 
    selectedMemberId, 
    setActiveTab, 
    setSelectedMemberId, 
    setSelectedCertMemberId,
    setSelectedReceiptId,
    receipts, 
    shares, 
    transactions,
    settings,
    language, 
    t, 
    currentUser,
    updateMember,
    addExpense,
    addIncome,
    showToast
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'schedule' | 'nominees' | 'shares' | 'payments' | 'statement' | 'cancellation'>('info');

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Nominee Edit State
  const [editingNomineeIdx, setEditingNomineeIdx] = useState<number | null>(null); // null means not editing, -1 means adding new
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [nomineePercentage, setNomineePercentage] = useState(100);
  const [nomineeMobile, setNomineeMobile] = useState('');
  const [nomineeNid, setNomineeNid] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [nomineePhoto, setNomineePhoto] = useState('');

  const member = members.find(m => m.id === selectedMemberId) || members[0];



  // Direct Photo Upload Handler
  const handleDirectPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('ছবি ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
      return;
    }

    try {
      if (member.photoUrl) {
        deletePhotoFromStorage(member.photoUrl);
      }
      const uploadedUrl = await uploadOptimizedPhoto(file, 'members');
      updateMember(member.id, { photoUrl: uploadedUrl });
      showToast('সদস্যের ছবি সফলভাবে আপলোড ও সংরক্ষিত হয়েছে!', 'success');
    } catch (err) {
      console.error('Failed to upload photo:', err);
      try {
        const compressed = await compressImage(file, 800, 800, 0.75);
        updateMember(member.id, { photoUrl: compressed });
        showToast('সদস্যের ছবি সফলভাবে আপলোড ও সংরক্ষিত হয়েছে!', 'success');
      } catch {
        showToast('ছবি আপলোড করতে ব্যর্থ হয়েছে', 'error');
      }
    }
  };

  if (!member) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">সদস্যের তথ্য পাওয়া যায়নি।</p>
        <button
          onClick={() => setActiveTab('members')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          সদস্য তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  // Filter member-specific items
  const memberReceipts = receipts.filter(r => isReceiptForMemberId(r.memberId, member.id, member.memberNo));
  const memberShares = shares.filter(s => isReceiptForMemberId(s.memberId, member.id, member.memberNo));
  const memberTransactions = transactions.filter(t => isReceiptForMemberId(t.memberId, member.id, member.memberNo));

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hidden File Input for Direct Photo Upload */}
      <input 
        type="file" 
        ref={photoInputRef} 
        onChange={handleDirectPhotoUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('members')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {member.nameBn}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-bold">
                {member.id}
              </span>
            </div>
            <p className="text-xs text-slate-500">{member.nameEn || 'Registered Member'}</p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'collector' && (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>ছবি আপলোড করুন</span>
            </button>
          )}

          {currentUser.role !== 'collector' && (
            <button
              onClick={() => {
                setSelectedMemberId(member.id);
                setActiveTab('member_form');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              <span>তথ্য সংশোধন (Edit)</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedMemberId(member.id);
              setActiveTab('collect_payment');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <HandCoins className="w-4 h-4" />
            <span>{t('collectPaymentBtn')}</span>
          </button>

          <button
            onClick={() => {
              setSelectedCertMemberId(member.id);
              setActiveTab('share_cert');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>{t('shareCertificate')}</span>
          </button>

          <button
            onClick={() => {
              setActiveProfileTab('statement');
              setTimeout(() => handlePrintStatement(), 150);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{t('memberStatement')}</span>
          </button>

          </div>
        </div>

      {/* Member Header Profile Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden print-card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          
          {/* Member Photo */}
          <div className="relative shrink-0 group">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.nameBn}
                loading="lazy"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg bg-slate-800"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-700/60 border border-white/20 text-blue-100 flex flex-col items-center justify-center ring-4 ring-white/20 shadow-lg">
                <User className="w-12 h-12 text-blue-200" />
                <span className="text-[10px] font-bold mt-1 text-blue-200">ছবি নেই</span>
              </div>
            )}
            
            {/* Direct Photo Change Overlay for Super Admin / Admin */}
            {currentUser.role !== 'collector' && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-white font-bold text-[11px] cursor-pointer"
                title="সদস্যের ছবি আপলোড / পরিবর্তন করুন"
              >
                <Camera className="w-6 h-6 text-amber-300 animate-pulse" />
                <span>ছবি পরিবর্তন</span>
              </button>
            )}

            <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
              member.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
            }`}>
              {translations[language][member.status]}
            </span>
          </div>

          {/* Member Information Summary */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {member.nameBn}
              </h2>
              {member.nameEn && (
                <span className="text-sm font-medium text-blue-200">
                  ({member.nameEn})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-blue-100">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-300" />
                {member.mobile}
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-300" />
                NID: {member.nid}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                যোগদান: {formatDate(member.joinDate, language === 'bn')}
              </span>
            </div>

            <p className="text-xs text-blue-200 max-w-xl">
              {member.presentAddress}
            </p>
          </div>

          {/* Member Financial Metric Quick Badges */}
          <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-[10px] font-semibold text-blue-200">মোট শেয়ার সংখ্যা</div>
              <div className="text-lg font-black text-amber-300">
                {language === 'bn' ? toBnDigits(member.shareQty) : member.shareQty} টি
              </div>
              <div className="text-[10px] text-blue-200">অংশীদার শেয়ার</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-[10px] font-semibold text-blue-200">মোট সঞ্চয় / জমা</div>
              <div className="text-lg font-black text-emerald-300">
                {formatCurrency(member.currentDeposit, language === 'bn')}
              </div>
              <div className="text-[10px] text-rose-300">
                বকেয়া: {member.currentDue > 0 ? formatCurrency(member.currentDue, language === 'bn') : '০.০০'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Inner Tabs Bar (no-print) */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 rounded-2xl shadow-2xs no-print overflow-x-auto">
        <button
          onClick={() => setActiveProfileTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeProfileTab === 'info' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}
        </button>

        <button
          onClick={() => setActiveProfileTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeProfileTab === 'schedule' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '১২ মাসের কিস্তি শিডিউল' : '12-Month Schedule'}</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('nominees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeProfileTab === 'nominees' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'bn' ? 'মনোনীত ব্যক্তি (নমিনি)' : 'Nominees'} ({member.nominees?.length || 0})
        </button>

        <button
          onClick={() => setActiveProfileTab('shares')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeProfileTab === 'shares' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'bn' ? 'শেয়ারের তথ্য' : 'Shares'} ({memberShares.length || 1})
        </button>

        <button
          onClick={() => setActiveProfileTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeProfileTab === 'payments' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'bn' ? 'পরিশোধ ও রসিদ হিস্ট্রি' : 'Payment History'} ({memberReceipts.length})
        </button>

        <button
          onClick={() => setActiveProfileTab('statement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeProfileTab === 'statement' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'bn' ? 'পূর্ণাঙ্গ মেম্বার স্টেটমেন্ট (A4)' : 'Financial Statement'}
        </button>

        {currentUser.role !== 'collector' && (
          <button
            onClick={() => setActiveProfileTab('cancellation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeProfileTab === 'cancellation' 
                ? 'bg-rose-600 border-rose-600 text-white shadow-xs' 
                : 'text-rose-600 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সদস্যতা বাতিল ও রিফান্ড' : 'Cancellation & Refund'}</span>
          </button>
        )}
      </div>

      {/* Tab: 12-Month Schedule & Matrix */}
      {activeProfileTab === 'schedule' && (() => {
        const scheduleSummary = getMemberScheduleSummary(member.id, receipts, member.shareQty, member.memberNo);

        return (
          <div className="space-y-4">
            {/* Summary Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-semibold">১২ মাসের মোট নির্ধারিত চাঁদা</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  ৳ {toBnDigits(TOTAL_SCHEDULE_AMOUNT.toLocaleString('en-IN'))}
                </div>
                <div className="text-[10px] text-slate-400">১০ মাস × ২০০০ + ২ মাস × ৭০০০</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                <div className="text-[11px] text-emerald-800 font-semibold">মোট পরিশোধিত টাকা</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  ৳ {toBnDigits(scheduleSummary.totalPaid.toLocaleString('en-IN'))}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  {toBnDigits(scheduleSummary.paidMonthsCount)} টি মাস পরিশোধিত
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
                <div className="text-[11px] text-rose-800 font-semibold">মোট অবশিষ্ট বকেয়া</div>
                <div className="text-lg font-black text-rose-700 mt-0.5">
                  ৳ {toBnDigits(scheduleSummary.totalDue.toLocaleString('en-IN'))}
                </div>
                <div className="text-[10px] text-rose-700 font-bold">
                  {toBnDigits(scheduleSummary.dueMonthsCount + scheduleSummary.partialMonthsCount)} টি মাস অপরিশোধিত
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-xs flex flex-col justify-between">
                <div className="text-[11px] text-blue-800 font-semibold">দ্রুত আদায় অ্যাকশন</div>
                <button
                  onClick={() => {
                    setSelectedMemberId(member.id);
                    setActiveTab('collect_payment');
                  }}
                  className="w-full mt-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <HandCoins className="w-3.5 h-3.5" />
                  <span>টাকা জমা নিন</span>
                </button>
              </div>
            </div>

            {/* 12-Month Detailed Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>১২ মাসের কিস্তি বিবরণী ও স্ট্যাটাস (নভেম্বর ২০২৫ হতে অক্টোবর ২০২৬)</span>
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> সবুজ (Paid = পরিশোধিত)
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> লাল (Due = বকেয়া)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {scheduleSummary.statusList.map((item) => {
                  const isPaid = item.status === 'paid';
                  const isPartial = item.status === 'partial';
                  const isDue = item.status === 'due';
                  const isExtra = item.schedule.isExtraMonth;

                  return (
                    <div
                      key={item.schedule.id}
                      className={`p-4 rounded-xl border-2 transition relative flex flex-col justify-between ${
                        isPaid
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : isPartial
                          ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                          : 'bg-rose-50/70 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                            মাস #{toBnDigits(item.schedule.monthOrder)}
                          </span>

                          {isPaid && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> পরিশোধিত
                            </span>
                          )}
                          {isPartial && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> আংশিক
                            </span>
                          )}
                          {isDue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                              <AlertCircle className="w-3 h-3" /> বকেয়া
                            </span>
                          )}
                        </div>

                        {/* Month title */}
                        <div className="font-extrabold text-sm text-slate-900">
                          {item.schedule.nameBn}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.schedule.descriptionBn}
                        </div>

                        {/* Rate breakdown */}
                        <div className="mt-3 p-2 bg-white/80 rounded-lg border border-slate-200 text-[11px] space-y-0.5">
                          <div className="flex justify-between text-slate-600">
                            <span>নির্ধারিত হার:</span>
                            <span className="font-bold text-slate-800">৳ {toBnDigits(item.schedule.totalAmount.toLocaleString('en-IN'))}</span>
                          </div>
                          {isExtra && (
                            <div className="flex justify-between text-indigo-700 text-[10px]">
                              <span>(নিয়মিত ২০০০ + এক্সট্রা ৫০০০)</span>
                            </div>
                          )}
                          <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                            <span>জমা প্রাপ্তি:</span>
                            <span>৳ {toBnDigits(item.paidAmount.toLocaleString('en-IN'))}</span>
                          </div>
                          {item.dueAmount > 0 && (
                            <div className="flex justify-between text-rose-700 font-bold">
                              <span>বকেয়া:</span>
                              <span>৳ {toBnDigits(item.dueAmount.toLocaleString('en-IN'))}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action button if due */}
                      {item.dueAmount > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActiveTab('collect_payment');
                          }}
                          className="mt-3 w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>এই মাসের ৳ {toBnDigits(item.dueAmount.toLocaleString('en-IN'))} জমা নিন</span>
                        </button>
                      ) : (
                        <div className="mt-3 text-center text-[10px] text-emerald-700 font-bold bg-emerald-100/70 py-1 rounded-md">
                          ✓ সম্পূর্ণ পরিশোধিত
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tab 1: Personal & Family Information */}
      {activeProfileTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              ব্যক্তিগত ও পারিবারিক বিবরণ
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">
                  {member.spouseName && (!member.fatherName || member.fatherName === '—' || member.fatherName.includes('স্বামী')) ? 'স্বামীর নাম:' : 'পিতার নাম:'}
                </span>
                <span className="font-bold text-slate-900">
                  {(!member.fatherName || member.fatherName === '—') && member.spouseName ? member.spouseName : member.fatherName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">মাতার নাম:</span>
                <span className="font-bold text-slate-900">{member.motherName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">স্বামী / স্ত্রী:</span>
                <span className="font-bold text-slate-900">{member.spouseName || 'প্রযোজ্য নয়'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">জন্ম তারিখ:</span>
                <span className="font-bold text-slate-900">{formatDate(member.dob, language === 'bn')}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">পেশা:</span>
                <span className="font-bold text-slate-900">{member.occupation || 'ব্যবসায়ী'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">লিঙ্গ:</span>
                <span className="font-bold text-slate-900">
                  {translations[language][member.gender] || (member.gender === 'female' ? (language === 'bn' ? 'মহিলা' : 'Female') : member.gender === 'other' ? (language === 'bn' ? 'অন্যান্য' : 'Other') : (language === 'bn' ? 'পুরুষ' : 'Male'))}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ধর্ম:</span>
                <span className="font-bold text-slate-900">{(member as any).religion || 'ইসলাম'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">জাতীয়তা:</span>
                <span className="font-bold text-slate-900">{(member as any).nationality || 'বাংলাদেশী'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              পরিচয়পত্র ও যোগাযোগ
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">এনআইডি নম্বর:</span>
                <span className="font-mono font-bold text-slate-900">{member.nid}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">জন্ম নিবন্ধন নং:</span>
                <span className="font-mono font-bold text-slate-900">{member.birthRegNo || 'প্রযোজ্য নয়'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">প্রাথমিক মোবাইল:</span>
                <span className="font-mono font-bold text-blue-700">{member.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">বিকল্প মোবাইল:</span>
                <span className="font-mono font-bold text-slate-700">{member.altMobile || 'নেই'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block mb-0.5">বর্তমান ঠিকানা:</span>
                <span className="font-medium text-slate-900">{member.presentAddress}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block mb-0.5">স্থায়ী ঠিকানা:</span>
                <span className="font-medium text-slate-900">{member.permanentAddress}</span>
              </div>
              
              {/* Photo Front & Photo Back Display */}
              <div className="col-span-2 pt-3 border-t border-slate-100">
                <span className="text-slate-500 block mb-2 font-bold">সদস্যের ছবি ও NID/আইডি কার্ড (Photo Front & Back):</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 block font-semibold">সামনের ছবি (Front Photo)</span>
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt="Front Photo"
                        className="w-full h-28 object-cover rounded-lg border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-full h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                        সামনের ছবি নেই
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 block font-semibold">পিছনের ছবি / NID Back</span>
                    {member.photoBackUrl ? (
                      <img
                        src={member.photoBackUrl}
                        alt="Back Photo"
                        className="w-full h-28 object-cover rounded-lg border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-full h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                        পিছনের ছবি নেই
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Nominee Management */}
      {activeProfileTab === 'nominees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'মনোনীত ব্যক্তি (নমিনি) ব্যবস্থাপনা' : 'Nominee Management'}
            </h3>
            {editingNomineeIdx === null && currentUser.role !== 'collector' && (
              <button
                onClick={() => {
                  setEditingNomineeIdx(-1);
                  setNomineeName('');
                  setNomineeRelation('');
                  setNomineePercentage(100);
                  setNomineeMobile('');
                  setNomineeNid('');
                  setNomineeAddress('');
                  setNomineePhoto('');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন নমিনি যোগ করুন' : 'Add New Nominee'}</span>
              </button>
            )}
          </div>

          {editingNomineeIdx !== null ? (
            /* Nominee Edit Form */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 max-w-xl">
              <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                {editingNomineeIdx === -1 
                  ? (language === 'bn' ? 'নতুন নমিনির বিবরণী যোগ করুন' : 'Add New Nominee Details') 
                  : (language === 'bn' ? 'মনোনীত ব্যক্তির তথ্য সংশোধন করুন' : 'Edit Nominee Details')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">নমিনির নাম (Name) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20"
                    placeholder="নমিনির নাম লিখুন"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সম্পর্ক (Relation)</label>
                  <input
                    type="text"
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20"
                    placeholder="যেমন: স্ত্রী, পুত্র, কন্যা ইত্যাদি"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">অংশীদারিত্ব বা বন্টন হার (%)</label>
                  <input
                    type="number"
                    value={nomineePercentage}
                    onChange={(e) => setNomineePercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500/20"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর (Mobile)</label>
                  <input
                    type="text"
                    value={nomineeMobile}
                    onChange={(e) => setNomineeMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 font-mono"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {nomineeNid && nomineeNid.trim().length === 17 
                      ? 'জন্ম নিবন্ধন নং (১৭ ডিজিট)' 
                      : 'NID নং (১৭ এর কম ডিজিট)'}
                  </label>
                  <input
                    type="text"
                    value={nomineeNid}
                    onChange={(e) => setNomineeNid(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 font-mono"
                    placeholder="আইডি নম্বর লিখুন"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    ১৭ ডিজিটের হলে জন্ম নিবন্ধন এবং কম হলে এনআইডি হিসেবে গণ্য হবে।
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">ঠিকানা (Address)</label>
                  <textarea
                    value={nomineeAddress}
                    onChange={(e) => setNomineeAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 h-16"
                    placeholder="পূর্ণ ঠিকানা লিখুন"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1.5">নমিনির পাসপোর্ট ছবি (Nominee Photo)</label>
                  <div className="flex items-center gap-4">
                    {nomineePhoto ? (
                      <img
                        src={nomineePhoto}
                        alt="Nominee Photo Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-400 font-bold text-[10px] text-center shrink-0">
                        কোনো ছবি নেই
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              showToast('ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
                              return;
                            }
                            
                            try {
                              if (nomineePhoto) {
                                deletePhotoFromStorage(nomineePhoto);
                              }
                              const uploadedUrl = await uploadOptimizedPhoto(file, 'nominees');
                              setNomineePhoto(uploadedUrl);
                              showToast('নমিনির ছবি সফলভাবে আপলোড হয়েছে!', 'success');
                            } catch (err) {
                              console.error('Failed to upload nominee photo:', err);
                              try {
                                const compressed = await compressImage(file, 600, 600, 0.75);
                                setNomineePhoto(compressed);
                                showToast('নমিনির ছবি সফলভাবে আপলোড হয়েছে!', 'success');
                              } catch {
                                showToast('ছবি আপলোড করতে ব্যর্থ হয়েছে', 'error');
                              }
                            }
                          }
                        }}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingNomineeIdx(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!nomineeName) {
                      showToast('নমিনির নাম আবশ্যক!', 'error');
                      return;
                    }
                    const newNom = {
                      id: editingNomineeIdx === -1 ? `NOM-${Date.now()}` : (member.nominees?.[editingNomineeIdx]?.id || `NOM-${Date.now()}`),
                      name: nomineeName,
                      relation: nomineeRelation,
                      percentage: nomineePercentage,
                      mobile: nomineeMobile,
                      nidBirthReg: nomineeNid,
                      address: nomineeAddress,
                      photoUrl: nomineePhoto
                    };
                    let updated = [...(member.nominees || [])];
                    if (editingNomineeIdx === -1) {
                      updated.push(newNom);
                    } else {
                      updated[editingNomineeIdx] = newNom;
                    }
                    updateMember(member.id, { nominees: updated });
                    setEditingNomineeIdx(null);
                    showToast('নমিনির তথ্য সফলভাবে সংরক্ষিত হয়েছে!', 'success');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          ) : (
            /* Nominees List View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(!member.nominees || member.nominees.length === 0) ? (
                <div className="col-span-2 p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-400 font-medium text-xs">কোনো মনোনীত ব্যক্তির তথ্য নেই। অনুগ্রহ করে নতুন নমিনি যোগ করুন।</p>
                </div>
              ) : (
                member.nominees.map((nominee, idx) => (
                  <div
                    key={nominee.id || idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-2 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-3">
                          <label 
                            className="relative group/nom cursor-pointer shrink-0"
                            title="নমিনির ছবি আপলোড / পরিবর্তন করতে ক্লিক করুন"
                          >
                            {nominee.photoUrl ? (
                              <img
                                src={nominee.photoUrl}
                                alt={nominee.name}
                                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                                <User className="w-6 h-6" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-slate-950/70 rounded-full opacity-0 group-hover/nom:opacity-100 transition-all flex items-center justify-center text-white">
                              <Camera className="w-4 h-4 text-amber-300" />
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file && member) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    showToast('ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না!', 'error');
                                    return;
                                  }
                                  try {
                                    const oldPhoto = nominee.photoUrl;
                                    if (oldPhoto) {
                                      deletePhotoFromStorage(oldPhoto);
                                    }
                                    const uploadedUrl = await uploadOptimizedPhoto(file, 'nominees');
                                    let updated = [...(member.nominees || [])];
                                    if (updated[idx]) {
                                      updated[idx] = { ...updated[idx], photoUrl: uploadedUrl };
                                      updateMember(member.id, { 
                                        nominees: updated,
                                        nominee_photo: idx === 0 ? uploadedUrl : (member as any).nominee_photo 
                                      });
                                      showToast('নমিনির ছবি সফলভাবে আপডেট হয়েছে!', 'success');
                                    }
                                  } catch (err) {
                                    console.error('Failed to upload nominee photo:', err);
                                    try {
                                      const compressed = await compressImage(file, 600, 600, 0.75);
                                      let updated = [...(member.nominees || [])];
                                      if (updated[idx]) {
                                        updated[idx] = { ...updated[idx], photoUrl: compressed };
                                        updateMember(member.id, { 
                                          nominees: updated,
                                          nominee_photo: idx === 0 ? compressed : (member as any).nominee_photo 
                                        });
                                        showToast('নমিনির ছবি সফলভাবে আপডেট হয়েছে!', 'success');
                                      }
                                    } catch {
                                      showToast('ছবি প্রসেস করতে ব্যর্থ হয়েছে', 'error');
                                    }
                                  }
                                }
                              }}
                            />
                          </label>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{nominee.name}</h4>
                            <span className="text-xs text-blue-600 font-bold">{nominee.relation}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          {language === 'bn' ? toBnDigits(nominee.percentage) : nominee.percentage}% অংশীদার
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                        <div>
                          <span className="text-slate-400 block mb-0.5">মোবাইল:</span>
                          <span className="font-mono font-bold text-slate-800">{nominee.mobile || 'প্রযোজ্য নয়'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">
                            {nominee.nidBirthReg && nominee.nidBirthReg.trim().length === 17 
                              ? (language === 'bn' ? 'জন্ম নিবন্ধন:' : 'Birth Reg:') 
                              : (language === 'bn' ? 'এনআইডি:' : 'NID:')}
                          </span>
                          <span className="font-mono font-bold text-slate-800">{nominee.nidBirthReg || 'প্রযোজ্য নয়'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-0.5">ঠিকানা:</span>
                          <span className="text-slate-700 font-medium">{nominee.address || 'প্রযোজ্য নয়'}</span>
                        </div>
                      </div>
                    </div>

                    {currentUser.role !== 'collector' && (
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-end">
                        <button
                          onClick={() => {
                            setEditingNomineeIdx(idx);
                            setNomineeName(nominee.name);
                            setNomineeRelation(nominee.relation);
                            setNomineePercentage(nominee.percentage);
                            setNomineeMobile(nominee.mobile || '');
                            setNomineeNid(nominee.nidBirthReg || '');
                            setNomineeAddress(nominee.address || '');
                            setNomineePhoto(nominee.photoUrl || '');
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>সংশোধন</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('আপনি কি নিশ্চিতভাবে এই নমিনিকে মুছে ফেলতে চান?')) {
                              const updated = member.nominees.filter((_, i) => i !== idx);
                              updateMember(member.id, { nominees: updated });
                              showToast('মনোনীত ব্যক্তি সফলভাবে অপসারিত হয়েছেন!', 'info');
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Cancellation & Refund */}
      {activeProfileTab === 'cancellation' && (() => {
        const joinDate = new Date(member.joinDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - joinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const durationInYears = diffDays / 365;
        const isLessThanTwoYears = durationInYears < 2;

        const totalDeposit = member.currentDeposit;
        const deductionRate = isLessThanTwoYears ? 0.2 : 0;
        const deduction = totalDeposit * deductionRate;
        const refundAmount = totalDeposit - deduction;

        const handleProcessCancellation = () => {
          if (member.status === 'inactive') {
            showToast('সদস্যের অ্যাকাউন্ট ইতিমধ্যে নিষ্ক্রিয় বা বাতিল করা হয়েছে!', 'error');
            return;
          }
          if (!window.confirm(`আপনি কি নিশ্চিতভাবে ${member.nameBn}-এর সদস্যতা বাতিল করতে চান? \n\nফেরতযোগ্য পরিমাণ: ৳${refundAmount.toLocaleString('en-IN')}\nকর্তনকৃত পরিমাণ: ৳${deduction.toLocaleString('en-IN')} (২০%)`)) {
            return;
          }

          // 1. Record refund as expense
          addExpense({
            date: new Date().toISOString().split('T')[0],
            category: 'অফিস পরিচালনা ব্যয়',
            description: `সদস্যতা অবসান ও সঞ্চয় ফেরত: ${member.nameBn} (${member.id})`,
            amount: refundAmount,
            paymentMethod: 'cash',
            approvedBy: currentUser.name,
            addedBy: currentUser.name,
            status: 'approved',
          });

          // 2. Record deduction as project income if any
          if (deduction > 0) {
            addIncome({
              date: new Date().toISOString().split('T')[0],
              category: 'প্রকল্প আয় ও অন্যান্য',
              description: `সদস্যতা বাতিল বাবদ ২০% সার্ভিস চার্জ কর্তন: ${member.nameBn} (${member.id})`,
              amount: deduction,
              paymentMethod: 'cash',
              receivedBy: currentUser.name,
              addedBy: currentUser.name,
              status: 'received',
            });
          }

          // 3. Update member status to inactive and balance to 0
          updateMember(member.id, {
            status: 'inactive',
            currentDeposit: 0,
            shareQty: 0,
            totalShareValue: 0,
            notes: `${member.notes || ''}\n[${new Date().toISOString().split('T')[0]}] সদস্যতা বাতিল ও রিফান্ড সম্পন্ন। রিফান্ড: ৳${refundAmount}, কর্তন: ৳${deduction} (${isLessThanTwoYears ? '২ বছরের কম সময়ের জন্য ২০% কর্তন' : '২ বছরের বেশি সময়ের জন্য ০% কর্তন'})`,
          });

          showToast('সদস্যতা অবসান ও রিফান্ড প্রক্রিয়া সফলভাবে সম্পন্ন হয়েছে!', 'success');
        };

        return (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-extrabold text-slate-950 text-sm">সদস্যতা অবসান ও রিফান্ড হিসেব</h3>
                <p className="text-xs text-slate-500">Membership Termination & Refund Statement</p>
              </div>
            </div>

            {/* Rule Callout */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5 text-slate-800">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                বাউনিয়া বিল্ডার্স অবসান নিয়মাবলী (Cancellation Rules):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed font-medium">
                <li>যদি সদস্যতা গ্রহণের মেয়াদ ২ বছরের কম হয়: <strong>মোট জমা থেকে ২০% কর্তন করা হবে (Deduction = ২০%)।</strong></li>
                <li>যদি সদস্যতা গ্রহণের মেয়াদ ২ বছর বা তার বেশি হয়: <strong>কোনো সার্ভিস চার্জ কর্তন করা হবে না (Deduction = ০%)।</strong></li>
                <li>নিট ফেরতযোগ্য টাকা = মোট সঞ্চয় জমা − কর্তনকৃত পরিমাণ।</li>
              </ul>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block mb-0.5">যোগদানের তারিখ:</span>
                <span className="font-bold text-slate-900">{formatDate(member.joinDate, true)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block mb-0.5">সদস্যতা সময়কাল (Duration):</span>
                <span className="font-bold text-slate-900">
                  {toBnDigits(diffDays)} দিন ({toBnDigits(durationInYears.toFixed(2))} বছর)
                </span>
              </div>

              <div className="col-span-2 border-t border-dashed border-slate-200 my-1"></div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 block mb-0.5">মোট সঞ্চয় জমা (Total Deposit):</span>
                <span className="font-black text-slate-900 text-sm">
                  ৳ {toBnDigits(totalDeposit.toLocaleString('en-IN'))}
                </span>
              </div>
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-700 font-bold block mb-0.5">
                  সার্ভিস চার্জ কর্তন {isLessThanTwoYears ? '(২০%)' : '(০%)'}:
                </span>
                <span className="font-black text-red-900 text-sm">
                  ৳ {toBnDigits(deduction.toLocaleString('en-IN'))}
                </span>
                <span className="text-[9px] block text-red-600 font-bold mt-0.5">
                  {isLessThanTwoYears ? 'মেয়াদ ২ বছরের কম হওয়ায় ২০% কর্তন প্রযোজ্য' : 'মেয়াদ ২ বছরের বেশি হওয়ায় কর্তন প্রযোজ্য নয়'}
                </span>
              </div>

              <div className="col-span-2 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
                <span className="text-emerald-800 font-bold block mb-1">সর্বমোট ফেরতযোগ্য নিট রিফান্ড (Net Refundable):</span>
                <span className="font-black text-emerald-950 text-xl block">
                  ৳ {toBnDigits(refundAmount.toLocaleString('en-IN'))}
                </span>
              </div>
            </div>

            {/* Status notice or cancel button */}
            {member.status === 'inactive' ? (
              <div className="p-4 bg-slate-100 text-slate-600 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
                <span>এই সদস্যের অ্যাকাউন্ট ইতিমধ্যেই বাতিল ও নিস্পত্তি করা হয়েছে।</span>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleProcessCancellation}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>সদস্যতা আনুষ্ঠানিকভাবে বাতিল ও রিফান্ড প্রক্রিয়া করুন</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tab 3: Shares Tab */}
      {activeProfileTab === 'shares' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              শেয়ার বরাদ্দ ও সনদ হিস্ট্রি
            </h3>
            <button
              onClick={() => {
                setSelectedCertMemberId(member.id);
                setActiveTab('share_cert');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>শেয়ার সনদ প্রিন্ট করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">সনদ নম্বর</th>
                  <th className="py-2.5 px-3">শেয়ার সংখ্যা</th>
                  <th className="py-2.5 px-3">ইস্যু তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    BBSC-{member.id.replace('BB-', '')}-01
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {language === 'bn' ? toBnDigits(member.shareQty) : member.shareQty} টি শেয়ার
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {formatDate(member.joinDate, language === 'bn')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Payments & Receipts */}
      {activeProfileTab === 'payments' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              পরিশোধের রসিদ ও হিস্ট্রি
            </h3>
            <button
              onClick={() => {
                setSelectedMemberId(member.id);
                setActiveTab('collect_payment');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <HandCoins className="w-4 h-4" />
              <span>নতুন কিস্তি / ফি আদায়</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">রশিদ নং</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">ধরণ</th>
                  <th className="py-2.5 px-3">পরিমাণ</th>
                  <th className="py-2.5 px-3">পদ্ধতি</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      কোনো রসিদ তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  memberReceipts.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-blue-700">
                        {r.receiptNo}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(r.date, language === 'bn')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold">
                          {translations[language][r.paymentType]}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        {formatCurrency(r.amount, language === 'bn')}
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-semibold text-slate-600">
                        {r.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceiptId(r.id);
                            setActiveTab('receipt_view');
                          }}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-[11px] transition cursor-pointer"
                        >
                          রসিদ দেখুন
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Full Official A4 Member Statement */}
      {activeProfileTab === 'statement' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg print:shadow-none print:border-none print-card max-w-4xl mx-auto space-y-6">
          
          {/* Printable Statement Header */}
          <div className="text-center pb-4 border-b-2 border-blue-900">
            <h1 className="text-2xl font-black text-blue-950">বাউনিয়া বিল্ডার্স</h1>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {settings.addressBn || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০'} | ফোন: {settings.phones?.join(', ') || '01833-405170, 01711-280514'}
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-blue-900 text-white text-xs font-bold rounded-md uppercase tracking-wider">
              সদস্য আর্থিক হিসাব বিবরণী (Member Financial Statement)
            </div>
          </div>

          {/* Member Details in Statement */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p><strong className="text-slate-600">সদস্যের নাম:</strong> <span className="font-bold text-slate-900">{member.nameBn}</span></p>
              <p className="mt-1"><strong className="text-slate-600">আইডি নং:</strong> <span className="font-mono font-bold text-blue-800">{member.id}</span></p>
              <p className="mt-1"><strong className="text-slate-600">মোবাইল:</strong> <span className="font-mono">{member.mobile}</span></p>
            </div>
            <div>
              <p><strong className="text-slate-600">মোট শেয়ার:</strong> <span className="font-bold text-blue-900">{member.shareQty} টি</span></p>
              <p className="mt-1"><strong className="text-slate-600">মোট সঞ্চয় জমা:</strong> <span className="font-bold text-emerald-800">৳ {member.currentDeposit.toLocaleString('en-IN')}</span></p>
              <p className="mt-1"><strong className="text-slate-600">বর্তমান বকেয়া:</strong> <span className="font-bold text-rose-700">৳ {member.currentDue.toLocaleString('en-IN')}</span></p>
            </div>
          </div>

          {/* Statement Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              লেনদেন ও আদায়ের তালিকা
            </h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200">তারিখ</th>
                  <th className="p-2 border-r border-slate-200">রশিদ / রেফারেন্স</th>
                  <th className="p-2 border-r border-slate-200">বিবরণ</th>
                  <th className="p-2 border-r border-slate-200 text-right">জমা (৳)</th>
                  <th className="p-2 text-right">স্থিতি (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-200">{formatDate(member.joinDate, true)}</td>
                  <td className="p-2 border-r border-slate-200 font-mono">OP-BAL</td>
                  <td className="p-2 border-r border-slate-200 font-medium">প্রারম্ভিক জমা / ওপেনিং ব্যালেন্স</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700">{member.openingBalance?.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-right font-bold">{member.openingBalance?.toLocaleString('en-IN')}</td>
                </tr>
                {memberReceipts.map(r => (
                  <tr key={r.id}>
                    <td className="p-2 border-r border-slate-200">{formatDate(r.date, true)}</td>
                    <td className="p-2 border-r border-slate-200 font-mono text-blue-700">{r.receiptNo}</td>
                    <td className="p-2 border-r border-slate-200">{translations['bn'][r.paymentType]}</td>
                    <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700">{r.amount.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right font-bold">{member.currentDeposit.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statement Signatures */}
          <div className="pt-16 grid grid-cols-3 text-center text-xs font-bold text-slate-800">
            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.treasurerName || 'মো: মাহবুব সরকার'}</div>
              <div className="border-t border-slate-600 pt-1 w-32 mx-auto">ক্যাশিয়ার</div>
            </div>
            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.secretaryName || 'মো: মনিরুজ্জামান'}</div>
              <div className="border-t border-slate-600 pt-1 w-40 mx-auto">সাধারণ সম্পাদক</div>
            </div>
            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.presidentName || 'মো: ফয়েজুর রহমান খান'}</div>
              <div className="border-t border-slate-600 pt-1 w-32 mx-auto">সভাপতি</div>
            </div>
          </div>

          {/* Print button on screen */}
          <div className="text-center pt-4 no-print">
            <button
              onClick={handlePrintStatement}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              প্রিন্ট করুন (Print Statement)
            </button>
          </div>

        </div>
      )}

      {/* Super Admin Quick Edit & Photo Update Modal (REMOVED) */}

    </div>
  );
};
