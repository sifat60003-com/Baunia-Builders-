import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Award, 
  Coins, 
  HandCoins, 
  CalendarDays, 
  CalendarClock, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  PlusCircle, 
  Receipt, 
  FileText, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Printer,
  CheckCircle2,
  Landmark
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';

export const DashboardView: React.FC = () => {
  const { 
    stats, 
    t, 
    language, 
    receipts, 
    members, 
    incomes,
    expenses,
    monthlyDues,
    fdrs,
    setActiveTab, 
    setSelectedMemberId, 
    setSelectedReceiptId 
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'collection' | 'income_expense'>('collection');

  // KPI Cards configuration
  const kpiCards = [
    {
      id: 'total-members',
      title: t('totalMembers'),
      value: language === 'bn' ? toBnDigits(stats.totalMembers) : stats.totalMembers,
      sub: `${stats.activeMembers} ${t('active')}`,
      icon: Users,
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      onClick: () => setActiveTab('members'),
    },
    {
      id: 'active-members',
      title: t('activeMembers'),
      value: language === 'bn' ? toBnDigits(stats.activeMembers) : stats.activeMembers,
      sub: `${language === 'bn' ? toBnDigits(((stats.activeMembers / (stats.totalMembers || 1)) * 100).toFixed(0)) : ((stats.activeMembers / (stats.totalMembers || 1)) * 100).toFixed(0)}% সক্রিয়`,
      icon: UserCheck,
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      onClick: () => setActiveTab('members'),
    },
    {
      id: 'total-shares',
      title: t('totalShares'),
      value: language === 'bn' ? toBnDigits(stats.totalShares) : stats.totalShares,
      sub: `${language === 'bn' ? toBnDigits(stats.totalMembers) : stats.totalMembers} ${language === 'bn' ? 'জন সদস্যের শেয়ার' : 'Total Members'}`,
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      onClick: () => setActiveTab('shares'),
    },
    {
      id: 'total-collection',
      title: t('totalCollection'),
      value: formatCurrency(stats.totalCollection, language === 'bn'),
      sub: `${receipts.length} ${language === 'bn' ? 'টি রসিদ' : 'Receipts'}`,
      icon: HandCoins,
      color: 'from-blue-700 to-blue-900',
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-50',
      onClick: () => setActiveTab('receipts'),
    },
    {
      id: 'today-collection',
      title: t('todayCollection'),
      value: formatCurrency(stats.todayCollection, language === 'bn'),
      sub: language === 'bn' ? 'আজকের মোট প্রাপ্তি' : "Today's Total Received",
      icon: CalendarDays,
      color: 'from-teal-600 to-emerald-700',
      textColor: 'text-teal-700',
      bgColor: 'bg-teal-50',
      onClick: () => setActiveTab('receipts'),
    },
    {
      id: 'month-collection',
      title: t('thisMonthCollection'),
      value: formatCurrency(stats.thisMonthCollection, language === 'bn'),
      sub: language === 'bn' ? 'চলতি আগস্ট ২০২৬' : 'August 2026',
      icon: CalendarClock,
      color: 'from-cyan-600 to-blue-700',
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      onClick: () => setActiveTab('receipts'),
    },
    {
      id: 'total-due',
      title: t('totalDue'),
      value: formatCurrency(stats.totalDue, language === 'bn'),
      sub: `${monthlyDues.filter(d => d.dueAmount > 0).length} ${language === 'bn' ? 'জন সদস্যের বকেয়া' : 'Members overdue'}`,
      icon: AlertCircle,
      color: 'from-rose-600 to-red-700',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      onClick: () => setActiveTab('dues'),
    },
    {
      id: 'total-income',
      title: t('totalIncome'),
      value: formatCurrency(stats.totalIncome, language === 'bn'),
      sub: language === 'bn' ? 'অন্যান্য প্রাতিষ্ঠানিক আয়' : 'Institutional Income',
      icon: TrendingUp,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      onClick: () => setActiveTab('income'),
    },
    {
      id: 'total-expenses',
      title: t('totalExpenses'),
      value: formatCurrency(stats.totalExpenses, language === 'bn'),
      sub: language === 'bn' ? 'অফিস ও পরিচালন ব্যয়' : 'Operational Expenses',
      icon: TrendingDown,
      color: 'from-purple-600 to-pink-700',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      onClick: () => setActiveTab('expenses'),
    },
    {
      id: 'total-fdr',
      title: t('totalFdr'),
      value: formatCurrency(stats.totalFdr, language === 'bn'),
      sub: `${fdrs.length} ${language === 'bn' ? 'টি FDR অ্যাকাউন্ট' : 'FDR Accounts'}`,
      icon: Landmark,
      color: 'from-indigo-600 to-purple-800',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      onClick: () => setActiveTab('fdr'),
    },
    {
      id: 'current-balance',
      title: t('currentBalance'),
      value: formatCurrency(stats.currentBalance, language === 'bn'),
      sub: language === 'bn' ? 'ক্যাশ ও ব্যাংক মোট স্থিতি' : 'Total Cash & Bank Reserves',
      icon: Wallet,
      color: 'from-blue-600 via-indigo-600 to-blue-900',
      textColor: 'text-blue-900',
      bgColor: 'bg-blue-100',
      highlight: true,
      onClick: () => setActiveTab('cashbook'),
    },
    {
      id: 'inactive-members',
      title: t('inactiveMembers'),
      value: language === 'bn' ? toBnDigits(stats.inactiveMembers) : stats.inactiveMembers,
      sub: language === 'bn' ? 'স্থগিত বা অনুপস্থিত' : 'Inactive or pending',
      icon: UserX,
      color: 'from-slate-600 to-slate-800',
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-100',
      onClick: () => setActiveTab('members'),
    },
    {
      id: 'certificates-issued',
      title: language === 'bn' ? 'সনদপত্র ইস্যু সংখ্যা' : 'Certificates Issued',
      value: language === 'bn' ? toBnDigits(stats.certificatesIssued || 0) : (stats.certificatesIssued || 0),
      sub: language === 'bn' ? 'সদস্যদের শেয়ার সার্টিফিকেট' : 'Share Certificates Issued',
      icon: Award,
      color: 'from-indigo-500 to-blue-600',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      onClick: () => setActiveTab('shares'),
    },
  ];

  // Quick Action Buttons
  const quickActions = [
    {
      label: t('addMemberBtn'),
      icon: PlusCircle,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: () => setActiveTab('member_form'),
    },
    {
      label: t('collectPaymentBtn'),
      icon: HandCoins,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      onClick: () => setActiveTab('collect_payment'),
    },
    {
      label: t('addIncomeBtn'),
      icon: TrendingUp,
      color: 'bg-teal-600 hover:bg-teal-700 text-white',
      onClick: () => setActiveTab('income'),
    },
    {
      label: t('addExpenseBtn'),
      icon: TrendingDown,
      color: 'bg-rose-600 hover:bg-rose-700 text-white',
      onClick: () => setActiveTab('expenses'),
    },
    {
      label: t('createShareBtn'),
      icon: Award,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      onClick: () => setActiveTab('shares'),
    },
    {
      label: t('viewReportsBtn'),
      icon: FileText,
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      onClick: () => setActiveTab('reports'),
    },
  ];

  // Dynamic Monthly Collection Data for Visual Chart (Last 6 Months)
  const monthlyTrends = useMemo(() => {
    const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const now = new Date();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mIdx = d.getMonth();
      
      const monthCollection = receipts
        .filter(r => r.date && r.date.startsWith(yearMonth))
        .reduce((sum, r) => sum + (r.amount || 0), 0);
        
      const monthIncome = incomes
        .filter(inc => inc.date && inc.date.startsWith(yearMonth))
        .reduce((sum, inc) => sum + (inc.amount || 0), 0);
        
      const monthExpense = expenses
        .filter(exp => exp.date && exp.date.startsWith(yearMonth))
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);
        
      result.push({
        month: months[mIdx],
        monthEn: monthsEn[mIdx],
        collection: monthCollection,
        income: monthIncome,
        expense: monthExpense,
      });
    }
    return result;
  }, [receipts, incomes, expenses]);

  const maxCollection = Math.max(...monthlyTrends.map(m => m.collection), 10000);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome Bar */}
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white shadow-sm border border-blue-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'বাউনিয়া বিল্ডার্স সেন্ট্রাল ড্যাশবোর্ড' : 'Baunia Builders Central Dashboard'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'বাউনিয়া বিল্ডার্স' : 'Baunia Builders'}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              {language === 'bn' 
                ? 'সদস্য শেয়ার, মাসিক সঞ্চয় কালেকশন ও রিয়েল-টাইম আর্থিক ব্যবস্থাপনা সিস্টেম' 
                : 'Member shares, savings collection & comprehensive financial management system.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('collect_payment')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
            >
              <HandCoins className="w-4 h-4" />
              <span>{t('collectPaymentBtn')}</span>
            </button>
            <button
              onClick={() => setActiveTab('member_form')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>{t('addMemberBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: 12 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {kpiCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`p-4.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                card.highlight ? 'ring-2 ring-blue-500/40 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-slate-500 text-[11px] sm:text-xs font-semibold uppercase tracking-wider leading-tight mb-1 line-clamp-2">
                    {card.title}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight break-words">
                    {card.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center group-hover:scale-105 transition shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-1 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 font-medium">
                <span className="truncate pr-1">{card.sub}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bento Middle Row: Analytical Chart + Quick Actions Bento Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Main Bento Analytical Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-base">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                  <span>{activeChartTab === 'collection' ? t('monthlyCollectionChart') : t('incomeVsExpenseChart')}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 ml-4">
                  {language === 'bn' ? 'গত ৬ মাসের আর্থিক লেনদেনের তুলনামূলক চিত্র' : 'Comparative financial trends over last 6 months'}
                </p>
              </div>

              {/* Switch Chart Tab */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200">
                <button
                  onClick={() => setActiveChartTab('collection')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeChartTab === 'collection' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'কালেকশন ট্রেন্ড' : 'Collections'}
                </button>
                <button
                  onClick={() => setActiveChartTab('income_expense')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeChartTab === 'income_expense' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'আয় বনাম ব্যয়' : 'Income vs Expense'}
                </button>
              </div>
            </div>

            {/* Bento Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
              {monthlyTrends.map((trend, i) => {
                const heightPercent = (trend.collection / maxCollection) * 100;
                const incPercent = (trend.income / 90000) * 100;
                const expPercent = (trend.expense / 90000) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                      {language === 'bn' ? trend.month : trend.monthEn}: {formatCurrency(activeChartTab === 'collection' ? trend.collection : trend.income, language === 'bn')}
                    </div>

                    {activeChartTab === 'collection' ? (
                      <div className="w-full max-w-[48px] flex flex-col items-center h-full justify-end">
                        <div 
                          className="w-full rounded-t-lg bg-blue-100 group-hover:bg-blue-600 transition-colors duration-200 relative cursor-pointer"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition">
                            {toBnDigits((trend.collection / 1000).toFixed(0))}k
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-[56px] flex items-end justify-center gap-1.5 h-full">
                        {/* Income Bar */}
                        <div 
                          className="w-1/2 rounded-t-lg bg-emerald-500 group-hover:bg-emerald-400 transition-all duration-300"
                          style={{ height: `${incPercent}%` }}
                          title={`Income: ৳ ${trend.income}`}
                        />
                        {/* Expense Bar */}
                        <div 
                          className="w-1/2 rounded-t-lg bg-rose-500 group-hover:bg-rose-400 transition-all duration-300"
                          style={{ height: `${expPercent}%` }}
                          title={`Expense: ৳ ${trend.expense}`}
                        />
                      </div>
                    )}

                    <span className="mt-3 text-xs font-semibold text-slate-600">
                      {language === 'bn' ? trend.month : trend.monthEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-600">
            {activeChartTab === 'collection' ? (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>{language === 'bn' ? 'সদস্য ফি ও সঞ্চয় আদায়' : 'Member Collections'}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>{t('totalIncome')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>{t('totalExpenses')}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Bento Quick Actions Hub (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-base mb-4">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
              <span>{language === 'bn' ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer group transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-blue-300 transition-all text-slate-700 group-hover:text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900 transition">
                      {action.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom quick tip in action card */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">স্বাক্ষরিত শেয়ার সার্টিফিকেট:</span>
            <button
              onClick={() => setActiveTab('shares')}
              className="text-blue-600 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
            >
              <span>সার্টিফিকেট প্রিন্ট</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bento Bottom Tables Row: Recent Collections & Overdue Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Collections Bento Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-base">
              <span className="w-1.5 h-5 bg-orange-500 rounded-full"></span>
              <span>{t('recentCollections')}</span>
            </h2>
            <button
              onClick={() => setActiveTab('receipts')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              {t('viewAll')} →
            </button>
          </div>

          <div className="overflow-x-auto">
            {receipts.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  {language === 'bn' ? 'কোনো লেনদেন বা রসিদ পাওয়া যায়নি' : 'No receipts recorded yet'}
                </p>
                <button
                  onClick={() => setActiveTab('collect_payment')}
                  className="mt-2.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition cursor-pointer"
                >
                  {t('collectPaymentBtn')}
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3 font-semibold">{t('receiptNo')}</th>
                    <th className="pb-3 font-semibold">{t('memberName')}</th>
                    <th className="pb-3 font-semibold">{t('amount')}</th>
                    <th className="pb-3 font-semibold">{t('paymentType')}</th>
                    <th className="pb-3 font-semibold text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  {receipts.slice(0, 5).map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {r.receiptNo}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {r.memberName}
                      </td>
                      <td className="py-3 font-bold text-slate-800 whitespace-nowrap">
                        {formatCurrency(r.amount, language === 'bn')}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {translations[language][r.paymentType]}
                        </span>
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedReceiptId(r.id);
                            setActiveTab('receipt_view');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title={t('reprintReceipt')}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Due / Overdue Members Bento Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-base">
              <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
              <span>{t('dueMembersList')}</span>
            </h2>
            <button
              onClick={() => setActiveTab('dues')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              {t('viewAll')} →
            </button>
          </div>

          <div className="overflow-x-auto">
            {monthlyDues.filter(d => d.dueAmount > 0).length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  {language === 'bn' ? 'বর্তমানে কোনো সদস্যের বকেয়া নেই' : 'No overdue payments currently'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'bn' ? 'সকল সদস্যের হিসাব আপ-টু-ডেট রয়েছে' : 'All member accounts are clear'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3 font-semibold text-center w-12">ক্র. নং</th>
                    <th className="pb-3 font-semibold">{t('memberId')}</th>
                    <th className="pb-3 font-semibold">{t('memberName')}</th>
                    <th className="pb-3 font-semibold">{t('dueAmount')}</th>
                    <th className="pb-3 font-semibold">{t('lastPayment')}</th>
                    <th className="pb-3 font-semibold text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  {monthlyDues.filter(d => d.dueAmount > 0).slice(0, 5).map((due, index) => (
                    <tr key={due.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-mono font-bold text-slate-600 text-center">
                        {toBnDigits(index + 1)}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-700">
                        {due.memberId}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {due.memberName}
                      </td>
                      <td className="py-3 font-bold text-rose-600 whitespace-nowrap">
                        {formatCurrency(due.dueAmount, language === 'bn')}
                      </td>
                      <td className="py-3 text-slate-400 text-xs">
                        {formatDate(due.lastPaymentDate, language === 'bn')}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedMemberId(due.memberId);
                            setActiveTab('collect_payment');
                          }}
                          className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition cursor-pointer"
                        >
                          {t('collectDue')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* FDR Table Bento Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-base">
              <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
              <span>{language === 'bn' ? 'FDR হিসাব তালিকা (মেয়াদ: ৩, ৬, ৯, ১২ মাস)' : 'FDR Accounts (3, 6, 9, 12 Months Tenure)'}</span>
            </h2>
            <button
              onClick={() => setActiveTab('fdr')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              {t('viewAll')} →
            </button>
          </div>

          <div className="overflow-x-auto">
            {fdrs.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  {language === 'bn' ? 'কোনো FDR হিসাব নেই' : 'No FDR accounts found'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3 font-semibold">{language === 'bn' ? 'FDR নম্বর' : 'FDR No'}</th>
                    <th className="pb-3 font-semibold">{language === 'bn' ? 'ব্যাংক' : 'Bank'}</th>
                    <th className="pb-3 font-semibold">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th className="pb-3 font-semibold">{language === 'bn' ? 'মেয়াদ' : 'Tenure'}</th>
                    <th className="pb-3 font-semibold text-right">{language === 'bn' ? 'অ্যামাউন্ট' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  {fdrs.slice(0, 5).map(fdr => (
                    <tr key={fdr.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-mono font-bold text-indigo-600">
                        {language === 'bn' ? toBnDigits(fdr.fdrNo) : fdr.fdrNo}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {fdr.bankName}
                      </td>
                      <td className="py-3 text-slate-500">
                        {language === 'bn' ? toBnDigits(formatDate(fdr.date)) : formatDate(fdr.date)}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {language === 'bn' ? `${toBnDigits(fdr.tenureMonths)} মাস` : `${fdr.tenureMonths} Months`}
                        </span>
                      </td>
                      <td className="py-3 font-extrabold text-slate-900 text-right">
                        {formatCurrency(fdr.amount, language === 'bn')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
