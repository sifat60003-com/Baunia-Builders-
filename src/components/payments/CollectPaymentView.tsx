import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HandCoins, 
  User, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Receipt, 
  Printer, 
  Coins,
  Sparkles,
  Phone,
  Clock,
  Layers,
  CheckSquare,
  Square,
  CheckCheck,
  RotateCcw,
  X,
  Plus,
  HelpCircle,
  Tag,
  FileText,
  Search,
  ChevronDown
} from 'lucide-react';
import { PaymentType, PaymentMethod, MonthPaymentBreakdown } from '../../types';
import { formatCurrency, numberToBengaliWords, numberToEnglishWords, toBnDigits } from '../../utils/formatters';
import { MONTHLY_SCHEDULE, getMonthlySchedule, getMemberMonthlyStatusList, MonthScheduleItem, getCurrentRunningMonthId } from '../../utils/monthlySchedule';

export const CollectPaymentView: React.FC = () => {
  const { 
    members, 
    receipts,
    collectPayment, 
    selectedMemberId, 
    setSelectedMemberId, 
    setActiveTab, 
    setSelectedReceiptId,
    currentUser, 
    language, 
    t, 
    showToast 
  } = useApp();

  const eligibleMembers = members.filter(m => (m.memberNo || 0) >= 1 && (m.memberNo || 0) <= 96);

  const [memberId, setMemberId] = useState(selectedMemberId || eligibleMembers[0]?.id || members[0]?.id || '');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('monthly_fee');
  
  // Multiple month selection state (array of month IDs)
  const [selectedMonthIds, setSelectedMonthIds] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(2000);
  const [isManualAmount, setIsManualAmount] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [collectorName, setCollectorName] = useState(currentUser.name);

  // Selected Member (from members 1 to 96)
  const selectedMember = eligibleMembers.find(m => m.id === memberId) || eligibleMembers[0] || members[0];
  const shareQty = selectedMember?.shareQty || 1;

  // Filtered members for search box (1 to 96)
  const filteredMembers = eligibleMembers.filter(m => 
    m.nameBn.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.mobile.includes(memberSearchQuery) ||
    String(m.memberNo).includes(memberSearchQuery)
  );

  // Dynamic schedule based on member's shareQty (month * share = amount, extra * share = amount)
  const memberSchedule = getMonthlySchedule(shareQty, [], true);

  // Calculate monthly status matrix for selected member
  const memberMonthlyStatus = selectedMember 
    ? getMemberMonthlyStatusList(selectedMember.id, receipts, shareQty, selectedMember.memberNo) 
    : [];

  const visibleUnpaidMonths = memberMonthlyStatus.filter(item => item.status !== 'paid').slice(0, 12);

  // Get array of scheduled items for currently selected months (excluding paid months)
  const selectedSchedules = memberSchedule
    .filter(m => selectedMonthIds.includes(m.id))
    .filter(m => {
      const statusObj = memberMonthlyStatus.find(s => s.schedule.id === m.id);
      return !statusObj || statusObj.status !== 'paid';
    })
    .sort((a, b) => a.monthOrder - b.monthOrder);

  // Calculate multi-month totals
  const totalBaseAmount = selectedSchedules.reduce((sum, s) => sum + s.baseAmount, 0);
  const totalExtraAmount = selectedSchedules.reduce((sum, s) => sum + s.extraAmount, 0);
  const calculatedScheduleTotal = selectedSchedules.reduce((sum, s) => sum + s.totalAmount, 0);
  const extraMonthsCount = selectedSchedules.filter(s => s.isExtraMonth).length;
  const regularMonthsCount = selectedSchedules.length;

  // Automatic Fine Calculation
  // Due Date = 15 of every month. Fine = 200 Tk. Fine applies from 16th. Disabled as requested.
  const todayStr = new Date().toISOString().split('T')[0];
  const totalFineAmount = 0;

  // Find all unpaid / due months for this member up to the current running month
  const dueMonthsList = memberMonthlyStatus.filter(m => (m.status === 'due' || m.status === 'partial') && m.schedule.id <= getCurrentRunningMonthId());

  // Sync memberId when selectedMemberId from context changes
  useEffect(() => {
    if (selectedMemberId && selectedMemberId !== memberId) {
      setMemberId(selectedMemberId);
    }
  }, [selectedMemberId]);

  // When member changes, auto-select all their due months (unpaid)
  useEffect(() => {
    if (selectedMember) {
      const statusList = getMemberMonthlyStatusList(selectedMember.id, receipts, selectedMember.shareQty || 1, selectedMember.memberNo);
      const dueList = statusList.filter(s => (s.status === 'due' || s.status === 'partial') && s.schedule.id <= getCurrentRunningMonthId());
      
      if (dueList.length > 0) {
        // Auto-select ALL due months so user doesn't lose any due selection
        setSelectedMonthIds(dueList.map(s => s.schedule.id));
      } else {
        const firstUnpaid = statusList.find(s => s.status !== 'paid');
        if (firstUnpaid) {
          setSelectedMonthIds([firstUnpaid.schedule.id]);
        } else {
          setSelectedMonthIds([]);
        }
      }
      setIsManualAmount(false);
    }
  }, [memberId]);

  // When selectedMonthIds changes, auto update amount (locked/readOnly)
  useEffect(() => {
    setAmount((calculatedScheduleTotal || (2000 * shareQty)) + totalFineAmount);
  }, [selectedMonthIds, calculatedScheduleTotal, shareQty, totalFineAmount]);

  // Toggle month selection handler (Multi-select)
  const handleToggleMonth = (schedule: MonthScheduleItem) => {
    const statusObj = memberMonthlyStatus.find(s => s.schedule.id === schedule.id);
    if (statusObj && statusObj.status === 'paid') {
      showToast('এই মাসটি ইতিমধ্যে পরিশোধিত হয়েছে (লকড - ডাবল কালেকশন নিষিদ্ধ)', 'info');
      return;
    }
    setIsManualAmount(false);
    setSelectedMonthIds(prev => {
      if (prev.includes(schedule.id)) {
        // If clicking on the only selected month, keep it or allow deselecting
        if (prev.length === 1) {
          return prev; // keep at least 1 month
        }
        return prev.filter(id => id !== schedule.id);
      } else {
        return [...prev, schedule.id];
      }
    });
  };

  // Quick selection helpers
  const handleSelectAllDue = () => {
    setIsManualAmount(false);
    if (dueMonthsList.length > 0) {
      setSelectedMonthIds(dueMonthsList.map(d => d.schedule.id));
      showToast(`${toBnDigits(dueMonthsList.length)}টি বকেয়া মাস নির্বাচিত হয়েছে`, 'info');
    } else {
      showToast('এই সদস্যের কোনো বকেয়া মাস নেই', 'info');
    }
  };

  const handleSelectAll12Months = () => {
    setIsManualAmount(false);
    const unpaidMonthIds = visibleUnpaidMonths.map(item => item.schedule.id);
    setSelectedMonthIds(unpaidMonthIds);
    showToast('সকল দৃশ্যমান মাস একসাথে নির্বাচিত হয়েছে', 'info');
  };

  const handleSelectFirstNMonths = (count: number) => {
    setIsManualAmount(false);
    const unpaidMonths = visibleUnpaidMonths
      .slice(0, count)
      .map(item => item.schedule.id);
    setSelectedMonthIds(unpaidMonths);
    showToast(`প্রথম ${toBnDigits(count)}টি বকেয়া মাস নির্বাচিত হয়েছে`, 'info');
  };

  const handleClearSelection = () => {
    setIsManualAmount(false);
    // Keep first unpaid schedule as default
    const firstUnpaid = memberMonthlyStatus.find(s => s.status !== 'paid');
    const firstSchedId = dueMonthsList.length > 0 
      ? dueMonthsList[0].schedule.id 
      : firstUnpaid 
      ? firstUnpaid.schedule.id 
      : memberSchedule[0]?.id || '2025-11';
    setSelectedMonthIds([firstSchedId]);
  };

  // Amount in words
  const amountWordsBn = numberToBengaliWords(amount || 0);
  const amountWordsEn = numberToEnglishWords(amount || 0);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember) {
      showToast('অনুগ্রহ করে একজন সদস্য নির্বাচন করুন', 'error');
      return;
    }

    if (!amount || amount <= 0) {
      showToast('টাকার পরিমাণ শূন্য বা নেতিবাচক হতে পারে না', 'error');
      return;
    }

    const previousDue = selectedMember.currentDue || 0;
    const remainingDue = Math.max(0, previousDue - (paymentType === 'monthly_fee' ? (amount - totalFineAmount) : amount));

    // Construct breakdown items for the selected months
    let monthBreakdown: MonthPaymentBreakdown[] = [];
    let compositeMonthName = '';
    let isExtraMonth = false;

    if (paymentType === 'monthly_fee') {
      const alreadyPaidMonths = selectedMonthIds.filter(mId => {
        const statusObj = memberMonthlyStatus.find(s => s.schedule.id === mId);
        return statusObj && statusObj.status === 'paid';
      });
      if (alreadyPaidMonths.length > 0) {
        showToast('নির্বাচিত মাস(সমূহ) ইতিমধ্যে পরিশোধিত হয়েছে! ডাবল রসিদ কাটা নিষিদ্ধ।', 'error');
        return;
      }

      const monthNamesList = selectedSchedules.map(s => s.nameBn);
      isExtraMonth = selectedSchedules.some(s => s.isExtraMonth);
      
      if (selectedSchedules.length === 1) {
        compositeMonthName = selectedSchedules[0].nameBn;
      } else {
        compositeMonthName = `${selectedSchedules.map(s => s.shortNameBn).join(', ')} (${toBnDigits(selectedSchedules.length)}টি মাস)`;
      }

      // Allocate payment per month
      monthBreakdown = selectedSchedules.map(sched => {
        return {
          monthId: sched.id,
          monthName: sched.nameBn,
          shortName: sched.shortNameBn,
          baseAmount: sched.baseAmount,
          extraAmount: sched.extraAmount,
          totalAmount: sched.totalAmount,
          isExtraMonth: sched.isExtraMonth,
          paidAmount: sched.totalAmount
        };
      });
    }

    const newReceipt = collectPayment({
      memberId: selectedMember.id,
      memberName: selectedMember.nameBn,
      paymentType,
      amount: Number(amount),
      paymentMethod,
      transactionRef: transactionRef.trim() || undefined,
      paymentMonth: paymentType === 'monthly_fee' ? selectedMonthIds[0] : undefined,
      monthName: paymentType === 'monthly_fee' ? compositeMonthName : undefined,
      paymentMonths: paymentType === 'monthly_fee' ? selectedMonthIds : undefined,
      monthNames: paymentType === 'monthly_fee' ? selectedSchedules.map(s => s.nameBn) : undefined,
      monthBreakdown: paymentType === 'monthly_fee' ? monthBreakdown : undefined,
      isExtraMonth,
      baseAmount: paymentType === 'monthly_fee' ? totalBaseAmount : amount,
      extraAmount: paymentType === 'monthly_fee' ? totalExtraAmount : 0,
      fineAmount: totalFineAmount,
      remarks: remarks.trim() || undefined,
      collectorName,
      previousDue,
      remainingDue,
    });

    showToast(`টাকা জমা সম্পন্ন হয়েছে! রশিদ #${newReceipt.receiptNo} সংরক্ষণ করা হয়েছে। নতুন জমা নেয়ার জন্য ফর্ম প্রস্তুত।`, 'success');
    
    // Refresh form state for next collection
    setRemarks('');
    setTransactionRef('');
    setIsManualAmount(false);
    setMemberSearchQuery('');
    setIsMemberDropdownOpen(false);
  };

  const totalPaidMonths = memberMonthlyStatus.filter(m => m.status === 'paid').length;
  const totalDueMonths = memberMonthlyStatus.filter(m => m.status === 'due').length;
  const totalPartialMonths = memberMonthlyStatus.filter(m => m.status === 'partial').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <HandCoins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t('navCollectPayment')}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                মাল্টিপল মাস কালেকশন
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              একাধিক মাস বা এককালীন ১২ মাসের কিস্তি নির্বাচন করে একসাথে টাকা গ্রহণ ও অটো হিসাব
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dues')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer border border-rose-200"
          >
            <AlertCircle className="w-4 h-4" />
            <span>বকেয়া তালিকা ({toBnDigits(dueMonthsList.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-slate-500" />
            <span>সকল রসিদ</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Member Selection & Live Member Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>১. সদস্য নির্বাচন করুন (Select Member)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              সদস্য নং ১ থেকে ৯৬ (মোট: {toBnDigits(eligibleMembers.length)} জন)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>সদস্যের নাম, আইডি, মোবাইল বা নং লিখে খুঁজুন <span className="text-rose-500">*</span></span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">সার্চ বক্স</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => {
                    setMemberSearchQuery(e.target.value);
                    setIsMemberDropdownOpen(true);
                  }}
                  onFocus={() => setIsMemberDropdownOpen(true)}
                  placeholder={selectedMember ? `নির্বাচিত: ${selectedMember.memberNo}. ${selectedMember.nameBn} (${selectedMember.mobile})` : "সদস্য খুঁজুন (নাম, মোবাইল, নং)..."}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown List */}
              {isMemberDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 max-h-64 overflow-y-auto">
                  <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500 flex justify-between items-center sticky top-0">
                    <span>সদস্য তালিকা (নং ১ - ৯৬)</span>
                    <button 
                      type="button" 
                      onClick={() => setIsMemberDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600 font-bold px-1"
                    >
                      ✕ বন্ধ
                    </button>
                  </div>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setMemberId(m.id);
                          setSelectedMemberId(m.id);
                          setMemberSearchQuery('');
                          setIsMemberDropdownOpen(false);
                        }}
                        className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-50 transition flex items-center justify-between border-b border-slate-50 ${
                          memberId === m.id ? 'bg-blue-50/80 font-bold text-blue-900' : 'text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {m.memberNo}
                          </span>
                          <div>
                            <div className="font-bold">{m.nameBn}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{m.id} • {m.mobile}</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          শেয়ার: {toBnDigits(m.shareQty)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      কোনো সদস্য পাওয়া যায়নি (১ থেকে ৯৬ এর মধ্যে)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Member Quick Preview Pill */}
            {selectedMember && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {selectedMember.memberNo}
                  </div>
                  <div>
                    <div className="font-bold text-blue-950 text-sm flex items-center gap-2">
                      <span>{selectedMember.nameBn}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-200/70 text-blue-900 font-mono">
                        {selectedMember.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-blue-600" />
                        <span className="font-mono">{selectedMember.mobile}</span>
                      </span>
                      <span>•</span>
                      <span>শেয়ার: <strong>{toBnDigits(selectedMember.shareQty)} টি</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-500">১২ মাসের অবস্থা</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      পেইড: {toBnDigits(totalPaidMonths)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                      বকেয়া: {toBnDigits(totalDueMonths + totalPartialMonths)}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Step 2: Payment Type Selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>২. জমার খাত ও মাল্টিপল মাস নির্বাচন (Multi-Month Schedule Selection)</span>
            </h2>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> পরিশোধিত
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> আসন্ন (Next)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> অগ্রিম পরিশোধ (Advance)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> বকেয়া (Due)
              </span>
            </div>
          </div>

          {/* MULTI-MONTH SCHEDULE SELECTION MATRIX */}
          <div className="pt-1 space-y-4">
              
              {/* Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>ক্লিক করে এক বা একাধিক মাস সিলেক্ট করুন:</span>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {dueMonthsList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllDue}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>সকল বকেয়া মাস ({toBnDigits(dueMonthsList.length)})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectFirstNMonths(3)}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                  >
                    প্রথম ৩ মাস
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectFirstNMonths(6)}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                  >
                    প্রথম ৬ মাস
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectAll12Months}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition cursor-pointer"
                  >
                    সকল মাস একত্রে
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 font-medium text-[11px] transition cursor-pointer flex items-center gap-0.5"
                    title="সিলেকশন রিসেট"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>রিসেট</span>
                  </button>
                </div>
              </div>

              {/* 12-Month Interactive Grid with Multi-Select Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {visibleUnpaidMonths.map((item) => {
                  const isPaid = item.status === 'paid';
                  const isSelected = !isPaid && selectedMonthIds.includes(item.schedule.id);
                  const isPartial = item.status === 'partial';
                  const isNext = item.isNext;
                  const isAdvance = item.isAdvance;
                  const isDue = item.status === 'due' && !isNext && !isAdvance;
                  const isExtra = item.schedule.isExtraMonth;

                  return (
                    <div
                      key={item.schedule.id}
                      onClick={() => handleToggleMonth(item.schedule)}
                      className={`relative p-3 rounded-xl border-2 transition flex flex-col justify-between select-none ${
                        isPaid
                          ? 'bg-emerald-50/90 border-emerald-400 text-emerald-900 cursor-not-allowed opacity-90 shadow-none'
                          : isSelected 
                          ? 'ring-3 ring-blue-500/40 border-blue-600 shadow-md scale-[1.02] z-10 cursor-pointer' 
                          : 'hover:scale-[1.01] border-slate-200 cursor-pointer'
                      } ${
                        isSelected
                          ? isExtra 
                            ? 'bg-indigo-50/90 text-indigo-950'
                            : 'bg-blue-50/90 text-blue-950'
                          : isPaid
                          ? ''
                          : isNext
                          ? 'bg-blue-50/80 border-blue-500 text-blue-950 hover:bg-blue-100/80 shadow-xs'
                          : isAdvance
                          ? 'bg-amber-50/80 border-amber-400 text-amber-950 hover:bg-amber-100/80 shadow-xs'
                          : isPartial
                          ? 'bg-amber-50/70 border-amber-300 text-amber-900 hover:bg-amber-100/70'
                          : 'bg-rose-50/70 border-rose-300 text-rose-900 hover:bg-rose-100/70'
                      }`}
                    >
                      {/* Top checkbox and order badge */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1">
                          {isPaid ? (
                            <span className="text-emerald-700 font-bold text-[11px]" title="লকড">🔒</span>
                          ) : isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                            #{toBnDigits(item.schedule.monthOrder)}
                          </span>
                        </div>

                        {isPaid && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                            <CheckCircle2 className="w-2.5 h-2.5" /> পরিশোধিত
                          </span>
                        )}
                        {isNext && !isPaid && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow-xs">
                            <Clock className="w-2.5 h-2.5" /> আসন্ন
                          </span>
                        )}
                        {isAdvance && !isPaid && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-bold shadow-xs">
                            <Clock className="w-2.5 h-2.5" /> অগ্রিম পরিশোধ
                          </span>
                        )}
                        {isDue && !isPaid && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                            <AlertCircle className="w-2.5 h-2.5" /> বকেয়া
                          </span>
                        )}
                        {isPartial && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-bold">
                            <Clock className="w-2.5 h-2.5" /> আংশিক
                          </span>
                        )}
                      </div>

                      {/* Month Name */}
                      <div className="font-extrabold text-xs tracking-tight">
                        {item.schedule.shortNameBn}
                      </div>

                      {/* Month Amount Breakdown */}
                      <div className="mt-2 pt-1.5 border-t border-black/5 flex items-end justify-between">
                        <div>
                          <div className="text-[11px] font-black tracking-tight">
                            ৳ {toBnDigits(item.schedule.totalAmount.toLocaleString('en-IN'))}
                          </div>
                          {isExtra && (
                            <div className="text-[9px] font-bold text-indigo-700 bg-indigo-100/80 px-1 py-0.2 rounded mt-0.5 inline-block">
                              +৫০০০ এক্সট্রা
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[9px] font-bold">
                            নির্বাচিত
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-Month Live Calculation & Summary Breakdown Card */}
              {selectedSchedules.length > 0 && (
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-emerald-50/60 border border-blue-200/90 space-y-3.5 shadow-xs">
                  
                  {/* Top Bar with Selected Count & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black shadow-xs">
                        {toBnDigits(selectedSchedules.length)} টি মাস নির্বাচিত
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        ({selectedSchedules.map(s => s.shortNameBn).join(', ')})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500">মোট নির্ধারিত হার: </span>
                      <strong className="text-base font-black text-emerald-800">
                        ৳ {toBnDigits(calculatedScheduleTotal.toLocaleString('en-IN'))}
                      </strong>
                    </div>
                  </div>

                  {/* Selected Month Chips with remove button */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedSchedules.map(s => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-blue-300 text-blue-950 shadow-2xs"
                      >
                        <span>{s.shortNameBn}</span>
                        <span className="text-emerald-700 font-extrabold text-[11px] font-mono">
                          (৳ {toBnDigits(s.totalAmount.toLocaleString('en-IN'))})
                        </span>
                        {selectedSchedules.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMonth(s);
                            }}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer ml-0.5"
                            title="বাতিল করুন"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Breakdown Math calculation row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500 font-semibold">নিয়মিত কিস্তি (Base Rate)</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {toBnDigits(regularMonthsCount)} মাস × ২০০০ = <span className="text-blue-900 font-black">৳ {toBnDigits(totalBaseAmount.toLocaleString('en-IN'))}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500 font-semibold">বিশেষ অতিরিক্ত ফি (Extra Fee)</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {extraMonthsCount > 0 ? (
                          <span>{toBnDigits(extraMonthsCount)} মাস × ৫০০০ = <span className="text-indigo-900 font-black">৳ {toBnDigits(totalExtraAmount.toLocaleString('en-IN'))}</span></span>
                        ) : (
                          <span className="text-slate-400">০ ৳ (কোনো অতিরিক্ত ফি নেই)</span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300">
                      <div className="text-[10px] text-emerald-800 font-semibold">সর্বমোট স্বয়ংক্রিয় যোগফল</div>
                      <div className="font-black text-emerald-900 text-sm mt-0.5">
                        ৳ {toBnDigits((calculatedScheduleTotal + totalFineAmount).toLocaleString('en-IN'))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

        </div>

        {/* Step 3: Payment Particulars & Method */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>৩. নগদ টাকা আদায় ও মাধ্যম (Payment & Confirmation)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Amount Input with Auto Indicator */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>আদায়কৃত টাকার পরিমাণ (Amount in BDT) <span className="text-rose-500">*</span></span>
                {paymentType === 'monthly_fee' && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {selectedMonthIds.length > 1 ? `${toBnDigits(selectedMonthIds.length)} মাসের মোট হিসাব` : 'স্বয়ংক্রিয় হিসাব'}
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                <input
                  type="number"
                  readOnly
                  value={amount}
                  className="w-full pl-8 pr-9 py-2.5 text-base bg-slate-100 border-2 border-emerald-300/80 rounded-xl font-black text-emerald-950 cursor-not-allowed select-none"
                  title="এই পরিমাণটি নির্বাচিত মাস ও শেয়ার সংখ্যা অনুযায়ী স্বয়ংক্রিয়ভাবে নির্ধারিত এবং লকড"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700 pointer-events-none" title="লকড (সম্পাদনা নিষিদ্ধ)">
                  🔒
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                পরিশোধের মাধ্যম (Payment Method)
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-bold text-slate-800 cursor-pointer"
              >
                <option value="cash">নগদ ক্যাশ গ্রহণ (Cash)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ অ্যাপ (Nagad)</option>
                <option value="bank">ব্যাংক ডিপোজিট (Bank Transfer)</option>
                <option value="cheque">চেক মারফত (Cheque)</option>
              </select>
            </div>

            {/* Transaction Ref (if not cash) */}
            {paymentMethod !== 'cash' ? (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ট্রানজেকশন / রেফারেন্স নং (Txn ID)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. TRX-987654 / CHQ-12345"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  টাকা আদায়কারী কর্মকর্তা (Collector)
                </label>
                <input
                  type="text"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>
            )}

          </div>

          {/* Amount In Words Dynamic Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/80 border border-emerald-200/90 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>টাকার পরিমাণ কথায় (In Words):</span>
            </div>
            <div className="text-xs font-black text-emerald-900">
              {amountWordsBn}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 italic">
              {amountWordsEn}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              মন্তব্য বা বিশেষ নোট (যদি থাকে)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                selectedSchedules.length > 0 
                  ? `যেমন: ${selectedSchedules.map(s => s.shortNameBn).join(', ')} মাসের কিস্তি পরিশোধ...`
                  : 'মন্তব্য লিখুন...'
              }
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-hidden font-medium"
            />
          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition"
          >
            বাতিল
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer active:scale-98"
          >
            <Printer className="w-4.5 h-4.5" />
            <span>
              {paymentType === 'monthly_fee' && selectedMonthIds.length > 1
                ? `${toBnDigits(selectedMonthIds.length)} মাসের টাকা জমা নিশ্চিত করুন ও মানি রসিদ তৈরি করুন`
                : 'টাকা জমা নিশ্চিত করুন ও মানি রসিদ তৈরি করুন'}
            </span>
          </button>
        </div>

      </form>

    </div>
  );
};
