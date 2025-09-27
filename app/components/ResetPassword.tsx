"use client";

import { useState, Suspense } from "react";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Popup from "../components/Popup";
import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "../utils/auth";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { password, confirmPassword } = form;

    const newErrors: Partial<typeof form> = {};
    if (!password) newErrors.password = "*Password harus diisi";
    if (!confirmPassword)
      newErrors.confirmPassword = "*Konfirmasi password harus diisi";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "*Password tidak cocok";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetPassword({
        token: token ?? "", // dari useSearchParams
        newPassword: password,
      });

      setMessage("Password berhasil direset");
      setPopupType("success");
      setShowPopup(true);
      setForm({ password: "", confirmPassword: "" });
      setTimeout(() => router.replace("/login"), 2000);
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan saat reset password");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6 md:p-10 min-h-[500px] flex flex-col justify-center overflow-hidden">
        {/* Flower top */}
        <div className="absolute -top-2 right-0 z-0">
          <Image
            src="/assets/flower-top.png"
            alt="Flower Top"
            width={100}
            height={100}
            className="w-20 md:w-24"
          />
        </div>
        {/* Flower bottom */}
        <div className="absolute bottom-0 left-0 z-0">
          <Image
            src="/assets/flower-bottom.png"
            alt="Flower Bottom"
            width={100}
            height={100}
            className="w-20 md:w-24"
          />
        </div>

        <div className="relative z-10">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-black transition-all inline-flex items-center mb-4"
          >
            <ChevronLeft size={18} className="mr-1" />
            Kembali ke Login
          </Link>

          <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Password Baru
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Konfirmasi Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
                placeholder="Ulangi password baru"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl mt-4 hover:-translate-y-1 duration-150 ease-in"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
