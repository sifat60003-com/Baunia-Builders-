import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { AdminProfileModal } from './AdminProfileModal';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  HandCoins, 
  Receipt, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  FileSpreadsheet, 
  FileText, 
  ShieldAlert, 
  Settings, 
  Upload, 
  X,
  Sparkles,
  ChevronRight,
  LogOut,
  Camera,
  Landmark
} from 'lucide-react';
import { toBnDigits } from '../../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    t, 
    language, 
    currentUser, 
    members, 
    monthlyDues, 
    receipts,
    fdrs,
    switchRole,
    setIsAuthenticated
  } = useApp();

  const isMemberRole = currentUser.role === 'member';
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Navigation Items
  const menuItems = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: LayoutDashboard,
      roles: ['super_admin', 'admin', 'accountant', 'collector', 'member'],
    },
    {
      id: 'members',
      label: t('navMembers'),
      icon: Users,
      badge: members.length,
      roles: ['super_admin', 'admin', 'accountant', 'collector'],
    },
    {
      id: 'shares',
      label: t('navShares'),
      icon: Award,
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'collect_payment',
      label: t('navCollectPayment'),
      icon: HandCoins,
      highlight: true,
      roles: ['super_admin', 'admin', 'accountant', 'collector'],
    },
    {
      id: 'receipts',
      label: t('navReceipts'),
      icon: Receipt,
      badge: receipts.length,
      roles: ['super_admin', 'admin', 'accountant', 'collector', 'member'],
    },
    {
      id: 'dues',
      label: t('navDues'),
      icon: Clock,
      badge: monthlyDues.filter(d => d.dueAmount > 0).length,
      badgeColor: 'bg-rose-500',
      roles: ['super_admin', 'admin', 'accountant', 'collector', 'member'],
    },
    {
      id: 'income',
      label: t('navIncome'),
      icon: TrendingUp,
      roles: ['super_admin', 'admin', 'accountant'],
    },
    {
      id: 'expenses',
      label: t('navExpenses'),
      icon: TrendingDown,
      roles: ['super_admin', 'admin', 'accountant'],
    },
    {
      id: 'cashbook',
      label: t('navCashBook'),
      icon: BookOpen,
      roles: ['super_admin', 'admin', 'accountant'],
    },
    {
      id: 'fdr',
      label: t('navFdr'),
      icon: Landmark,
      badge: fdrs.filter(f => f.status === 'active').length,
      badgeColor: 'bg-indigo-600',
      roles: ['super_admin', 'admin', 'accountant'],
    },
    {
      id: 'transactions',
      label: t('navTransactions'),
      icon: FileSpreadsheet,
      roles: ['super_admin', 'admin', 'accountant'],
    },
    {
      id: 'reports',
      label: t('navReports'),
      icon: FileText,
      roles: ['super_admin', 'admin', 'accountant', 'collector'],
    },
    {
      id: 'import',
      label: t('navImport'),
      icon: Upload,
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'users',
      label: t('navUsers'),
      icon: ShieldAlert,
      roles: ['super_admin'],
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: Settings,
      roles: ['super_admin', 'admin'],
    },
  ];

  // Filter based on active role
  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1E3A8A] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-blue-700/50 shadow-2xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Sidebar Header / Logo */}
        <div className="p-5 border-b border-blue-700/50 flex items-center justify-between">
          <Logo size="md" isLight={true} />
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg lg:hidden transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="mx-4 mt-3 px-3.5 py-2 rounded-xl bg-blue-900/40 border border-blue-600/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-blue-100">
              {currentUser.name.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 font-bold uppercase tracking-wider">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {visibleMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'members' && (activeTab === 'member_detail' || activeTab === 'member_form')) ||
              (item.id === 'receipts' && activeTab === 'receipt_view') ||
              (item.id === 'shares' && activeTab === 'share_cert');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/40 text-white shadow-sm ring-1 ring-white/20 font-bold'
                    : item.highlight
                    ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/30'
                    : 'text-blue-100 hover:text-white hover:bg-blue-600/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-300' : 'text-blue-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${item.badgeColor || 'bg-blue-500'}`}>
                      {language === 'bn' ? toBnDigits(item.badge) : item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info & quick logout/switch */}
        <div className="p-4 border-t border-blue-700/50 bg-blue-900/40">
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 mb-2.5 p-1.5 -m-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer group"
            title="প্রোফাইল ছবি ও সেটিংস পরিবর্তন"
          >
            <div className="relative shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/80 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center border border-white/30 shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs">
                <Camera className="w-2 h-2" />
              </div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition">{currentUser.name}</p>
              <p className="text-[10px] text-blue-200 capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-blue-700/40">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-blue-200 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3 text-amber-300" />
              <span>ছবি পরিবর্তন</span>
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
              }}
              className="text-blue-200 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
