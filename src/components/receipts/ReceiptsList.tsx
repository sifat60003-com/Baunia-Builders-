import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Receipt as ReceiptIcon, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Plus, 
  Eye, 
  User, 
  Calendar,
  HandCoins,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';

export const ReceiptsList: React.FC = () => {
  const { 
    receipts, 
    setSelectedReceiptId, 
    setActiveTab, 
    language, 
    t, 
    currentUser 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter receipts
  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = 
      r.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.amount).includes(searchTerm);

    const matchesType = typeFilter === 'all' || r.paymentType === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage) || 1;
  const paginatedReceipts = filteredReceipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalCollected = receipts.reduce((sum, r) => sum + r.amount, 0);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Member ID', 'Member Name', 'Payment Type', 'Amount', 'Payment Method', 'Collector'];
    const rows = filteredReceipts.map(r => [
      r.receiptNo,
      r.date,
      r.memberId,
      `"${r.memberName}"`,
      r.paymentType,
      r.amount,
      r.paymentMethod,
      `"${r.collectorName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Baunia_Builders_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navReceipts')} (Money Receipts Registry)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            মোট সংগৃহীত অর্থ: <span className="font-extrabold text-emerald-700">{formatCurrency(totalCollected, language === 'bn')}</span> ({receipts.length} টি রসিদ)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={() => setActiveTab('collect_payment')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('collectPaymentBtn')}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={language === 'bn' ? 'রশিদ নং, সদস্য নাম বা আইডি দিয়ে খুঁজুন...' : 'Search receipt no, member name or ID...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden font-medium"
          >
            <option value="all">সকল জমার খাত (All)</option>
            <option value="monthly_fee">মাসিক ফি (Monthly Fee)</option>
            <option value="share_purchase">শেয়ার ক্রয় (Share Purchase)</option>
            <option value="savings_deposit">সঞ্চয় জমা (Savings)</option>
            <option value="admission_fee">ভর্তি ফি (Admission)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t('receiptNo')}</th>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">{t('memberName')}</th>
                <th className="py-3 px-4">{t('paymentType')}</th>
                <th className="py-3 px-4">{t('amount')}</th>
                <th className="py-3 px-4">মাধ্যম</th>
                <th className="py-3 px-4">কালেক্টর</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    কোনো রসিদ পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                paginatedReceipts.map(receipt => (
                  <tr key={receipt.id} className="hover:bg-blue-50/40 transition group">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {receipt.receiptNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(receipt.date, language === 'bn')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{receipt.memberName}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal">{receipt.memberId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5 items-start">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800">
                          {translations[language][receipt.paymentType]}
                        </span>
                        {receipt.monthBreakdown && receipt.monthBreakdown.length > 1 ? (
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                            {toBnDigits(receipt.monthBreakdown.length)}টি মাস ({receipt.monthBreakdown.map(m => m.shortName).join(', ')})
                          </span>
                        ) : receipt.monthName ? (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {receipt.monthName}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(receipt.amount, language === 'bn')}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                      {receipt.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {receipt.collectorName}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedReceiptId(receipt.id);
                          setActiveTab('receipt_view');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>রসিদ দেখুন / প্রিন্ট</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            মোট <span className="font-bold">{filteredReceipts.length}</span> টি রসিদ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold">
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
