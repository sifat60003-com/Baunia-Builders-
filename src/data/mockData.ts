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
  AuditLog 
} from '../types';
import { generateMembersFromRaw, generateShareTransactionsFromMembers } from './importedMembers';

export const initialSettings: OrganizationSettings = {
  nameBn: 'বাউনিয়া বিল্ডার্স',
  nameEn: 'BAUNIA BUILDERS',
  addressBn: 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০',
  addressEn: 'Baunia Pukurpar, Turag, Dhaka-1230',
  phones: ['01833-805170', '01711-280514', '01739-704588'],
  email: 'info@bauniabuilders.com',
  website: 'https://bauniabuilders.com',
  defaultSharePrice: 100000,
  defaultMonthlyFee: 2000,
  currency: 'BDT',
  currencySymbol: '৳',
  receiptPrefix: 'BBR-2026-',
  memberIdPrefix: 'BB-',
  financialYear: '2026-2027',
  presidentName: 'মো: ফয়েজুর রহমান খান',
  secretaryName: 'মো: মনিরুজ্জামান',
  treasurerName: 'মো: মাহবুব সরকার',
};

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    name: 'SIFAT HASAN SIAM',
    email: 'sifat.comp.bw@gmail.com',
    phone: '202500',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-27 08:30 AM',
    createdAt: '2026-01-01',
  },
  {
    id: 'USR-002',
    name: 'MD MAHBUB SARKAR',
    email: 'mahbub@bauniabuilders.com',
    phone: '202501',
    role: 'accountant',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-26 04:15 PM',
    createdAt: '2026-01-10',
  },
  {
    id: 'USR-003',
    name: 'সিফাত আহমেদ',
    email: 'collector@bauniabuilders.com',
    phone: '01739-704588',
    role: 'collector',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-27 09:45 AM',
    createdAt: '2026-02-01',
  }
];

// Members imported directly from official registry (96 members)
export const initialMembers: Member[] = generateMembersFromRaw();
export const initialShareTransactions: ShareTransaction[] = generateShareTransactionsFromMembers(initialMembers);
export const initialReceipts: PaymentReceipt[] = [];
export const initialIncomes: Income[] = [];
export const initialExpenses: Expense[] = [];
export const initialTransactions: FinancialTransaction[] = [];
export const initialMonthlyDues: MonthlyDue[] = [];
export const initialNotifications: NotificationItem[] = [];
export const initialAuditLogs: AuditLog[] = [];
