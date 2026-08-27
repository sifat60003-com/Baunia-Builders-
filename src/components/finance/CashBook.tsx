import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Calendar, 
  Printer, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';

export const CashBook: React.FC = () => {
  const { 
    receipts, 
    incomes, 
    expenses, 
    stats, 
    language, 
    t, 
    settings 
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'this_month'>('all');

  // Compute unified cash entries
  const collectionsEntry = receipts.map(r => ({
    id: r.id,
    date: r.date,
    type: 'inflow' as const,
    source: `সদস্য জমা: ${r.memberName} (${r.receiptNo})`,
    category: translations[language][r.paymentType],
    method: r.paymentMethod,
    amount: r.amount,
  }));

  const incomesEntry = incomes.map(i => ({
    id: i.id,
    date: i.date,
    type: 'inflow' as const,
    source: `অন্যান্য আয়: ${i.title}`,
    category: translations[language][i.category] || i.category,
    method: i.paymentMethod,
    amount: i.amount,
  }));

  const expensesEntry = expenses.map(e => ({
    id: e.id,
    date: e.date,
    type: 'outflow' as const,
    source: `ব্যয়: ${e.title} (${e.voucherNo})`,
    category: translations[language][e.category] || e.category,
    method: e.paymentMethod,
    amount: e.amount,
  }));

  // Combine and sort by date descending
  const allEntries = [...collectionsEntry, ...incomesEntry, ...expensesEntry].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalInflow = receipts.reduce((sum, r) => sum + r.amount, 0) + incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalOutflow = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netClosingBalance = totalInflow - totalOutflow;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navCashBook')} (Daily Cash & Bank Ledger)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            প্রতিদিনের প্রাপ্তি (Inflow), পরিশোধ (Outflow) এবং সমাপনী স্থিতি (Closing Balance)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>ক্যাশ বুক প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Cash Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">সর্বমোট ক্যাশ ও ব্যাংক প্রাপ্তি (Total Inflow)</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {formatCurrency(totalInflow, language === 'bn')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-700">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">সর্বমোট ব্যয় ও পরিশোধ (Total Outflow)</div>
            <div className="text-xl font-extrabold text-rose-700 mt-0.5">
              {formatCurrency(totalOutflow, language === 'bn')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-900 text-white shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 text-white">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-blue-200 font-semibold">সর্বশেষ ক্যাশ স্থিতি (Closing Balance)</div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {formatCurrency(netClosingBalance, language === 'bn')}
            </div>
          </div>
        </div>

      </div>

      {/* Cash Book Ledger Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-card">
        
        {/* Printable Header in Print Mode */}
        <div className="hidden print:block p-6 text-center border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">বাউনিয়া বিল্ডার্স</h2>
          <p className="text-xs text-slate-600">{settings.addressBn || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০'}</p>
          <h3 className="text-sm font-bold mt-2 uppercase underline">দৈনিক ক্যাশ ও ব্যাংক বুক হিসাব বিবরণী</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">লেনদেনের উৎস ও বিবরণ</th>
                <th className="py-3 px-4">খাত (Category)</th>
                <th className="py-3 px-4">মাধ্যম</th>
                <th className="py-3 px-4 text-right text-emerald-700">জমা / আয় (Inflow)</th>
                <th className="py-3 px-4 text-right text-rose-700">খরচ / ব্যয় (Outflow)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allEntries.map((entry, idx) => (
                <tr key={`${entry.id}-${idx}`} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {formatDate(entry.date, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {entry.type === 'inflow' ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{entry.source}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {entry.category}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">
                    {entry.method}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-700 whitespace-nowrap">
                    {entry.type === 'inflow' ? formatCurrency(entry.amount, language === 'bn') : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-rose-600 whitespace-nowrap">
                    {entry.type === 'outflow' ? formatCurrency(entry.amount, language === 'bn') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Total Row */}
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right uppercase">
                  সর্বমোট (Total):
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 text-sm">
                  {formatCurrency(totalInflow, language === 'bn')}
                </td>
                <td className="py-3 px-4 text-right text-rose-800 text-sm">
                  {formatCurrency(totalOutflow, language === 'bn')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures for Print Mode */}
        <div className="hidden print:grid grid-cols-3 pt-16 pb-8 text-center text-xs font-bold text-slate-800">
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
