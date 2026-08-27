const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// 1. collectPayment
content = content.replace(
  'setReceipts(prev => [newReceipt, ...prev]);',
  `setReceipts(prev => [newReceipt, ...prev]);
    // Sync to Supabase
    supabase.from('receipts').insert([{
      id: newReceipt.id,
      receipt_no: newReceipt.receiptNo,
      member_id: newReceipt.memberId,
      member_name: newReceipt.memberName,
      amount: newReceipt.amount,
      date: newReceipt.date,
      type: newReceipt.type || newReceipt.paymentType,
      payment_method: newReceipt.paymentMethod,
      status: newReceipt.status,
      collected_by: newReceipt.collectedBy || currentUser.name,
      notes: newReceipt.notes || newReceipt.remarks,
      created_at: newReceipt.createdAt || new Date().toISOString()
    }]).then(({error}) => {
      if(error) console.error('Supabase insert receipt error:', error);
    });`
);

// 2. addMember
content = content.replace(
  'setMembers(prev => [newMember, ...prev]);',
  `setMembers(prev => [newMember, ...prev]);
    // Sync to Supabase
    supabase.from('members').insert([{
      id: newMember.id,
      member_no: newMember.memberNo,
      name_bn: newMember.nameBn,
      name_en: newMember.nameEn,
      father_name: newMember.fatherName,
      mother_name: newMember.motherName,
      mobile: newMember.mobile,
      alt_mobile: newMember.altMobile,
      occupation: newMember.occupation,
      present_address: newMember.presentAddress,
      permanent_address: newMember.permanentAddress,
      join_date: newMember.joinDate,
      status: newMember.status,
      share_qty: newMember.shareQty,
      share_price: newMember.sharePrice,
      total_share_value: newMember.totalShareValue,
      opening_balance: newMember.openingBalance,
      created_at: newMember.createdAt,
      updated_at: newMember.updatedAt
    }]).then(({error}) => {
      if(error) console.error('Supabase insert member error:', error);
    });`
);

// 3. updateMember
content = content.replace(
  /setMembers\(prev => prev\.map\(m =>\s*m\.id === id \? updatedMember : m\s*\)\);/g,
  `setMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
    // Sync to Supabase
    supabase.from('members').update({
      name_bn: updatedMember.nameBn,
      name_en: updatedMember.nameEn,
      father_name: updatedMember.fatherName,
      mother_name: updatedMember.motherName,
      mobile: updatedMember.mobile,
      alt_mobile: updatedMember.altMobile,
      occupation: updatedMember.occupation,
      present_address: updatedMember.presentAddress,
      permanent_address: updatedMember.permanentAddress,
      join_date: updatedMember.joinDate,
      status: updatedMember.status,
      share_qty: updatedMember.shareQty,
      share_price: updatedMember.sharePrice,
      total_share_value: updatedMember.totalShareValue,
      opening_balance: updatedMember.openingBalance,
      updated_at: updatedMember.updatedAt
    }).eq('id', id).then(({error}) => {
      if(error) console.error('Supabase update member error:', error);
    });`
);

// 4. updateSettings
content = content.replace(
  'setSettings(newSettings);',
  `setSettings(newSettings);
    // Sync to Supabase
    supabase.from('settings').upsert({
      id: newSettings.id || 'default',
      name_bn: newSettings.nameBn,
      name_en: newSettings.nameEn,
      president_name: newSettings.presidentName,
      secretary_name: newSettings.secretaryName,
      treasurer_name: newSettings.treasurerName,
      share_price: newSettings.sharePrice,
      monthly_fee: newSettings.monthlyFee,
      is_financial_reset_done: newSettings.isFinancialResetDone_V6,
      updated_at: new Date().toISOString()
    }).then(({error}) => {
      if(error) console.error('Supabase upsert settings error:', error);
    });`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
