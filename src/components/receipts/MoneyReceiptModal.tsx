import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Receipt,
  Scissors,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { formatCurrency, formatDate, numberToBengaliWords, numberToEnglishWords, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';

export const MoneyReceiptModal: React.FC = () => {
  const { 
    receipts, 
    selectedReceiptId, 
    setActiveTab, 
    settings, 
    language, 
    t, 
    members,
    deleteReceipt 
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const receipt = receipts.find(r => r.id === selectedReceiptId) || receipts[0];

  const handlePrint = () => {
    window.print();
  };

  if (!receipt) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl">
        <p>রশিদ পাওয়া যায়নি</p>
        <button
          onClick={() => setActiveTab('receipts')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          রসিদ তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  const member = members.find(m => m.id === receipt.memberId);
  const amountWordsBn = numberToBengaliWords(receipt.amount);
  const amountWordsEn = numberToEnglishWords(receipt.amount);

  // Single Copy Template Generator
  const renderReceiptCopy = (copyType: 'গ্রাহক কপি (Customer Copy)' | 'অফিস কপি (Office Copy)') => (
    <div className="border-2 border-slate-800 rounded-2xl p-6 bg-white relative space-y-4">
      
      {/* Top Tag & Receipt No */}
      <div className="flex items-start justify-between border-b-2 border-blue-900 pb-3">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <div>
            <h2 className="text-xl font-black text-blue-950 tracking-tight leading-none">
              বাউনিয়া বিল্ডার্স
            </h2>
            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              BAUNIA BUILDERS
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {settings.addressBn || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০'} | ফোন: {settings.phones?.join(', ') || '01833-405170, 01711-280514'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-0.5 bg-blue-900 text-white text-[10px] font-black rounded-md uppercase tracking-wider mb-1">
            {copyType}
          </span>
          <div className="text-xs font-bold text-slate-800">
            রশিদ নং: <span className="font-mono text-blue-900 font-extrabold">{receipt.receiptNo}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            তারিখ: {formatDate(receipt.date, true)}
          </div>
        </div>
      </div>

      {/* Received From Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <div className="text-slate-500 text-[10px]">সদস্যের নাম:</div>
          <div className="font-bold text-slate-900 text-sm">{receipt.memberName}</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px]">সদস্য আইডি ও মোবাইল:</div>
          <div className="font-mono font-bold text-blue-800">
            {receipt.memberId} {member ? `| ${member.mobile}` : ''}
          </div>
        </div>
        <div className={receipt.monthBreakdown && receipt.monthBreakdown.length > 1 ? "col-span-2" : ""}>
          <div className="text-slate-500 text-[10px]">জমার বিবরণ / মাস:</div>
          <div className="font-bold text-slate-900">
            {receipt.monthName ? (
              <span>
                {translations['bn'][receipt.paymentType]} - <span className="text-blue-900 font-extrabold">{receipt.monthName}</span>
                {receipt.isExtraMonth && <span className="text-[10px] text-indigo-700 font-bold ml-1">(বিশেষ এক্সট্রা মাস অন্তর্ভুক্ত)</span>}
              </span>
            ) : (
              <span>
                {translations['bn'][receipt.paymentType]}
                {receipt.paymentMonth ? ` (${receipt.paymentMonth})` : ''}
              </span>
            )}
          </div>
        </div>
        {(!receipt.monthBreakdown || receipt.monthBreakdown.length <= 1) && (
          <div>
            <div className="text-slate-500 text-[10px]">পরিশোধ মাধ্যম:</div>
            <div className="font-bold uppercase text-slate-800 text-[11px]">
              {receipt.paymentMethod} {receipt.transactionRef ? `(${receipt.transactionRef})` : ''}
            </div>
          </div>
        )}
      </div>

      {/* Multi-Month Itemized Table Breakdown (When multiple months are paid) */}
      {receipt.monthBreakdown && receipt.monthBreakdown.length > 1 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 flex items-center justify-between text-[11px]">
            <span>পরিশোধিত মাসের বিস্তারিত বিবরণী ({toBnDigits(receipt.monthBreakdown.length)}টি মাস):</span>
            <span className="uppercase text-[10px] text-slate-600 font-medium">
              মাধ্যম: {receipt.paymentMethod} {receipt.transactionRef ? `(${receipt.transactionRef})` : ''}
            </span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-1.5 px-3">#</th>
                <th className="py-1.5 px-3">মাসের নাম</th>
                <th className="py-1.5 px-3 text-right">মাসিক কিস্তি</th>
                <th className="py-1.5 px-3 text-right">এক্সট্রা ফি</th>
                <th className="py-1.5 px-3 text-right">পরিশোধিত টাকা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {receipt.monthBreakdown.map((item, idx) => (
                <tr key={item.monthId} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-3 font-mono text-slate-400">{toBnDigits(idx + 1)}</td>
                  <td className="py-1.5 px-3 font-bold text-slate-900">
                    {item.monthName}
                    {item.isExtraMonth && (
                      <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                        এক্সট্রা
                      </span>
                    )}
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-600">
                    ৳ {toBnDigits(item.baseAmount.toLocaleString('en-IN'))}
                  </td>
                  <td className="py-1.5 px-3 text-right text-indigo-700 font-semibold">
                    {item.extraAmount > 0 ? `৳ ${toBnDigits(item.extraAmount.toLocaleString('en-IN'))}` : '-'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-black text-emerald-800">
                    ৳ {toBnDigits((item.paidAmount || item.totalAmount).toLocaleString('en-IN'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Amount Box */}
      <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
        <div>
          <div className="text-[10px] font-bold text-blue-900 uppercase">কথায় (In Words):</div>
          <div className="text-xs font-bold text-blue-950 mt-0.5">{amountWordsBn}</div>
          <div className="text-[10px] text-blue-700 italic">{amountWordsEn}</div>
        </div>

        <div className="text-right shrink-0 pl-4 border-l border-blue-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">মোট প্রাপ্ত টাকা</div>
          <div className="text-xl font-black text-emerald-800 tracking-tight">
            {formatCurrency(receipt.amount, true)}
          </div>
        </div>
      </div>

      {/* Balance Calculation Pill */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200">
        <div>
          <span className="text-slate-500">পূর্বের বকেয়া: </span>
          <span className="font-bold text-slate-800">৳ {receipt.previousDue?.toLocaleString('en-IN') || '০.০০'}</span>
        </div>
        <div>
          <span className="text-slate-500">গৃহীত জমা: </span>
          <span className="font-bold text-emerald-700">৳ {receipt.amount?.toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-slate-500">অবশিষ্ট বকেয়া: </span>
          <span className="font-bold text-rose-700">৳ {receipt.remainingDue?.toLocaleString('en-IN') || '০.০০'}</span>
        </div>
      </div>

      {/* Signatures */}
      <div className="pt-8 flex items-center justify-between text-xs font-bold text-slate-700 px-4">
        <div className="text-center">
          <div className="text-[11px] text-slate-600 italic font-mono mb-1">{receipt.collectorName}</div>
          <div className="border-t border-slate-600 pt-1 w-32">টাকা আদায়কারী</div>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          * সিস্টেম জেনারেটেড মানি রসিদ *
        </div>

        <div className="text-center">
          <div className="text-[11px] text-slate-600 italic font-serif mb-1">যাচাইকৃত</div>
          <div className="border-t border-slate-600 pt-1 w-32">হিসাবরক্ষক</div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Control Bar (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('receipts')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              মানি রসিদ (Official Money Receipt)
            </h1>
            <p className="text-xs text-slate-500">
              রশিদ নং: <span className="font-mono font-bold text-blue-700">{receipt.receiptNo}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ভুল রশিদ ডিলিট</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন (Print Dual Copy)</span>
          </button>
        </div>
      </div>

      {/* Dual Copy Canvas for Print / Screen */}
      <div className="space-y-6 print-card">
        
        {/* Upper: Customer Copy */}
        {renderReceiptCopy('গ্রাহক কপি (Customer Copy)')}

        {/* Perforation Cut Line */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="w-full border-t-2 border-dashed border-slate-300" />
          <div className="absolute px-4 bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-full border border-slate-200">
            <Scissors className="w-3 h-3" />
            <span>কেটে আলাদা করুন (Perforation Line)</span>
          </div>
        </div>

        {/* Lower: Office Copy */}
        {renderReceiptCopy('অফিস কপি (Office Copy)')}

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">ভুল রশিদ মোছার নিশ্চিতকরণ</h3>
                <p className="text-xs text-slate-500">Delete Incorrect Receipt</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">রশিদ নং:</span>
                <span className="font-mono font-bold text-blue-700">{receipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সদস্যের নাম:</span>
                <span className="font-bold text-slate-900">{receipt.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সদস্য আইডি:</span>
                <span className="font-mono text-slate-700">{receipt.memberId}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">টাকার পরিমাণ:</span>
                <span className="font-extrabold text-rose-700">{formatCurrency(receipt.amount, true)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200/70 text-amber-900">
              ⚠️ <strong>সতর্কতা:</strong> রশিদটি মুছে ফেললে সদস্যের মোট জমা ৳ {receipt.amount.toLocaleString('en-IN')} কমে যাবে এবং ক্যাশ লেজার থেকে এই জমা বাতিল হবে।
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteReceipt(receipt.id);
                  setShowDeleteConfirm(false);
                  setActiveTab('receipts');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, রশিদটি মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
