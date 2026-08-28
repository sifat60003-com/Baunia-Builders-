import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { AdminProfileModal } from './AdminProfileModal';
import { 
  Search, 
  Bell, 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  Check, 
  ShieldCheck, 
  ChevronDown, 
  LogOut,
  SlidersHorizontal,
  ExternalLink,
  Camera,
  User as UserIcon
} from 'lucide-react';
import { UserRole } from '../../types';
import { translations } from '../../utils/translations';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { 
    language, 
    toggleLanguage, 
    t, 
    currentUser, 
    switchRole, 
    setIsAuthenticated,
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setIsSearchOpen,
    setActiveTab
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roles: { key: UserRole; labelBn: string; labelEn: string; desc: string }[] = [
    { key: 'super_admin', labelBn: 'সুপার অ্যাডমিন', labelEn: 'Super Admin', desc: 'পূর্ণ সিস্টেম ও আর্থিক নিয়ন্ত্রণ' },
    { key: 'admin', labelBn: 'অ্যাডমিন', labelEn: 'Admin', desc: 'সদস্য, শেয়ার ও রসিদ ব্যবস্থাপনা' },
    { key: 'collector', labelBn: 'হিসাবরক্ষক / কালেক্টর', labelEn: 'Accountant / Collector', desc: 'টাকা আদায় ও রসিদ তৈরি' },
    { key: 'member', labelBn: 'সদস্য পোর্টাল', labelEn: 'Member Portal', desc: 'ব্যক্তিগত শেয়ার, জমা ও বকেয়া' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer transition hover:opacity-90 flex items-center"
          >
            <Logo size="sm" showText={false} className="lg:hidden" />
            <Logo size="sm" showText={true} className="hidden lg:flex" />
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full transition group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
              <span className="truncate text-xs font-medium text-slate-500">{t('searchPlaceholder')}</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded-full shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer md:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bento Style Language Switcher Segmented Control */}
          <div className="flex bg-slate-100 rounded-lg p-1 text-[11px] font-bold border border-slate-200">
            <button
              onClick={() => language !== 'bn' && toggleLanguage()}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                language === 'bn' 
                  ? 'bg-white shadow-xs text-blue-700 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => language !== 'en' && toggleLanguage()}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                language === 'en' 
                  ? 'bg-white shadow-xs text-blue-700 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setShowRoleMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-xl transition cursor-pointer"
              title="Switch demo user role"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {language === 'bn' ? translations['bn'][currentUser.role] : translations['en'][currentUser.role]}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'bn' ? 'ভূমিকা পরিবর্তন (Role Preview)' : 'Switch System Role'}
                </div>
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 text-xs hover:bg-blue-50 transition cursor-pointer ${
                      currentUser.role === r.key ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-md ${currentUser.role === r.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Check className={`w-3 h-3 ${currentUser.role === r.key ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {language === 'bn' ? r.labelBn : r.labelEn}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {r.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifMenu(prev => !prev)}
              className="relative w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 border-2 border-white">
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{t('notifications')}</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                          !n.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          n.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                          n.type === 'member' ? 'bg-blue-100 text-blue-700' :
                          n.type === 'expense' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {language === 'bn' ? n.titleBn : n.titleEn}
                            </h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                            {language === 'bn' ? n.messageBn : n.messageEn}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer group"
              title="প্রোফাইল সেটিংস"
            >
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-600/20 shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs">
                  <Camera className="w-2 h-2" />
                </div>
              </div>
              <div className="hidden xl:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase mt-0.5">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-600/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-sm truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {currentUser.email || currentUser.phone}
                      </div>
                    </div>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    {language === 'bn' ? translations['bn'][currentUser.role] : translations['en'][currentUser.role]}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsAdminProfileOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-blue-700 font-semibold hover:bg-blue-50/80 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>প্রোফাইল ছবি ও তথ্য পরিবর্তন</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('navSettings')}</span>
                  </button>
                  {currentUser.role === 'member' && (
                    <button
                      onClick={() => {
                        setActiveTab('member_detail');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t('viewProfile')}</span>
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'লগআউট (Logout)' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
      />
    </header>
  );
};
