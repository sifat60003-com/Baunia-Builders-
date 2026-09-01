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
  Check,
  Camera,
  User as UserIcon,
  Trash2,
  Unplug
} from 'lucide-react';
import { SystemSettings } from '../../types';
import defaultLogo from '../../assets/images/baunia_builders_logo_1787932825880.jpg';
import { getSupabaseCredentials, saveSupabaseCredentials, disconnectSupabase, isSupabaseConfigured, supabase } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompressor';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    clearAllData, 
    resetToDefaultData, 
    syncAllDataToSupabase, 
    reimport96MembersToSupabase, 
    showToast, 
    language, 
    t,
    currentUser,
    updateUser
  } = useApp();

  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Admin Profile State
  const [adminName, setAdminName] = useState(currentUser.name);
  const [adminEmail, setAdminEmail] = useState(currentUser.email || '');
  const [adminPhone, setAdminPhone] = useState(currentUser.phone || '');
  const [adminAvatar, setAdminAvatar] = useState(currentUser.avatar || '');
  const [isAdminSaving, setIsAdminSaving] = useState(false);

  const handleAdminPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট (10MB) হতে পারবে', 'warning');
      return;
    }

    try {
      const compressed = await compressImage(file, 400, 400, 0.75);
      setAdminAvatar(compressed);
      showToast('ছবি লোড হয়েছে! "প্রোফাইল সংরক্ষণ" বাটনে চাপুন', 'info');
    } catch (err) {
      console.error('Failed to compress admin avatar:', err);
      showToast('ছবি প্রসেস করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim()) {
      showToast('এডমিনের নাম আবশ্যক', 'error');
      return;
    }
    setIsAdminSaving(true);
    try {
      updateUser(currentUser.id, {
        name: adminName.trim(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        avatar: adminAvatar.trim() || undefined
      });
      showToast('এডমিন প্রোফাইল ও ছবি সফলভাবে সংরক্ষিত হয়েছে! ✅', 'success');
    } catch (err: any) {
      showToast('ত্রুটি: ' + err.message, 'error');
    } finally {
      setIsAdminSaving(false);
    }
  };

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

  const handleDisconnectSupabase = () => {
    disconnectSupabase();
    setSpUrl('');
    setSpKey('');
    setSyncStatus(null);
    showToast('সুপাবেজ সংযোগ সফলভাবে বিচ্ছিন্ন (Disconnected) করা হয়েছে!', 'info');
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
    const rawData = localStorage.getItem('BAUNIA_BUILDERS_DATA_V4') || localStorage.getItem('BAUNIA_BUILDERS_DATA_V1');
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
          localStorage.setItem('BAUNIA_BUILDERS_DATA_V4', text);
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

      {/* Admin Profile & Photo Management Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">লগইনকৃত এডমিন প্রোফাইল ও ছবি (Admin Profile & Photo)</h2>
              <p className="text-[11px] text-slate-500">আপনার ব্যক্তিগত প্রোফাইল ফটো আপলোড ও তথ্য পরিবর্তন করুন</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Avatar Preview & Upload Action */}
          <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            <div className="relative group">
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-600/30 shadow-md bg-white"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-linear-to-tr from-blue-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center ring-4 ring-blue-600/20 shadow-md">
                  {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                </div>
              )}

              <label className="absolute inset-0 bg-slate-900/60 rounded-full text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-bold mt-1">ফাইল বেছে নিন</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdminPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1 w-full">
              <label className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>কম্পিউটার/মোবাইল থেকে আপলোড</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdminPhotoUpload}
                  className="hidden"
                />
              </label>

              {adminAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminAvatar('');
                    showToast('ছবি সরানো হয়েছে', 'info');
                  }}
                  className="w-full py-1.5 px-3 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ছবি সরান</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400">JPG, PNG, WebP (সর্বোচ্চ ৫ মেগাবাইট)</p>
          </div>

          {/* Admin Details Form */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">এডমিনের পুরো নাম *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="যেমন: SIFAT HASAN SIAM"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@bauniabuilders.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="01833-405170"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ছবির সরাসরি ওয়েব লিংক (Image URL)</label>
              <input
                type="url"
                value={adminAvatar}
                onChange={(e) => setAdminAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAdminProfile}
                disabled={isAdminSaving}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAdminSaving ? 'সংরক্ষণ হচ্ছে...' : 'এডমিন প্রোফাইল ও ছবি সংরক্ষণ করুন (Save)'}</span>
              </button>
            </div>
          </div>
        </div>
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
            <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={(formData.logoUrl && !formData.logoUrl.includes('1787927051112')) ? formData.logoUrl : defaultLogo} 
                  alt="Logo" 
                  onError={(e) => { e.currentTarget.src = defaultLogo; }}
                  className="w-full h-full object-contain rounded-lg" 
                />
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800 text-xs">অফিসিয়াল সংস্থা লোগো (Official Logo)</p>
                  <label className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>লোগো ফাইল আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 500, 500, 0.8);
                            setFormData(prev => ({ ...prev, logoUrl: compressed }));
                            showToast('নতুন লোগো লোড হয়েছে! "সেটিংস সংরক্ষণ করুন" বাটনে চাপুন', 'info');
                          } catch (err) {
                            console.error('Failed to compress logo:', err);
                            showToast('লোগো ফাইল প্রসেস করতে ব্যর্থ হয়েছে', 'error');
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">সমস্ত রশিদ, শেয়ার সার্টিফিকেট, হেডার এবং সাইডবারে এই অফিসিয়াল লোগো প্রদর্শিত হবে</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Logo URL or Image Path"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, logoUrl: defaultLogo }));
                        showToast('ডিফল্ট লোগো রিসেট হয়েছে', 'info');
                      }}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer transition"
                    >
                      ডিফল্ট রিসেট
                    </button>
                  )}
                </div>
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
              <label className="block font-bold text-slate-700 mb-1">সভাপতির নাম</label>
              <input
                type="text"
                value={formData.presidentName}
                onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সাধারণ সম্পাদকের নাম</label>
              <input
                type="text"
                value={formData.secretaryName}
                onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ক্যাশিয়ারের নাম</label>
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
{`-- ১. সেটিংস টেবিল
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  data JSONB,
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

-- ২. সদস্য টেবিল (নমিনি বাদে পরিষ্কার ফিল্ডস)
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  member_no TEXT,
  name_bn TEXT,
  name_en TEXT,
  father_name TEXT,
  mother_name TEXT,
  spouse_name TEXT,
  dob TEXT,
  birth_date TEXT,
  gender TEXT DEFAULT 'male',
  religion TEXT DEFAULT 'islam',
  nationality TEXT DEFAULT 'Bangladeshi',
  nid TEXT,
  birth_reg_no TEXT,
  mobile TEXT,
  alt_mobile TEXT,
  email TEXT,
  occupation TEXT,
  present_address TEXT,
  permanent_address TEXT,
  photo_url TEXT,
  photo_back_url TEXT,
  pin TEXT,
  is_pin_set BOOLEAN DEFAULT false,
  join_date TEXT,
  status TEXT DEFAULT 'active',
  share_qty NUMERIC DEFAULT 1,
  share_value NUMERIC DEFAULT 25000,
  opening_balance NUMERIC DEFAULT 0,
  current_due NUMERIC DEFAULT 25000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৩. নমিনি টেবিল (সদস্যের সাথে ফরেন কি দিয়ে লিঙ্কড)
CREATE TABLE IF NOT EXISTS nominees (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  nid_birth_reg TEXT,
  mobile TEXT,
  address TEXT,
  percentage NUMERIC DEFAULT 100,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nominees_member_id ON nominees(member_id);

-- ৪. জমা রশিদ টেবিল
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  receipt_no TEXT,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT,
  member_no TEXT,
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

-- ৫. আয় টেবিল
CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  income_id TEXT,
  date TEXT,
  source TEXT,
  category TEXT,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  payment_method TEXT,
  ref_number TEXT,
  receipt_no TEXT,
  received_by TEXT,
  added_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৬. ব্যয় টেবিল
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  expense_id TEXT,
  date TEXT,
  category TEXT,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  paid_to TEXT,
  payment_method TEXT,
  ref_number TEXT,
  voucher_no TEXT,
  approved_by TEXT,
  added_by TEXT,
  status TEXT DEFAULT 'approved',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৭. শেয়ার টেবিল
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT,
  certificate_no TEXT,
  share_count NUMERIC DEFAULT 1,
  share_qty INT DEFAULT 1,
  face_value NUMERIC DEFAULT 25000,
  share_price NUMERIC DEFAULT 25000,
  total_value NUMERIC DEFAULT 25000,
  total_amount NUMERIC DEFAULT 25000,
  type TEXT,
  date TEXT,
  issue_date TEXT,
  status TEXT DEFAULT 'active',
  approved_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৮. এফডিআর টেবিল
CREATE TABLE IF NOT EXISTS fdrs (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  fdr_no TEXT,
  amount NUMERIC DEFAULT 0,
  interest_rate NUMERIC DEFAULT 0,
  start_date TEXT,
  duration_months NUMERIC DEFAULT 12,
  maturity_date TEXT,
  status TEXT DEFAULT 'running',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৯. ইউজার টেবিল
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  role TEXT DEFAULT 'staff',
  permissions JSONB DEFAULT '[]'::jsonb,
  password_hash TEXT,
  status TEXT DEFAULT 'active',
  avatar TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ১০. লেনদেন লেজার টেবিল
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  transaction_id TEXT,
  date TEXT,
  type TEXT,
  ref_id TEXT,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  user_name TEXT,
  member_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS পারমিশন ডিজাবল / উন্মুক্তকরণ
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE nominees DISABLE ROW LEVEL SECURITY;
ALTER TABLE receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE shares DISABLE ROW LEVEL SECURITY;
ALTER TABLE fdrs DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;`}
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

            {isSupabaseConfigured() && (
              <button
                type="button"
                onClick={handleDisconnectSupabase}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                <Unplug className="w-4 h-4 text-rose-600" />
                <span>সুপাবেজ সংযোগ বিচ্ছিন্ন করুন (Disconnect)</span>
              </button>
            )}

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
