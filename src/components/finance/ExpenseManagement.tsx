import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  Calendar, 
  Receipt, 
  Tag, 
  CheckCircle2, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { translations } from '../../utils/translations';

export const ExpenseManagement: React.FC = () => {
  const { 
    expenses, 
    addExpense, 
    deleteExpense, 
    language, 
    t, 
    currentUser, 
    showToast 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('office_rent');
  const [amount, setAmount] = useState<number>(12000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherNo, setVoucherNo] = useState(`EXP-2026-${String(expenses.length + 1).padStart(4, '0')}`);
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'approved' | 'pending'>('approved');

  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.paidTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      showToast('সঠিক শিরোনাম ও খরচের পরিমাণ লিখুন', 'error');
      return;
    }

    addExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      voucherNo: voucherNo.trim() || `EXP-${Date.now()}`,
      paidTo: paidTo.trim() || 'অফিস ক্যাশ',
      paymentMethod,
      description: description.trim() || undefined,
      recordedBy: currentUser.name,
      status,
    });

    setIsModalOpen(false);
    setTitle('');
    setPaidTo('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navExpenses')} (Expense Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            অফিস ভাড়া, পরিচালনা ব্যয়, কর্মকর্তাদের বেতন ও উন্নয়ন ভাউচার
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{t('print')}</span>
          </button>

          <button
            onClick={() => {
              setVoucherNo(`EXP-2026-${String(expenses.length + 1).padStart(4, '0')}`);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addExpenseBtn')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-700">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">সর্বমোট অফিস ও পরিচালন ব্যয়</div>
            <div className="text-xl font-extrabold text-rose-700 mt-0.5">
              {formatCurrency(totalExpense, language === 'bn')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">মোট অনুমোদিত ভাউচার</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {language === 'bn' ? toBnDigits(expenses.length) : expenses.length} টি
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">প্রধান ব্যয়ের খাত</div>
            <div className="text-base font-extrabold text-purple-950 mt-0.5">
              অফিস ভাড়া ও কর্মকর্তা বেতন
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ভাউচার নং, শিরোনাম বা প্রাপক দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ভাউচার নং</th>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">ব্যয়ের বিবরণ ও শিরোনাম</th>
                <th className="py-3 px-4">খাত (Category)</th>
                <th className="py-3 px-4">প্রাপক (Paid To)</th>
                <th className="py-3 px-4">{t('amount')}</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right no-print">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-rose-50/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {exp.voucherNo}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {formatDate(exp.date, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{exp.title}</div>
                    {exp.description && <div className="text-[10px] text-slate-400 font-normal">{exp.description}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {translations[language][exp.category] || exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {exp.paidTo}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-rose-600 whitespace-nowrap">
                    {formatCurrency(exp.amount, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>অনুমোদিত</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right no-print">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-rose-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">নতুন পরিচালন ব্যয় ভাউচার</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-rose-200 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভাউচার নং *</label>
                  <input
                    type="text"
                    required
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্যয়ের বিবরণ / খাত *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: অফিস ভাড়া আগস্ট ২০২৬..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="office_rent">অফিস ভাড়া (Office Rent)</option>
                    <option value="staff_salary">কর্মচারী বেতন (Staff Salary)</option>
                    <option value="entertainment">আপ্যায়ন ব্যয় (Entertainment)</option>
                    <option value="stationery">স্টেশনারি ও প্রিন্টিং (Stationery)</option>
                    <option value="utility">বিদ্যুৎ ও ইউটিলিটি বিল (Utility)</option>
                    <option value="land_development">জমি উন্নয়ন ও সার্ভে (Land Dev)</option>
                    <option value="legal_fees">আইন ও দলিল খরচ (Legal Fees)</option>
                    <option value="maintenance">মেরামত ও রক্ষণাবেক্ষণ (Maintenance)</option>
                    <option value="others">অন্যান্য খরচ (Others)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রাপকের নাম (Paid To)</label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="মালিক / সরবরাহকারী"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মাধ্যম</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="cash">নগদ প্রদান (Cash)</option>
                    <option value="bank">ব্যাংক ট্রান্সফার (Bank)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  ভাউচার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
