import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Phone,
  CreditCard,
  Building,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Nominee, Gender, MemberStatus } from '../../types';
import { formatCurrency, toBnDigits } from '../../utils/formatters';

export const MemberForm: React.FC = () => {
  const { 
    members, 
    addMember, 
    updateMember, 
    selectedMemberId, 
    setActiveTab, 
    settings, 
    language, 
    t, 
    showToast 
  } = useApp();

  const isEditing = !!selectedMemberId;
  const existingMember = isEditing ? members.find(m => m.id === selectedMemberId) : null;

  // Next Member ID preview
  const nextMemberNo = members.reduce((max, m) => Math.max(max, m.memberNo || 0), 0) + 1;
  const autoMemberId = `${settings.memberIdPrefix || 'BB-'}${String(nextMemberNo).padStart(4, '0')}`;

  // Form States
  const [nameBn, setNameBn] = useState(existingMember?.nameBn || '');
  const [nameEn, setNameEn] = useState(existingMember?.nameEn || '');
  const [fatherName, setFatherName] = useState(existingMember?.fatherName || '');
  const [motherName, setMotherName] = useState(existingMember?.motherName || '');
  const [spouseName, setSpouseName] = useState(existingMember?.spouseName || '');
  const [dob, setDob] = useState(existingMember?.dob || '1985-01-01');
  const [gender, setGender] = useState<Gender>(existingMember?.gender || 'male');
  const [nid, setNid] = useState(existingMember?.nid || '');
  const [birthRegNo, setBirthRegNo] = useState(existingMember?.birthRegNo || '');
  const [mobile, setMobile] = useState(existingMember?.mobile || '');
  const [altMobile, setAltMobile] = useState(existingMember?.altMobile || '');
  const [email, setEmail] = useState(existingMember?.email || '');
  const [occupation, setOccupation] = useState(existingMember?.occupation || '');
  const [presentAddress, setPresentAddress] = useState(existingMember?.presentAddress || 'বাউনিয়া পুকুরপাড়, তুরাগ, ঢাকা-১২৩০');
  const [permanentAddress, setPermanentAddress] = useState(existingMember?.permanentAddress || 'বাউনিয়া, তুরাগ, ঢাকা');
  const [photoUrl, setPhotoUrl] = useState(existingMember?.photoUrl || '');
  const [photoBackUrl, setPhotoBackUrl] = useState(existingMember?.photoBackUrl || '');
  const [pin, setPin] = useState(existingMember?.pin || '');

  // Membership & Share Fields
  const [joinDate, setJoinDate] = useState(existingMember?.joinDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MemberStatus>(existingMember?.status || 'active');
  const [shareQty, setShareQty] = useState<number>(existingMember?.shareQty || 1);
  const [sharePrice, setSharePrice] = useState<number>(existingMember?.sharePrice || settings.defaultSharePrice || 100000);
  const [monthlyFee, setMonthlyFee] = useState<number>(existingMember?.monthlyFee || settings.defaultMonthlyFee || 1000);
  const [openingBalance, setOpeningBalance] = useState<number>(existingMember?.openingBalance || 20000);
  const [notes, setNotes] = useState(existingMember?.notes || '');

  // Nominees List State
  const [nominees, setNominees] = useState<Nominee[]>(
    existingMember?.nominees && existingMember.nominees.length > 0
      ? existingMember.nominees
      : [
          {
            id: 'NOM-1',
            name: '',
            relation: 'স্ত্রী',
            nidBirthReg: '',
            mobile: '',
            address: 'বাউনিয়া, তুরাগ, ঢাকা',
            percentage: 100,
          },
        ]
  );

  // Auto calculate total share value
  const totalShareValue = shareQty * sharePrice;

  // Calculate total nominee percentage
  const totalNomineePercent = nominees.reduce((sum, n) => sum + (Number(n.percentage) || 0), 0);
  const isNomineeValid = totalNomineePercent === 100;

  // Nominee Handlers
  const handleAddNominee = () => {
    const remaining = Math.max(0, 100 - totalNomineePercent);
    setNominees(prev => [
      ...prev,
      {
        id: `NOM-${Date.now()}`,
        name: '',
        relation: 'ছেলে',
        nidBirthReg: '',
        mobile: '',
        address: presentAddress || 'বাউনিয়া, তুরাগ, ঢাকা',
        percentage: remaining || 50,
      },
    ]);
  };

  const handleRemoveNominee = (index: number) => {
    if (nominees.length === 1) {
      showToast('কমপক্ষে একজন মনোনীত ব্যক্তি (নমিনি) আবশ্যক', 'warning');
      return;
    }
    setNominees(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNominee = (index: number, field: keyof Nominee, val: any) => {
    setNominees(prev =>
      prev.map((n, i) => (i === index ? { ...n, [field]: val } : n))
    );
  };

  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ ৫MB এর কম হতে হবে', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
      showToast('সদস্যের ছবি আপলোড হয়েছে', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleMemberPhotoBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ ৫MB এর কম হতে হবে', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBackUrl(reader.result as string);
      showToast('NID/আইডি কার্ডের পিছনের অংশের ছবি আপলোড হয়েছে', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleNomineePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ ৫MB এর কম হতে হবে', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateNominee(index, 'photoUrl', reader.result as string);
      showToast('নমিনির ছবি আপলোড হয়েছে', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameBn.trim()) {
      showToast('দয়া করে সদস্যের নাম (বাংলা) লিখুন', 'error');
      return;
    }

    if (!mobile.trim()) {
      showToast('দয়া করে মোবাইল নম্বর লিখুন', 'error');
      return;
    }

    if (!isNomineeValid) {
      showToast('মনোনীত ব্যক্তির মোট শতকরা হার অবশ্যই ১০০% হতে হবে', 'error');
      return;
    }

    const memberPayload = {
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      spouseName: spouseName.trim() || undefined,
      dob,
      gender,
      nid: nid.trim(),
      birthRegNo: birthRegNo.trim() || undefined,
      mobile: mobile.trim(),
      altMobile: altMobile.trim() || undefined,
      email: email.trim() || undefined,
      occupation: occupation.trim() || 'ব্যবসায়ী',
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      photoBackUrl: photoBackUrl.trim() || undefined,
      joinDate,
      status,
      shareQty: Number(shareQty),
      sharePrice: Number(sharePrice),
      totalShareValue,
      monthlyFee: Number(monthlyFee),
      openingBalance: Number(openingBalance),
      currentDeposit: existingMember ? existingMember.currentDeposit : Number(openingBalance),
      currentDue: existingMember ? existingMember.currentDue : 0,
      notes: notes.trim() || undefined,
      pin: pin.trim() || (mobile ? mobile.slice(-4) : '1234'),
      isPinSet: existingMember?.isPinSet ?? Boolean(pin.trim()),
      nominees,
    };

    if (isEditing && existingMember) {
      updateMember(existingMember.id, memberPayload);
      setActiveTab('members');
    } else {
      const created = addMember(memberPayload);
      setActiveTab('members');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('members')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? 'সদস্য তথ্য সম্পাদনা' : 'নতুন সদস্য নিবন্ধন ফরম'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? `সদস্য আইডি: ${existingMember?.id}` : `স্বয়ংক্রিয় আইডি: ${autoMemberId}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
            {isEditing ? existingMember?.id : autoMemberId}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">১. ব্যক্তিগত তথ্য (Personal Information)</h2>
              <p className="text-xs text-slate-500">সদস্যের প্রাথমিক পরিচিতি ও জাতীয় পরিচয়পত্র তথ্য</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            
            {/* Member Name Bangla */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সদস্যের নাম (বাংলায়) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: মো: আনোয়ার হোসেন"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Member Name English */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সদস্যের নাম (ইংরেজি)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Md. Anwar Hossain"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01833-405170"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
                />
              </div>
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পিতার নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="মরহুম আব্দুল খালেক"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মাতার নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="মোসাম্মৎ আয়েশা খাতুন"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Spouse Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                স্বামী / স্ত্রীর নাম
              </label>
              <input
                type="text"
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                placeholder="নাজনীন আক্তার"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                জন্ম তারিখ
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                লিঙ্গ (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              >
                <option value="male">পুরুষ (Male)</option>
                <option value="female">মহিলা (Female)</option>
                <option value="other">অন্যান্য (Other)</option>
              </select>
            </div>

            {/* NID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                জাতীয় পরিচয়পত্র (NID) নং <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="19822692015000123"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
              />
            </div>

            {/* Birth Reg No */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                জন্ম নিবন্ধন নম্বর (যদি থাকে)
              </label>
              <input
                type="text"
                value={birthRegNo}
                onChange={(e) => setBirthRegNo(e.target.value)}
                placeholder="20002692015000456"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
              />
            </div>

            {/* Alt Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বিকল্প মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={altMobile}
                onChange={(e) => setAltMobile(e.target.value)}
                placeholder="01712-987654"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@gmail.com"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পেশা (Occupation)
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="ব্যবসায়ী / প্রকৌশলী / প্রবাসী"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Secret Security PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                গোপন পিন (Security PIN - 4 Digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="ডিফল্ট: মোবাইলের শেষ ৪ ডিজিট"
                className="w-full px-3.5 py-2 text-xs bg-amber-50/50 border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-bold font-mono text-amber-900"
              />
              <span className="text-[10px] text-slate-400">সদস্য পোর্টালে অনধিকার প্রবেশ ঠেকানোর ৪ ডিজিটের পিন</span>
            </div>

            {/* Member Photo (Upload & URL) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সদস্যের সামনের ছবি / Profile Photo (Front)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Member Preview"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs shrink-0 bg-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                    <User className="w-7 h-7" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMemberPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        সরান
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="ছবি URL..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Member Photo Back (NID Back / Document Back) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NID / ডকুমেন্টের পিছনের ছবি (Photo Back)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {photoBackUrl ? (
                  <img
                    src={photoBackUrl}
                    alt="Photo Back Preview"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-xs shrink-0 bg-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                    <User className="w-7 h-7 opacity-50" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>পিছনের ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMemberPhotoBackUpload}
                        className="hidden"
                      />
                    </label>
                    {photoBackUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoBackUrl('')}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        সরান
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photoBackUrl}
                    onChange={(e) => setPhotoBackUrl(e.target.value)}
                    placeholder="পিছনের ছবির URL..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বর্তমান ঠিকানা (Present Address)
              </label>
              <textarea
                rows={2}
                value={presentAddress}
                onChange={(e) => setPresentAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                স্থায়ী ঠিকানা (Permanent Address)
              </label>
              <textarea
                rows={2}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Membership & Share Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">২. সদস্যপদ ও শেয়ার তথ্য (Membership & Shares)</h2>
              <p className="text-xs text-slate-500">শেয়ার কোয়ান্টিটি, শেয়ার মূল্য ও মাসিক চাঁদা নির্ধারণ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Joining Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                যোগদানের তারিখ
              </label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Member Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সদস্যের অবস্থা (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemberStatus)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              >
                <option value="active">সক্রিয় (Active)</option>
                <option value="pending">অপেক্ষমাণ (Pending)</option>
                <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
              </select>
            </div>

            {/* Share Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                শেয়ার সংখ্যা (Quantity) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={shareQty}
                onChange={(e) => setShareQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-bold text-blue-900"
              />
            </div>

            {/* Monthly Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মাসিক চাঁদা / ফি (৳)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(parseInt(e.target.value) || 1000)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রাথমিক জমা / ওপেনিং ব্যালেন্স (৳)
              </label>
              <input
                type="number"
                min={0}
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-bold text-emerald-800"
              />
            </div>

          </div>
        </div>

        {/* Card 3: Nominee Management (With 100% Validation Rule) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">৩. মনোনীত ব্যক্তি / নমিনি তথ্য (Nominee Details)</h2>
                {isNomineeValid ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>মোট ১০০% পূর্ণ</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>মোট: {totalNomineePercent}% (১০০% আবশ্যক)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                একাধিক নমিনি যোগ করা যাবে। সকল নমিনির শতকরা হারের সমষ্টি অবশ্যই ১০০% হতে হবে।
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNominee}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>আরেকজন নমিনি যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {nominees.map((nominee, idx) => (
              <div
                key={nominee.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase">
                    মনোনীত ব্যক্তি #{idx + 1}
                  </span>
                  {nominees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNominee(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-md transition cursor-pointer"
                      title="নমিনি মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      নমিনির নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nominee.name}
                      onChange={(e) => handleUpdateNominee(idx, 'name', e.target.value)}
                      placeholder="যেমন: নাজনীন আক্তার"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      সম্পর্ক (Relationship) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nominee.relation}
                      onChange={(e) => handleUpdateNominee(idx, 'relation', e.target.value)}
                      placeholder="স্ত্রী / পুত্র / কন্যা / মা"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      শতকরা হার (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={nominee.percentage}
                      onChange={(e) => handleUpdateNominee(idx, 'percentage', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-bold text-blue-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      এনআইডি / জন্ম নিবন্ধন নং
                    </label>
                    <input
                      type="text"
                      value={nominee.nidBirthReg}
                      onChange={(e) => handleUpdateNominee(idx, 'nidBirthReg', e.target.value)}
                      placeholder="19862692015000456"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      নমিনির মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={nominee.mobile}
                      onChange={(e) => handleUpdateNominee(idx, 'mobile', e.target.value)}
                      placeholder="01712-987654"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      নমিনির বর্তমান ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={nominee.address}
                      onChange={(e) => handleUpdateNominee(idx, 'address', e.target.value)}
                      placeholder="বাউনিয়া, তুরাগ, ঢাকা"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      নমিনির ছবি (Nominee Photo)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {nominee.photoUrl ? (
                        <img
                          src={nominee.photoUrl}
                          alt="Nominee"
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-1">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>নমিনির ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleNomineePhotoUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={nominee.photoUrl || ''}
                          onChange={(e) => handleUpdateNominee(idx, 'photoUrl', e.target.value)}
                          placeholder="বা ছবির লিঙ্ক (https://...)"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            বিশেষ মন্তব্য বা নোট (যদি থাকে)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="সদস্য সম্পর্কিত অতিরিক্ত কোনো তথ্য বা রেফারেন্স..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
          />
        </div>

        {/* Submit & Cancel Buttons Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            {t('cancel')}
          </button>

          <button
            type="submit"
            disabled={!isNomineeValid}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition cursor-pointer ${
              isNomineeValid 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-slate-400 cursor-not-allowed opacity-75'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'তথ্য আপডেট করুন' : 'সদস্য সংরক্ষণ ও নিবন্ধন করুন'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
