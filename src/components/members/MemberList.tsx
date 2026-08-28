import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  HandCoins, 
  Award, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, toBnDigits } from '../../utils/formatters';
import { translations } from '../../utils/translations';
import { Member } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const MemberList: React.FC = () => {
  const { 
    members, 
    deleteMember, 
    setActiveTab, 
    setSelectedMemberId, 
    setSelectedCertMemberId,
    language, 
    t,
    currentUser 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'due'>('all');
  const [shareFilter, setShareFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'shares' | 'deposit' | 'due'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);

  // Deletion modal state
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Filter & Search Logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const nomineeMatch = m.nominees?.some(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.nidBirthReg.includes(searchTerm)
      );

      const matchesSearch = 
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mobile.includes(searchTerm) ||
        m.nid.includes(searchTerm) ||
        Boolean(nomineeMatch);

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && m.status === 'active') ||
        (statusFilter === 'inactive' && m.status === 'inactive') ||
        (statusFilter === 'due' && (m.currentDue || 0) > 0);

      const matchesShare = 
        shareFilter === 'all' ||
        (shareFilter === '1' && m.shareQty === 1) ||
        (shareFilter === '2' && m.shareQty === 2) ||
        (shareFilter === '3+' && m.shareQty >= 3);

      return matchesSearch && matchesStatus && matchesShare;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'id') cmp = (a.memberNo || 0) - (b.memberNo || 0);
      else if (sortBy === 'name') cmp = a.nameBn.localeCompare(b.nameBn);
      else if (sortBy === 'shares') cmp = a.shareQty - b.shareQty;
      else if (sortBy === 'deposit') cmp = a.currentDeposit - b.currentDeposit;
      else if (sortBy === 'due') cmp = a.currentDue - b.currentDue;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [members, searchTerm, statusFilter, shareFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['সদস্য নং', 'আইডি', 'অংশীদার / সদস্য নাম', 'মোবাইল', 'শেয়ার সংখ্যা', 'নমীনির নাম', 'নমীনির NID/জন্ম নিবন্ধন', 'জমা', 'বকেয়া', 'অবস্থা'];
    const rows = filteredMembers.map(m => [
      m.memberNo,
      m.id,
      `"${m.nameBn}"`,
      `"${m.mobile}"`,
      m.shareQty,
      `"${m.nominees?.[0]?.name || ''}"`,
      `"${m.nominees?.[0]?.nidBirthReg || ''}"`,
      m.currentDeposit,
      m.currentDue,
      m.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Baunia_Builders_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navMembers')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn' 
              ? `সর্বমোট ${toBnDigits(members.length)} জন নিবন্ধিত সদস্য ও শেয়ার তালিকা` 
              : `Total ${members.length} registered members and share registry.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'collector' && (
            <button
              onClick={() => setActiveTab('import')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{language === 'bn' ? 'এক্সেল ইমপোর্ট' : 'Import CSV'}</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{t('print')}</span>
          </button>

          {currentUser.role !== 'collector' && (
            <button
              onClick={() => {
                setSelectedMemberId(null);
                setActiveTab('member_form');
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addMemberBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={language === 'bn' ? 'সদস্য নাম, আইডি বা মোবাইল...' : 'Search Name, ID, Mobile...'}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
            >
              <option value="all">{language === 'bn' ? 'সকল অবস্থা (All Status)' : 'All Status'}</option>
              <option value="active">{language === 'bn' ? 'সক্রিয় সদস্য (Active)' : 'Active Members'}</option>
              <option value="inactive">{language === 'bn' ? 'নিষ্ক্রিয় সদস্য (Inactive)' : 'Inactive'}</option>
              <option value="due">{language === 'bn' ? 'বকেয়া রয়েছে এমন (Has Due)' : 'Has Due'}</option>
            </select>
          </div>

          {/* Share Filter */}
          <div>
            <select
              value={shareFilter}
              onChange={(e) => {
                setShareFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
            >
              <option value="all">{language === 'bn' ? 'সকল শেয়ার কোয়ান্টিটি' : 'All Shares'}</option>
              <option value="1">১টি শেয়ার</option>
              <option value="2">২টি শেয়ার</option>
              <option value="3+">৩ বা ততোধিক শেয়ার</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
            >
              <option value="id-asc">{language === 'bn' ? 'আইডি ক্রমানুসারে (BB-0001)' : 'Sort: ID (Asc)'}</option>
              <option value="name-asc">{language === 'bn' ? 'নাম ক্রমানুসারে (A-Z)' : 'Sort: Name'}</option>
              <option value="shares-desc">{language === 'bn' ? 'সর্বোচ্চ শেয়ার' : 'Sort: Most Shares'}</option>
              <option value="deposit-desc">{language === 'bn' ? 'সর্বোচ্চ জমা' : 'Sort: Highest Deposit'}</option>
              <option value="due-desc">{language === 'bn' ? 'সর্বোচ্চ বকেয়া' : 'Sort: Highest Due'}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print-card">
        
        {/* Printable Organization Header in Print Mode */}
        <div className="hidden print:block p-6 border-b border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900">বাউনিয়া বিল্ডার্স</h2>
          <p className="text-xs text-slate-600">বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০ | ফোন: 01833-805170, 01711-280514</p>
          <h3 className="text-sm font-bold mt-2 underline">সদস্য ও শেয়ার তালিকা</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center">নং</th>
                <th className="py-3 px-3">{t('memberId')}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'অংশীদার / সদস্য' : 'Partner / Member'}</th>
                <th className="py-3 px-4">{t('mobile')}</th>
                <th className="py-3 px-3 text-center">{t('shares')}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'নমীনির নাম ও এনআইডি' : 'Nominee & NID'}</th>
                <th className="py-3 px-3">{t('deposit')}</th>
                <th className="py-3 px-3">{t('status')}</th>
                <th className="py-3 px-4 text-right no-print">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    {language === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি' : 'No members found matching criteria'}
                  </td>
                </tr>
              ) : (
                paginatedMembers.map(member => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-blue-50/40 transition group"
                  >
                    {/* Member No */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500 whitespace-nowrap">
                      {language === 'bn' ? toBnDigits(member.memberNo) : member.memberNo}
                    </td>

                    {/* Member ID */}
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setActiveTab('member_detail');
                        }}
                        className="hover:underline hover:text-blue-900 cursor-pointer text-left"
                        title="সদস্যের প্রোফাইল দেখুন"
                      >
                        {member.id}
                      </button>
                    </td>

                    {/* Member Name */}
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setActiveTab('member_form');
                        }}
                        className="font-bold text-slate-900 group-hover:text-blue-700 cursor-pointer text-sm flex items-center gap-1.5"
                        title="সদস্য তথ্য সংশোধন ও ছবি আপলোড করতে ক্লিক করুন (Edit Form)"
                      >
                        <span>{member.nameBn}</span>
                        <Edit className="w-3.5 h-3.5 text-blue-500 opacity-60 group-hover:opacity-100 transition shrink-0" />
                      </div>
                      {member.nameEn && member.nameEn !== `Member ${member.memberNo}` && (
                        <div className="text-[11px] text-slate-400">
                          {member.nameEn}
                        </div>
                      )}
                    </td>

                    {/* Mobile */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 font-mono text-xs text-slate-800">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        {member.mobile}
                      </span>
                    </td>

                    {/* Shares */}
                    <td className="py-3 px-3 text-center font-bold text-blue-900 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                        {language === 'bn' ? toBnDigits(member.shareQty) : member.shareQty} {language === 'bn' ? 'টি' : 'Shares'}
                      </span>
                    </td>

                    {/* Nominee details */}
                    <td className="py-3 px-4">
                      {member.nominees?.[0] ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">{member.nominees[0].name}</div>
                          {member.nominees[0].nidBirthReg && (
                            <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                              NID: {member.nominees[0].nidBirthReg}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Total Deposit */}
                    <td className="py-3 px-3 font-bold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(member.currentDeposit, language === 'bn')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        member.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : member.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        {translations[language][member.status]}
                      </span>
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Collect Payment */}
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActiveTab('collect_payment');
                          }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title={t('collectPaymentBtn')}
                        >
                          <HandCoins className="w-4 h-4" />
                        </button>

                        {/* View Profile */}
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActiveTab('member_detail');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title={t('viewProfile')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Share Certificate */}
                        <button
                          onClick={() => {
                            setSelectedCertMemberId(member.id);
                            setActiveTab('share_cert');
                          }}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title={t('shareCertificate')}
                        >
                          <Award className="w-4 h-4" />
                        </button>

                        {/* Edit Member (Admin/Super Admin only) */}
                        {currentUser.role !== 'collector' && (
                          <button
                            onClick={() => {
                              setSelectedMemberId(member.id);
                              setActiveTab('member_form');
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title={t('edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Member (Super Admin only) */}
                        {currentUser.role === 'super_admin' && (
                          <button
                            onClick={() => setMemberToDelete(member)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 no-print">
          <div className="flex items-center gap-3">
            <div>
              {language === 'bn' ? 'প্রদর্শিত হচ্ছে' : 'Showing'}{' '}
              <span className="font-bold">
                {filteredMembers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>
              -
              <span className="font-bold">
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
              </span>
              {' '}{language === 'bn' ? 'মোট' : 'of'}{' '}
              <span className="font-bold">{language === 'bn' ? toBnDigits(filteredMembers.length) : filteredMembers.length}</span>
              {' '}{language === 'bn' ? 'জন সদস্য' : 'members'}
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-300">
              <span className="text-slate-500">{language === 'bn' ? 'প্রতি পেজে:' : 'Per page:'}</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <React.Fragment key={page}>
                    {prev && page - prev > 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {language === 'bn' ? toBnDigits(page) : page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (memberToDelete) {
            deleteMember(memberToDelete.id);
            setMemberToDelete(null);
          }
        }}
        title={`সদস্য (${memberToDelete?.nameBn}) মুছে ফেলা নিশ্চিত করুন`}
        description="আপনি কি নিশ্চিতভাবে এই সদস্য এবং তার সংশ্লিষ্ট প্রাথমিক প্রোফাইল মুছে ফেলতে চান? এই অ্যাকশনটি অপরিবর্তনীয়।"
      />

    </div>
  );
};
