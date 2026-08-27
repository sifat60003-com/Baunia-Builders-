const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Sync addShareTransaction
if (!content.includes("supabase.from('shares').insert")) {
  content = content.replace(
    'setShares(prev => [newTx, ...prev]);',
    `setShares(prev => [newTx, ...prev]);
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
    }]).then(({error}) => { if(error) console.error('Supabase shares insert err:', error); });`
  );
}

// Sync addIncome
if (!content.includes("supabase.from('incomes').insert")) {
  content = content.replace(
    'setIncomes(prev => [newInc, ...prev]);',
    `setIncomes(prev => [newInc, ...prev]);
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
    }]).then(({error}) => { if(error) console.error('Supabase income insert err:', error); });`
  );
}

// Sync addExpense
if (!content.includes("supabase.from('expenses').insert")) {
  content = content.replace(
    'setExpenses(prev => [newExp, ...prev]);',
    `setExpenses(prev => [newExp, ...prev]);
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
    }]).then(({error}) => { if(error) console.error('Supabase expense insert err:', error); });`
  );
}

// Sync addUser
if (!content.includes("supabase.from('users').insert")) {
  content = content.replace(
    'setUsers(prev => [...prev, newUser]);',
    `setUsers(prev => [...prev, newUser]);
    supabase.from('users').insert([{
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.createdAt
    }]).then(({error}) => { if(error) console.error('Supabase user insert err:', error); });`
  );
}

fs.writeFileSync('src/context/AppContext.tsx', content);
