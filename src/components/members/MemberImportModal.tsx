import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Trash2,
  FileText,
  Sparkles
} from 'lucide-react';
import { Member } from '../../types';
import { toBnDigits } from '../../utils/formatters';

export const MemberImportModal: React.FC = () => {
  const { addMember, setActiveTab, showToast, language, t } = useApp();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample CSV format generator
  const handleDownloadSample = () => {
    const headers = 'NameBn,NameEn,FatherName,MotherName,Mobile,NID,ShareQty,SharePrice,MonthlyFee,OpeningBalance,PresentAddress,NomineeName,NomineeRelation,NomineePercent\n';
    const sampleRows = 
      'মো: রফিকুল ইসলাম,Md. Rafiqul Islam,আব্দুল কাদের,রাবেয়া খাতুন,01711122233,19802692015000999,2,100000,1000,50000,বাউনিয়া তুরাগ ঢাকা,মোসা: নাসরিন,স্ত্রী,100\n' +
      'মো: তারেক মাহমুদ,Md. Tareq Mahmud,মাহমুদুর রহমান,ফাতেমা বেগম,01822334455,19852692015000888,1,100000,1000,25000,উত্তরা সেক্টর ১০ ঢাকা,মাহমুদা আক্তার,কন্যা,100\n';

    const blob = new Blob(['\uFEFF' + headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'baunia_builders_member_import_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV parser
  const handleParse = (text: string) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }

    const lines = text.trim().split('\n');
    if (lines.length <= 1) {
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const results: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 5) continue;

      results.push({
        nameBn: cols[0] || `সদস্য ${i}`,
        nameEn: cols[1] || '',
        fatherName: cols[2] || 'পিতার নাম',
        motherName: cols[3] || 'মাতার নাম',
        mobile: cols[4] || `0170000000${i}`,
        nid: cols[5] || `198000000000${i}`,
        shareQty: parseInt(cols[6]) || 1,
        sharePrice: parseInt(cols[7]) || 100000,
        monthlyFee: parseInt(cols[8]) || 1000,
        openingBalance: parseInt(cols[9]) || 20000,
        presentAddress: cols[10] || 'বাউনিয়া, তুরাগ, ঢাকা',
        nomineeName: cols[11] || 'নমিনি নাম',
        nomineeRelation: cols[12] || 'স্ত্রী',
        nomineePercent: parseInt(cols[13]) || 100,
      });
    }

    setParsedRows(results);
  };

  // File drop handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleParse(text);
    };
    reader.readAsText(file);
  };

  // Import Execution
  const handleExecuteImport = () => {
    if (parsedRows.length === 0) {
      showToast('ইমপোর্ট করার জন্য কোনো তথ্য পাওয়া যায়নি', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      parsedRows.forEach(row => {
        addMember({
          nameBn: row.nameBn,
          nameEn: row.nameEn,
          fatherName: row.fatherName,
          motherName: row.motherName,
          gender: 'male',
          dob: '1985-01-01',
          nid: row.nid,
          mobile: row.mobile,
          presentAddress: row.presentAddress,
          permanentAddress: row.presentAddress,
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
          shareQty: row.shareQty,
          sharePrice: row.sharePrice,
          totalShareValue: row.shareQty * row.sharePrice,
          monthlyFee: row.monthlyFee,
          openingBalance: row.openingBalance,
          currentDeposit: row.openingBalance,
          currentDue: 0,
          nominees: [
            {
              id: `NOM-${Date.now()}-${Math.random()}`,
              name: row.nomineeName,
              relation: row.nomineeRelation,
              percentage: row.nomineePercent,
              address: row.presentAddress,
            },
          ],
        });
      });

      showToast(`সফলভাবে ${parsedRows.length} জন সদস্য ইমপোর্ট সম্পন্ন হয়েছে!`, 'success');
      setActiveTab('members');
    } catch (err) {
      showToast('ইমপোর্ট প্রক্রিয়ায় সমস্যা হয়েছে', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('members')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('navImport')} (CSV / Excel Member Importer)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              একসাথে একাধিক সদস্যের নাম, শেয়ার, যোগাযোগ ও নমিনির তথ্য ডাটাবেসে যুক্ত করুন
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>নমুনা ফাইল ডাউনলোড (Sample CSV)</span>
        </button>
      </div>

      {/* Upload Zone & Paste Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Box */}
        <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 transition text-center flex flex-col items-center justify-center min-h-[220px] group cursor-pointer relative">
          <input
            type="file"
            accept=".csv, .txt"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            CSV ফাইল ড্র্যাগ করুন অথবা ক্লিক করে সিলেক্ট করুন
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            সাপোর্ট করে: .csv, UTF-8 ফরম্যাট
          </p>
        </div>

        {/* Or Paste CSV Raw Text */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              অথবা সরাসরি CSV টেক্সট পেস্ট করুন:
            </h3>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="NameBn,NameEn,FatherName,MotherName,Mobile,NID,ShareQty..."
              className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            প্রথম লাইন কলামের নাম (Headers) হিসেবে গণ্য হবে।
          </div>
        </div>

      </div>

      {/* Live Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                ইমপোর্ট প্রিভিউ: {language === 'bn' ? toBnDigits(parsedRows.length) : parsedRows.length} জন সদস্য পাওয়া গেছে
              </h3>
            </div>
            <button
              onClick={() => {
                setParsedRows([]);
                setCsvText('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold"
            >
              ক্লিয়ার করুন
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-2.5">সদস্যের নাম (বাংলা)</th>
                  <th className="p-2.5">মোবাইল</th>
                  <th className="p-2.5">এনআইডি</th>
                  <th className="p-2.5">শেয়ার</th>
                  <th className="p-2.5">প্রাথমিক জমা</th>
                  <th className="p-2.5">নমিনি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{r.nameBn}</td>
                    <td className="p-2.5 font-mono">{r.mobile}</td>
                    <td className="p-2.5 font-mono">{r.nid}</td>
                    <td className="p-2.5 font-bold text-blue-700">{r.shareQty} টি</td>
                    <td className="p-2.5 font-bold text-emerald-700">৳ {r.openingBalance}</td>
                    <td className="p-2.5">{r.nomineeName} ({r.nomineeRelation})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('members')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              বাতিল
            </button>
            <button
              onClick={handleExecuteImport}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ইমপোর্ট কনফার্ম করুন ({parsedRows.length} জন)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
