import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  User, 
  Member, 
  PaymentReceipt, 
  ShareTransaction, 
  Income, 
  Expense, 
  FinancialTransaction, 
  MonthlyDue, 
  NotificationItem, 
  OrganizationSettings, 
  AuditLog, 
  Language, 
  UserRole,
  PaymentType,
  PaymentMethod,
  FdrItem,
  Gender
} from '../types';
import { 
  initialSettings, 
  initialUsers, 
  initialMembers, 
  initialShareTransactions, 
  initialReceipts, 
  initialIncomes, 
  initialExpenses, 
  initialTransactions, 
  initialMonthlyDues, 
  initialNotifications, 
  initialAuditLogs 
} from '../data/mockData';
import { translations } from '../utils/translations';
import { rawMembersList, generateMembersFromRaw } from '../data/importedMembers';
import { supabase, isSupabaseConfigured, getSupabaseCredentials, saveSupabaseCredentials } from '../lib/supabase';
import { numberToWordsBn, numberToWordsEn } from '../utils/formatters';
import { getMemberScheduleSummary } from '../utils/monthlySchedule';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

interface AppContextType {
  // Auth state
  isSupabaseLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  // Localization & Role
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['bn']) => string;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Navigation & View State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  selectedReceiptId: string | null;
  setSelectedReceiptId: (id: string | null) => void;
  selectedCertMemberId: string | null;
  setSelectedCertMemberId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data & Collections
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => void;
  members: Member[];
  addMember: (memberData: Omit<Member, 'id' | 'memberNo' | 'createdAt' | 'updatedAt'>) => Member;
  updateMember: (id: string, memberData: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Omit<Member, 'id' | 'memberNo' | 'createdAt' | 'updatedAt'>[]) => number;

  shares: ShareTransaction[];
  addShareTransaction: (tx: Omit<ShareTransaction, 'id' | 'createdAt'>) => void;

  receipts: PaymentReceipt[];
  collectPayment: (paymentData: {
    memberId: string;
    memberName?: string;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentMonth?: string;
    monthName?: string;
    paymentMonths?: string[];
    monthNames?: string[];
    monthBreakdown?: any[];
    isExtraMonth?: boolean;
    baseAmount?: number;
    extraAmount?: number;
    transactionRef?: string;
    refNumber?: string;
    notes?: string;
    remarks?: string;
    date?: string;
    collectorName?: string;
    previousDue?: number;
    remainingDue?: number;
  }) => PaymentReceipt;
  addReceipt: (paymentData: {
    memberId: string;
    memberName?: string;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentMonth?: string;
    monthName?: string;
    paymentMonths?: string[];
    monthNames?: string[];
    monthBreakdown?: any[];
    isExtraMonth?: boolean;
    baseAmount?: number;
    extraAmount?: number;
    transactionRef?: string;
    refNumber?: string;
    notes?: string;
    remarks?: string;
    date?: string;
    collectorName?: string;
    previousDue?: number;
    remainingDue?: number;
  }) => PaymentReceipt;
  deleteReceipt: (id: string) => void;

  incomes: Income[];
  addIncome: (income: Omit<Income, 'id' | 'incomeId' | 'createdAt'>) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'expenseId' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string) => void;

  fdrs: FdrItem[];
  addFdr: (fdr: Omit<FdrItem, 'id' | 'fdrNo' | 'createdAt'>) => void;
  deleteFdr: (id: string) => void;

  transactions: FinancialTransaction[];
  monthlyDues: MonthlyDue[];
  payDue: (dueId: string, amount: number, method: PaymentMethod) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;

  // Data Reset & Clear
  syncAllDataToSupabase: () => Promise<{ success: boolean; message: string; count: number }>;
  reimport96MembersToSupabase: () => Promise<{ success: boolean; message: string; count: number }>;
  clearAllData: () => void;
  resetToDefaultData: () => void;

  // Computed Financials & Stats
  stats: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    totalShares: number;
    totalShareValue: number;
    totalCollection: number;
    todayCollection: number;
    thisMonthCollection: number;
    totalDue: number;
    totalIncome: number;
    totalExpenses: number;
    totalFdr: number;
    currentBalance: number;
  };

  // Toast
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'BAUNIA_BUILDERS_DATA_V4';
const AUTH_SESSION_KEY = 'BAUNIA_BUILDERS_AUTH_SESSION_V2';

const getInitialAuthSession = (usersList: User[]) => {
  try {
    const stored = localStorage.getItem(AUTH_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.isAuthenticated) {
        let foundUser: User | undefined;
        if (parsed.userId) {
          foundUser = usersList.find(u => u.id === parsed.userId);
        }
        if (!foundUser && (parsed.role || parsed.activeRole)) {
          const targetRole = parsed.role || parsed.activeRole;
          foundUser = usersList.find(u => u.role === targetRole);
        }
        if (!foundUser && parsed.user && parsed.user.id) {
          foundUser = parsed.user as User;
        }
        if (foundUser) {
          return { isAuthenticated: true, user: foundUser };
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse auth session:', e);
  }
  return { isAuthenticated: false, user: usersList[0] };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from local storage or mock initial
  const loadInitialData = () => {
    try {
      // Clear legacy V1, V2 & V3 data if present
      localStorage.removeItem('BAUNIA_BUILDERS_DATA_V1');
      localStorage.removeItem('BAUNIA_BUILDERS_DATA_V2');
      localStorage.removeItem('BAUNIA_BUILDERS_DATA_V3');
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // Settings Data Migration: Update legacy mock names to correct names
        if (parsedData.settings) {
          // Always ensure valid new logo is active
          if (!parsedData.settings.logoUrl || parsedData.settings.logoUrl.includes('1787927051112') || parsedData.settings.logoUrl.includes('baunia_builders_logo_1787927051112')) {
            parsedData.settings.logoUrl = initialSettings.logoUrl;
          }

          if (parsedData.settings.presidentName === 'মো: মোশাররফ হোসেন' || parsedData.settings.presidentName === 'মো: আব্দুল মালেক') {
            parsedData.settings.presidentName = 'মো: ফয়েজুর রহমান খান';
          }
          if (parsedData.settings.secretaryName === 'মো: রফিকুল ইসলাম' || parsedData.settings.secretaryName === 'মো: শরিফুল ইসলাম') {
            parsedData.settings.secretaryName = 'মো: মনিরুজ্জামান';
          }
          if (!parsedData.settings.treasurerName || parsedData.settings.treasurerName === 'মো: রফিকুল ইসলাম') {
            parsedData.settings.treasurerName = 'মো: মাহবুব সরকার';
          }
          
          // USER CREDENTIALS MIGRATION
          if (!parsedData.users) parsedData.users = [];
          
          let user1 = parsedData.users.find((u: any) => u.id === 'USR-001');
          if (!user1) {
            user1 = { id: 'USR-001', status: 'active', createdAt: new Date().toISOString() };
            parsedData.users.push(user1);
          }
          user1.name = 'SIFAT HASAN SIAM';
          user1.email = 'sifat.comp.bw@gmail.com';
          user1.phone = '202500';
          user1.role = 'super_admin';
          
          let user2 = parsedData.users.find((u: any) => u.id === 'USR-002');
          if (!user2) {
            user2 = { id: 'USR-002', status: 'active', createdAt: new Date().toISOString() };
            parsedData.users.push(user2);
          }
          user2.name = 'MD MAHBUB SARKAR';
          user2.email = 'mahbub@bauniabuilders.com';
          user2.phone = '202501';
          user2.role = 'accountant';
          
          // FINANCIAL RESET MIGRATION (Requested by user)
          // Reset all collection amounts and set balance to 0
          if (!parsedData.settings.isFinancialResetDone_V6) {
            parsedData.settings.isFinancialResetDone_V6 = true;
            
            // Clear all financial transaction records
            parsedData.receipts = [];
            parsedData.incomes = [];
            parsedData.expenses = [];
            parsedData.transactions = [];
            parsedData.monthlyDues = [];
            
            // Reset member balances and calculate due up to August 2026
            if (parsedData.members && Array.isArray(parsedData.members)) {
              // We need to calculate the due based on the schedule
              // Since receipts are empty, totalDue will be the total up to 2026-08
              parsedData.members = parsedData.members.map((m: any) => {
                const shareQty = m.shareQty || 1;
                // Based on Nov 2025 to Aug 2026: 9 months of 2000 (18000) + 1 extra month (5000+2000=7000) = 25000 per share
                const calculatedDue = shareQty * 25000; 
                
                return {
                  ...m,
                  currentDeposit: 0,
                  currentDue: calculatedDue
                };
              });
            }
            
            // Save the reset state back to local storage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedData));
          }
        }
        
        return parsedData;
      }
    } catch (e) {
      console.error('Failed to load local storage data:', e);
    }
    return {
      settings: initialSettings,
      users: initialUsers,
      members: initialMembers,
      shares: initialShareTransactions,
      receipts: initialReceipts,
      incomes: initialIncomes,
      expenses: initialExpenses,
      fdrs: [],
      transactions: initialTransactions,
      monthlyDues: initialMonthlyDues,
      notifications: initialNotifications,
      auditLogs: initialAuditLogs,
    };
  };

  const initialData = loadInitialData();
  const initialAuth = getInitialAuthSession(initialData.users);

  const [isSupabaseLoading, setIsSupabaseLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(initialAuth.isAuthenticated);
  const [language, setLanguage] = useState<Language>('bn');
  const [currentUser, setCurrentUserState] = useState<User>(initialAuth.user);

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    try {
      if (auth) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
          isAuthenticated: true,
          userId: currentUser.id,
          role: currentUser.role,
          user: currentUser
        }));
      } else {
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to update auth in localStorage:', e);
    }
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    try {
      const stored = localStorage.getItem(AUTH_SESSION_KEY);
      let isAuth = true;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.isAuthenticated !== undefined) {
            isAuth = parsed.isAuthenticated;
          }
        } catch (e) {}
      }
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
        isAuthenticated: isAuth,
        userId: user.id,
        role: user.role,
        user: user
      }));
    } catch (e) {
      console.error('Failed to update current user session:', e);
    }
  };
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [settings, setSettings] = useState<OrganizationSettings>(initialData.settings);
  const [members, setMembers] = useState<Member[]>(initialData.members);
  const [shares, setShares] = useState<ShareTransaction[]>(initialData.shares);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(initialData.receipts);
  const [incomes, setIncomes] = useState<Income[]>(initialData.incomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [fdrs, setFdrs] = useState<FdrItem[]>(initialData.fdrs || []);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialData.transactions);
  const [monthlyDues, setMonthlyDues] = useState<MonthlyDue[]>(initialData.monthlyDues);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialData.notifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialData.auditLogs);

  // Navigation & selection
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [selectedCertMemberId, setSelectedCertMemberId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Refs for tracking actual database columns to prevent schema mismatch errors during updates
  const membersColumnsRef = React.useRef<string[]>([]);
  const nomineesColumnsRef = React.useRef<string[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to extract table columns dynamically from a database row.
  // Excludes nested JSON/array relations like 'nominees' but correctly preserves NULL columns (since typeof null === 'object')
  const getTableColumns = (row: any): string[] => {
    if (!row || typeof row !== 'object') return [];
    return Object.keys(row).filter(key => {
      const val = row[key];
      if (val === null) return true;
      if (Array.isArray(val)) return false;
      if (typeof val === 'object') return false; // Filter out nested relations
      return true;
    });
  };

  
  // Helpers for Supabase Mapping
  const mapSupabaseMember = (m: any): Member => {
    const shareQty = m.share_qty || 1;
    const calculatedDue = shareQty * 25000;
    
    const nominees = m.nominees && Array.isArray(m.nominees) && m.nominees.length > 0
      ? m.nominees.map((n: any) => ({
          id: n.id || `NOM-${m.id}-${Math.random().toString(36).substring(2, 7)}`,
          name: n.name || '',
          relation: n.relation || 'নমিনী',
          nidBirthReg: n.nid_birth_reg || '',
          mobile: n.mobile || '',
          address: n.address || '',
          percentage: Number(n.percentage) || 0,
          photoUrl: n.photo_url || undefined,
        }))
      : (m.nominee_name ? [{
          id: `NOM-${m.id}-1`,
          name: m.nominee_name || '',
          relation: m.nominee_relation || 'নমিনী',
          nidBirthReg: m.nominee_nid || m.nominee_nid_birth_reg || '',
          mobile: m.nominee_mobile || m.nominee_phone || m.nominee_contact || m.mobile || '',
          address: m.present_address || 'বাউনিয়া, তুরাগ, ঢাকা',
          percentage: Number(m.nominee_share_percent) || Number(m.nominee_percentage) || 100,
        }] : []);

    const rawGender = String(m.gender || '').toLowerCase().trim();
    const gender: Gender = rawGender === 'female' || rawGender === 'মহিলা' ? 'female' : rawGender === 'other' || rawGender === 'অন্যান্য' ? 'other' : 'male';

    return {
      id: m.id,
      memberNo: m.member_no,
      nameBn: m.name_bn,
      nameEn: m.name_en || `Member ${m.member_no}`,
      fatherName: m.father_name || '—',
      motherName: m.mother_name || '—',
      spouseName: m.spouse_name || '',
      mobile: m.mobile || '',
      altMobile: m.alt_mobile || '',
      email: m.email || '',
      occupation: m.occupation || 'ব্যবসায়ী',
      presentAddress: m.present_address || 'বাউনিয়া, তুরাগ, ঢাকা',
      permanentAddress: m.permanent_address || 'বাউনিয়া, তুরাগ, ঢাকা',
      joinDate: m.join_date || '2026-01-01',
      status: m.status || 'active',
      shareQty: shareQty,
      sharePrice: Number(m.share_price) || 100000,
      totalShareValue: Number(m.total_share_value) || (shareQty * 100000),
      openingBalance: Number(m.opening_balance || 0),
      createdAt: m.created_at || '2026-01-01',
      updatedAt: m.updated_at || new Date().toISOString(),
      gender: gender,
      dob: m.birth_date || m.dob || '1990-01-01',
      nid: m.nid || '',
      birthRegNo: m.birth_reg_no || '',
      photoUrl: m.photo_url || m.photoUrl,
      photoBackUrl: m.photo_back_url || m.photoBackUrl,
      pin: m.pin || undefined,
      isPinSet: m.is_pin_set !== undefined ? Boolean(m.is_pin_set) : Boolean(m.pin),
      monthlyFee: 2000,
      currentDeposit: Number(m.opening_balance || 0),
      currentDue: m.current_due !== undefined && m.current_due !== null ? Number(m.current_due) : calculatedDue,
      notes: m.notes || '',
      nominees: nominees,
    };
  };

  const refreshMembers = async () => {
    if (isSupabaseConfigured()) {
      const { data: membersData, error: mErr } = await supabase.from('members').select('*, nominees(*)');
      if (membersData) {
        setMembers(membersData.map(mapSupabaseMember));
      } else if (mErr) {
        console.warn('Supabase refresh members err:', mErr.message);
      }
    }
  };

  const mapSupabaseReceipt = (r: any): PaymentReceipt => {
    let pMonths: string[] = [];
    if (r.payment_months) {
      try {
        pMonths = typeof r.payment_months === 'string' ? JSON.parse(r.payment_months) : r.payment_months;
      } catch (e) { pMonths = []; }
    }
    let mBreakdown: any[] = [];
    if (r.month_breakdown) {
      try {
        mBreakdown = typeof r.month_breakdown === 'string' ? JSON.parse(r.month_breakdown) : r.month_breakdown;
      } catch (e) { mBreakdown = []; }
    }

    const pType = (r.payment_type || r.type || 'monthly_fee') as PaymentType;
    const amt = Number(r.amount) || 0;

    return {
      id: r.id,
      receiptNo: r.receipt_no || r.receiptNo || r.id,
      date: r.date || r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      memberId: String(r.member_id || r.memberId || ''),
      memberName: r.member_name || r.memberName || 'সদস্য',
      memberMobile: r.member_mobile || r.memberMobile || r.mobile || '',
      paymentType: pType,
      paymentMonth: r.payment_month || r.paymentMonth || undefined,
      paymentMonths: pMonths.length > 0 ? pMonths : (r.paymentMonths || undefined),
      monthBreakdown: mBreakdown.length > 0 ? mBreakdown : (r.monthBreakdown || undefined),
      amount: amt,
      amountInWordsBn: numberToWordsBn(amt),
      amountInWordsEn: numberToWordsEn(amt),
      paymentMethod: r.payment_method || r.paymentMethod || 'cash',
      previousDue: r.previous_due !== null && r.previous_due !== undefined ? Number(r.previous_due) : r.previousDue,
      remainingDue: r.remaining_due !== null && r.remaining_due !== undefined ? Number(r.remaining_due) : r.remainingDue,
      status: r.status || 'active',
      collectorId: r.collector_id || r.collectorId || 'USR-001',
      collectorName: r.collected_by || r.collector_name || r.collectorName || 'Admin',
      notes: r.notes || r.remarks || '',
      createdAt: r.created_at || r.createdAt || new Date().toISOString()
    };
  };

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchFromSupabase = async () => {
      if (!isSupabaseConfigured()) {
        setIsSupabaseLoading(false);
        return;
      }
      try {
        setIsSupabaseLoading(true);
        
        // 1. Settings (Support both 'settings' and 'organization_settings' tables)
        let { data: settingsData, error: sErr } = await supabase.from('settings').select('*').limit(1);
        if ((!settingsData || settingsData.length === 0) && !sErr) {
          const { data: orgData } = await supabase.from('organization_settings').select('*').limit(1);
          if (orgData && orgData.length > 0) {
            settingsData = orgData;
          }
        }
        if (settingsData && settingsData.length > 0) {
          const s = settingsData[0];
          setSettings(prev => ({
            ...prev,
            id: s.id || prev.id,
            nameBn: s.name_bn || prev.nameBn,
            nameEn: s.name_en || prev.nameEn,
            presidentName: s.president_name || prev.presidentName,
            secretaryName: s.secretary_name || prev.secretaryName,
            treasurerName: s.treasurer_name || prev.treasurerName,
            sharePrice: s.share_price ? Number(s.share_price) : prev.sharePrice,
            monthlyFee: s.monthly_fee ? Number(s.monthly_fee) : prev.monthlyFee,
            isFinancialResetDone_V6: s.is_financial_reset_done
          }));
        } else if (sErr) {
          console.warn('Supabase settings err:', sErr.message);
        }

        // 2. Users
        const { data: usersData, error: uErr } = await supabase.from('users').select('*');
        if (usersData && usersData.length > 0) {
          const loadedUsers = usersData.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            status: u.status,
            lastLogin: u.last_login,
            createdAt: u.created_at,
            avatar: u.avatar || u.avatar_url || ''
          }));
          setUsers(loadedUsers);

          // Synchronize currentUser from persisted session with freshly loaded Supabase users
          try {
            const stored = localStorage.getItem(AUTH_SESSION_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.userId || parsed.role)) {
                const targetRole = parsed.role || parsed.activeRole;
                const matchedUser = (parsed.userId && loadedUsers.find(u => u.id === parsed.userId))
                  || (targetRole && loadedUsers.find(u => u.role === targetRole));
                if (matchedUser) {
                  setCurrentUserState(matchedUser);
                }
              }
            }
          } catch (e) {
            console.error('Failed to sync auth session with Supabase users:', e);
          }
        } else if (uErr) {
          console.warn('Supabase users err:', uErr.message);
        }

        // 3. Members
        const { data: membersData, error: mErr } = await supabase.from('members').select('*, nominees(*)');
        if (membersData && membersData.length > 0) {
          membersColumnsRef.current = getTableColumns(membersData[0]);
          const firstMem = membersData[0];
          if (firstMem.nominees && Array.isArray(firstMem.nominees) && firstMem.nominees.length > 0) {
            nomineesColumnsRef.current = Object.keys(firstMem.nominees[0]);
          } else {
            // Fetch nominees columns separately if no members have nested nominees yet
            supabase.from('nominees').select('*').limit(1).then(({ data: nomData }) => {
              if (nomData && nomData.length > 0) {
                nomineesColumnsRef.current = Object.keys(nomData[0]);
              }
            });
          }
          setMembers(membersData.map(mapSupabaseMember));
        } else if (mErr) {
          console.warn('Supabase members err:', mErr.message);
        }

        // 4. Receipts (Support both 'receipts' and 'payment_receipts' tables)
        let { data: receiptsData, error: rErr } = await supabase.from('receipts').select('*');
        if ((!receiptsData || receiptsData.length === 0) && !rErr) {
          const { data: pReceiptsData } = await supabase.from('payment_receipts').select('*');
          if (pReceiptsData && pReceiptsData.length > 0) {
            receiptsData = pReceiptsData;
          }
        }
        if (receiptsData && receiptsData.length > 0) {
          setReceipts(receiptsData.map(mapSupabaseReceipt));
        } else if (rErr) {
          console.warn('Supabase receipts err:', rErr.message);
        }

        // 5. Incomes
        const { data: incomesData } = await supabase.from('incomes').select('*');
        if (incomesData && incomesData.length > 0) {
          setIncomes(incomesData.map(i => ({
            id: i.id,
            incomeId: i.income_id,
            date: i.date,
            category: i.category,
            description: i.description,
            amount: Number(i.amount),
            paymentMethod: i.payment_method,
            refNumber: i.ref_number,
            addedBy: i.added_by,
            createdAt: i.created_at
          })));
        }

        // 6. Expenses
        const { data: expensesData } = await supabase.from('expenses').select('*');
        if (expensesData && expensesData.length > 0) {
          setExpenses(expensesData.map(e => ({
            id: e.id,
            expenseId: e.expense_id,
            date: e.date,
            category: e.category,
            description: e.description,
            amount: Number(e.amount),
            paymentMethod: e.payment_method,
            refNumber: e.ref_number,
            approvedBy: e.approved_by,
            addedBy: e.added_by,
            status: e.status,
            createdAt: e.created_at
          })));
        }

        // 7. Shares
        const { data: sharesData } = await supabase.from('shares').select('*');
        if (sharesData && sharesData.length > 0) {
          setShares(sharesData.map(s => ({
            id: s.id,
            memberId: s.member_id,
            memberName: s.member_name,
            type: s.type,
            shareQty: s.share_qty,
            sharePrice: Number(s.share_price),
            totalAmount: Number(s.total_amount),
            date: s.date,
            certificateNo: s.certificate_no,
            approvedBy: s.approved_by,
            notes: s.notes,
            createdAt: s.created_at
          })));
        }

        // 8. Transactions
        const { data: txData } = await supabase.from('transactions').select('*');
        if (txData && txData.length > 0) {
          setTransactions(txData.map(t => ({
            id: t.id,
            transactionId: t.transaction_id,
            date: t.date,
            type: t.type,
            refId: t.ref_id,
            description: t.description,
            debit: Number(t.debit),
            credit: Number(t.credit),
            balance: Number(t.balance),
            user: t.user_name || 'System',
            createdAt: t.created_at
          })));
        }

        // 9. Monthly Dues
        const { data: duesData } = await supabase.from('monthly_dues').select('*');
        if (duesData && duesData.length > 0) {
          setMonthlyDues(duesData.map(d => ({
            id: d.id,
            memberId: d.member_id,
            memberName: d.member_name,
            mobile: d.mobile,
            monthYear: d.month_year,
            expectedAmount: Number(d.expected_amount),
            paidAmount: Number(d.paid_amount),
            dueAmount: Number(d.due_amount),
            status: d.status,
            lastPaymentDate: d.last_payment_date
          })));
        }

        // 10. Audit Logs
        const { data: auditData } = await supabase.from('audit_logs').select('*');
        if (auditData && auditData.length > 0) {
          setAuditLogs(auditData.map(a => ({
            id: a.id,
            userId: a.user_id,
            userName: a.user_name,
            action: a.action,
            details: a.details,
            timestamp: a.timestamp
          })));
        }

      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      } finally {
        setIsSupabaseLoading(false);
      }
    };
    
    fetchFromSupabase();
  }, []);

  // Supabase Realtime Subscription for automatic multi-panel synchronization (Super Admin <-> Accountant)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('app-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'receipts' }, async () => {
        const { data: recs } = await supabase.from('receipts').select('*');
        if (recs) setReceipts(recs.map(mapSupabaseReceipt));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, async () => {
        const { data: mems } = await supabase.from('members').select('*');
        if (mems) {
          if (mems.length > 0) {
            membersColumnsRef.current = getTableColumns(mems[0]);
          }
          setMembers(mems.map(mapSupabaseMember));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, async () => {
        const { data: txs } = await supabase.from('transactions').select('*');
        if (txs) {
          setTransactions(txs.map(t => ({
            id: t.id,
            transactionId: t.transaction_id,
            date: t.date,
            type: t.type,
            refId: t.ref_id,
            description: t.description,
            debit: Number(t.debit),
            credit: Number(t.credit),
            balance: Number(t.balance),
            user: t.user_name || 'System',
            createdAt: t.created_at
          })));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_dues' }, async () => {
        const { data: duesData } = await supabase.from('monthly_dues').select('*');
        if (duesData) {
          setMonthlyDues(duesData.map(d => ({
            id: d.id,
            memberId: String(d.member_id),
            memberName: d.member_name,
            mobile: d.mobile,
            monthYear: d.month_year,
            expectedAmount: Number(d.expected_amount),
            paidAmount: Number(d.paid_amount),
            dueAmount: Number(d.due_amount),
            status: d.status,
            lastPaymentDate: d.last_payment_date
          })));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, async () => {
        const { data: incomesData } = await supabase.from('incomes').select('*');
        if (incomesData) {
          setIncomes(incomesData.map(i => ({
            id: i.id,
            incomeId: i.income_id,
            date: i.date,
            category: i.category,
            description: i.description,
            amount: Number(i.amount),
            paymentMethod: i.payment_method,
            refNumber: i.ref_number,
            addedBy: i.added_by,
            createdAt: i.created_at
          })));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, async () => {
        const { data: expensesData } = await supabase.from('expenses').select('*');
        if (expensesData) {
          setExpenses(expensesData.map(e => ({
            id: e.id,
            expenseId: e.expense_id,
            date: e.date,
            category: e.category,
            description: e.description,
            amount: Number(e.amount),
            paymentMethod: e.payment_method,
            refNumber: e.ref_number,
            approvedBy: e.approved_by,
            addedBy: e.added_by,
            status: e.status,
            createdAt: e.created_at
          })));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Periodic polling every 4 seconds for instant multi-portal sync (Super Admin <-> Accountant)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const syncPollInterval = setInterval(async () => {
      try {
        const { data: recs } = await supabase.from('receipts').select('*');
        if (recs) setReceipts(recs.map(mapSupabaseReceipt));

        const { data: mems } = await supabase.from('members').select('*');
        if (mems) {
          if (mems.length > 0) {
            membersColumnsRef.current = getTableColumns(mems[0]);
          }
          setMembers(mems.map(mapSupabaseMember));
        }

        const { data: txs } = await supabase.from('transactions').select('*');
        if (txs) {
          setTransactions(txs.map(t => ({
            id: t.id,
            transactionId: t.transaction_id,
            date: t.date,
            type: t.type,
            refId: t.ref_id,
            description: t.description,
            debit: Number(t.debit),
            credit: Number(t.credit),
            balance: Number(t.balance),
            user: t.user_name || 'System',
            createdAt: t.created_at
          })));
        }
      } catch (e) {
        // silent polling failure catch
      }
    }, 4000);

    return () => clearInterval(syncPollInterval);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      const dataToSave = {
        settings,
        users,
        members,
        shares,
        receipts,
        incomes,
        expenses,
        fdrs,
        transactions,
        monthlyDues,
        notifications,
        auditLogs,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to sync to local storage:', e);
    }
  }, [settings, users, members, shares, receipts, incomes, expenses, fdrs, transactions, monthlyDues, notifications, auditLogs]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Translation helper
  const t = (key: keyof typeof translations['bn']): string => {
    return translations[language][key] || translations['bn'][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      showToast(language === 'bn' ? `ভূমিকা পরিবর্তন: ${translations['bn'][role]}` : `Role switched to ${translations['en'][role]}`, 'info');
    }
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now()}`,
      timestamp: language === 'bn' ? 'এইমাত্র' : 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast(t('markAllRead'), 'info');
  };

  const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATE', 'প্রতিষ্ঠান সেটিংস পরিবর্তন করা হয়েছে');
    showToast(t('successSaved'), 'success');
  };

  // Member Management CRUD
  const addMember = (memberData: Omit<Member, 'id' | 'memberNo' | 'createdAt' | 'updatedAt'>): Member => {
    const maxNo = members.reduce((max, m) => Math.max(max, m.memberNo || 0), 0);
    const newNo = maxNo + 1;
    const padded = String(newNo).padStart(4, '0');
    const newId = `${settings.memberIdPrefix || 'BB-'}${padded}`;
    const now = new Date().toISOString().split('T')[0];

    const newMember: Member = {
      ...memberData,
      id: newId,
      memberNo: newNo,
      totalShareValue: memberData.shareQty * (memberData.sharePrice || settings.defaultSharePrice),
      currentDeposit: memberData.openingBalance || 0,
      currentDue: memberData.currentDue || 0,
      createdAt: now,
      updatedAt: now,
    };

    setMembers(prev => [newMember, ...prev]);
    // Sync to Supabase
    if (isSupabaseConfigured()) {
      const firstNominee = newMember.nominees?.[0];
      const memberPayload: any = {
        id: newMember.id,
        member_no: newMember.memberNo,
        name_bn: newMember.nameBn,
        name_en: newMember.nameEn || '',
        father_name: newMember.fatherName || '',
        mother_name: newMember.motherName || '',
        spouse_name: newMember.spouseName || '',
        birth_date: newMember.dob || '1990-01-01',
        dob: newMember.dob || '1990-01-01', // Support both birth_date and dob columns
        gender: newMember.gender || 'male',
        nid: newMember.nid || '',
        birth_reg_no: newMember.birthRegNo || '',
        mobile: newMember.mobile,
        alt_mobile: newMember.altMobile || '',
        email: newMember.email || '',
        occupation: newMember.occupation || 'ব্যবসায়ী',
        present_address: newMember.presentAddress || 'বাউনিয়া, তুরাগ, ঢাকা',
        permanent_address: newMember.permanentAddress || 'বাউনিয়া, তুরাগ, ঢাকা',
        photo_url: newMember.photoUrl || '',
        photo_back_url: newMember.photoBackUrl || '',
        pin: newMember.pin || '',
        is_pin_set: newMember.isPinSet || false,
        join_date: newMember.joinDate || now,
        status: newMember.status || 'active',
        share_qty: newMember.shareQty || 1,
        share_price: newMember.sharePrice || 100000,
        total_share_value: newMember.totalShareValue || 100000,
        opening_balance: newMember.openingBalance || 0,
        notes: newMember.notes || '',
        created_at: newMember.createdAt,
        updated_at: newMember.updatedAt
      };

      // Support flat nominee columns if they exist in the members table
      if (firstNominee) {
        memberPayload.nominee_name = firstNominee.name || '';
        memberPayload.nominee_relation = firstNominee.relation || '';
        memberPayload.nominee_nid = firstNominee.nidBirthReg || '';
        memberPayload.nominee_nid_birth_reg = firstNominee.nidBirthReg || '';
        memberPayload.nominee_mobile = firstNominee.mobile || '';
        memberPayload.nominee_phone = firstNominee.mobile || '';
        memberPayload.nominee_contact = firstNominee.mobile || '';
        memberPayload.nominee_share_percent = Number(firstNominee.percentage) || 100;
        memberPayload.nominee_percentage = Number(firstNominee.percentage) || 100;
      }

      // DYNAMIC COLUMN FILTERING FOR MEMBERS TABLE INSERTION
      if (membersColumnsRef.current.length > 0) {
        Object.keys(memberPayload).forEach(key => {
          if (!membersColumnsRef.current.includes(key)) {
            delete memberPayload[key];
          }
        });
      }

      supabase.from('members').insert([memberPayload]).then(async ({ error }) => {
        if (error) {
          console.error('Supabase insert member error:', error);
        } else {
          // Insert Nominees into nominees table
          if (newMember.nominees && newMember.nominees.length > 0) {
            const nomineeRows = newMember.nominees.map(n => {
              const rowPayload: any = {
                id: n.id && !n.id.startsWith('NOM-') ? n.id : `NOM-${newMember.id}-${Math.random().toString(36).substring(2, 7)}`,
                member_id: newMember.id,
                name: n.name || '',
                relation: n.relation || 'নমিনী',
                nid_birth_reg: n.nidBirthReg || '',
                mobile: n.mobile || '',
                address: n.address || '',
                percentage: Number(n.percentage) || 0,
                photo_url: n.photoUrl || null,
                created_at: new Date().toISOString()
              };

              // DYNAMIC COLUMN FILTERING FOR NOMINEES TABLE INSERTION
              if (nomineesColumnsRef.current.length > 0) {
                Object.keys(rowPayload).forEach(key => {
                  if (!nomineesColumnsRef.current.includes(key)) {
                    delete rowPayload[key];
                  }
                });
              }

              return rowPayload;
            });

            const { error: nomErr } = await supabase.from('nominees').insert(nomineeRows);
            if (nomErr) console.error('Supabase insert nominees error:', nomErr);
          }
          refreshMembers();
        }
      });
    }

    // Create Initial Share Transaction
    if (newMember.shareQty > 0) {
      const certNo = `BB-CERT-${new Date().getFullYear()}-${padded}`;
      const newShareTx: ShareTransaction = {
        id: `STX-${Date.now()}`,
        memberId: newId,
        memberName: newMember.nameBn,
        type: 'initial',
        shareQty: newMember.shareQty,
        sharePrice: newMember.sharePrice,
        totalAmount: newMember.totalShareValue,
        date: newMember.joinDate || now,
        certificateNo: certNo,
        approvedBy: currentUser.name,
        notes: 'নতুন সদস্য প্রাথমিক শেয়ার নিবন্ধন',
        createdAt: now,
      };
      setShares(prev => [newShareTx, ...prev]);
    }

    // Add Audit and Notification
    addAuditLog('MEMBER_REGISTER', `নতুন সদস্য যোগ: ${newMember.nameBn} (${newId})`);
    addNotification({
      titleBn: 'নতুন সদস্য নিবন্ধিত',
      titleEn: 'New Member Registered',
      messageBn: `${newMember.nameBn} (${newId}) বাউনিয়া বিল্ডার্সে যোগদান করেছেন।`,
      messageEn: `${newMember.nameEn || newMember.nameBn} (${newId}) joined Baunia Builders.`,
      type: 'member',
      isRead: false,
      linkTab: 'members',
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(t('successSaved'), 'success');
    return newMember;
  };

  const updateMember = (id: string, memberData: Partial<Member>) => {
    const now = new Date().toISOString().split('T')[0];
    setMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const shareQty = memberData.shareQty !== undefined ? memberData.shareQty : m.shareQty;
          const sharePrice = memberData.sharePrice !== undefined ? memberData.sharePrice : m.sharePrice;
          const totalShareValue = shareQty * sharePrice;
          return {
            ...m,
            ...memberData,
            totalShareValue,
            updatedAt: now,
          };
        }
        return m;
      })
    );

    if (isSupabaseConfigured()) {
      const supabasePayload: any = {};
      if (memberData.nameBn !== undefined) supabasePayload.name_bn = memberData.nameBn;
      if (memberData.nameEn !== undefined) supabasePayload.name_en = memberData.nameEn;
      if (memberData.fatherName !== undefined) supabasePayload.father_name = memberData.fatherName;
      if (memberData.motherName !== undefined) supabasePayload.mother_name = memberData.motherName;
      if (memberData.spouseName !== undefined) supabasePayload.spouse_name = memberData.spouseName;
      if (memberData.dob !== undefined) {
        supabasePayload.birth_date = memberData.dob;
        supabasePayload.dob = memberData.dob; // Support both birth_date and dob columns
      }
      if (memberData.gender !== undefined) supabasePayload.gender = memberData.gender;
      if (memberData.nid !== undefined) supabasePayload.nid = memberData.nid;
      if (memberData.birthRegNo !== undefined) supabasePayload.birth_reg_no = memberData.birthRegNo;
      if (memberData.mobile !== undefined) supabasePayload.mobile = memberData.mobile;
      if (memberData.altMobile !== undefined) supabasePayload.alt_mobile = memberData.altMobile;
      if (memberData.email !== undefined) supabasePayload.email = memberData.email;
      if (memberData.occupation !== undefined) supabasePayload.occupation = memberData.occupation;
      if (memberData.presentAddress !== undefined) supabasePayload.present_address = memberData.presentAddress;
      if (memberData.permanentAddress !== undefined) supabasePayload.permanent_address = memberData.permanentAddress;
      if (memberData.photoUrl !== undefined) supabasePayload.photo_url = memberData.photoUrl;
      if (memberData.photoBackUrl !== undefined) supabasePayload.photo_back_url = memberData.photoBackUrl;
      if (memberData.pin !== undefined) supabasePayload.pin = memberData.pin;
      if (memberData.isPinSet !== undefined) supabasePayload.is_pin_set = memberData.isPinSet;
      if (memberData.joinDate !== undefined) supabasePayload.join_date = memberData.joinDate;
      if (memberData.status !== undefined) supabasePayload.status = memberData.status;
      if (memberData.shareQty !== undefined) supabasePayload.share_qty = memberData.shareQty;
      if (memberData.sharePrice !== undefined) supabasePayload.share_price = memberData.sharePrice;
      if (memberData.openingBalance !== undefined) supabasePayload.opening_balance = memberData.openingBalance;
      if (memberData.currentDue !== undefined) supabasePayload.current_due = memberData.currentDue;
      if (memberData.notes !== undefined) supabasePayload.notes = memberData.notes;

      // Support flat nominee columns if they exist in the members table
      if (memberData.nominees !== undefined) {
        const firstNominee = memberData.nominees?.[0];
        if (firstNominee) {
          supabasePayload.nominee_name = firstNominee.name || '';
          supabasePayload.nominee_relation = firstNominee.relation || '';
          supabasePayload.nominee_nid = firstNominee.nidBirthReg || '';
          supabasePayload.nominee_nid_birth_reg = firstNominee.nidBirthReg || '';
          supabasePayload.nominee_mobile = firstNominee.mobile || '';
          supabasePayload.nominee_phone = firstNominee.mobile || '';
          supabasePayload.nominee_contact = firstNominee.mobile || '';
          supabasePayload.nominee_share_percent = Number(firstNominee.percentage) || 100;
          supabasePayload.nominee_percentage = Number(firstNominee.percentage) || 100;
        }
      }

      supabasePayload.updated_at = new Date().toISOString();

      // DYNAMIC COLUMN FILTERING: Prevent errors if database has fewer columns
      if (membersColumnsRef.current.length > 0) {
        Object.keys(supabasePayload).forEach(key => {
          if (!membersColumnsRef.current.includes(key)) {
            delete supabasePayload[key];
          }
        });
      }

      supabase.from('members').update(supabasePayload).eq('id', id).then(async ({ error }) => {
        if (error) {
          console.error('Supabase update member error:', error);
          showToast(`ডাটাবেজ আপডেট ব্যর্থ হয়েছে: ${error.message} (${error.code || ''})`, 'error');
        } else {
          showToast(t('successSaved'), 'success');
        }

        // Sync Nominees table in Supabase
        if (memberData.nominees !== undefined) {
          try {
            await supabase.from('nominees').delete().eq('member_id', id);
            if (memberData.nominees.length > 0) {
              const nomineeRows = memberData.nominees.map(n => {
                const rowPayload: any = {
                  id: n.id && !n.id.startsWith('NOM-') ? n.id : `NOM-${id}-${Math.random().toString(36).substring(2, 7)}`,
                  member_id: id,
                  name: n.name || '',
                  relation: n.relation || 'নমিনী',
                  nid_birth_reg: n.nidBirthReg || '',
                  mobile: n.mobile || '',
                  address: n.address || '',
                  percentage: Number(n.percentage) || 0,
                  photo_url: n.photoUrl || null,
                  created_at: new Date().toISOString()
                };
                
                // DYNAMIC NOMINEE COLUMN FILTERING
                if (nomineesColumnsRef.current.length > 0) {
                  Object.keys(rowPayload).forEach(key => {
                    if (!nomineesColumnsRef.current.includes(key)) {
                      delete rowPayload[key];
                    }
                  });
                }
                
                return rowPayload;
              });

              const { error: nomErr } = await supabase.from('nominees').insert(nomineeRows);
              if (nomErr) console.error('Supabase insert nominees error:', nomErr);
            }
          } catch (e) {
            console.error('Error updating nominees in Supabase:', e);
          }
        }
        refreshMembers();
      });
    } else {
      showToast(t('successSaved'), 'success');
    }

    addAuditLog('MEMBER_UPDATE', `সদস্য তথ্য আপডেট: ${id}`);
  };

  const deleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    if (isSupabaseConfigured()) {
      supabase.from('nominees').delete().eq('member_id', id).then(() => {
        supabase.from('members').delete().eq('id', id).then(({error}) => {
          if (error) console.error('Supabase delete member err:', error);
          refreshMembers();
        });
      });
    }
    addAuditLog('MEMBER_DELETE', `সদস্য মুছে ফেলা হয়েছে: ${target?.nameBn || id}`);
    showToast(t('successDeleted'), 'info');
  };

  const importMembers = (newMembers: Omit<Member, 'id' | 'memberNo' | 'createdAt' | 'updatedAt'>[]): number => {
    let currentMax = members.reduce((max, m) => Math.max(max, m.memberNo || 0), 0);
    const now = new Date().toISOString().split('T')[0];
    const created: Member[] = [];

    newMembers.forEach(m => {
      currentMax++;
      const padded = String(currentMax).padStart(4, '0');
      const id = `${settings.memberIdPrefix || 'BB-'}${padded}`;
      created.push({
        ...m,
        id,
        memberNo: currentMax,
        totalShareValue: m.shareQty * (m.sharePrice || settings.defaultSharePrice),
        currentDeposit: m.openingBalance || 0,
        currentDue: m.currentDue || 0,
        createdAt: now,
        updatedAt: now,
      });
    });

    setMembers(prev => [...created, ...prev]);
    addAuditLog('MEMBER_IMPORT', `${created.length} জন সদস্য বাল্ক ইমপোর্ট করা হয়েছে`);
    confetti({ particleCount: 80, spread: 80 });
    showToast(`${created.length} জন সদস্য সফলভাবে ইমপোর্ট করা হয়েছে!`, 'success');
    return created.length;
  };

  // Share Management
  const addShareTransaction = (tx: Omit<ShareTransaction, 'id' | 'createdAt'>) => {
    const id = `STX-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newTx: ShareTransaction = {
      ...tx,
      id,
      createdAt: now,
    };
    setShares(prev => [newTx, ...prev]);
    supabase.from('shares').insert([{
      id: newTx.id,
      member_id: newTx.memberId,
      member_name: newTx.memberName,
      type: newTx.type,
      share_qty: newTx.shareQty,
      share_price: newTx.sharePrice,
      total_amount: newTx.totalAmount,
      date: newTx.date,
      certificate_no: newTx.certificateNo,
      approved_by: newTx.approvedBy,
      notes: newTx.notes,
      created_at: newTx.createdAt
    }]).then(({error}) => { if(error) console.error('Supabase shares insert err:', error); });

    // Update target member share count
    setMembers(prev =>
      prev.map(m => {
        if (m.id === tx.memberId) {
          const newQty = m.shareQty + tx.shareQty;
          return {
            ...m,
            shareQty: newQty,
            totalShareValue: newQty * m.sharePrice,
          };
        }
        return m;
      })
    );

    addAuditLog('SHARE_TRANSACTION', `শেয়ার লেনদেন: ${tx.memberName} (${tx.shareQty} টি শেয়ার)`);
    showToast(t('successSaved'), 'success');
  };

  // Payment Collection & Receipt
  const collectPayment = (paymentData: {
    memberId: string;
    memberName?: string;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentMonth?: string;
    monthName?: string;
    paymentMonths?: string[];
    monthNames?: string[];
    monthBreakdown?: any[];
    isExtraMonth?: boolean;
    baseAmount?: number;
    extraAmount?: number;
    transactionRef?: string;
    refNumber?: string;
    notes?: string;
    remarks?: string;
    date?: string;
    collectorName?: string;
    previousDue?: number;
    remainingDue?: number;
  }): PaymentReceipt => {
    const member = members.find(m => m.id === paymentData.memberId);
    const date = paymentData.date || new Date().toISOString().split('T')[0];
    const receiptCount = receipts.length + 1;
    const receiptNo = `${settings.receiptPrefix || 'BBR-2026-'}${String(receiptCount).padStart(6, '0')}`;

    const amountInWordsBn = numberToWordsBn(paymentData.amount);
    const amountInWordsEn = numberToWordsEn(paymentData.amount);

    const prevDue = paymentData.previousDue !== undefined ? paymentData.previousDue : (member?.currentDue || 0);
    const remDue = paymentData.remainingDue !== undefined ? paymentData.remainingDue : Math.max(0, prevDue - paymentData.amount);

    const newReceipt: PaymentReceipt = {
      id: `RCP-${Date.now()}`,
      receiptNo,
      date,
      memberId: paymentData.memberId,
      memberName: paymentData.memberName || member?.nameBn || 'অজ্ঞাত সদস্য',
      memberMobile: member?.mobile || '',
      paymentType: paymentData.paymentType,
      paymentMonth: paymentData.paymentMonth,
      monthName: paymentData.monthName,
      paymentMonths: paymentData.paymentMonths,
      monthNames: paymentData.monthNames,
      monthBreakdown: paymentData.monthBreakdown,
      isExtraMonth: paymentData.isExtraMonth,
      baseAmount: paymentData.baseAmount,
      extraAmount: paymentData.extraAmount,
      amount: paymentData.amount,
      amountInWordsBn,
      amountInWordsEn,
      paymentMethod: paymentData.paymentMethod,
      refNumber: paymentData.refNumber || paymentData.transactionRef,
      transactionRef: paymentData.transactionRef || paymentData.refNumber,
      notes: paymentData.notes || paymentData.remarks,
      previousDue: prevDue,
      remainingDue: remDue,
      collectorId: currentUser.id,
      collectorName: paymentData.collectorName || currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setReceipts(prev => [newReceipt, ...prev]);
    // Sync to Supabase
    if (isSupabaseConfigured()) {
      supabase.from('receipts').insert([{
        id: newReceipt.id,
        receipt_no: newReceipt.receiptNo,
        member_id: newReceipt.memberId,
        member_name: newReceipt.memberName,
        amount: newReceipt.amount,
        date: newReceipt.date,
        type: newReceipt.paymentType,
        payment_type: newReceipt.paymentType,
        payment_month: newReceipt.paymentMonth || null,
        payment_months: newReceipt.paymentMonths ? JSON.stringify(newReceipt.paymentMonths) : null,
        month_breakdown: newReceipt.monthBreakdown ? JSON.stringify(newReceipt.monthBreakdown) : null,
        payment_method: newReceipt.paymentMethod,
        previous_due: newReceipt.previousDue,
        remaining_due: newReceipt.remainingDue,
        status: 'active',
        collected_by: newReceipt.collectorName || currentUser.name,
        notes: newReceipt.notes,
        created_at: newReceipt.createdAt || new Date().toISOString()
      }]).then(({error}) => {
        if(error) console.error('Supabase insert receipt error:', error);
      });
    }

    // Update member's deposit and reduce due
    setMembers(prev =>
      prev.map(m => {
        if (m.id === paymentData.memberId) {
          const newDeposit = m.currentDeposit + paymentData.amount;
          const newDue = Math.max(0, m.currentDue - (paymentData.paymentType === 'previous_due' || paymentData.paymentType === 'monthly_fee' ? paymentData.amount : 0));
          
          if (isSupabaseConfigured()) {
            supabase.from('members').update({
              opening_balance: newDeposit,
              current_due: newDue,
              updated_at: new Date().toISOString()
            }).eq('id', m.id).then(({error}) => {
              if (error) console.error('Supabase update member deposit error:', error);
            });
          }

          return {
            ...m,
            currentDeposit: newDeposit,
            currentDue: newDue,
          };
        }
        return m;
      })
    );

    // Update financial ledger
    const lastBalance = transactions.length > 0 ? transactions[0].balance : 500000;
    const newBalance = lastBalance + paymentData.amount;
    const txId = `TXN-2026-${String(transactions.length + 1).padStart(4, '0')}`;
    const descMonth = paymentData.monthName || (paymentData.paymentMonth ? ` (${paymentData.paymentMonth})` : '');
    const newTx: FinancialTransaction = {
      id: `TXN-${Date.now()}`,
      transactionId: txId,
      date,
      type: 'member_payment',
      refId: receiptNo,
      description: `${translations['bn'][paymentData.paymentType] || 'মাসিক চাঁদা'}${descMonth}: ${member?.nameBn} (${member?.id})`,
      debit: 0,
      credit: paymentData.amount,
      balance: newBalance,
      user: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
    if (isSupabaseConfigured()) {
      supabase.from('transactions').insert([{
        id: newTx.id,
        transaction_id: newTx.transactionId,
        date: newTx.date,
        type: newTx.type,
        ref_id: newTx.refId,
        description: newTx.description,
        debit: newTx.debit,
        credit: newTx.credit,
        balance: newTx.balance,
        user_name: newTx.user,
        created_at: newTx.createdAt
      }]).then(({error}) => {
        if (error) console.error('Supabase insert transaction error:', error);
      });
    }

    // Trigger celebratory confetti and log
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    addAuditLog('COLLECT_PAYMENT', `টাকা কালেকশন: রশিদ ${receiptNo}, পরিমাণ: ৳ ${paymentData.amount}, সদস্য: ${member?.nameBn}`);
    addNotification({
      titleBn: 'নতুন রসিদ ইস্যু হয়েছে',
      titleEn: 'Money Receipt Generated',
      messageBn: `${member?.nameBn} এর ৳ ${paymentData.amount} এর রসিদ (${receiptNo}) প্রস্তুত।`,
      messageEn: `Receipt ${receiptNo} issued for ${member?.nameEn || member?.nameBn} (৳ ${paymentData.amount}).`,
      type: 'payment',
      isRead: false,
      linkTab: 'receipts',
    });

    showToast(`রশিদ নং ${receiptNo} সফলভাবে তৈরি হয়েছে!`, 'success');
    return newReceipt;
  };

  const deleteReceipt = (id: string) => {
    const target = receipts.find(r => r.id === id);
    if (target) {
      // Revert member balance & due
      setMembers(prev => prev.map(m => {
        if (m.id === target.memberId) {
          const newDeposit = Math.max(0, m.currentDeposit - target.amount);
          const isDueRelated = target.paymentType === 'previous_due' || target.paymentType === 'monthly_fee';
          const newDue = m.currentDue + (isDueRelated ? target.amount : 0);

          if (isSupabaseConfigured()) {
            supabase.from('members').update({
              opening_balance: newDeposit,
              current_due: newDue,
              updated_at: new Date().toISOString()
            }).eq('id', m.id).then(({ error }) => {
              if (error) console.error('Supabase update member deposit error:', error);
            });
          }

          return {
            ...m,
            currentDeposit: newDeposit,
            currentDue: newDue,
          };
        }
        return m;
      }));

      // Revert financial transaction ledger
      setTransactions(prev => prev.filter(t => t.refId !== target.receiptNo));
      if (isSupabaseConfigured()) {
        supabase.from('transactions').delete().eq('ref_id', target.receiptNo).then(({ error }) => {
          if (error) console.error('Supabase delete transaction error:', error);
        });
      }
    }

    setReceipts(prev => prev.filter(r => r.id !== id));
    if (isSupabaseConfigured()) {
      supabase.from('receipts').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete receipt err:', error);
      });
    }

    addAuditLog('RECEIPT_DELETE', `ভুল রসিদ বাতিল করা হয়েছে: ${target?.receiptNo || id} (পরিমাণ: ৳ ${target?.amount || 0})`);
    showToast(`রশিদ নং ${target?.receiptNo || id} সফলভাবে মুছে ফেলা হয়েছে!`, 'warning');
  };

  // Income Management
  const addIncome = (income: Omit<Income, 'id' | 'incomeId' | 'createdAt'>) => {
    const incCount = incomes.length + 1;
    const incomeId = `INC-${String(incCount).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newInc: Income = {
      ...income,
      id: `INC-${Date.now()}`,
      incomeId,
      createdAt: now,
    };
    setIncomes(prev => [newInc, ...prev]);
    supabase.from('incomes').insert([{
      id: newInc.id,
      income_id: newInc.incomeId,
      date: newInc.date,
      category: newInc.category,
      description: newInc.description,
      amount: newInc.amount,
      payment_method: newInc.paymentMethod,
      ref_number: newInc.refNumber,
      added_by: newInc.addedBy,
      created_at: newInc.createdAt
    }]).then(({error}) => { if(error) console.error('Supabase income insert err:', error); });

    // Ledger
    const lastBalance = transactions.length > 0 ? transactions[0].balance : 500000;
    const newBalance = lastBalance + income.amount;
    const txId = `TXN-2026-${String(transactions.length + 1).padStart(4, '0')}`;
    const newTx: FinancialTransaction = {
      id: `TXN-${Date.now()}`,
      transactionId: txId,
      date: income.date,
      type: 'income',
      refId: incomeId,
      description: income.description,
      debit: 0,
      credit: income.amount,
      balance: newBalance,
      user: currentUser.name,
      createdAt: now,
    };
    setTransactions(prev => [newTx, ...prev]);

    addAuditLog('INCOME_ADD', `আয় যোগ: ${incomeId}, পরিমাণ: ৳ ${income.amount}`);
    showToast(t('successSaved'), 'success');
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    setIncomes(prev => prev.map(inc => (inc.id === id ? { ...inc, ...updates } : inc)));
    showToast(t('successSaved'), 'success');
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(inc => inc.id !== id));
    addAuditLog('INCOME_DELETE', `আয় রেকর্ড মুছে ফেলা হয়েছে: ${id}`);
    showToast(t('successDeleted'), 'info');
  };

  // Expense Management
  const addExpense = (expense: Omit<Expense, 'id' | 'expenseId' | 'createdAt'>) => {
    const expCount = expenses.length + 1;
    const expenseId = `EXP-${String(expCount).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newExp: Expense = {
      ...expense,
      id: `EXP-${Date.now()}`,
      expenseId,
      createdAt: now,
    };
    setExpenses(prev => [newExp, ...prev]);
    supabase.from('expenses').insert([{
      id: newExp.id,
      expense_id: newExp.expenseId,
      date: newExp.date,
      category: newExp.category,
      description: newExp.description,
      amount: newExp.amount,
      payment_method: newExp.paymentMethod,
      ref_number: newExp.refNumber,
      approved_by: newExp.approvedBy,
      added_by: newExp.addedBy,
      status: newExp.status,
      created_at: newExp.createdAt
    }]).then(({error}) => { if(error) console.error('Supabase expense insert err:', error); });

    if (expense.status === 'approved') {
      const lastBalance = transactions.length > 0 ? transactions[0].balance : 500000;
      const newBalance = lastBalance - expense.amount;
      const txId = `TXN-2026-${String(transactions.length + 1).padStart(4, '0')}`;
      const newTx: FinancialTransaction = {
        id: `TXN-${Date.now()}`,
        transactionId: txId,
        date: expense.date,
        type: 'expense',
        refId: expenseId,
        description: expense.description,
        debit: expense.amount,
        credit: 0,
        balance: newBalance,
        user: currentUser.name,
        createdAt: now,
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    addAuditLog('EXPENSE_ADD', `ব্যয় যোগ: ${expenseId}, পরিমাণ: ৳ ${expense.amount}`);
    showToast(t('successSaved'), 'success');
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp)));
    showToast(t('successSaved'), 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    addAuditLog('EXPENSE_DELETE', `ব্যয় মুছে ফেলা হয়েছে: ${id}`);
    showToast(t('successDeleted'), 'info');
  };

  const addFdr = (fdrData: Omit<FdrItem, 'id' | 'fdrNo' | 'createdAt'>) => {
    const id = `FDR-${Date.now()}`;
    const fdrNo = `FDR-2026-${String(fdrs.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newFdr: FdrItem = {
      ...fdrData,
      id,
      fdrNo,
      addedBy: currentUser.name,
      createdAt: now,
    };
    setFdrs(prev => [newFdr, ...prev]);
    addAuditLog('FDR_ADD', `FDR তৈরি: ${fdrNo}, পরিমাণ: ৳ ${fdrData.amount}`);
    showToast(language === 'bn' ? 'FDR সফলভাবে তৈরি করা হয়েছে' : 'FDR created successfully', 'success');
  };

  const deleteFdr = (id: string) => {
    const target = fdrs.find(f => f.id === id);
    setFdrs(prev => prev.filter(f => f.id !== id));
    if (target) {
      addAuditLog('FDR_DELETE', `FDR মুছে ফেলা হয়েছে: ${target.fdrNo}`);
    }
    showToast(language === 'bn' ? 'FDR মুছে ফেলা হয়েছে' : 'FDR deleted', 'info');
  };

  const approveExpense = (id: string) => {
    setExpenses(prev =>
      prev.map(exp => {
        if (exp.id === id) {
          return {
            ...exp,
            status: 'approved',
            approvedBy: currentUser.name,
          };
        }
        return exp;
      })
    );
    showToast('ব্যয় সফলভাবে অনুমোদিত হয়েছে!', 'success');
  };

  // Due Collection
  const payDue = (dueId: string, amount: number, method: PaymentMethod) => {
    const dueItem = monthlyDues.find(d => d.id === dueId);
    if (!dueItem) return;

    collectPayment({
      memberId: dueItem.memberId,
      paymentType: 'previous_due',
      amount,
      paymentMethod: method,
      notes: `${dueItem.monthYear} বকেয়া পরিশোধ`,
    });

    setMonthlyDues(prev =>
      prev.map(d => {
        if (d.id === dueId) {
          const newPaid = d.paidAmount + amount;
          const newDue = Math.max(0, d.dueAmount - amount);
          return {
            ...d,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newDue === 0 ? 'paid' : 'partial',
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return d;
      })
    );
  };

  // User Management
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    supabase.from('users').insert([{
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.createdAt
    }]).then(({error}) => { if(error) console.error('Supabase user insert err:', error); });
    addAuditLog('USER_ADD', `ইউজার যোগ: ${newUser.name} (${newUser.role})`);
    showToast(t('successSaved'), 'success');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser.id === id) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUserState(updatedUser);
      try {
        const stored = localStorage.getItem(AUTH_SESSION_KEY);
        const isAuth = stored ? JSON.parse(stored).isAuthenticated : isAuthenticated;
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
          isAuthenticated: isAuth,
          userId: updatedUser.id,
          role: updatedUser.role,
          user: updatedUser
        }));
      } catch (e) {}
    }

    if (isSupabaseConfigured()) {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.role !== undefined) payload.role = updates.role;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.avatar !== undefined) payload.avatar = updates.avatar;

      supabase.from('users').update(payload).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase user update err:', error);
      });
    }

    addAuditLog('USER_UPDATE', `ইউজার তথ্য আপডেট: ${id}`);
    showToast(t('successSaved'), 'success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('USER_DELETE', `ইউজার মুছে ফেলা হয়েছে: ${id}`);
    showToast(t('successDeleted'), 'info');
  };

  // Clear & Reset operations

  const syncAllDataToSupabase = async (): Promise<{ success: boolean; message: string; count: number }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'সুপাবেজ URL এবং Anon Key সেটিংস থেকে দেওয়া নেই!', count: 0 };
    }
    let totalCount = 0;
    const errors: string[] = [];

    // 1. Members
    if (members.length > 0) {
      try {
        const memberPayload = members.map(m => ({
          id: m.id,
          member_no: m.memberNo,
          name_bn: m.nameBn,
          name_en: m.nameEn || '',
          father_name: m.fatherName || '',
          mother_name: m.motherName || '',
          spouse_name: m.spouseName || '',
          birth_date: m.dob || '',
          gender: m.gender || 'male',
          nid: m.nid || '',
          birth_reg_no: m.birthRegNo || '',
          mobile: m.mobile || '',
          alt_mobile: m.altMobile || '',
          occupation: m.occupation || '',
          present_address: m.presentAddress || '',
          permanent_address: m.permanentAddress || '',
          join_date: m.joinDate || new Date().toISOString().split('T')[0],
          status: m.status || 'active',
          share_qty: m.shareQty || 1,
          opening_balance: m.openingBalance || 0,
          current_due: m.currentDue !== undefined ? m.currentDue : ((m.shareQty || 1) * 25000),
          created_at: m.createdAt || new Date().toISOString(),
          updated_at: m.updatedAt || new Date().toISOString()
        }));
        const { error: mErr } = await supabase.from('members').upsert(memberPayload);
        if (mErr) {
          errors.push(`সদস্য: ${mErr.message}`);
        } else {
          totalCount += members.length;
          // Sync all nominees
          const allNomineeRows: any[] = [];
          members.forEach(m => {
            if (m.nominees && m.nominees.length > 0) {
              m.nominees.forEach((n, idx) => {
                allNomineeRows.push({
                  id: n.id && !n.id.startsWith('NOM-') ? n.id : `NOM-${m.id}-${idx + 1}`,
                  member_id: m.id,
                  name: n.name || '',
                  relation: n.relation || 'নমিনী',
                  nid_birth_reg: n.nidBirthReg || '',
                  mobile: n.mobile || '',
                  address: n.address || '',
                  percentage: Number(n.percentage) || 0,
                  photo_url: n.photoUrl || null,
                  created_at: new Date().toISOString()
                });
              });
            }
          });
          if (allNomineeRows.length > 0) {
            const { error: nomErr } = await supabase.from('nominees').upsert(allNomineeRows);
            if (nomErr) errors.push(`নমিনী: ${nomErr.message}`);
          }
        }
      } catch (err: any) {
        errors.push(`সদস্য: ${err.message}`);
      }
    }

    // 2. Settings (soft sync)
    if (settings) {
      try {
        const { error: sErr } = await supabase.from('settings').upsert([{
          id: settings.id || 'default',
          name_bn: settings.orgNameBn,
          name_en: settings.orgNameEn,
          president_name: settings.presidentName,
          secretary_name: settings.secretaryName,
          treasurer_name: settings.treasurerName,
          share_price: settings.defaultSharePrice,
          monthly_fee: settings.defaultMonthlyFee,
          is_financial_reset_done: true,
          updated_at: new Date().toISOString()
        }]);
        if (sErr) errors.push(`সেটিংস: ${sErr.message}`);
      } catch (err: any) {
        errors.push(`সেটিংস: ${err.message}`);
      }
    }

    // 3. Receipts
    if (receipts.length > 0) {
      try {
        const receiptPayload = receipts.map(r => ({
          id: r.id,
          receipt_no: r.receiptNo,
          member_id: r.memberId,
          member_name: r.memberName,
          amount: r.amount,
          date: r.date,
          type: r.paymentType || r.type || 'monthly_fee',
          payment_type: r.paymentType || r.type || 'monthly_fee',
          payment_month: r.paymentMonth || null,
          payment_months: r.paymentMonths ? JSON.stringify(r.paymentMonths) : null,
          month_breakdown: r.monthBreakdown ? JSON.stringify(r.monthBreakdown) : null,
          payment_method: r.paymentMethod,
          previous_due: r.previousDue !== undefined ? r.previousDue : null,
          remaining_due: r.remainingDue !== undefined ? r.remainingDue : null,
          status: r.status || 'active',
          collected_by: r.collectorName || r.collectedBy || 'Admin',
          notes: r.notes || r.remarks || '',
          created_at: r.createdAt || new Date().toISOString()
        }));
        const { error: rErr } = await supabase.from('receipts').upsert(receiptPayload);
        if (rErr) errors.push(`রশিদ: ${rErr.message}`);
        else totalCount += receipts.length;
      } catch (err: any) {
        errors.push(`রশিদ: ${err.message}`);
      }
    }

    // 4. Incomes
    if (incomes.length > 0) {
      try {
        const incomePayload = incomes.map(i => ({
          id: i.id,
          income_id: i.incomeId,
          date: i.date,
          category: i.category,
          description: i.description,
          amount: i.amount,
          payment_method: i.paymentMethod,
          ref_number: i.refNumber || '',
          added_by: i.addedBy,
          created_at: i.createdAt
        }));
        const { error: iErr } = await supabase.from('incomes').upsert(incomePayload);
        if (iErr) errors.push(`আয়: ${iErr.message}`);
        else totalCount += incomes.length;
      } catch (err: any) {
        errors.push(`আয়: ${err.message}`);
      }
    }

    // 5. Expenses
    if (expenses.length > 0) {
      try {
        const expensePayload = expenses.map(e => ({
          id: e.id,
          expense_id: e.expenseId,
          date: e.date,
          category: e.category,
          description: e.description,
          amount: e.amount,
          payment_method: e.paymentMethod,
          ref_number: e.refNumber || '',
          approved_by: e.approvedBy || '',
          added_by: e.addedBy,
          status: e.status,
          created_at: e.createdAt
        }));
        const { error: eErr } = await supabase.from('expenses').upsert(expensePayload);
        if (eErr) errors.push(`ব্যয়: ${eErr.message}`);
        else totalCount += expenses.length;
      } catch (err: any) {
        errors.push(`ব্যয়: ${err.message}`);
      }
    }

    // 6. Shares
    if (shares.length > 0) {
      try {
        const sharePayload = shares.map(s => ({
          id: s.id,
          member_id: s.memberId,
          member_name: s.memberName,
          type: s.type,
          share_qty: s.shareQty,
          share_price: s.sharePrice,
          total_amount: s.totalAmount,
          date: s.date,
          certificate_no: s.certificateNo || '',
          approved_by: s.approvedBy || '',
          notes: s.notes || '',
          created_at: s.createdAt
        }));
        const { error: shErr } = await supabase.from('shares').upsert(sharePayload);
        if (shErr) errors.push(`শেয়ার: ${shErr.message}`);
        else totalCount += shares.length;
      } catch (err: any) {
        errors.push(`শেয়ার: ${err.message}`);
      }
    }

    // 7. Users
    if (users.length > 0) {
      try {
        const userPayload = users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status,
          avatar: u.avatar || '',
          created_at: u.createdAt
        }));
        const { error: uErr } = await supabase.from('users').upsert(userPayload);
        if (uErr) errors.push(`ইউজার: ${uErr.message}`);
        else totalCount += users.length;
      } catch (err: any) {
        errors.push(`ইউজার: ${err.message}`);
      }
    }

    if (errors.length > 0) {
      return { 
        success: false, 
        message: `সমস্যা: ${errors.join(' | ')}. মোট ${totalCount}টি তথ্য আপলোড হয়েছে।`, 
        count: totalCount 
      };
    }

    return { success: true, message: `সফলভাবে মোট ${totalCount}টি রেকর্ড সুপাবেজে সিঙ্ক/আপলোড হয়েছে!`, count: totalCount };
  };

  const reimport96MembersToSupabase = async (): Promise<{ success: boolean; message: string; count: number }> => {
    const fresh96 = generateMembersFromRaw();
    setMembers(fresh96);
    
    if (!isSupabaseConfigured()) {
      showToast(language === 'bn' ? 'স্থানীয়ভাবে ৯৬ জন সদস্য রি-লোড করা হয়েছে (সুপাবেজ সংযোগ নেই)' : '96 members reloaded locally', 'info');
      return { success: true, message: 'স্থানীয়ভাবে ৯৬ জন সদস্য রি-লোড করা হয়েছে', count: 96 };
    }

    try {
      const memberPayload = fresh96.map(m => ({
        id: m.id,
        member_no: m.memberNo,
        name_bn: m.nameBn,
        name_en: m.nameEn || '',
        father_name: m.fatherName || '',
        mother_name: m.motherName || '',
        mobile: m.mobile || '',
        alt_mobile: m.altMobile || '',
        occupation: m.occupation || '',
        present_address: m.presentAddress || '',
        permanent_address: m.permanentAddress || '',
        join_date: m.joinDate || '2026-01-01',
        status: m.status || 'active',
        share_qty: m.shareQty || 1,
        opening_balance: m.openingBalance || 0,
        current_due: m.currentDue !== undefined ? m.currentDue : ((m.shareQty || 1) * 25000),
        created_at: m.createdAt || new Date().toISOString(),
        updated_at: m.updatedAt || new Date().toISOString()
      }));

      const { error: mErr } = await supabase.from('members').upsert(memberPayload);
      if (mErr) {
        throw new Error(`সদস্য আপলোডে সমস্যা: ${mErr.message}`);
      }

      showToast(language === 'bn' ? 'সফলভাবে ৯৬ জন সদস্যের তথ্য সুপাবেজে আপলোড করা হয়েছে!' : '96 members successfully uploaded to Supabase!', 'success');
      return { success: true, message: 'সফলভাবে ৯৬ জন সদস্যের তথ্য সুপাবেজে আপলোড করা হয়েছে!', count: 96 };
    } catch (err: any) {
      console.error('Reimport err:', err);
      showToast(err.message || 'আপলোডে সমস্যা হয়েছে', 'error');
      return { success: false, message: err.message || 'আপলোডে সমস্যা হয়েছে', count: 0 };
    }
  };


  const clearAllData = () => {
    const freshMembers = generateMembersFromRaw();
    setMembers(freshMembers);
    setShares(initialShareTransactions);
    setReceipts([]);
    setIncomes([]);
    setExpenses([]);
    setTransactions([]);
    setMonthlyDues([]);
    setNotifications([]);
    setAuditLogs([]);
    setSelectedMemberId(null);
    setSelectedReceiptId(null);
    setSelectedCertMemberId(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('BAUNIA_BUILDERS_DATA_V1');

    if (isSupabaseConfigured()) {
      supabase.from('receipts').delete().neq('id', 'CLEARED_NON_EXISTENT').then(({error}) => {
        if (error) console.error('Clear receipts err:', error);
      });
      supabase.from('transactions').delete().neq('id', 'CLEARED_NON_EXISTENT').then(({error}) => {
        if (error) console.error('Clear tx err:', error);
      });
      supabase.from('incomes').delete().neq('id', 'CLEARED_NON_EXISTENT').then(({error}) => {
        if (error) console.error('Clear incomes err:', error);
      });
      supabase.from('expenses').delete().neq('id', 'CLEARED_NON_EXISTENT').then(({error}) => {
        if (error) console.error('Clear expenses err:', error);
      });
      supabase.from('monthly_dues').delete().neq('id', 'CLEARED_NON_EXISTENT').then(({error}) => {
        if (error) console.error('Clear dues err:', error);
      });
    }

    showToast(language === 'bn' ? 'সকল ডেমো ও রসিদ ডাটা সফলভাবে মুছে ফেলা হয়েছে' : 'All demo and receipt data cleared successfully', 'info');
  };

  const resetToDefaultData = () => {
    setSettings(initialSettings);
    setUsers(initialUsers);
    setMembers(initialMembers);
    setShares(initialShareTransactions);
    setReceipts([]);
    setIncomes([]);
    setExpenses([]);
    setTransactions([]);
    setMonthlyDues([]);
    setNotifications([]);
    setAuditLogs([]);
    setSelectedMemberId(null);
    setSelectedReceiptId(null);
    setSelectedCertMemberId(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast(language === 'bn' ? 'সদস্য তালিকা ও সেটিংস ডিফল্টে রিসেট করা হয়েছে' : 'Reset to default registry list successfully', 'info');
  };

  // Dynamically calculate members with precise dues up to August 2026 (2026-08)
  const membersWithDynamicDues = useMemo(() => {
    return members.map(m => {
      const summary = getMemberScheduleSummary(m.id, receipts, m.shareQty || 1, m.memberNo);
      return {
        ...m,
        currentDue: summary.totalDue
      };
    });
  }, [members, receipts]);

  // Dynamically compute monthly dues overview for all members up to August 2026
  const computedMonthlyDues = useMemo<MonthlyDue[]>(() => {
    return membersWithDynamicDues
      .map(m => {
        const summary = getMemberScheduleSummary(m.id, receipts, m.shareQty || 1, m.memberNo);
        return {
          id: `DUE-${m.id}`,
          memberId: String(m.id),
          memberName: m.nameBn,
          mobile: m.mobile || '',
          monthYear: 'আগস্ট ২০২৬ পর্যন্ত',
          month: 'আগস্ট ২০২৬ পর্যন্ত (১২ মাস)',
          expectedAmount: summary.totalExpected,
          paidAmount: summary.totalPaid,
          dueAmount: summary.totalDue,
          status: (summary.totalDue === 0 ? 'paid' : summary.totalPaid > 0 ? 'partial' : 'unpaid') as 'paid' | 'partial' | 'unpaid'
        };
      });
  }, [membersWithDynamicDues, receipts]);

  // Computed Real-Time Stats
  const stats = useMemo(() => {
    const totalMembers = membersWithDynamicDues.length;
    const activeMembers = membersWithDynamicDues.filter(m => m.status === 'active').length;
    const inactiveMembers = membersWithDynamicDues.filter(m => m.status === 'inactive' || m.status === 'pending').length;

    const totalShares = membersWithDynamicDues.reduce((sum, m) => sum + (m.shareQty || 0), 0);
    const totalShareValue = membersWithDynamicDues.reduce((sum, m) => sum + (m.totalShareValue || 0), 0);

    const totalCollection = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCollection = receipts
      .filter(r => r.date === todayStr)
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const currentMonth = todayStr.substring(0, 7);
    const thisMonthCollection = receipts
      .filter(r => r.date.startsWith(currentMonth))
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalDue = membersWithDynamicDues.reduce((sum, m) => sum + (m.currentDue || 0), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalFdr = fdrs.filter(f => f.status === 'active').reduce((sum, f) => sum + (f.amount || 0), 0);

    // Current Cash Balance: Total Collections + Total Income - Total Expenses - Total FDR
    const currentBalance = totalCollection + totalIncome - totalExpenses - totalFdr;

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      totalShares,
      totalShareValue,
      totalCollection,
      todayCollection,
      thisMonthCollection,
      totalDue,
      totalIncome,
      totalExpenses,
      totalFdr,
      currentBalance,
    };
  }, [membersWithDynamicDues, receipts, incomes, expenses, fdrs]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        language,
        setLanguage,
        toggleLanguage,
        t,
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        addUser,
        updateUser,
        deleteUser,

        activeTab,
        setActiveTab,
        selectedMemberId,
        setSelectedMemberId,
        selectedReceiptId,
        setSelectedReceiptId,
        selectedCertMemberId,
        setSelectedCertMemberId,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,

        settings,
        updateSettings,
        members: membersWithDynamicDues,
        addMember,
        updateMember,
        deleteMember,
        importMembers,

        shares,
        addShareTransaction,

        receipts,
        collectPayment,
        addReceipt: collectPayment,
        deleteReceipt,

        incomes,
        addIncome,
        updateIncome,
        deleteIncome,

        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        approveExpense,

        fdrs,
        addFdr,
        deleteFdr,

        transactions,
        monthlyDues: computedMonthlyDues,
        payDue,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,

        auditLogs,
        addAuditLog,

        syncAllDataToSupabase,
        reimport96MembersToSupabase,
        clearAllData,
        resetToDefaultData,

        stats,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
