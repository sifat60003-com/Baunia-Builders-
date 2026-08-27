import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Printer, 
  Download, 
  Users, 
  Coins, 
  AlertTriangle, 
  Award, 
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { 
    members, 
    receipts, 
    incomes, 
    expenses, 
    monthlyDues, 
    shares, 
    stats, 
    settings, 
    language, 
    t 
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'members' | 'financial' | 'dues' | 'shares'>('financial');

  // Print
  const handlePrint = () => {
    window.print();
  };

  // CSV Export for current tab
  const handleExport = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = 'report.csv';

    if (activeReportTab === 'members') {
      filename = 'Baunia_Builders_Member_Report.csv';
      headers = ['Member ID', 'Name Bn', 'Name En', 'Mobile', 'NID', 'Share Qty', 'Monthly Fee', 'Total Deposit', 'Current Due', 'Status'];
      rows = members.map(m => [
        m.id, `"${m.nameBn}"`, `"${m.nameEn || ''}"`, m.mobile, m.nid, m.shareQty, m.monthlyFee, m.currentDeposit, m.currentDue, m.status
      ]);
    } else if (activeReportTab === 'financial') {
      filename = 'Baunia_Builders_Financial_Report.csv';
      headers = ['Date', 'Type', 'Title / Member', 'Category', 'Amount', 'Method'];
      const recs = receipts.map(r => [r.date, 'Member Collection', `"${r.memberName}"`, r.paymentType, r.amount, r.paymentMethod]);
      const incs = incomes.map(i => [i.date, 'Income', `"${i.title}"`, i.category, i.amount, i.paymentMethod]);
      const exps = expenses.map(e => [e.date, 'Expense', `"${e.title}"`, e.category, -e.amount, e.paymentMethod]);
      rows = [...recs, ...incs, ...exps];
    } else if (activeReportTab === 'dues') {
      filename = 'Baunia_Builders_Overdue_Report.csv';
      headers = ['Member ID', 'Member Name', 'Month', 'Due Amount', 'Last Payment'];
      rows = monthlyDues.filter(d => d.dueAmount > 0).map(d => [
        d.memberId, `"${d.memberName}"`, d.month, d.dueAmount, d.lastPaymentDate
      ]);
    } else if (activeReportTab === 'shares') {
      filename = 'Baunia_Builders_Share_Report.csv';
      headers = ['Cert No', 'Member ID', 'Member Name', 'Share Qty', 'Issue Date'];
      rows = shares.map(s => [
        s.certificateNo, s.memberId, `"${s.memberName}"`, s.shareQty, s.issueDate
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navReports')} (Comprehensive Financial & Audit Reports)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            বাউনিয়া বিল্ডার্স এর সামগ্রিক আর্থিক বিবরণী, অডিট শিট ও প্রতিবেদন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>রিপোর্ট প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs (no-print) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit no-print">
        <button
          onClick={() => setActiveReportTab('financial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeReportTab === 'financial'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>আর্থিক লাভ-ক্ষতি ও ব্যালেন্স শিট</span>
        </button>

        <button
          onClick={() => setActiveReportTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeReportTab === 'members'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>সদস্যদের পূর্ণাঙ্গ তালিকা ও ডিপোজিট রিপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveReportTab('dues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeReportTab === 'dues'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>বকেয়া ও অনাদায়ী তালিকা (Defaulters)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('shares')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeReportTab === 'shares'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>শেয়ার ক্যাপিটাল রেজিস্ট্রি রিপোর্ট</span>
        </button>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6 print-card">
        
        {/* Printable Header */}
        <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
            বাউনিয়া বিল্ডার্স
          </h2>
          <div className="text-xs font-bold text-blue-800 uppercase tracking-widest">
            BAUNIA BUILDERS | DHAKA, BANGLADESH
          </div>
          <p className="text-xs text-slate-600">
            {settings.addressBn || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০'} | মোবাইল: 01833-805170, 01711-280514
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
              {activeReportTab === 'financial' && 'মাসিক ও বাৎসরিক পূর্ণাঙ্গ আর্থিক প্রতিবেদন'}
              {activeReportTab === 'members' && 'সদস্য তালিকা ও সঞ্চয় স্থিতি প্রতিবেদন'}
              {activeReportTab === 'dues' && 'অনাদায়ী ও বকেয়া চাঁদা প্রতিবেদন'}
              {activeReportTab === 'shares' && 'শেয়ার মূলধন রেজিস্ট্রি প্রতিবেদন'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            প্রতিবেদন তৈরির তারিখ: {formatDate(new Date().toISOString(), true)}
          </div>
        </div>

        {/* TAB 1: Financial Statement */}
        {activeReportTab === 'financial' && (
          <div className="space-y-6">
            
            {/* KPI Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[11px] text-slate-500 block">মোট সদস্য সংগ্রহ</span>
                <span className="text-lg font-extrabold text-blue-950">
                  {formatCurrency(stats.totalDeposits, language === 'bn')}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] text-slate-500 block">অন্যান্য প্রাতিষ্ঠানিক আয়</span>
                <span className="text-lg font-extrabold text-emerald-800">
                  {formatCurrency(stats.totalIncome, language === 'bn')}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[11px] text-slate-500 block">মোট ব্যয় ও খরচ</span>
                <span className="text-lg font-extrabold text-rose-700">
                  {formatCurrency(stats.totalExpenses, language === 'bn')}
                </span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-[11px] text-slate-500 block">নেট উদ্বৃত্ত / ব্যালেন্স</span>
                <span className="text-lg font-extrabold text-indigo-950">
                  {formatCurrency(stats.cashInHand, language === 'bn')}
                </span>
              </div>
            </div>

            {/* Income & Expense Breakdown Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Income Column */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-emerald-800 text-white font-bold text-xs flex justify-between">
                  <span>প্রাপ্তি ও আয়সমূহ (Inflows)</span>
                  <span>টাকার পরিমাণ</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium">সদস্যদের নিয়মিত মাসিক চাঁদা ও সঞ্চয়</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(stats.monthlyCollected, true)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">নতুন শেয়ার বিক্রয় মূলধন</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(stats.totalShareCapital, true)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">সদস্য ভর্তি ফি ও প্রকল্প আয়</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(stats.totalIncome, true)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-emerald-50 font-bold border-t border-emerald-200">
                    <tr>
                      <td className="p-2.5">সর্বমোট প্রাপ্তি</td>
                      <td className="p-2.5 text-right text-emerald-900 font-extrabold">
                        {formatCurrency(stats.totalDeposits + stats.totalIncome, true)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Expense Column */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-rose-800 text-white font-bold text-xs flex justify-between">
                  <span>ব্যয় ও খরচসমূহ (Outflows)</span>
                  <span>টাকার পরিমাণ</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium">অফিস ভাড়া ও ইউটিলিটি বিল</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">৳ ৫২,০০০</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">কর্মকর্তা ও কর্মচারীদের বেতন</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">৳ ২৫,০০০</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">আপ্যায়ন, স্টেশনারি ও বিবিধ ব্যয়</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">৳ ৮,০০০</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-rose-50 font-bold border-t border-rose-200">
                    <tr>
                      <td className="p-2.5">সর্বমোট ব্যয়</td>
                      <td className="p-2.5 text-right text-rose-900 font-extrabold">
                        {formatCurrency(stats.totalExpenses, true)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Members Report */}
        {activeReportTab === 'members' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">আইডি</th>
                  <th className="p-2.5">সদস্যের নাম</th>
                  <th className="p-2.5">মোবাইল</th>
                  <th className="p-2.5">শেয়ার</th>
                  <th className="p-2.5">মোট সঞ্চয় জমা</th>
                  <th className="p-2.5">বকেয়া</th>
                  <th className="p-2.5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="p-2.5 font-mono font-bold text-blue-700">{m.id}</td>
                    <td className="p-2.5 font-bold text-slate-900">{m.nameBn}</td>
                    <td className="p-2.5 font-mono text-slate-600">{m.mobile}</td>
                    <td className="p-2.5 font-bold">{m.shareQty} টি</td>
                    <td className="p-2.5 font-bold text-emerald-700">{formatCurrency(m.currentDeposit, true)}</td>
                    <td className="p-2.5 font-bold text-rose-600">{formatCurrency(m.currentDue, true)}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">সক্রিয়</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Dues Report */}
        {activeReportTab === 'dues' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">আইডি</th>
                  <th className="p-2.5">সদস্যের নাম</th>
                  <th className="p-2.5">মাস / বিবরণ</th>
                  <th className="p-2.5 text-rose-600">বকেয়া টাকার পরিমাণ</th>
                  <th className="p-2.5">সর্বশেষ জমার তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyDues.filter(d => d.dueAmount > 0).map(d => (
                  <tr key={d.id}>
                    <td className="p-2.5 font-mono font-bold">{d.memberId}</td>
                    <td className="p-2.5 font-bold text-slate-900">{d.memberName}</td>
                    <td className="p-2.5 font-medium">{d.month}</td>
                    <td className="p-2.5 font-extrabold text-rose-600">{formatCurrency(d.dueAmount, true)}</td>
                    <td className="p-2.5 text-slate-600">{formatDate(d.lastPaymentDate, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Shares Report */}
        {activeReportTab === 'shares' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">সনদ নং</th>
                  <th className="p-2.5">আইডি</th>
                  <th className="p-2.5">শেয়ারহোল্ডার নাম</th>
                  <th className="p-2.5">শেয়ার সংখ্যা</th>
                  <th className="p-2.5">ইস্যু তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shares.map(s => (
                  <tr key={s.id}>
                    <td className="p-2.5 font-mono font-bold text-blue-800">{s.certificateNo}</td>
                    <td className="p-2.5 font-mono">{s.memberId}</td>
                    <td className="p-2.5 font-bold text-slate-900">{s.memberName}</td>
                    <td className="p-2.5 font-bold text-blue-900">{s.shareQty} টি</td>
                    <td className="p-2.5 text-slate-600">{formatDate(s.issueDate, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures for Print Mode */}
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

      </div>

    </div>
  );
};
