import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FdrItem } from '../../types';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { 
  Landmark, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  Clock, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  X
} from 'lucide-react';

export const FdrManagement: React.FC = () => {
  const { fdrs, addFdr, deleteFdr, language, t, showToast } = useApp();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [bankName, setBankName] = useState('ব্রাক ব্যাংক পিএলসি');
  const [amount, setAmount] = useState<number>(100000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [notes, setNotes] = useState('');

  const filteredFdrs = fdrs.filter(f => 
    f.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.fdrNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.notes && f.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalFdrAmount = fdrs
    .filter(f => f.status === 'active')
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) {
      showToast(isBn ? 'দয়া করে ব্যাংক বা প্রতিষ্ঠানের নাম লিখুন' : 'Please enter bank name', 'error');
      return;
    }
    if (amount <= 0) {
      showToast(isBn ? 'সঠিক পরিমাণ লিখুন' : 'Please enter valid amount', 'error');
      return;
    }

    addFdr({
      bankName: bankName.trim(),
      amount: Number(amount),
      date,
      tenureMonths: Number(tenureMonths),
      status: 'active',
      notes: notes.trim(),
    });

    showToast(isBn ? 'সফলভাবে নতুন FDR তৈরি করা হয়েছে এবং ক্যাশ থেকে কর্তন করা হয়েছে' : 'FDR created successfully and deducted from cash balance', 'success');
    
    // Reset Form
    setBankName('ব্রাক ব্যাংক পিএলসি');
    setAmount(100000);
    setDate(new Date().toISOString().split('T')[0]);
    setTenureMonths(12);
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {isBn ? 'FDR ব্যবস্থাপনা' : 'FDR Management'}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {isBn ? 'স্থায়ী আমানত (FDR) হিসাব ও বর্তমান ক্যাশ ব্যালেন্স সমন্বয়' : 'Fixed Deposit Receipts and cash balance adjustment'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>{isBn ? 'নতুন FDR তৈরি করুন' : 'Create New FDR'}</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <Landmark className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">
              {isBn ? 'মোট সক্রিয় FDR অ্যামাউন্ট' : 'Total Active FDR Amount'}
            </div>
            <div className="text-2xl font-black text-indigo-950 mt-1">
              {formatCurrency(totalFdrAmount, isBn)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {isBn ? 'বর্তমান ক্যাশ থেকে স্বয়ংক্রিয়ভাবে বিয়োগকৃত' : 'Automatically deducted from cash balance'}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">
              {isBn ? 'মোট FDR একাউন্ট সংখ্যা' : 'Total FDR Accounts'}
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {isBn ? toBnDigits(fdrs.length) : fdrs.length} {isBn ? 'টি' : 'Accounts'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {isBn ? '৩, ৬, ৯ ও ১২ মাসের মেয়াদি' : 'Tenure: 3, 6, 9, 12 Months'}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'ব্যাংক বা FDR নম্বর দিয়ে খুঁজুন...' : 'Search by bank or FDR No...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          {isBn ? `মোট পাওয়া গেছে: ${toBnDigits(filteredFdrs.length)} টি FDR` : `Total Found: ${filteredFdrs.length}`}
        </div>
      </div>

      {/* FDR Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-6">{isBn ? 'FDR নম্বর' : 'FDR No'}</th>
                <th className="py-4 px-6">{isBn ? 'ব্যাংক / প্রতিষ্ঠানের নাম' : 'Bank / Institution'}</th>
                <th className="py-4 px-6">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="py-4 px-6">{isBn ? 'মেয়াদ (সময়)' : 'Tenure'}</th>
                <th className="py-4 px-6 text-right">{isBn ? 'অ্যামাউন্ট' : 'Amount'}</th>
                <th className="py-4 px-6 text-center">{isBn ? 'অবস্থা' : 'Status'}</th>
                <th className="py-4 px-6 text-center">{isBn ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredFdrs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Landmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">{isBn ? 'কোনো FDR হিসাব পাওয়া যায়নি' : 'No FDR records found'}</p>
                  </td>
                </tr>
              ) : (
                filteredFdrs.map((fdr) => (
                  <tr key={fdr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-blue-600">
                      {isBn ? toBnDigits(fdr.fdrNo) : fdr.fdrNo}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{fdr.bankName}</div>
                      {fdr.notes && <div className="text-xs text-slate-400 mt-0.5">{fdr.notes}</div>}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {isBn ? toBnDigits(formatDate(fdr.date)) : formatDate(fdr.date)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        {isBn ? `${toBnDigits(fdr.tenureMonths)} মাস` : `${fdr.tenureMonths} Months`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                      {formatCurrency(fdr.amount, isBn)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        fdr.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {fdr.status === 'active' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'উত্তোলিত/মেয়াদোত্তীর্ণ' : 'Closed')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => deleteFdr(fdr.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create FDR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {isBn ? 'নতুন FDR তৈরি করুন' : 'Create New FDR'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isBn ? 'অ্যামাউন্ট বর্তমান ক্যাশ ব্যালেন্স থেকে স্বয়ংক্রিয়ভাবে বিয়োগ হবে' : 'Amount will be automatically deducted from cash balance'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-150 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'ব্যাংক বা আর্থিক প্রতিষ্ঠানের নাম *' : 'Bank / Institution Name *'}
                </label>
                <input
                  type="text"
                  required
                  read-only
                  disabled
                  value={bankName}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isBn ? 'অ্যামাউন্ট (টাকা) *' : 'Amount (BDT) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isBn ? 'তারিখ *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'সময় / মেয়াদ (মাস) *' : 'Tenure (Months) *'}
                </label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value={3}>{isBn ? '৩ মাস (3 Months)' : '3 Months'}</option>
                  <option value={6}>{isBn ? '৬ মাস (6 Months)' : '6 Months'}</option>
                  <option value={9}>{isBn ? '৯ মাস (9 Months)' : '9 Months'}</option>
                  <option value={12}>{isBn ? '১২ মাস (12 Months)' : '12 Months'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'বিবরণ / নোট (ঐচ্ছিক)' : 'Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isBn ? 'অ্যাকাউন্ট নম্বর বা অন্যান্য বিবরণ...' : 'Account number or other details...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  {isBn ? 'FDR সংরক্ষণ করুন' : 'Save FDR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
