const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add import
if (!content.includes('import { supabase }')) {
  content = content.replace("import { translations } from '../utils/translations';", "import { translations } from '../utils/translations';\nimport { supabase } from '../lib/supabase';");
}

// Add state for supabaseLoading
if (!content.includes('isSupabaseLoading')) {
  content = content.replace('const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);', 'const [isSupabaseLoading, setIsSupabaseLoading] = useState<boolean>(true);\n  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);');
}

// Add context type
if (!content.includes('isSupabaseLoading: boolean')) {
  content = content.replace('isAuthenticated: boolean;', 'isSupabaseLoading: boolean;\n  isAuthenticated: boolean;');
}

// Provide it
if (!content.includes('isSupabaseLoading,')) {
  content = content.replace('isAuthenticated,', 'isSupabaseLoading,\n        isAuthenticated,');
}

// Add useEffect to fetch from Supabase
const fetchEffect = `
  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        setIsSupabaseLoading(true);
        
        // 1. Settings
        const { data: settingsData, error: sErr } = await supabase.from('settings').select('*').limit(1);
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
          setUsers(usersData.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            status: u.status,
            lastLogin: u.last_login,
            createdAt: u.created_at,
            avatar: ''
          })));
        } else if (uErr) {
          console.warn('Supabase users err:', uErr.message);
        }

        // 3. Members
        const { data: membersData, error: mErr } = await supabase.from('members').select('*');
        if (membersData && membersData.length > 0) {
          setMembers(membersData.map(m => ({
            id: m.id,
            memberNo: m.member_no,
            nameBn: m.name_bn,
            nameEn: m.name_en,
            fatherName: m.father_name,
            motherName: m.mother_name,
            mobile: m.mobile,
            altMobile: m.alt_mobile,
            occupation: m.occupation,
            presentAddress: m.present_address,
            permanentAddress: m.permanent_address,
            joinDate: m.join_date,
            status: m.status,
            shareQty: m.share_qty,
            sharePrice: Number(m.share_price),
            totalShareValue: Number(m.total_share_value),
            openingBalance: Number(m.opening_balance),
            createdAt: m.created_at,
            updatedAt: m.updated_at,
            gender: 'male',
            nid: '',
            monthlyFee: 500,
            currentDeposit: 0,
            currentDue: 0,
            nominees: []
          })));
        } else if (mErr) {
          console.warn('Supabase members err:', mErr.message);
        }

        // 4. Receipts
        const { data: receiptsData, error: rErr } = await supabase.from('receipts').select('*');
        if (receiptsData && receiptsData.length > 0) {
          setReceipts(receiptsData.map(r => ({
            id: r.id,
            receiptNo: r.receipt_no,
            memberId: r.member_id,
            memberName: r.member_name,
            amount: Number(r.amount),
            date: r.date,
            type: r.type,
            paymentMethod: r.payment_method,
            status: r.status,
            collectedBy: r.collected_by,
            notes: r.notes,
            createdAt: r.created_at
          })));
        } else if (rErr) {
          console.warn('Supabase receipts err:', rErr.message);
        }

      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      } finally {
        setIsSupabaseLoading(false);
      }
    };
    
    fetchFromSupabase();
  }, []);
`;

if (!content.includes('fetchFromSupabase = async () => {')) {
  content = content.replace('// Sync to local storage', fetchEffect + '\n  // Sync to local storage');
}

fs.writeFileSync('src/context/AppContext.tsx', content);
