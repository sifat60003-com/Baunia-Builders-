export type UserRole = 'super_admin' | 'admin' | 'accountant' | 'collector' | 'member';

export type Language = 'bn' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar?: string;
  memberId?: string; // If user is linked to a Member account
  lastLogin?: string;
  createdAt: string;
}

export interface Nominee {
  id: string;
  name: string;
  relation: string;
  nidBirthReg: string;
  mobile: string;
  address: string;
  percentage: number; // e.g. 50, 100
  photoUrl?: string;
}

export type MemberStatus = 'active' | 'inactive' | 'pending';
export type Gender = 'male' | 'female' | 'other';

export interface Member {
  id: string; // e.g. BB-0001
  memberNo: number; // e.g. 1
  nameBn: string;
  nameEn: string;
  fatherName: string;
  motherName: string;
  spouseName?: string;
  dob: string;
  gender: Gender;
  nid: string;
  birthRegNo?: string;
  mobile: string;
  altMobile?: string;
  email?: string;
  occupation: string;
  presentAddress: string;
  permanentAddress: string;
  photoUrl?: string;
  photoBackUrl?: string;
  joinDate: string;
  status: MemberStatus;
  shareQty: number;
  sharePrice: number;
  totalShareValue: number; // shareQty * sharePrice
  monthlyFee: number;
  openingBalance: number;
  currentDeposit: number;
  currentDue: number;
  notes?: string;
  pin?: string; // 4-digit Security PIN for member portal high security
  isPinSet?: boolean; // Indicates if member has completed 1st-time NID & PIN setup
  nominees: Nominee[];
  createdAt: string;
  updatedAt: string;
}

export type ShareTransactionType = 'initial' | 'additional' | 'transfer' | 'refund';

export interface ShareTransaction {
  id: string;
  memberId: string;
  memberName: string;
  type: ShareTransactionType;
  shareQty: number;
  sharePrice: number;
  totalAmount: number;
  date: string;
  certificateNo: string;
  transferToMemberId?: string;
  transferToMemberName?: string;
  notes?: string;
  approvedBy: string;
  createdAt: string;
}

export type PaymentType = 
  | 'monthly_fee' 
  | 'share_payment' 
  | 'savings_deposit' 
  | 'special_deposit' 
  | 'previous_due' 
  | 'other';

export type PaymentMethod = 'cash' | 'bank' | 'bkash' | 'nagad' | 'rocket' | 'other';

export interface MonthPaymentBreakdown {
  monthId: string;
  monthName: string;
  shortName: string;
  baseAmount: number;
  extraAmount: number;
  totalAmount: number;
  isExtraMonth: boolean;
  paidAmount: number;
}

export interface PaymentReceipt {
  id: string;
  receiptNo: string; // e.g. BBR-2026-000001
  date: string;
  memberId: string;
  memberName: string;
  memberMobile: string;
  paymentType: PaymentType;
  paymentMonth?: string; // e.g. '2025-11', '2026-04'
  monthName?: string; // e.g. 'নভেম্বর ২০২৫', 'এপ্রিল ২০২৬ (এক্সট্রা সহ)'
  paymentMonths?: string[]; // list of month IDs e.g. ['2025-11', '2025-12']
  monthNames?: string[]; // list of month names
  monthBreakdown?: MonthPaymentBreakdown[];
  isExtraMonth?: boolean;
  baseAmount?: number;
  extraAmount?: number;
  amount: number;
  amountInWordsBn: string;
  amountInWordsEn: string;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  refNumber?: string;
  notes?: string;
  previousDue?: number;
  remainingDue?: number;
  status?: string;
  collectorId: string;
  collectorName: string;
  createdAt: string;
}

export type IncomeCategory = 
  | 'membership_fee' 
  | 'share_income' 
  | 'investment_return' 
  | 'donation' 
  | 'rental_income' 
  | 'project_return' 
  | 'other';

export interface Income {
  id: string;
  incomeId: string; // e.g. INC-0001
  date: string;
  category: IncomeCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  refNumber?: string;
  addedBy: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'office_rent' 
  | 'salary' 
  | 'transportation' 
  | 'utility_bill' 
  | 'meeting_expense' 
  | 'maintenance' 
  | 'legal_fee' 
  | 'tea_snack' 
  | 'stationery' 
  | 'investment' 
  | 'other';

export interface Expense {
  id: string;
  expenseId: string; // e.g. EXP-0001
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  refNumber?: string;
  approvedBy: string;
  addedBy: string;
  status: 'approved' | 'pending';
  createdAt: string;
}

export type TransactionType = 
  | 'member_payment' 
  | 'share_purchase' 
  | 'income' 
  | 'expense' 
  | 'adjustment' 
  | 'refund';

export interface FinancialTransaction {
  id: string;
  transactionId: string; // e.g. TXN-2026-0001
  date: string;
  type: TransactionType;
  refId?: string;
  description: string;
  debit: number; // money going out
  credit: number; // money coming in
  balance: number; // running cash balance
  user: string;
  createdAt: string;
}

export interface MonthlyDue {
  id: string;
  memberId: string;
  memberName: string;
  mobile: string;
  monthYear?: string; // e.g. "2026-08"
  month?: string;
  expectedAmount: number;
  paidAmount: number;
  dueAmount: number;
  lastPaymentDate?: string;
  status: 'paid' | 'partial' | 'unpaid';
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'member' | 'payment' | 'expense';
  isRead: boolean;
  timestamp: string;
  linkTab?: string;
}

export interface OrganizationSettings {
  nameBn: string;
  nameEn: string;
  addressBn: string;
  addressEn: string;
  phones: string[];
  email: string;
  website: string;
  defaultSharePrice: number;
  defaultMonthlyFee: number;
  currency: string;
  currencySymbol: string;
  receiptPrefix: string;
  memberIdPrefix: string;
  financialYear: string;
  presidentName: string;
  secretaryName: string;
  treasurerName?: string;
  orgNameBn?: string;
  orgNameEn?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  logoUrl?: string;
}

export type SystemSettings = OrganizationSettings;

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
