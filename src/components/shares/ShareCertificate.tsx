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
import defaultLogo from '../../assets/images/baunia_builders_logo_1787932825880.jpg';

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

  const watermarkSrc = (settings?.logoUrl && !settings.logoUrl.includes('1787927051112')) 
    ? settings.logoUrl 
    : defaultLogo;

  return (
    <div className="space-y-6 pb-12">
      {/* Dynamic Style block for Portrait A4 printing */}
      <style>{`
        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            position: absolute !important;
            top: 4mm !important;
            left: 4mm !important;
            width: 202mm !important;
            height: 289mm !important;
            margin: 0 !important;
            padding: 0.2in !important;
            box-sizing: border-box !important;
            border: 8px double #1e3a8a !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
            background-color: white !important;
          }
          .print-card .inner-frame {
            padding: 0.15in !important;
            margin: 0 !important;
            height: 100% !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .print-card h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .print-card .photo-container {
            width: 76px !important;
            height: 98px !important;
          }
          .print-card .photo-label {
            margin-top: 2px !important;
            padding: 1px 4px !important;
            font-size: 8px !important;
          }
          .print-card .right-panel-container {
            padding: 0 !important;
          }
          .print-card .cert-text {
            font-size: 13px !important;
            line-height: 1.6 !important;
          }
          .print-card .terms-box {
            padding: 6px 10px !important;
          }
          .print-card .signatures-row {
            padding-top: 10px !important;
          }
          @page {
            size: A4 portrait;
            margin: 0 !important;
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

      {/* Printable Portrait A4 Certificate Canvas */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-8 border-double border-blue-900 relative overflow-hidden print-card">
        
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600/30"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600/30"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600/30"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600/30"></div>

        {/* Ornate Background Watermark (Baunia Builders Logo) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.11] pointer-events-none select-none z-0">
          <img 
            src={watermarkSrc} 
            alt="Baunia Builders Watermark" 
            className="w-72 h-72 sm:w-96 sm:h-96 object-contain grayscale"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>

        {/* Certificate Inner Frame */}
        <div className="border border-amber-600/40 p-4 sm:p-6 rounded-2xl relative z-10 space-y-3.5 sm:space-y-4 inner-frame">
          
          {/* Certificate Header Block - Left-aligned Logo, Centered Corporate Text */}
          <div className="grid grid-cols-12 gap-2 pb-3 border-b-2 border-blue-950 items-center">
            {/* Logo left */}
            <div className="col-span-3 sm:col-span-2 flex justify-start">
              <Logo size="xl" showText={false} />
            </div>

            {/* Central Corporate Banner */}
            <div className="col-span-6 sm:col-span-8 text-center space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-wide whitespace-nowrap">
                বাউনিয়া বিল্ডার্স
              </h1>
              <div className="text-[11px] sm:text-xs font-black text-blue-900 uppercase tracking-wider leading-none">
                BAUNIA BUILDERS | DHAKA, BANGLADESH
              </div>
              <p className="text-[9px] sm:text-xs text-slate-700 font-bold leading-tight mt-0.5">
                বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০ | মোবাইল: 01833-405170, 01711-280514
              </p>
            </div>

            {/* Balancer spacer */}
            <div className="col-span-3 sm:col-span-2"></div>
          </div>

          {/* Certificate Title Banner */}
          <div className="text-center py-0.5">
            <div className="inline-block px-8 py-1.5 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-amber-300 font-black text-xs sm:text-sm rounded-xl shadow-md uppercase tracking-wider border border-amber-400/40">
              শেয়ার মালিকানা সনদপত্র | SHARE CERTIFICATE
            </div>
          </div>

          {/* Meta Bar: Cert No & Issue Date */}
          <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs font-bold text-slate-700 px-4 py-1.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">সনদ নং (Certificate No):</span>{' '}
              <span className="font-mono text-blue-900 block sm:inline">{certNumber}</span>
            </div>
            <div className="text-center">
              <span className="text-slate-500">সদস্য আইডি:</span>{' '}
              <span className="font-mono text-blue-900 block sm:inline">{member.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ইস্যু তারিখ (Issue Date):</span>{' '}
              <span className="text-slate-900 block sm:inline">{formatDate(member.joinDate, true)}</span>
            </div>
          </div>

          {/* Layout Content Grid: Left (Written details), Right (Combined photos & Nominee info) */}
          <div className="grid grid-cols-12 gap-4 items-start pt-1 print:gap-3">
            
            {/* Left Column: Certification Text */}
            <div className="col-span-12 sm:col-span-7 print:col-span-7 space-y-2.5">
              <div className="text-slate-800 leading-relaxed text-xs sm:text-[13.5px] font-semibold text-justify space-y-2.5 px-1 cert-text">
                <p>
                  এই মর্মে প্রত্যয়ন করা যাইতেছে যে, সম্মানিত সদস্য জনাব/জনাবা{' '}
                  <strong className="text-blue-950 font-black text-sm sm:text-base underline underline-offset-4 decoration-amber-500">
                    {member.nameBn}
                  </strong>
                  {member.nameEn && <span className="font-bold text-xs"> ({member.nameEn})</span>}, পিতা:{' '}
                  <strong>{member.fatherName}</strong>, মাতা: <strong>{member.motherName}</strong>, জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নং:{' '}
                  <span className="font-mono font-bold text-slate-900">{member.nid}</span>, স্থায়ী ঠিকানা:{' '}
                  <span className="font-normal text-slate-700">{member.permanentAddress}</span>।
                </p>

                <p>
                  তিনি বাউনিয়া বিল্ডার্স এর একজন আইনানুগ নিবন্ধিত ও নিয়মিত সক্রিয় সাধারণ সদস্য। তিনি অত্র প্রতিষ্ঠানের মোট{' '}
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-950 font-black rounded-md border border-blue-300">
                    {language === 'bn' ? toBnDigits(member.shareQty || 0) : (member.shareQty || 0)} টি
                  </span>{' '}
                  সাধারণ শেয়ারের স্থায়ী মালিকানা অর্জন করিয়াছেন এবং তিনি অত্র প্রতিষ্ঠানের গঠনতন্ত্র ও সাধারণ নীতিমালা অনুযায়ী শেয়ার অংশীদার ও স্বত্বাধিকারী হিসেবে স্বীকৃতি লাভ করিয়াছেন।
                </p>
              </div>
            </div>

            {/* Right Column: Photos Box (Member & Nominee side by side in one box) and Nominee Details Box underneath */}
            <div className="col-span-12 sm:col-span-5 print:col-span-5 space-y-2.5 right-panel-container">
              
              {/* Single Box containing both Member and Nominee Photos side-by-side */}
              <div className="bg-slate-50/60 rounded-xl p-2.5 border border-slate-200">
                <div className="grid grid-cols-2 gap-2.5 items-center">
                  {/* Member Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-25 sm:w-22 sm:h-27 bg-white border-2 border-blue-900 rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs shrink-0 photo-container">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.nameBn}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-1 text-slate-300">
                          <User className="w-8 h-8 mx-auto opacity-40 text-blue-900" />
                          <span className="text-[8px] font-bold block text-slate-400 mt-0.5">ফটো পাওয়া যায়নি</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-blue-950 mt-1 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200 photo-label">
                      সদস্যের ছবি
                    </span>
                  </div>

                  {/* Nominee Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-25 sm:w-22 sm:h-27 bg-white border-2 border-emerald-800 rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs shrink-0 photo-container">
                      {primaryNominee.photoUrl ? (
                        <img
                          src={primaryNominee.photoUrl}
                          alt="Nominee"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-1 text-slate-300">
                          <User className="w-8 h-8 mx-auto opacity-40 text-emerald-800" />
                          <span className="text-[8px] font-bold block text-slate-400 mt-0.5">ফটো পাওয়া যায়নি</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-800 mt-1 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 photo-label">
                      নমিনির ছবি
                    </span>
                  </div>
                </div>
              </div>

              {/* Nominee Details Card (Underneath the photo box) */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-150 text-[10px] sm:text-xs">
                <div className="pb-1 border-b border-slate-100 flex items-center gap-1.5 text-blue-950 mb-1.5">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span className="font-extrabold uppercase tracking-wide text-[9px] sm:text-[10px]">মনোনীত ব্যক্তি (Nominee Details)</span>
                </div>

                {primaryNominee.name ? (
                  <div className="space-y-1 font-bold text-slate-800 leading-tight">
                    <div className="grid grid-cols-12 gap-1">
                      <span className="col-span-3 text-slate-400 font-medium">নাম:</span>
                      <span className="col-span-9 text-slate-900 font-extrabold">{primaryNominee.name}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1">
                      <span className="col-span-3 text-slate-400 font-medium">সম্পর্ক:</span>
                      <span className="col-span-9 text-blue-800">{primaryNominee.relation}</span>
                    </div>
                    {primaryNominee.nidBirthReg && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-3 text-slate-400 font-medium">
                          {primaryNominee.nidBirthReg.trim().length === 17 ? 'জন্ম নিবন্ধন:' : 'এনআইডি:'}
                        </span>
                        <span className="col-span-9 font-mono">{primaryNominee.nidBirthReg}</span>
                      </div>
                    )}
                    {primaryNominee.mobile && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-3 text-slate-400 font-medium">মোবাইল:</span>
                        <span className="col-span-9 font-mono">{primaryNominee.mobile}</span>
                      </div>
                    )}
                    {primaryNominee.address && (
                      <div className="grid grid-cols-12 gap-1">
                        <span className="col-span-3 text-slate-400 font-medium">ঠিকানা:</span>
                        <span className="col-span-9 text-slate-600 font-normal break-words">{primaryNominee.address}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[9px] text-slate-400 font-bold text-center py-1">কোনো মনোনীত ব্যক্তির তথ্য পাওয়া যায়নি।</p>
                )}
              </div>

            </div>

          </div>

          {/* Legal / Rules Box - Requested Terms and Conditions */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[10px] sm:text-xs text-slate-800 terms-box">
            <div className="font-extrabold text-blue-950 uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-xs">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>বিশেষ শর্তাবলী ও নীতিমালা (Terms & Conditions)</span>
            </div>
            <ol className="list-decimal pl-4 font-bold space-y-1 text-slate-700 leading-normal text-[9px] sm:text-[10.5px]">
              <li>
                সদস্যপদ গ্রহণের তারিখ হতে ২ (দুই) বছর পূরণ হওয়ার পূর্বে কোনো সদস্য নিজ ইচ্ছায় সদস্যপদ বাতিল করলে, সদস্যের মোট জমাকৃত অর্থের উপর ২০% কর্তন করা হবে।
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
          <div className="pt-5 sm:pt-6 grid grid-cols-3 text-center text-[10px] sm:text-xs font-bold text-slate-800 signatures-row">
            <div>
              <div className="font-serif italic text-blue-900 text-xs sm:text-sm mb-1">{settings.presidentName || 'মো: ফয়েজুর রহমান খান'}</div>
              <div className="border-t-2 border-slate-800 pt-0.5 w-26 sm:w-30 mx-auto">
                সভাপতি (President)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-xs sm:text-sm mb-1">{settings.secretaryName || 'মো: মনিরুজ্জামান'}</div>
              <div className="border-t-2 border-slate-800 pt-0.5 w-32 sm:w-36 mx-auto">
                সাধারণ সম্পাদক (General Secretary)
              </div>
            </div>

            <div>
              <div className="font-serif italic text-blue-900 text-xs sm:text-sm mb-1">{settings.treasurerName || 'মো: মাহবুব সরকার'}</div>
              <div className="border-t-2 border-slate-800 pt-0.5 w-26 sm:w-30 mx-auto">
                ক্যাশিয়ার (Cashier)
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
