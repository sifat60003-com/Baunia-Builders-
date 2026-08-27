import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Plus, 
  Printer, 
  ArrowRightLeft, 
  Search, 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  UserCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatDate, toBnDigits } from '../../utils/formatters';
import { Member } from '../../types';

export const ShareManagement: React.FC = () => {
  const { 
    members, 
    shares, 
    addShare, 
    transferShare, 
    setActiveTab, 
    setSelectedCertMemberId,
    language, 
    t, 
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Assign form state
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [shareQty, setShareQty] = useState(1);
  const [sharePrice, setSharePrice] = useState(100000);
  const [remarks, setRemarks] = useState('');

  // Transfer form state
  const [fromMemberId, setFromMemberId] = useState(members[0]?.id || '');
  const [toMemberId, setToMemberId] = useState(members[1]?.id || '');
  const [transferQty, setTransferQty] = useState(1);

  // Filtered share list
  const filteredShares = shares.filter(s => 
    s.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSharesAllocated = members.reduce((sum, m) => sum + m.shareQty, 0);
  const totalShareValue = members.reduce((sum, m) => sum + m.totalShareValue, 0);

  // Handle Assign Share
  const handleAssignShare = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === selectedMemberId);
    if (!member) {
      showToast('সদস্য নির্বাচন করুন', 'error');
      return;
    }

    addShare({
      memberId: member.id,
      memberName: member.nameBn,
      shareQty: Number(shareQty),
      sharePrice: Number(sharePrice),
      totalAmount: Number(shareQty) * Number(sharePrice),
      issueDate: new Date().toISOString().split('T')[0],
      remarks: remarks || 'নতুন শেয়ার বরাদ্দ',
    });

    setIsAssignModalOpen(false);
  };

  // Handle Transfer Share
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromMemberId === toMemberId) {
      showToast('প্রেরক এবং প্রাপক সদস্য একই হতে পারে না', 'error');
      return;
    }

    const fromMem = members.find(m => m.id === fromMemberId);
    if (!fromMem || fromMem.shareQty < transferQty) {
      showToast(`প্রেরক সদস্যের কাছে পর্যাপ্ত শেয়ার নেই (বর্তমান: ${fromMem?.shareQty || 0} টি)`, 'error');
      return;
    }

    transferShare(fromMemberId, toMemberId, Number(transferQty));
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navShares')} (Share Capital Registry)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            বাউনিয়া বিল্ডার্স এর প্রাতিষ্ঠানিক শেয়ার মালিকানা, সনদ বিতরণ ও স্থানান্তর ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-slate-500" />
            <span>{language === 'bn' ? 'শেয়ার হস্তান্তর' : 'Transfer Share'}</span>
          </button>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন শেয়ার বরাদ্দ' : 'Allocate Share'}</span>
          </button>
        </div>
      </div>

      {/* Share Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">মোট বরাদ্দকৃত শেয়ার</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {language === 'bn' ? toBnDigits(totalSharesAllocated) : totalSharesAllocated} টি
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">শেয়ারহোল্ডার সদস্য সংখ্যা</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {language === 'bn' ? toBnDigits(members.length) : members.length} জন
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">মোট শেয়ার সনদ</div>
            <div className="text-xl font-extrabold text-amber-800 mt-0.5">
              {language === 'bn' ? toBnDigits(shares.length) : shares.length} টি
            </div>
          </div>
        </div>

      </div>

      {/* Share Certificates & Allocations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Search Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'সনদ নম্বর বা সদস্য নাম খুঁজুন...' : 'Search Certificate or Member...'}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            মোট সনদ: <span className="font-bold text-slate-900">{filteredShares.length}</span> টি
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">সনদ নম্বর (Cert No)</th>
                <th className="py-3 px-4">সদস্যের নাম ও আইডি</th>
                <th className="py-3 px-4">শেয়ার সংখ্যা</th>
                <th className="py-3 px-4">ইস্যু তারিখ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShares.map(share => (
                <tr key={share.id} className="hover:bg-blue-50/40 transition group">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {share.certificateNo}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700">
                      {share.memberName}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      {share.memberId}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-blue-900">
                    {language === 'bn' ? toBnDigits(share.shareQty) : share.shareQty} টি শেয়ার
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {formatDate(share.issueDate, language === 'bn')}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedCertMemberId(share.memberId);
                        setActiveTab('share_cert');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] transition ml-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t('shareCertificate')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Assign Share Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">নতুন শেয়ার বরাদ্দ (Allocate Shares)</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-blue-200 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignShare} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">সদস্য নির্বাচন করুন</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.nameBn} (বর্তমান শেয়ার: {m.shareQty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন শেয়ার সংখ্যা</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={shareQty}
                  onChange={(e) => setShareQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মন্তব্য / বিবরণ</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="যেমন: অতিরিক্ত শেয়ার বরাদ্দ..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  বরাদ্দ সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Share Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">শেয়ার হস্তান্তর (Transfer Shares)</h3>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-300 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransfer} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রেরক সদস্য (From Member)</label>
                <select
                  value={fromMemberId}
                  onChange={(e) => setFromMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.nameBn} (মালিকানা: {m.shareQty} টি শেয়ার)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রাপক সদস্য (To Member)</label>
                <select
                  value={toMemberId}
                  onChange={(e) => setToMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.nameBn} (বর্তমান: {m.shareQty} টি শেয়ার)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">হস্তান্তরযোগ্য শেয়ার সংখ্যা</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  হস্তান্তর নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
