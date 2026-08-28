import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Search, 
  Filter, 
  HandCoins, 
  MessageSquare, 
  Printer, 
  Download, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  X,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { 
  MONTHLY_SCHEDULE, 
  getMemberMonthlyStatusList, 
  getMemberScheduleSummary,
  TOTAL_SCHEDULE_AMOUNT 
} from '../../utils/monthlySchedule';

export const DueManagement: React.FC = () => {
  const { 
    members, 
    receipts,
    setActiveTab, 
    setSelectedMemberId, 
    language, 
    t, 
    showToast,
    settings 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  const [selectedDueForSms, setSelectedDueForSms] = useState<{
    memberId: string;
    memberName: string;
    mobile: string;
    dueMonths: string[];
    dueAmount: number;
  } | null>(null);

  // Compute status for all members up to August 2026 (2026-08)
  const currentRunningMonthId = '2026-08';
  const membersDueAnalysis = members.map(m => {
    const statusSummary = getMemberScheduleSummary(m.id, receipts, m.shareQty, m.memberNo);
    const unpaidMonths = statusSummary.statusList.filter(s => (s.status === 'due' || s.status === 'partial') && s.schedule.id <= currentRunningMonthId);
    
    return {
      member: m,
      summary: statusSummary,
      unpaidMonths,
      hasDue: unpaidMonths.length > 0,
      totalDue: unpaidMonths.reduce((sum, item) => sum + item.dueAmount, 0)
    };
  });

  // Filter based on search and month selection
  const filteredAnalysis = membersDueAnalysis.filter(item => {
    const matchesSearch = 
      item.member.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.member.mobile.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedMonthFilter === 'all') {
      return item.hasDue;
    } else {
      // Check if this member is due in the selected month
      const matchMonth = item.summary.statusList.find(s => s.schedule.id === selectedMonthFilter);
      return matchMonth && (matchMonth.status === 'due' || matchMonth.status === 'partial');
    }
  });

  const totalMembersWithDue = membersDueAnalysis.filter(m => m.hasDue).length;
  const overallDueAmount = membersDueAnalysis.reduce((sum, m) => sum + m.totalDue, 0);
  const overallPaidAmount = membersDueAnalysis.reduce((sum, m) => sum + m.summary.totalPaid, 0);

  // Generate Reminder SMS
  const generateSmsText = (dueData: { memberName: string; dueMonths: string[]; dueAmount: number }) => {
    const monthsStr = dueData.dueMonths.slice(0, 3).join(', ') + (dueData.dueMonths.length > 3 ? ` ও অন্যান্য` : '');
    const hotline = settings?.phones?.[0] || '01833-405170';
    return `সম্মানিত ${dueData.memberName}, বাউনিয়া বিল্ডার্স-এ আপনার (${monthsStr}) বাবদ মোট বকেয়া ৳ ${dueData.dueAmount.toLocaleString('en-IN')} টাকা। দ্রুত পরিশোধের বিনীত অনুরোধ রইল। ধন্যবাদ। হটলাইন: ${hotline}`;
  };

  const handleCopySms = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('এসএমএস টেক্সট কপি করা হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('navDues')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              ১২ মাসের বকেয়া মনিটরিং
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            প্রতিটি মাসের নির্ধারিত কিস্তি (২০০০ ৳) ও অতিরিক্ত ফি (৫০০০ ৳) আদায় ও বকেয়া পর্যালোচনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('collect_payment')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs"
          >
            <HandCoins className="w-4 h-4" />
            <span>টাকা জমা নিন</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>বকেয়া শিট প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">সর্বমোট বকেয়া টাকার পরিমাণ</div>
            <div className="text-xl font-black text-rose-700 mt-0.5">
              {formatCurrency(overallDueAmount, language === 'bn')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              ১২ মাসের মোট নির্ধারণী: {formatCurrency(TOTAL_SCHEDULE_AMOUNT * members.length, language === 'bn')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">বকেয়া সদস্য সংখ্যা</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {toBnDigits(totalMembersWithDue)} / {toBnDigits(members.length)} জন
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
              বকেয়া হার: {Math.round((totalMembersWithDue / (members.length || 1)) * 100)}%
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">মোট আদায়কৃত কিস্তি</div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {formatCurrency(overallPaidAmount, language === 'bn')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              আদায় সম্পন্ন: {Math.round((overallPaidAmount / (TOTAL_SCHEDULE_AMOUNT * members.length || 1)) * 100)}%
            </div>
          </div>
        </div>

      </div>

      {/* Month Schedule Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>মাসভিত্তিক বকেয়া ফিল্টার (Select Month to View Due Members):</span>
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> সবুজ = পেইড
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> লাল = বকেয়া
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setSelectedMonthFilter('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              selectedMonthFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            সকল মাস ({toBnDigits(totalMembersWithDue)})
          </button>

          {MONTHLY_SCHEDULE.map(sched => {
            const isSelected = selectedMonthFilter === sched.id;
            const dueInMonthCount = membersDueAnalysis.filter(m => {
              const monthStat = m.summary.statusList.find(s => s.schedule.id === sched.id);
              return monthStat && (monthStat.status === 'due' || monthStat.status === 'partial');
            }).length;

            return (
              <button
                key={sched.id}
                onClick={() => setSelectedMonthFilter(sched.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : sched.isExtraMonth
                    ? 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{sched.shortNameBn}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected 
                    ? 'bg-blue-700 text-white' 
                    : dueInMonthCount > 0 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {toBnDigits(dueInMonthCount)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Due Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-card">
        
        {/* Table Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between no-print gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সদস্য নাম, মোবাইল বা আইডি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden font-medium"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium shrink-0">
            বকেয়া সদস্য: <span className="font-bold text-rose-700">{toBnDigits(filteredAnalysis.length)}</span> জন
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t('memberId')}</th>
                <th className="py-3 px-4">{t('memberName')}</th>
                <th className="py-3 px-4 min-w-[280px]">১২ মাসের কিস্তি স্ট্যাটাস (Paid/Due Timeline)</th>
                <th className="py-3 px-4 text-right">বকেয়ার পরিমাণ</th>
                <th className="py-3 px-4 text-right no-print">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnalysis.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    কোনো বকেয়া তথ্য নেই। সকল সদস্য নিয়মিত পরিশোধিত।
                  </td>
                </tr>
              ) : (
                filteredAnalysis.map(({ member, summary, unpaidMonths, totalDue }) => {
                  const dueMonthNames = unpaidMonths.map(u => u.schedule.nameBn);

                  return (
                    <tr key={member.id} className="hover:bg-rose-50/25 transition group">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 align-top">
                        {member.id}
                      </td>
                      
                      <td className="py-3 px-4 font-bold text-slate-900 align-top">
                        <div>{member.nameBn}</div>
                        <div className="text-[11px] font-normal text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{member.mobile}</span>
                        </div>
                      </td>

                      {/* 12-Month Matrix Visual Mini-Grid */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {summary.statusList.map(item => {
                            const isPaid = item.status === 'paid';
                            const isPartial = item.status === 'partial';
                            const isDue = item.status === 'due';

                            return (
                              <span
                                key={item.schedule.id}
                                title={`${item.schedule.nameBn}: ${
                                  isPaid ? 'পরিশোধিত (' + item.paidAmount + ' ৳)' : 'বকেয়া (' + item.dueAmount + ' ৳)'
                                }`}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition ${
                                  isPaid
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : isPartial
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-rose-100 text-rose-900 border-rose-300'
                                }`}
                              >
                                {item.schedule.shortNameBn.replace(' ২০', ' ')}
                              </span>
                            );
                          })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          পরিশোধিত: <strong className="text-emerald-700">{toBnDigits(summary.paidMonthsCount)}</strong> / ১২ মাস
                        </div>
                      </td>

                      <td className="py-3 px-4 font-black text-rose-700 text-sm whitespace-nowrap align-top text-right">
                        ৳ {toBnDigits(totalDue.toLocaleString('en-IN'))}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap no-print align-top">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDueForSms({
                              memberId: member.id,
                              memberName: member.nameBn,
                              mobile: member.mobile,
                              dueMonths: dueMonthNames,
                              dueAmount: totalDue
                            })}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition cursor-pointer"
                            title="এসএমএস রিমাইন্ডার বার্তা"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>এসএমএস</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMemberId(member.id);
                              setActiveTab('collect_payment');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition cursor-pointer"
                          >
                            <HandCoins className="w-3.5 h-3.5" />
                            <span>আদায় করুন</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SMS Reminder Modal */}
      {selectedDueForSms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-300" />
                <span>বকেয়া তাগাদা বার্তা (SMS Reminder)</span>
              </h3>
              <button
                onClick={() => setSelectedDueForSms(null)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">প্রাপক: </span>
                <strong className="text-slate-900">{selectedDueForSms.memberName}</strong> ({selectedDueForSms.memberId})
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রস্তুতকৃত বাংলা বার্তা:</label>
                <textarea
                  rows={4}
                  readOnly
                  value={generateSmsText(selectedDueForSms)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 leading-relaxed outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCopySms(generateSmsText(selectedDueForSms))}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>টেক্সট কপি করুন</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generateSmsText(selectedDueForSms))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>WhatsApp এ পাঠান</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
