import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, User, Receipt, Award, ArrowRight, Phone, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    members, 
    receipts, 
    shares,
    setActiveTab, 
    setSelectedMemberId, 
    setSelectedReceiptId,
    language 
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'members' | 'receipts' | 'shares'>('all');

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { members: [], receipts: [], shares: [] };

    const matchedMembers = (filterType === 'all' || filterType === 'members') 
      ? members.filter(m => 
          m.id.toLowerCase().includes(q) ||
          m.nameBn.toLowerCase().includes(q) ||
          m.nameEn.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          m.nid.includes(q) ||
          (m.occupation && m.occupation.toLowerCase().includes(q))
        ).slice(0, 5)
      : [];

    const matchedReceipts = (filterType === 'all' || filterType === 'receipts')
      ? receipts.filter(r =>
          r.receiptNo.toLowerCase().includes(q) ||
          r.memberName.toLowerCase().includes(q) ||
          r.memberId.toLowerCase().includes(q) ||
          String(r.amount).includes(q)
        ).slice(0, 5)
      : [];

    const matchedShares = (filterType === 'all' || filterType === 'shares')
      ? shares.filter(s =>
          s.certificateNo.toLowerCase().includes(q) ||
          s.memberName.toLowerCase().includes(q) ||
          s.memberId.toLowerCase().includes(q)
        ).slice(0, 5)
      : [];

    return {
      members: matchedMembers,
      receipts: matchedReceipts,
      shares: matchedShares,
    };
  }, [searchQuery, members, receipts, shares, filterType]);

  if (!isSearchOpen) return null;

  const totalResults = filteredResults.members.length + filteredResults.receipts.length + filteredResults.shares.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-600 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'সদস্য নাম, আইডি, মোবাইল, এনআইডি বা রশিদ খুঁজুন...' : 'Search members, ID, mobile, NID, receipts...'}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base font-medium outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-200/80 rounded-md hover:bg-slate-300 transition"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-white text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterType === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'সব ফলাফল' : 'All'}
          </button>
          <button
            onClick={() => setFilterType('members')}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterType === 'members' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'সদস্যগণ' : 'Members'} ({members.length})
          </button>
          <button
            onClick={() => setFilterType('receipts')}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterType === 'receipts' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'রশিদসমূহ' : 'Receipts'} ({receipts.length})
          </button>
          <button
            onClick={() => setFilterType('shares')}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterType === 'shares' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'শেয়ার সনদ' : 'Certificates'}
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchQuery.trim() ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30 text-blue-600" />
              <p className="text-sm font-medium">
                {language === 'bn' ? 'অনুসন্ধানের জন্য টাইপ করুন...' : 'Type to search across database...'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' ? 'যেমন: BB-0001, মো: আনোয়ার, 01812, BBR-2026-000001' : 'e.g. BB-0001, Anwar, 01812, BBR-2026-000001'}
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-700">
                {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching results found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                "{searchQuery}" {language === 'bn' ? 'এর সাথে মিল রয়েছে এমন কোনো তথ্য নেই' : 'did not match any records.'}
              </p>
            </div>
          ) : (
            <>
              {/* Members Section */}
              {filteredResults.members.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'bn' ? 'সদস্যগণ (Members)' : 'Members'}</span>
                  </div>
                  <div className="space-y-1">
                    {filteredResults.members.map(member => (
                      <div
                        key={member.id}
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setActiveTab('member_detail');
                          setIsSearchOpen(false);
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/80 transition cursor-pointer border border-transparent hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={member.nameBn}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-700 text-sm">
                                {member.nameBn}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-blue-100 text-blue-800 font-semibold">
                                {member.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {member.mobile}
                              </span>
                              <span>•</span>
                              <span>{member.shareQty} {language === 'bn' ? 'শেয়ার' : 'Shares'}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-medium">{formatCurrency(member.currentDeposit, language === 'bn')}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Receipts Section */}
              {filteredResults.receipts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'bn' ? 'মানি রসিদ (Receipts)' : 'Money Receipts'}</span>
                  </div>
                  <div className="space-y-1">
                    {filteredResults.receipts.map(receipt => (
                      <div
                        key={receipt.id}
                        onClick={() => {
                          setSelectedReceiptId(receipt.id);
                          setActiveTab('receipt_view');
                          setIsSearchOpen(false);
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/80 transition cursor-pointer border border-transparent hover:border-emerald-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-sm">
                                {receipt.receiptNo}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {receipt.memberName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                              <span>{formatDate(receipt.date, language === 'bn')}</span>
                              <span>•</span>
                              <span className="font-semibold text-emerald-700">
                                {formatCurrency(receipt.amount, language === 'bn')}
                              </span>
                              <span>•</span>
                              <span className="uppercase text-[10px] font-bold text-slate-500">
                                {receipt.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shares Section */}
              {filteredResults.shares.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'bn' ? 'শেয়ার লেনদেন ও সনদ' : 'Share Certificates'}</span>
                  </div>
                  <div className="space-y-1">
                    {filteredResults.shares.map(share => (
                      <div
                        key={share.id}
                        onClick={() => {
                          setActiveTab('shares');
                          setIsSearchOpen(false);
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/80 transition cursor-pointer border border-transparent hover:border-amber-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-sm">
                                {share.certificateNo}
                              </span>
                              <span className="text-xs text-slate-600 font-medium">
                                {share.memberName}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {share.shareQty} {language === 'bn' ? 'টি শেয়ার' : 'Shares'} — {formatCurrency(share.totalAmount, language === 'bn')}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>কীবোর্ড শর্টকাট:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">K</kbd>
          </div>
          <div>
            {language === 'bn' ? 'বাউনিয়া বিল্ডার্স ডাটাবেস' : 'Baunia Builders Engine'}
          </div>
        </div>
      </div>
    </div>
  );
};
