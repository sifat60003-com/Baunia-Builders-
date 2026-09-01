export interface MonthScheduleItem {
  id: string; // e.g. '2025-11', '2026-10', '2027-09'
  nameBn: string; // e.g. 'নভেম্বর ২০২৫'
  nameEn: string; // e.g. 'November 2025'
  shortNameBn: string; // e.g. 'নভেম্বর ২৫'
  monthOrder: number; // 1 to 12
  year: number; // e.g. 2025
  monthNumber: number; // 1 to 12
  baseAmount: number; // 2000 * shareQty
  extraAmount: number; // 5000 * shareQty for April and October, 0 for others
  totalAmount: number; // baseAmount + extraAmount
  isExtraMonth: boolean; // true for April and October in each 12-month cycle
  labelBn: string;
  descriptionBn: string;
}

/**
 * Generates the active 12-month schedule block.
 * Rule: 
 * - Nov 2025 to Oct 2026 (with April and October as extra months).
 * - When all 12 months in the current block are paid, automatically shifts/removes 
 *   to show the next 12 months (Nov 2026 to Oct 2027, etc.).
 */
export function getMonthlySchedule(shareQty: number = 1, paidMonthIds: string[] = [], returnAllBlocks: boolean = false): MonthScheduleItem[] {
  const qty = Math.max(1, Number(shareQty) || 1);

  const baseBlocks = [
    { startYear: 2025, startMonth: 11, endYear: 2026, endMonth: 10 },
    { startYear: 2026, startMonth: 11, endYear: 2027, endMonth: 10 },
    { startYear: 2027, startMonth: 11, endYear: 2028, endMonth: 10 },
    { startYear: 2028, startMonth: 11, endYear: 2029, endMonth: 10 },
    { startYear: 2029, startMonth: 11, endYear: 2030, endMonth: 10 },
  ];

  const monthNamesBn = [
    '', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const monthNamesEn = [
    '', 'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const bengaliYears: Record<number, string> = {
    2025: '২০২৫',
    2026: '২০২৬',
    2027: '২০২৭',
    2028: '২০২৮',
    2029: '২০২৯',
    2030: '২০৩০'
  };

  const generateBlockMonths = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
    const months = [];
    let curY = startYear;
    let curM = startMonth;
    let order = 1;

    while (true) {
      const isExtra = (curM === 4 || curM === 10); // April and October are extra months
      const id = `${curY}-${String(curM).padStart(2, '0')}`;
      const nameBn = `${monthNamesBn[curM]} ${bengaliYears[curY] || curY}${isExtra ? ' (+এক্সট্রা)' : ''}`;
      const nameEn = `${monthNamesEn[curM]} ${curY}`;
      const shortNameBn = `${monthNamesBn[curM]} ${bengaliYears[curY]?.slice(2) || String(curY).slice(2)}${isExtra ? ' (+এক্সট্রা)' : ''}`;

      months.push({
        id,
        nameBn,
        nameEn,
        shortNameBn,
        monthOrder: order++,
        year: curY,
        monthNumber: curM,
        base: 2000,
        extra: isExtra ? 5000 : 0,
        isExtra
      });

      if (curY === endYear && curM === endMonth) break;
      curM++;
      if (curM > 12) {
        curM = 1;
        curY++;
      }
    }
    return months;
  };

  if (returnAllBlocks) {
    const allMonths: MonthScheduleItem[] = [];
    let overallOrder = 1;
    baseBlocks.forEach((block) => {
      const blockMonths = generateBlockMonths(block.startYear, block.startMonth, block.endYear, block.endMonth);
      blockMonths.forEach(m => {
        const baseAmount = m.base * qty;
        const extraAmount = m.extra * qty;
        const totalAmount = baseAmount + extraAmount;
        allMonths.push({
          id: m.id,
          nameBn: m.nameBn,
          nameEn: m.nameEn,
          shortNameBn: m.shortNameBn,
          monthOrder: overallOrder++,
          year: m.year,
          monthNumber: m.monthNumber,
          baseAmount,
          extraAmount,
          totalAmount,
          isExtraMonth: m.isExtra,
          labelBn: m.extra > 0 ? `${totalAmount.toLocaleString('en-IN')} ৳ (${baseAmount}+${extraAmount})` : `${totalAmount.toLocaleString('en-IN')} ৳`,
          descriptionBn: m.extra > 0 ? `নিয়মিত ${baseAmount.toLocaleString('en-IN')} ৳ + বিশেষ এক্সট্রা ${extraAmount.toLocaleString('en-IN')} ৳` : 'নিয়মিত মাসিক সঞ্চয় কিস্তি'
        });
      });
    });
    return allMonths;
  }

  let activeBlockIndex = 0;
  for (let idx = 0; idx < baseBlocks.length; idx++) {
    const block = baseBlocks[idx];
    const blockMonths = generateBlockMonths(block.startYear, block.startMonth, block.endYear, block.endMonth);
    const allPaidInBlock = blockMonths.every(m => paidMonthIds.includes(m.id));
    if (allPaidInBlock) {
      activeBlockIndex = idx + 1;
    } else {
      break;
    }
  }

  if (activeBlockIndex >= baseBlocks.length) {
    activeBlockIndex = baseBlocks.length - 1;
  }

  const activeBlock = baseBlocks[activeBlockIndex];
  const rawMonths = generateBlockMonths(activeBlock.startYear, activeBlock.startMonth, activeBlock.endYear, activeBlock.endMonth);

  return rawMonths.map(m => {
    const baseAmount = m.base * qty;
    const extraAmount = m.extra * qty;
    const totalAmount = baseAmount + extraAmount;
    return {
      id: m.id,
      nameBn: m.nameBn,
      nameEn: m.nameEn,
      shortNameBn: m.shortNameBn,
      monthOrder: m.monthOrder,
      year: m.year,
      monthNumber: m.monthNumber,
      baseAmount,
      extraAmount,
      totalAmount,
      isExtraMonth: m.isExtra,
      labelBn: m.extra > 0 ? `${totalAmount.toLocaleString('en-IN')} ৳ (${baseAmount}+${extraAmount})` : `${totalAmount.toLocaleString('en-IN')} ৳`,
      descriptionBn: m.extra > 0 ? `নিয়মিত ${baseAmount.toLocaleString('en-IN')} ৳ + বিশেষ এক্সট্রা ${extraAmount.toLocaleString('en-IN')} ৳` : 'নিয়মিত মাসিক সঞ্চয় কিস্তি'
    };
  });
}

// Default export for backward compatibility (Nov 2025 - Oct 2026)
export const MONTHLY_SCHEDULE: MonthScheduleItem[] = getMonthlySchedule(1);

export const TOTAL_SCHEDULE_AMOUNT = MONTHLY_SCHEDULE.reduce((sum, m) => sum + m.totalAmount, 0);

export function getCurrentRunningMonthId(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export interface MemberMonthStatus {
  schedule: MonthScheduleItem;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'due';
  isNext?: boolean; // True for the immediate next unpaid month (Blue)
  isAdvance?: boolean; // True for months strictly after the running/next active month (Yellow / Ogrim)
  receipts: {
    id: string;
    receiptNo: string;
    date: string;
    amount: number;
  }[];
}

/**
 * Robust check if a receipt belongs to a member by ID or member number
 */
export function isReceiptForMemberId(
  receiptMemberId: string | number | undefined,
  targetMemberId: string | number | undefined,
  memberNo?: number | string
): boolean {
  if (!receiptMemberId || !targetMemberId) return false;
  const recStr = String(receiptMemberId).trim();
  const targetStr = String(targetMemberId).trim();
  const noStr = memberNo !== undefined && memberNo !== null ? String(memberNo).trim() : '';

  if (recStr === targetStr) return true;
  if (noStr && recStr === noStr) return true;

  const normRec = recStr.replace(/^[^\d]+/, '').replace(/^0+/, '');
  const normTarget = targetStr.replace(/^[^\d]+/, '').replace(/^0+/, '');
  const normNo = noStr.replace(/^[^\d]+/, '').replace(/^0+/, '');

  if (normRec && normTarget && normRec === normTarget) return true;
  if (normRec && normNo && normRec === normNo) return true;

  return false;
}

/**
 * Calculates the monthly payment status for a specific member across scheduled months,
 * factoring in shareQty, direct breakdown allocation, and waterfall accumulation pool.
 */
export function getMemberMonthlyStatusList(
  memberId: string | number,
  receipts: Array<{
    id: string;
    receiptNo: string;
    memberId: string | number;
    paymentType?: string;
    type?: string;
    payment_type?: string;
    paymentMonth?: string;
    paymentMonths?: string[];
    monthBreakdown?: Array<{
      monthId: string;
      paidAmount?: number;
      amount?: number;
      totalAmount?: number;
    }>;
    amount: number;
    date: string;
    status?: string;
  }>,
  shareQty: number = 1,
  memberNo?: number | string
): MemberMonthStatus[] {
  // 1. Filter receipts for this member
  const memberReceipts = receipts.filter(r => {
    if (r.status === 'cancelled') return false;
    return isReceiptForMemberId(r.memberId, memberId, memberNo);
  });

  const monthPaidAmountMap: Record<string, number> = {};
  const monthReceiptsMap: Record<string, Array<{ id: string; receiptNo: string; date: string; amount: number }>> = {};

  const tempSchedule = getMonthlySchedule(shareQty, [], true);
  tempSchedule.forEach(m => {
    monthPaidAmountMap[m.id] = 0;
    monthReceiptsMap[m.id] = [];
  });

  let unallocatedPool = 0;

  // 2. Process each receipt
  memberReceipts.forEach(r => {
    const pType = String(r.paymentType || r.payment_type || r.type || 'monthly_fee').toLowerCase().trim();
    const isEligibleType = 
      pType === 'monthly_fee' || 
      pType === 'monthly' ||
      pType === 'savings_deposit' || 
      pType === 'special_deposit' ||
      pType === 'previous_due' ||
      pType === 'member_payment' ||
      pType === 'installment' ||
      pType === 'extra_month' ||
      pType === 'share_payment' ||
      pType === 'other' ||
      pType === 'paid' ||
      pType === 'active';

    if (!isEligibleType) return;

    const receiptAmount = Number(r.amount) || 0;
    if (receiptAmount <= 0) return;

    let allocatedFromReceipt = 0;

    // A) Explicit Month Breakdown
    if (r.monthBreakdown && r.monthBreakdown.length > 0) {
      r.monthBreakdown.forEach(bd => {
        const itemAmt = bd.paidAmount !== undefined ? bd.paidAmount : bd.amount !== undefined ? bd.amount : bd.totalAmount || 0;
        if (itemAmt > 0 && monthPaidAmountMap[bd.monthId] !== undefined) {
          monthPaidAmountMap[bd.monthId] += itemAmt;
          monthReceiptsMap[bd.monthId].push({
            id: r.id,
            receiptNo: r.receiptNo || r.id,
            date: r.date,
            amount: itemAmt
          });
          allocatedFromReceipt += itemAmt;
        }
      });
    }
    // B) Explicit Payment Months Array
    else if (r.paymentMonths && r.paymentMonths.length > 0) {
      const perMonthShare = receiptAmount / r.paymentMonths.length;
      r.paymentMonths.forEach(mId => {
        if (monthPaidAmountMap[mId] !== undefined) {
          const mSched = tempSchedule.find(s => s.id === mId);
          const amtToApply = mSched ? Math.min(perMonthShare, mSched.totalAmount) : perMonthShare;
          monthPaidAmountMap[mId] += amtToApply;
          monthReceiptsMap[mId].push({
            id: r.id,
            receiptNo: r.receiptNo || r.id,
            date: r.date,
            amount: amtToApply
          });
          allocatedFromReceipt += amtToApply;
        }
      });
    }
    // C) Explicit Single Payment Month
    else if (r.paymentMonth && monthPaidAmountMap[r.paymentMonth] !== undefined) {
      const mSched = tempSchedule.find(s => s.id === r.paymentMonth);
      const mNeeded = mSched ? Math.max(0, mSched.totalAmount - monthPaidAmountMap[r.paymentMonth]) : receiptAmount;
      const amtToApply = Math.min(receiptAmount, mNeeded > 0 ? mNeeded : receiptAmount);
      monthPaidAmountMap[r.paymentMonth] += amtToApply;
      monthReceiptsMap[r.paymentMonth].push({
        id: r.id,
        receiptNo: r.receiptNo || r.id,
        date: r.date,
        amount: amtToApply
      });
      allocatedFromReceipt += amtToApply;
    }

    const remainder = Math.max(0, receiptAmount - allocatedFromReceipt);
    unallocatedPool += remainder;
  });

  // 3. Waterfall allocation of unallocated pool to unpaid months in chronological order
  if (unallocatedPool > 0) {
    for (const sched of tempSchedule) {
      if (unallocatedPool <= 0) break;
      const currentPaid = monthPaidAmountMap[sched.id] || 0;
      const needed = Math.max(0, sched.totalAmount - currentPaid);
      if (needed > 0) {
        const fillAmt = Math.min(unallocatedPool, needed);
        monthPaidAmountMap[sched.id] += fillAmt;
        unallocatedPool -= fillAmt;
        monthReceiptsMap[sched.id].push({
          id: `POOL-${sched.id}`,
          receiptNo: 'পরিশোধিত কিস্তি',
          date: new Date().toISOString().split('T')[0],
          amount: fillAmt
        });
      }
    }
  }

  // 4. Construct final status list
  const paidMonthIds = tempSchedule
    .filter(s => (monthPaidAmountMap[s.id] || 0) >= s.totalAmount)
    .map(s => s.id);

  const scheduleList = getMonthlySchedule(shareQty, paidMonthIds, true);

  const statusList: MemberMonthStatus[] = scheduleList.map(schedule => {
    const paidAmountForMonth = monthPaidAmountMap[schedule.id] || 0;
    const dueAmount = Math.max(0, schedule.totalAmount - paidAmountForMonth);

    let status: 'paid' | 'partial' | 'due' = 'due';
    if (paidAmountForMonth >= schedule.totalAmount) {
      status = 'paid';
    } else if (paidAmountForMonth > 0) {
      status = 'partial';
    } else {
      status = 'due';
    }

    return {
      schedule,
      paidAmount: paidAmountForMonth,
      dueAmount,
      status,
      isNext: false,
      isAdvance: false,
      receipts: monthReceiptsMap[schedule.id] || []
    };
  });

  const currentRunningMonthId = getCurrentRunningMonthId();
  let foundNext = false;
  statusList.forEach(item => {
    if (item.schedule.id <= currentRunningMonthId) {
      if (item.status !== 'paid') {
        if (!foundNext) {
          item.isNext = true;
          foundNext = true;
        } else {
          item.isNext = false;
        }
      }
    } else {
      if (item.status !== 'paid') {
        item.isAdvance = true;
      }
    }
  });

  return statusList;
}

/**
 * Returns summary totals for a member across scheduled months (due counted up to August 2026)
 */
export function getMemberScheduleSummary(
  memberId: string | number,
  receipts: Array<{
    id: string;
    receiptNo: string;
    memberId: string | number;
    paymentType?: string;
    type?: string;
    payment_type?: string;
    paymentMonth?: string;
    paymentMonths?: string[];
    monthBreakdown?: Array<{
      monthId: string;
      paidAmount?: number;
      amount?: number;
      totalAmount?: number;
    }>;
    amount: number;
    date: string;
    status?: string;
  }>,
  shareQty: number = 1,
  memberNo?: number | string
) {
  const currentRunningMonthId = getCurrentRunningMonthId();
  const statusList = getMemberMonthlyStatusList(memberId, receipts, shareQty, memberNo);
  const totalExpected = statusList.reduce((sum, m) => sum + m.schedule.totalAmount, 0);
  const totalPaid = statusList.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalDue = statusList
    .filter(item => item.schedule.id <= currentRunningMonthId)
    .reduce((sum, item) => sum + item.dueAmount, 0);
  const paidMonthsCount = statusList.filter(item => item.status === 'paid').length;
  const partialMonthsCount = statusList.filter(item => item.status === 'partial' && item.schedule.id <= currentRunningMonthId).length;
  const dueMonthsCount = statusList.filter(item => item.status === 'due' && !item.isNext && !item.isAdvance && item.schedule.id <= currentRunningMonthId).length;
  const nextMonthItem = statusList.find(item => item.isNext);

  return {
    statusList,
    totalExpected,
    totalPaid,
    totalDue,
    paidMonthsCount,
    partialMonthsCount,
    dueMonthsCount,
    nextMonthItem
  };
}

export interface DueMonthWithFine {
  schedule: MonthScheduleItem;
  status: 'paid' | 'partial' | 'due' | 'advance';
  paidAmount: number;
  dueAmount: number;
  isOverdue: boolean;
  isWithinGracePeriod: boolean;
  fineAmount: number;
  deadlineDateStr: string;
  noticeBn: string;
}

/**
 * Returns detailed due months list with overdue penalty/fine calculation strictly for Member Portal display.
 * NOTE: As per strict accounting rules, fine amount must NEVER be added to principal dues or database records.
 */
export function getMemberDueMonthsWithFines(
  memberId: string | number,
  receipts: Array<any>,
  shareQty: number = 1,
  memberNo?: number | string
) {
  const currentRunningMonthId = getCurrentRunningMonthId();
  const statusList = getMemberMonthlyStatusList(memberId, receipts, shareQty, memberNo);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  const dueMonthsWithFine: DueMonthWithFine[] = [];

  statusList.forEach(item => {
    if (item.schedule.id <= currentRunningMonthId && (item.status === 'due' || item.status === 'partial') && item.dueAmount > 0) {
      const schYear = item.schedule.year;
      const schMonth = item.schedule.monthNumber;
      
      const deadlineDateStr = `১৫ ${item.schedule.nameBn}`;
      
      let isOverdue = false;
      let isWithinGracePeriod = false;
      let fineAmount = 0;
      let noticeBn = '';

      if (schYear < currentYear || (schYear === currentYear && schMonth < currentMonthNum)) {
        isOverdue = true;
        fineAmount = 200; // Standard 200 BDT fine per overdue month
        noticeBn = `নির্ধারিত ১৫ তারিখ অতিক্রান্ত (বিলম্ব ফি ৳২০০ প্রযোজ্য)`;
      } else if (schYear === currentYear && schMonth === currentMonthNum) {
        if (currentDay > 15) {
          isOverdue = true;
          fineAmount = 200;
          noticeBn = `চলতি মাসের নির্ধারিত ১৫ তারিখ অতিক্রান্ত (বিলম্ব ফি ৳২০০ প্রযোজ্য)`;
        } else {
          isWithinGracePeriod = true;
          fineAmount = 0;
          noticeBn = `চলতি মাসের নিয়মিত সময় চলমান (১-১৫ তারিখের মধ্যে জরিমানা মুক্ত)`;
        }
      }

      dueMonthsWithFine.push({
        schedule: item.schedule,
        status: item.status,
        paidAmount: item.paidAmount,
        dueAmount: item.dueAmount,
        isOverdue,
        isWithinGracePeriod,
        fineAmount,
        deadlineDateStr,
        noticeBn,
      });
    }
  });

  const totalPrincipalDue = dueMonthsWithFine.reduce((sum, d) => sum + d.dueAmount, 0);
  const totalFineAmount = dueMonthsWithFine.reduce((sum, d) => sum + d.fineAmount, 0);
  const overdueCount = dueMonthsWithFine.filter(d => d.isOverdue).length;

  return {
    dueMonths: dueMonthsWithFine,
    totalPrincipalDue,
    totalFineAmount,
    overdueCount,
    hasDue: dueMonthsWithFine.length > 0,
    hasFine: totalFineAmount > 0,
    allMonthsStatus: statusList,
  };
}

