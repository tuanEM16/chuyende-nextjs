'use client';

import { useState } from "react";
import UserService from "@/services/UserService";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Mật khẩu mới phải từ 6 ký tự.");
      return;
    }

    try {
      setLoading(true);
      const res = await UserService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirm,
      });

      if (res?.data?.success) {
        alert("Đổi mật khẩu thành công!");
        router.push("/user"); // hoặc /user/profile tuỳ mày
      } else {
        alert(res?.data?.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Đổi mật khẩu</h1>

      <form onSubmit={submit} className="bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="text-xs text-slate-400 mt-1">Tối thiểu 6 ký tự.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl transition
            ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"}`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {loading ? "Đang lưu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
