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
    showToast
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'schedule' | 'nominees' | 'shares' | 'payments' | 'statement'>('info');

  const photoInputRef = useRef<HTMLInputElement>(null);

  const member = members.find(m => m.id === selectedMemberId) || members[0];

  // Quick Edit Modal State for Super Admin
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nameBn: '',
    nameEn: '',
    mobile: '',
    altMobile: '',
    nid: '',
    fatherName: '',
    motherName: '',
    presentAddress: '',
    permanentAddress: '',
    pin: '',
    photoUrl: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  const openQuickEdit = () => {
    if (!member) return;
    setEditForm({
      nameBn: member.nameBn || '',
      nameEn: member.nameEn || '',
      mobile: member.mobile || '',
      altMobile: member.altMobile || '',
      nid: member.nid || '',
      fatherName: member.fatherName || '',
      motherName: member.motherName || '',
      presentAddress: member.presentAddress || '',
      permanentAddress: member.permanentAddress || '',
      pin: member.pin || (member.mobile ? member.mobile.slice(-4) : '1234'),
      photoUrl: member.photoUrl || '',
      status: member.status || 'active'
    });
    setIsQuickEditOpen(true);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    updateMember(member.id, {
      nameBn: editForm.nameBn.trim(),
      nameEn: editForm.nameEn.trim(),
      mobile: editForm.mobile.trim(),
      altMobile: editForm.altMobile.trim() || undefined,
      nid: editForm.nid.trim(),
      fatherName: editForm.fatherName.trim(),
      motherName: editForm.motherName.trim(),
      presentAddress: editForm.presentAddress.trim(),
      permanentAddress: editForm.permanentAddress.trim(),
      pin: editForm.pin.trim() || undefined,
      photoUrl: editForm.photoUrl.trim() || undefined,
      status: editForm.status
    });

    setIsQuickEditOpen(false);
    showToast('সদস্যের তথ্য সফলভাবে সংশোধন ও সংরক্ষণ করা হয়েছে!', 'success');
  };

  // Direct Photo Upload Handler
  const handleDirectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && member) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('ছবি ফাইলের সাইজ ৫MB এর বেশি হতে পারবে না!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateMember(member.id, { photoUrl: result });
        showToast('সদস্যের ছবি সফলভাবে আপলোড ও চিহ্নিত করা হয়েছে!', 'success');
      };
      reader.readAsDataURL(file);
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
              onClick={openQuickEdit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              <span>তথ্য সংশোধন (Quick Edit)</span>
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

          {currentUser.role !== 'collector' && (
            <button
              onClick={() => {
                setSelectedMemberId(member.id);
                setActiveTab('member_form');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <Edit className="w-4 h-4 text-slate-500" />
              <span>পূর্ণাঙ্গ ফরম</span>
            </button>
          )}
        </div>
      </div>

      {/* Member Header Profile Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden print-card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          
          {/* Member Photo */}
          <div className="relative shrink-0 group">
            <img
              src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={member.nameBn}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            
            {/* Direct Photo Change Overlay for Super Admin / Admin */}
            {currentUser.role !== 'collector' && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-white font-bold text-[11px] cursor-pointer"
                title="সদস্যের ছবি আপলোড / পরিবর্তন করুন"
              >
                <Camera className="w-6 h-6 text-amber-300 animate-pulse" />
                <span>ছবি আপলোড</span>
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
                <span className="text-slate-400 block mb-0.5">পিতার নাম:</span>
                <span className="font-bold text-slate-900">{member.fatherName}</span>
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
                <span className="font-bold text-slate-900">{translations[language][member.gender]}</span>
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
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Nominee Management */}
      {activeProfileTab === 'nominees' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.nominees?.map((nominee, idx) => (
              <div
                key={nominee.id || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{nominee.name}</h4>
                      <span className="text-xs text-blue-600 font-semibold">{nominee.relation}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                    {language === 'bn' ? toBnDigits(nominee.percentage) : nominee.percentage}% অংশীদার
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">মোবাইল:</span>
                    <span className="font-mono font-bold text-slate-800">{nominee.mobile || 'প্রযোজ্য নয়'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">এনআইডি:</span>
                    <span className="font-mono font-bold text-slate-800">{nominee.nidBirthReg || 'প্রযোজ্য নয়'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">ঠিকানা:</span>
                    <span className="text-slate-700">{nominee.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              {settings.addressBn || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০'} | ফোন: 01833-805170, 01711-280514
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

      {/* Super Admin Quick Edit & Photo Update Modal */}
      {isQuickEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    সদস্য তথ্য সংশোধন (Super Admin Edit)
                  </h3>
                  <p className="text-xs text-slate-500">
                    সদস্য ID: <span className="font-mono font-bold text-blue-700">{member.id}</span> ({member.nameBn})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQuickEditOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Edit Form */}
            <form onSubmit={handleSaveQuickEdit} className="space-y-4">
              
              {/* Photo & Quick Upload Row */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={editForm.photoUrl || member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                  alt="Member Photo"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    সদস্যের ছবি (Photo)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>ডিভাইস থেকে ছবি আপলোড</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="অথবা ছবি লিঙ্ক/URL দিন..."
                    value={editForm.photoUrl}
                    onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 outline-hidden focus:border-blue-500 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name Bangla */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সদস্যের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nameBn}
                    onChange={(e) => setEditForm({ ...editForm, nameBn: e.target.value })}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Name English */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সদস্যের নাম (English)
                  </label>
                  <input
                    type="text"
                    value={editForm.nameEn}
                    onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রাথমিক মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Alt Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিকল্প মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={editForm.altMobile}
                    onChange={(e) => setEditForm({ ...editForm, altMobile: e.target.value })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* NID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    এনআইডি (NID) / জন্ম নিবন্ধন *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nid}
                    onChange={(e) => setEditForm({ ...editForm, nid: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Security PIN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সদস্য পোর্টাল ৪-ডিজিটের পিন (Security PIN)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={8}
                      value={editForm.pin}
                      onChange={(e) => setEditForm({ ...editForm, pin: e.target.value })}
                      className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white text-blue-700"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={editForm.fatherName}
                    onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={editForm.motherName}
                    onChange={(e) => setEditForm({ ...editForm, motherName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সদস্যের অবস্থা (Status)
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                  >
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                    <option value="pending">পেন্ডিং (Pending)</option>
                  </select>
                </div>
              </div>

              {/* Present Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বর্তমান ঠিকানা
                </label>
                <input
                  type="text"
                  value={editForm.presentAddress}
                  onChange={(e) => setEditForm({ ...editForm, presentAddress: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Permanent Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্থায়ী ঠিকানা
                </label>
                <input
                  type="text"
                  value={editForm.permanentAddress}
                  onChange={(e) => setEditForm({ ...editForm, permanentAddress: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickEditOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>সংশোধন সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
