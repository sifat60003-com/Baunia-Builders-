import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Printer, 
  Award, 
  ShieldCheck, 
  Download,
  Building,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';

export const ShareCertificate: React.FC = () => {
  const { 
    members, 
    selectedCertMemberId, 
    setSelectedCertMemberId, 
    setActiveTab, 
    settings,
    language 
  } = useApp();

  const [currentCertMemberId, setCurrentCertMemberId] = useState(
    selectedCertMemberId || members[0]?.id || ''
  );

  const member = members.find(m => m.id === currentCertMemberId) || members[0];

  const handlePrint = () => {
    window.print();
  };

  if (!member) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl">
        <p>সদস্য পাওয়া যায়নি</p>
      </div>
    );
  }

  const certNumber = `BBSC-${member.id.replace('BB-', '')}-01`;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Control Bar (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('shares')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              অফিসিয়াল শেয়ার সনদপত্র (Share Certificate)
            </h1>
            <p className="text-xs text-slate-500">
              বাউনিয়া বিল্ডার্স এর স্থায়ী শেয়ার মালিকানা দলিল
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Member Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">সদস্য নির্বাচন:</span>
            <select
              value={currentCertMemberId}
              onChange={(e) => setCurrentCertMemberId(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-hidden"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.nameBn} ({m.shareQty} টি শেয়ার)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>সনদ প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Printable A4 Certificate Canvas */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-double border-blue-900 relative overflow-hidden print-card">
        
        {/* Ornate Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
          <div className="w-96 h-96 rounded-full border-16 border-blue-900 flex items-center justify-center">
            <Award className="w-64 h-64 text-blue-950" />
          </div>
        </div>

        {/* Certificate Inner Frame */}
        <div className="border-2 border-amber-600/50 p-6 sm:p-8 rounded-2xl relative z-10 space-y-6">
          
          {/* Certificate Top Header */}
          <div className="text-center space-y-2 pb-4 border-b-2 border-blue-950">
            <div className="flex items-center justify-center gap-3">
              <Logo size="lg" showText={false} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight mt-1">
              বাউনিয়া বিল্ডার্স
            </h1>
            <div className="text-xs sm:text-sm font-bold text-blue-800 uppercase tracking-widest">
              BAUNIA BUILDERS | DHAKA, BANGLADESH
            </div>
            <p className="text-[11px] text-slate-600 font-medium max-w-lg mx-auto">
              বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০ | মোবাইল: 01833-805170, 01711-280514
            </p>
          </div>

          {/* Certificate Title Banner */}
          <div className="text-center py-2">
            <div className="inline-block px-8 py-2 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-amber-300 font-extrabold text-base sm:text-lg rounded-xl shadow-md uppercase tracking-wider border border-amber-400/40">
              শেয়ার মালিকানা সনদপত্র | SHARE CERTIFICATE
            </div>
          </div>

          {/* Meta Bar: Cert No & Issue Date */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">সনদ নং (Certificate No):</span>{' '}
              <span className="font-mono text-blue-900 text-sm">{certNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">সদস্য আইডি:</span>{' '}
              <span className="font-mono text-blue-900 text-sm">{member.id}</span>
            </div>
            <div>
              <span className="text-slate-500">ইস্যু তারিখ:</span>{' '}
              <span className="text-slate-900">{formatDate(member.joinDate, true)}</span>
            </div>
          </div>

          {/* Certificate Body Text (Formal & Legal wording) */}
          <div className="text-sm sm:text-base leading-loose text-slate-800 text-justify space-y-4 px-2 sm:px-6 pt-2 font-medium">
            <p>
              এই মর্মে প্রত্যয়ন করা যাইতেছে যে, জনাব/জনাবা{' '}
              <strong className="text-blue-950 font-black text-lg underline underline-offset-4 decoration-amber-500">
                {member.nameBn}
              </strong>
              {member.nameEn && <span> ({member.nameEn})</span>}, পিতা:{' '}
              <strong>{member.fatherName}</strong>, মাতা: <strong>{member.motherName}</strong>, জাতীয় পরিচয়পত্র নং:{' '}
              <span className="font-mono font-bold text-slate-900">{member.nid}</span>, স্থায়ী ঠিকানা:{' '}
              <span>{member.permanentAddress}</span>;
            </p>

            <p>
              বাউনিয়া বিল্ডার্স এর একজন নিবন্ধিত ও নিয়মিত সম্মানিত সাধারণ সদস্য। তিনি অত্র প্রতিষ্ঠানের মোট{' '}
              <span className="inline-block px-3 py-0.5 bg-blue-100 text-blue-950 font-black rounded-lg border border-blue-300">
                {language === 'bn' ? toBnDigits(member.shareQty) : member.shareQty} (
                {member.shareQty === 1 ? 'এক' : member.shareQty === 2 ? 'দুই' : member.shareQty === 3 ? 'তিন' : member.shareQty === 4 ? 'চার' : member.shareQty === 5 ? 'পাঁচ' : member.shareQty}
                ) টি
              </span>{' '}
              সাধারণ শেয়ারের বৈধ মালিক এবং অত্র প্রতিষ্ঠানের গঠনতন্ত্র ও নীতিমালা অনুযায়ী অংশীদার হিসেবে স্বীকৃতি লাভ করিয়াছেন।
            </p>

            <p className="text-xs text-slate-600 italic">
              * অত্র সনদপত্রটি প্রতিষ্ঠানের গঠনতন্ত্র ও নীতিমালার আলোকে প্রদত্ত এবং প্রতিষ্ঠানের সিল ও দায়িত্বপ্রাপ্ত কার্যনির্বাহীগণের স্বাক্ষর ব্যতিরেকে কার্যকর হইবে না।
            </p>
          </div>

          {/* Share Summary Highlight Pill */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-center text-xs">
            <div>
              <span className="text-slate-500 block">মোট শেয়ার সংখ্যা</span>
              <span className="text-base font-black text-blue-950">{language === 'bn' ? toBnDigits(member.shareQty) : member.shareQty} টি শেয়ার</span>
            </div>
            <div>
              <span className="text-slate-500 block">সদস্যের স্ট্যাটাস</span>
              <span className="text-base font-black text-emerald-800">নিয়মিত সক্রিয় সদস্য</span>
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-16 grid grid-cols-3 text-center text-xs font-bold text-slate-800">
            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.treasurerName || 'মো: মাহবুব সরকার'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-36 mx-auto">
                ক্যাশিয়ার (Cashier)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.secretaryName || 'মো: মনিরুজ্জামান'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-44 mx-auto">
                সাধারণ সম্পাদক (General Secretary)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-sm mb-1">{settings.presidentName || 'মো: ফয়েজুর রহমান খান'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-36 mx-auto">
                সভাপতি (President)
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
