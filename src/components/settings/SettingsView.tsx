import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Building, 
  Phone, 
  Mail, 
  Coins, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Database,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  RefreshCw,
  Link as LinkIcon,
  Key,
  UploadCloud,
  Users,
  Check
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { getSupabaseCredentials, saveSupabaseCredentials, isSupabaseConfigured, supabase } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, clearAllData, resetToDefaultData, syncAllDataToSupabase, reimport96MembersToSupabase, showToast, language, t } = useApp();

  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Supabase State
  const initialCreds = getSupabaseCredentials();
  const [spUrl, setSpUrl] = useState(initialCreds.url);
  const [spKey, setSpKey] = useState(initialCreds.key);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSaveSupabase = () => {
    let sanitizedUrl = spUrl.trim();
    // Remove trailing slash
    if (sanitizedUrl.endsWith('/')) {
      sanitizedUrl = sanitizedUrl.slice(0, -1);
    }
    // Remove API path if present
    if (sanitizedUrl.includes('/rest/v1')) {
      sanitizedUrl = sanitizedUrl.split('/rest/v1')[0];
    }
    
    saveSupabaseCredentials(sanitizedUrl, spKey);
    setSpUrl(sanitizedUrl); // Update the state
    showToast('Supabase ক্রেডেনশিয়াল সংরক্ষিত হয়েছে!', 'success');
  };

  const handleTestSupabase = async () => {
    if (!spUrl.trim() || !spKey.trim()) {
      showToast('দয়া করে Supabase URL ও Anon Key প্রদান করুন', 'warning');
      return;
    }
    setIsTesting(true);
    try {
      saveSupabaseCredentials(spUrl, spKey);
      const { error } = await supabase.from('members').select('id').limit(1);
      if (error && !error.message.includes('0 rows')) {
        showToast(`কানেকশন টেস্ট ব্যর্থ: ${error.message}`, 'error');
      } else {
        showToast('Supabase ডাটাবেজের সাথে সফলভাবে কানেক্ট হয়েছে! ✅', 'success');
      }
    } catch (err: any) {
      showToast(`কানেকশন ত্রুটি: ${err.message}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    if (!spUrl.trim() || !spKey.trim()) {
      showToast('প্রথমে Supabase Project URL এবং Anon Key সেভ করুন!', 'warning');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('সুপাবেজে ডাটা আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...');
    try {
      saveSupabaseCredentials(spUrl, spKey);
      const res = await syncAllDataToSupabase();
      if (res.success) {
        setSyncStatus(`✅ ${res.message}`);
        showToast(res.message, 'success');
      } else {
        setSyncStatus(`❌ ${res.message}`);
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setSyncStatus(`❌ ত্রুটি: ${err.message}`);
      showToast(`সিঙ্ক করতে ব্যর্থ: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReimport96Members = async () => {
    setIsSyncing(true);
    setSyncStatus('৯৬ জন সদস্যের তথ্য সুপাবেজে রিলোড/আপলোড হচ্ছে...');
    try {
      const res = await reimport96MembersToSupabase();
      if (res.success) {
        setSyncStatus(`✅ ${res.message}`);
      } else {
        setSyncStatus(`❌ ${res.message}`);
      }
    } catch (err: any) {
      setSyncStatus(`❌ ত্রুটি: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  // Full Database JSON Backup Export
  const handleExportBackup = () => {
    const rawData = localStorage.getItem('BAUNIA_BUILDERS_DATA_V1');
    if (!rawData) {
      showToast('কোনো ডাটা পাওয়া যায়নি', 'warning');
      return;
    }

    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Baunia_Builders_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড সফল হয়েছে!', 'success');
  };

  // Database JSON Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.members && parsed.receipts) {
          localStorage.setItem('BAUNIA_BUILDERS_DATA_V1', text);
          showToast('ডাটাবেজ সফলভাবে রিস্টোর হয়েছে! পেজ রিলোড হচ্ছে...', 'success');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          showToast('অকার্যকর ব্যাকআপ ফাইল ফরম্যাট', 'error');
        }
      } catch (err) {
        showToast('ফাইল পার্স করতে ব্যর্থ হয়েছে', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navSettings')} (Organization & Financial Setup)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            বাউনিয়া বিল্ডার্স এর প্রাতিষ্ঠানিক পরিচিতি, নিয়মাবলী ও স্বাক্ষরকারী নির্ধারণ
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t('saveSettings')}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Organization Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>১. প্রতিষ্ঠানের নাম, অফিসিয়াল লোগো ও যোগাযোগের ঠিকানা</span>
            </div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Logo Preview Block */}
            <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1 shadow-xs flex items-center justify-center shrink-0">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Building className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-slate-800 text-xs">অফিসিয়াল সংস্থা লোগো (Official Logo)</p>
                <p className="text-[11px] text-slate-500">সমস্ত রশিদ, শেয়ার সার্টিফিকেট, হেডার এবং সাইডবারে এই লোগো ব্যবহৃত হচ্ছে</p>
                <input
                  type="text"
                  placeholder="Logo URL or Base64 Image Path"
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={formData.orgNameBn}
                onChange={(e) => setFormData({ ...formData, orgNameBn: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization Name (English)</label>
              <input
                type="text"
                required
                value={formData.orgNameEn}
                onChange={(e) => setFormData({ ...formData, orgNameEn: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase tracking-wider text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">অফিস ঠিকানা (বাংলা)</label>
              <input
                type="text"
                value={formData.addressBn}
                onChange={(e) => setFormData({ ...formData, addressBn: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">হটলাইন ১</label>
              <input
                type="text"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">হটলাইন ২</label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">হটলাইন ৩</label>
              <input
                type="text"
                value={formData.phone3}
                onChange={(e) => setFormData({ ...formData, phone3: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Financial Rules & Defaults */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>২. মাসিক চাঁদা ও আইডি সংক্রান্ত নির্ধারিত নিয়মাবলী</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">মাসিক চাঁদা / কিস্তির পরিমাণ (৳)</label>
              <input
                type="number"
                value={formData.defaultMonthlyFee}
                onChange={(e) => setFormData({ ...formData, defaultMonthlyFee: parseFloat(e.target.value) || 1000 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সদস্য আইডি প্রিফিক্স</label>
              <input
                type="text"
                value={formData.memberIdPrefix}
                onChange={(e) => setFormData({ ...formData, memberIdPrefix: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Executive Signatories */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>৩. সনদ ও রসিদে স্বাক্ষরকারী কার্যনির্বাহী কমিটি</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">সভাপতির নাম (President)</label>
              <input
                type="text"
                value={formData.presidentName}
                onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সাধারণ সম্পাদকের নাম (Secretary)</label>
              <input
                type="text"
                value={formData.secretaryName}
                onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ক্যাশিয়ারের নাম (Cashier)</label>
              <input
                type="text"
                value={formData.treasurerName}
                onChange={(e) => setFormData({ ...formData, treasurerName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Supabase Cloud Database Manager */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-emerald-600" />
              <span>৪. ক্লাউড ডাটাবেজ সংযোগ (Supabase Configuration & Sync)</span>
            </h2>

            {isSupabaseConfigured() ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>সুপাবেজ সংযুক্ত আছে (Connected)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>সুপাবেজ কনফিগার করা নেই</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            আপনার Supabase Project Settings ➔ API সেকশন থেকে Project URL এবং Anon / Public Key নিচের বক্সে দিন। এরপর <strong>"ক্রেডেনশিয়াল সেভ করুন"</strong> এবং <strong>"সকল ডাটা সুপাবেজে সিঙ্ক/আপলোড করুন"</strong> বাটনে চাপলেই আপনার প্রতিষ্ঠানের সমস্ত সদস্য, জমা রশিদ ও আয়-ব্যয়ের তথ্য সরাসরি আপনার সুপাবেজ ক্লাউড ডাটাবেসে সেভ হয়ে যাবে।
          </p>

          <div className="grid grid-cols-1 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={spUrl}
                onChange={(e) => setSpUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Supabase Anon Key (Public Key)</span>
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={spKey}
                onChange={(e) => setSpKey(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {syncStatus && (
            <div className={`p-3.5 rounded-xl text-xs font-bold leading-relaxed space-y-2 ${
              syncStatus.includes('❌') || syncStatus.includes('সমস্যা') || syncStatus.includes('Could not find') ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              <div>{syncStatus}</div>
              
              {(syncStatus.includes('Could not find') || syncStatus.includes('schema cache') || syncStatus.includes('settings')) && (
                <div className="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-slate-800 font-normal space-y-2">
                  <p className="font-bold text-rose-700">⚠️ Supabase-এ টেবিল তৈরি করা নেই! সমাধান করার উপায়:</p>
                  <p className="text-[11px] leading-relaxed">
                    আপনার Supabase Dashboard ➔ SQL Editor-এ গিয়ে নিচের কোডটুকু রান করুন, এতে সকল টেবিল তৈরি হয়ে যাবে:
                  </p>
                  <pre className="p-2 bg-slate-900 text-emerald-400 font-mono rounded text-[10px] overflow-x-auto select-all max-h-48">
{`CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name_bn TEXT,
  name_en TEXT,
  president_name TEXT,
  secretary_name TEXT,
  treasurer_name TEXT,
  share_price NUMERIC DEFAULT 100000,
  monthly_fee NUMERIC DEFAULT 2000,
  is_financial_reset_done BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  member_no INT,
  name_bn TEXT,
  name_en TEXT,
  father_name TEXT,
  mother_name TEXT,
  mobile TEXT,
  alt_mobile TEXT,
  occupation TEXT,
  present_address TEXT,
  permanent_address TEXT,
  join_date TEXT,
  status TEXT DEFAULT 'active',
  share_qty INT DEFAULT 1,
  opening_balance NUMERIC DEFAULT 0,
  current_due NUMERIC DEFAULT 25000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  receipt_no TEXT,
  member_id TEXT,
  member_name TEXT,
  amount NUMERIC DEFAULT 0,
  date TEXT,
  type TEXT,
  payment_type TEXT,
  payment_month TEXT,
  payment_months TEXT,
  month_breakdown TEXT,
  payment_method TEXT,
  previous_due NUMERIC DEFAULT 0,
  remaining_due NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  collected_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  income_id TEXT,
  date TEXT,
  category TEXT,
  description TEXT,
  amount NUMERIC,
  payment_method TEXT,
  ref_number TEXT,
  added_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  expense_id TEXT,
  date TEXT,
  category TEXT,
  description TEXT,
  amount NUMERIC,
  payment_method TEXT,
  ref_number TEXT,
  approved_by TEXT,
  added_by TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  type TEXT,
  share_qty INT,
  share_price NUMERIC,
  total_amount NUMERIC,
  date TEXT,
  certificate_no TEXT,
  approved_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  transaction_id TEXT,
  date TEXT,
  type TEXT,
  ref_id TEXT,
  description TEXT,
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_dues (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  month TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT,
  message TEXT,
  type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT,
  details TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE shares DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_dues DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;`}
                  </pre>
                </div>
              )}

              {(syncStatus.includes('row-level security') || syncStatus.includes('RLS')) && !syncStatus.includes('Could not find') && (
                <div className="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-slate-800 font-normal">
                  <p className="font-bold text-rose-700 mb-1">⚠️ কীভাবে RLS সমস্যার সমাধান করবেন:</p>
                  <p className="text-[11px] leading-relaxed mb-2">
                    Supabase-এ Table RLS অন থাকার কারণে ডাটা আপলোড ব্লক হচ্ছে। Supabase SQL Editor-এ নিচের SQL কমান্ডটি চালিয়ে দিন:
                  </p>
                  <pre className="p-2 bg-slate-900 text-emerald-400 font-mono rounded text-[10px] overflow-x-auto select-all">
{`ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE shares DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_dues DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;`}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveSupabase}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>ক্রেডেনশিয়াল সেভ করুন</span>
            </button>

            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'পরীক্ষা করা হচ্ছে...' : 'কানেকশন টেস্ট করুন'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncAllToSupabase}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'সুপাবেজে আপলোড হচ্ছে...' : 'সকল ডাটা সুপাবেজে সিঙ্ক/আপলোড করুন'}</span>
            </button>

            <button
              type="button"
              onClick={handleReimport96Members}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer ml-auto disabled:opacity-50"
            >
              <Users className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>৯৬ জন সদস্য নতুন করে সুপাবেজে আপলোড করুন</span>
            </button>
          </div>
        </div>

        {/* Database Backup & Factory Reset */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>৫. ডাটাবেজ ব্যাকআপ ও রিস্টোর (Local JSON Management)</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড (JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>ব্যাকআপ রিস্টোর করুন</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition cursor-pointer ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>সকল ডাটা মুছুন / নতুন শুরু</span>
            </button>
          </div>
        </div>

      </form>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              আপনি কি নিশ্চিত সকল ডাটা মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500">
              সকল সদস্য, শেয়ার, রসিদ, আয়-ব্যয় এবং লেনদেনের ডাটা স্থায়ীভাবে মুছে যাবে এবং ডাটাবেজ একদম ফ্রেশ (০ ডাটা) হয়ে যাবে।
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                হ্যাঁ, ডাটা মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
