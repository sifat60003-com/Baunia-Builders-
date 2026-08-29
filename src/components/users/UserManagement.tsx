import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Phone, 
  Lock, 
  Edit3, 
  Trash2,
  CheckCircle2,
  XCircle,
  Key,
  Camera,
  Upload
} from 'lucide-react';
import { UserRole, User } from '../../types';

export const UserManagement: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    currentUser, 
    language, 
    t, 
    showToast 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('collector');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setName('');
    setUsername('');
    setEmail('');
    setRole('collector');
    setAvatar('');
    setPassword('123456');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setUsername((user as any).username || user.email?.split('@')[0] || user.id);
    setEmail(user.email || '');
    setRole(user.role);
    setAvatar(user.avatar || (user as any).avatarUrl || '');
    setPassword('******');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবি সর্বোচ্চ ৫ মেগাবাইট হতে পারবে', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      showToast('ছবি যুক্ত হয়েছে', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('নাম আবশ্যক', 'error');
      return;
    }

    if (editingUserId) {
      updateUser(editingUserId, {
        name: name.trim(),
        email: email.trim() || undefined,
        role,
        avatar: avatar.trim() || undefined
      });
      showToast('ব্যবহারকারীর তথ্য ও ছবি আপডেট করা হয়েছে ✅', 'success');
    } else {
      addUser({
        name: name.trim(),
        username: username.trim() || undefined,
        email: email.trim() || undefined,
        role,
        avatar: avatar.trim() || undefined,
        status: 'active',
      } as any);
      showToast('নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে ✅', 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navUsers')} (User Roles & Access Control)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            সিস্টেম এডমিন, একাউন্ট্যান্ট ও আদায়কারীদের রোল ও অনুমতি ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addUserBtn')}</span>
        </button>
      </div>

      {/* Role Badge Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
          <div className="font-extrabold text-purple-900">সুপার এডমিন (Super Admin)</div>
          <div className="text-[11px] text-purple-700 mt-0.5">সকল মডিউল ও ডাটাবেস এক্সেস</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
          <div className="font-extrabold text-blue-900">এডমিন (Admin)</div>
          <div className="text-[11px] text-blue-700 mt-0.5">সদস্য, শেয়ার ও অর্থ ব্যবস্থাপনা</div>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
          <div className="font-extrabold text-emerald-900">হিসাবরক্ষক (Accountant)</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">আয়-ব্যয়, ভাউচার ও ক্যাশ বুক</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
          <div className="font-extrabold text-amber-900">আদায়কারী (Collector)</div>
          <div className="text-[11px] text-amber-800 mt-0.5">মাঠ পর্যায়ে চাঁদা আদায় ও রসিদ</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ইউজার ও নাম</th>
                <th className="py-3 px-4">ইউজারনেম</th>
                <th className="py-3 px-4">ইমেইল</th>
                <th className="py-3 px-4">ভূমিকা (Role)</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {u.avatar || (u as any).avatarUrl ? (
                        <img
                          src={u.avatar || (u as any).avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        {currentUser.id === u.id && (
                          <span className="text-[10px] text-blue-600 font-bold">(বর্তমান লগইন)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    @{(u as any).username || u.email?.split('@')[0] || u.id}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {u.email || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      u.role === 'super_admin' ? 'bg-purple-100 text-purple-900' :
                      u.role === 'admin' ? 'bg-blue-100 text-blue-900' :
                      u.role === 'accountant' ? 'bg-emerald-100 text-emerald-900' :
                      u.role === 'collector' ? 'bg-amber-100 text-amber-900' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role === 'super_admin' ? 'সুপার এডমিন' :
                       u.role === 'admin' ? 'এডমিন' :
                       u.role === 'accountant' ? 'হিসাবরক্ষক' :
                       u.role === 'collector' ? 'কালেক্টর' : 'সদস্য'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সক্রিয়</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="সম্পাদনা ও ছবি পরিবর্তন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingUserId ? 'ব্যবহারকারীর তথ্য ও ছবি সম্পাদনা' : 'নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {/* Avatar Upload */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="relative shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-600" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-xs transition">
                    <Upload className="w-3 h-3" />
                    <span>প্রোফাইল ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400">JPG/PNG (সর্বোচ্চ ৫ মেগাবাইট)</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মো: কামরুল হাসান"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইউজারনেম *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="kamrul"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভূমিকা (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="admin">এডমিন (Admin)</option>
                    <option value="accountant">হিসাবরক্ষক (Accountant)</option>
                    <option value="collector">টাকা আদায়কারী (Collector)</option>
                    <option value="member">সদস্য (Member)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamrul@bauniabuilders.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ছবির ওয়েব লিংক (URL)</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingUserId ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
