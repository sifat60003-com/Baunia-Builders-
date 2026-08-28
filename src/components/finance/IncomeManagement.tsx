import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  Calendar, 
  Coins, 
  Tag,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { IncomeCategory, PaymentMethod } from '../../types';
import { translations } from '../../utils/translations';

export const IncomeManagement: React.FC = () => {
  const { 
    incomes, 
    addIncome, 
    deleteIncome, 
    language, 
    t, 
    currentUser, 
    showToast 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('bank_profit');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');

  const filteredIncomes = incomes.filter(i => {
    const t = (i.title || i.description || '').toLowerCase();
    const c = (i.category || '').toLowerCase();
    const r = (i.reference || i.refNumber || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return t.includes(term) || c.includes(term) || r.includes(term);
  });

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      showToast('সঠিক শিরোনাম ও টাকার পরিমাণ লিখুন', 'error');
      return;
    }

    addIncome({
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      paymentMethod,
      reference: reference.trim() || undefined,
      description: description.trim() || undefined,
      recordedBy: currentUser.name,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setReference('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navIncome')} (Income Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            অন্যান্য প্রাতিষ্ঠানিক আয়, ভর্তি ফি ও ব্যাংক লাভ ট্র্যাকিং
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addIncomeBtn')}</span>
          </button>
        </div>
      </div>

      {/* Income Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">সর্বমোট প্রাতিষ্ঠানিক আয়</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {formatCurrency(totalIncome, language === 'bn')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">মোট আয় ভাউচার এন্ট্রি</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {language === 'bn' ? toBnDigits(incomes.length) : incomes.length} টি
            </div>
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="আয়ের বিবরণ বা ক্যাটাগরি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">আইডি</th>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">আয়ের বিবরণ / খাত</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">{t('amount')}</th>
                <th className="py-3 px-4">মাধ্যম</th>
                <th className="py-3 px-4">এন্ট্রি প্রদানকারী</th>
                <th className="py-3 px-4 text-right no-print">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncomes.map(inc => (
                <tr key={inc.id} className="hover:bg-emerald-50/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-600">
                    {inc.id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {formatDate(inc.date, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{inc.title || inc.description || 'আয়'}</div>
                    {inc.title && inc.description && inc.description !== inc.title && (
                      <div className="text-[10px] text-slate-400 font-normal">{inc.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800">
                      {translations[language]?.[inc.category as keyof typeof translations['bn']] || inc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 whitespace-nowrap">
                    {formatCurrency(inc.amount, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                    {inc.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {inc.recordedBy || inc.addedBy || 'Admin'}
                  </td>
                  <td className="py-3 px-4 text-right no-print">
                    <button
                      onClick={() => deleteIncome(inc.id)}
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

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">নতুন আয় ভাউচার যোগ করুন</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">আয়ের বিবরণ / শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: নতুন সদস্য ভর্তি ফি..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আয়ের ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="bank_profit">ব্যাংক মুনাফা (Bank Profit)</option>
                    <option value="others">অন্যান্য (Others)</option>
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                    <option value="cash">নগদ (Cash)</option>
                    <option value="bank">ব্যাংক (Bank)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অতিরিক্ত নোট / বিবরণ</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="রেফারেন্স বা বিস্তারিত..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
