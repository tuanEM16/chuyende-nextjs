'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import UserService from '@/services/UserService';


const Icon = ({ path, size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
  </svg>
);

const HomeIcon = (props) => (
  <Icon
    path={[
      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      '9 22 9 12 15 12 15 22',
    ]}
    {...props}
  />
);
const UserIcon = (props) => (
  <Icon
    path={[
      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    ]}
    {...props}
  />
);
const CameraIcon = (props) => (
  <Icon
    path={[
      'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z',
      'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    ]}
    {...props}
  />
);
const SaveIcon = (props) => (
  <Icon
    path={[
      'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
      'M17 21v-8H7v8',
      'M7 3v5h8',
    ]}
    {...props}
  />
);

export default function UserEditPage() {
  const router = useRouter();


  const auth = useAuth();
  const user = auth?.user || null;
  const isLoading = auth?.isLoading ?? false;
  const updateUser = auth?.updateUser ?? (() => { });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    username: '',
    email: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');


  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);


  useEffect(() => {
    if (!isLoading && user) {
      setForm((prev) => ({
        ...prev,
        name: user?.name || '',
        phone: user?.phone || '',
        username: user?.username || '',
        email: user?.email || '',
      }));
      setPageLoading(false);
    }
  }, [isLoading, user]);


  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const initialLetter = useMemo(() => {
    const n = (form.name || user?.name || '').trim();
    return n ? n[0].toUpperCase() : 'U';
  }, [form.name, user?.name]);

  const onChange = (key) => (e) => {
    setErrorMsg('');
    setOkMsg('');
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const onPickAvatar = (e) => {
    setErrorMsg('');
    setOkMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const okType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
    if (!okType) {
      setErrorMsg('Avatar chỉ nhận PNG/JPG/WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Avatar tối đa 2MB.');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Tên không được để trống.';
    if (!form.phone.trim()) return 'Số điện thoại không được để trống.';
    if (!form.username.trim()) return 'Username không được để trống.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setOkMsg('');

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setSubmitting(true);
    try {

      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('phone', form.phone);
      fd.append('username', form.username);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res1 = await UserService.updateProfile(fd);

      const updated = res1?.data?.data || res1?.data?.user || res1?.data?.result || null;

      if (updated) {
        updateUser(updated);
      } else {
        updateUser({
          ...user,
          name: form.name,
          phone: form.phone,
          username: form.username,
          ...(avatarPreview ? { avatar: avatarPreview } : {}),
        });
      }

      setOkMsg('Cập nhật thông tin thành công ✅');
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'Cập nhật thất bại. Kiểm tra API/Token.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || pageLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Đang tải trang chỉnh sửa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 border-b pb-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Chỉnh sửa hồ sơ</h1>

        <div className="flex items-center gap-3">
          <Link href="/user" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
            Quay lại hồ sơ
          </Link>
          <Link href="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group">
            <HomeIcon size={20} className="mr-2 group-hover:scale-110 transition-transform" />
            Trang chủ
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-8">
        {errorMsg && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">{errorMsg}</div>
        )}
        {okMsg && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">{okMsg}</div>
        )}

        {/* Avatar + Basic */}
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center border-b pb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-100 bg-indigo-100 flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : user.avatar ? (
              <img src={UserService.getImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
            )

              : (
                <span className="text-indigo-700 text-3xl font-bold">{initialLetter}</span>
              )}

            <label
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow cursor-pointer hover:bg-indigo-700 transition"
              title="Đổi avatar"
            >
              <CameraIcon size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-600" />
              Thông tin cá nhân
            </h2>
            <p className="text-slate-500 text-sm mt-1">Cập nhật tên, số điện thoại, username và avatar.</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Họ tên</label>
            <input
              value={form.name}
              onChange={onChange('name')}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại</label>
            <input
              value={form.phone}
              onChange={onChange('phone')}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              value={form.username}
              onChange={onChange('username')}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              value={form.email}
              disabled
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Email thường không cho sửa.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link href="/user" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
            Hủy
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <SaveIcon size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
