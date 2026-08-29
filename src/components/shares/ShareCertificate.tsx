import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Printer, 
  Award, 
  ShieldCheck, 
  User,
  Phone,
  FileText,
  MapPin,
  Heart,
  HelpCircle
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
      <div className="p-8 text-center bg-white rounded-2xl no-print">
        <p className="text-slate-500 font-bold">কোনো সদস্য পাওয়া যায়নি</p>
      </div>
    );
  }

  const certNumber = `BBSC-${member.id.replace('BB-', '')}-01`;

  // Get primary nominee data safely
  const primaryNominee = member.nominees?.[0] || {
    name: member.nominee_name || '',
    relation: member.nominee_relation || '',
    nidBirthReg: member.nominee_nid || '',
    mobile: member.nominee_mobile || '',
    address: member.nominee_address || '',
    photoUrl: member.nominee_photo || '',
    percentage: 100
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Dynamic Style block for Landscape A4 printing */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border-width: 8px !important;
            border-color: #1e3a8a !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            padding: 0.4in !important;
            width: 11.69in !important;
            height: 8.27in !important;
            border-style: double !important;
            border-radius: 0 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          @page {
            size: 11.69in 8.27in landscape;
            margin: 0;
          }
        }
      `}</style>
      
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
            <h1 className="text-sm font-extrabold text-slate-900">
              অফিসিয়াল শেয়ার মালিকানা সনদপত্র (Share Certificate)
            </h1>
            <p className="text-xs text-slate-500">
              সদস্যের ছবি, নমিনির বিবরণী ও আইনগত নীতিমালা সহ
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
                  {m.id} - {m.nameBn} ({m.shareQty || 0} টি শেয়ার)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>সনদ প্রিন্ট করুন (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Landscape A4 Certificate Canvas */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-8 border-double border-blue-900 relative overflow-hidden print-card">
        
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600/30"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600/30"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600/30"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600/30"></div>

        {/* Ornate Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-96 h-96 rounded-full border-16 border-blue-900 flex items-center justify-center">
            <Award className="w-64 h-64 text-blue-950" />
          </div>
        </div>

        {/* Certificate Inner Frame */}
        <div className="border border-amber-600/40 p-6 sm:p-8 rounded-2xl relative z-10 space-y-6">
          
          {/* Certificate Header Block */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-blue-950 items-center">
            {/* Logo left */}
            <div className="col-span-2 flex justify-start">
              <Logo size="lg" showText={false} />
            </div>

            {/* Central Corporate Banner */}
            <div className="col-span-8 text-center space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                বাউনিয়া বিল্ডার্স
              </h1>
              <div className="text-xs sm:text-sm font-bold text-blue-800 uppercase tracking-widest">
                BAUNIA BUILDERS | DHAKA, BANGLADESH
              </div>
              <p className="text-[10px] text-slate-600 font-bold">
                বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০ | মোবাইল: 01833-405170, 01711-280514
              </p>
            </div>

            {/* Empty space or right metadata aligned */}
            <div className="col-span-2 text-right">
            </div>
          </div>

          {/* Certificate Title Banner */}
          <div className="text-center py-1">
            <div className="inline-block px-10 py-2 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-amber-300 font-black text-base sm:text-lg rounded-xl shadow-md uppercase tracking-wider border border-amber-400/40">
              শেয়ার মালিকানা সনদপত্র | SHARE CERTIFICATE
            </div>
          </div>

          {/* Meta Bar: Cert No & Issue Date */}
          <div className="grid grid-cols-3 text-xs font-bold text-slate-700 px-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">সনদ নং (Certificate No):</span>{' '}
              <span className="font-mono text-blue-900 text-sm block sm:inline">{certNumber}</span>
            </div>
            <div className="text-center">
              <span className="text-slate-500">সদস্য আইডি:</span>{' '}
              <span className="font-mono text-blue-900 text-sm block sm:inline">{member.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ইস্যু তারিখ (Issue Date):</span>{' '}
              <span className="text-slate-900 block sm:inline">{formatDate(member.joinDate, true)}</span>
            </div>
          </div>

          {/* Layout Content Grid: Left (Member info), Right (Photos & Nominee Details) */}
          <div className="grid grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Hand: Core Certification Text */}
            <div className="col-span-12 lg:col-span-7 space-y-4 text-justify">
              <div className="text-slate-800 leading-relaxed text-sm font-semibold space-y-3">
                <p>
                  এই মর্মে প্রত্যয়ন করা যাইতেছে যে, সম্মানিত সদস্য জনাব/জনাবা{' '}
                  <strong className="text-blue-950 font-black text-base underline underline-offset-4 decoration-amber-500">
                    {member.nameBn}
                  </strong>
                  {member.nameEn && <span> ({member.nameEn})</span>}, পিতা:{' '}
                  <strong>{member.fatherName}</strong>, মাতা: <strong>{member.motherName}</strong>, জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নং:{' '}
                  <span className="font-mono font-bold text-slate-900">{member.nid}</span>, স্থায়ী ঠিকানা:{' '}
                  <span className="font-normal text-slate-700">{member.permanentAddress}</span>।
                </p>

                <p>
                  তিনি বাউনিয়া বিল্ডার্স এর একজন আইনানুগ নিবন্ধিত ও নিয়মিত সক্রিয় সাধারণ সদস্য। তিনি অত্র প্রতিষ্ঠানের মোট{' '}
                  <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-950 font-black rounded-lg border border-blue-300">
                    {language === 'bn' ? toBnDigits(member.shareQty || 0) : (member.shareQty || 0)} টি
                  </span>{' '}
                  সাধারণ শেয়ারের স্থায়ী মালিকানা অর্জন করিয়াছেন এবং তিনি অত্র প্রতিষ্ঠানের গঠনতন্ত্র ও সাধারণ নীতিমালা অনুযায়ী শেয়ার অংশীদার ও স্বত্বাধিকারী হিসেবে স্বীকৃতি লাভ করিয়াছেন।
                </p>
              </div>
 
 
            </div>

            {/* Right Hand: Photos and Nominee Details Box */}
            <div className="col-span-12 lg:col-span-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-4">
              
              {/* Photos Panel */}
              <div className="grid grid-cols-2 gap-4">
                {/* Member Photo */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-28 bg-white border-2 border-blue-900 rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs shrink-0">
                    {member.member_photo ? (
                      <img
                        src={member.member_photo}
                        alt={member.nameBn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-300">
                        <User className="w-10 h-10 mx-auto opacity-40 text-blue-900" />
                        <span className="text-[8px] font-bold block text-slate-400 mt-1">ফটো পাওয়া যায়নি</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-blue-950 mt-1.5 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    সদস্যের ছবি
                  </span>
                </div>

                {/* Nominee Photo */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-28 bg-white border-2 border-emerald-800 rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs shrink-0">
                    {primaryNominee.photoUrl ? (
                      <img
                        src={primaryNominee.photoUrl}
                        alt="Nominee"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-300">
                        <User className="w-10 h-10 mx-auto opacity-40 text-emerald-800" />
                        <span className="text-[8px] font-bold block text-slate-400 mt-1">ফটো পাওয়া যায়নি</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 mt-1.5 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    নমিনির ছবি
                  </span>
                </div>
              </div>

              {/* Nominee details listing */}
              <div className="bg-white rounded-xl p-3 border border-slate-150 space-y-2 text-xs">
                <div className="pb-1.5 border-b border-slate-100 flex items-center gap-1.5 text-blue-950">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-extrabold uppercase tracking-wide text-[10px]">মনোনীত ব্যক্তি (Nominee Details)</span>
                </div>

                {primaryNominee.name ? (
                  <div className="space-y-1 text-[11px] font-bold text-slate-800 leading-relaxed">
                    <div className="grid grid-cols-12 gap-1">
                      <span className="col-span-4 text-slate-400 font-medium">নাম:</span>
                      <span className="col-span-8 text-slate-900 font-extrabold">{primaryNominee.name}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1">
                      <span className="col-span-4 text-slate-400 font-medium">সম্পর্ক:</span>
                      <span className="col-span-8 text-blue-800">{primaryNominee.relation}</span>
                    </div>
                    {primaryNominee.nidBirthReg && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-4 text-slate-400 font-medium">NID/জন্মনিবন্ধন:</span>
                        <span className="col-span-8 font-mono">{primaryNominee.nidBirthReg}</span>
                      </div>
                    )}
                    {primaryNominee.mobile && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-4 text-slate-400 font-medium">মোবাইল:</span>
                        <span className="col-span-8 font-mono">{primaryNominee.mobile}</span>
                      </div>
                    )}
                    {primaryNominee.address && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-4 text-slate-400 font-medium">ঠিকানা:</span>
                        <span className="col-span-8 text-slate-600 font-normal">{primaryNominee.address}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 font-bold text-center py-2">কোনো মনোনীত ব্যক্তির তথ্য পাওয়া যায়নি।</p>
                )}
              </div>

            </div>

          </div>

          {/* Legal / Rules Box - Requested Terms and Conditions */}
          <div className="p-4 bg-slate-50 border border-slate-250 rounded-xl space-y-2 text-xs text-slate-800">
            <div className="font-extrabold text-blue-950 uppercase tracking-wider pb-1 border-b border-slate-200/80 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>বিশেষ শর্তাবলী ও নীতিমালা (Terms & Conditions)</span>
            </div>
            <ol className="list-decimal pl-5 font-bold space-y-1.5 text-slate-700 leading-relaxed">
              <li>
                সদস্যপদ গ্রহণের তারিখ হতে ২ (দুই) বছর পূর্ণ হওয়ার পূর্বে কোনো সদস্য নিজ ইচ্ছায় সদস্যপদ বাতিল করলে, সদস্যের মোট জমাকৃত অর্থের উপর ২০% কর্তন করা হবে।
              </li>
              <li>
                প্রতি মাসের ১ তারিখ হতে ১৫ তারিখের মধ্যে মাসিক চাঁদা পরিশোধ করতে হবে। নির্ধারিত সময়ের মধ্যে মাসিক চাঁদা পরিশোধ না করলে ২০০/- (দুইশত) টাকা জরিমানা প্রযোজ্য হবে।
              </li>
              <li>
                অন্যান্য সকল কার্যক্রম প্রতিষ্ঠানের গঠনতন্ত্র ও নীতিমালা অনুযায়ী পরিচালিত হবে।
              </li>
            </ol>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-12 grid grid-cols-3 text-center text-[11px] font-bold text-slate-800">
            <div>
              <div className="font-serif italic text-blue-900 text-xs mb-1">{settings.presidentName || 'মো: ফয়েজুর রহমান খান'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-32 mx-auto">
                সভাপতি (President)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-xs mb-1">{settings.secretaryName || 'মো: মনিরুজ্জামান'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-40 mx-auto">
                সাধারণ সম্পাদক (General Secretary)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-xs mb-1">{settings.treasurerName || 'মো: মাহবুব সরকার'}</div>
              <div className="border-t-2 border-slate-800 pt-1 w-32 mx-auto">
                ক্যাশিয়ার (Cashier)
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
