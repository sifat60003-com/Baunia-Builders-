const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const enhancedFetch = `
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
`;

if (!content.includes("// 5. Incomes")) {
  content = content.replace("console.warn('Supabase receipts err:', rErr.message);", "console.warn('Supabase receipts err:', rErr.message);\n        }\n" + enhancedFetch);
}

fs.writeFileSync('src/context/AppContext.tsx', content);
