"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import {
  loginUser,
  loginWithGoogle,
  resetPasswordRequest,
} from "../utils/auth";
import { useRouter } from "next/navigation";
import Popup from "../components/Popup";

export default function Login() {
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for field
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(form);
      console.log("User logged in:", user);

      if (user.user.admin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors);
      } else {
        setMessage(error.message || "Terjadi kesalahan");
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  useEffect(() => {
    const popupData = sessionStorage.getItem("popup");
    if (popupData) {
      const { message, type } = JSON.parse(popupData);
      setMessage(message);
      setPopupType(type);
      setShowPopup(true);
      sessionStorage.removeItem("popup");
    }
  }, []);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi email sederhana
    if (!forgotPasswordEmail) {
      setEmailError("*Email harus diisi");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setEmailError("*Email tidak valid");
      return;
    }

    try {
      const response = await resetPasswordRequest(forgotPasswordEmail); // Simpan respons
      setMessage(response.message);
      setPopupType("success");
      setShowPopup(true);
      setShowForgotPasswordModal(false);
      setForgotPasswordEmail("");
      setEmailError("");
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan saat mengirim email");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-12">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      {/* Modal Forgot Password */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reset Password</h2>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Masukkan Email
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => {
                    setForgotPasswordEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                  placeholder="Masukkan alamat email"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="cursor-pointer flex-1 p-2 border border-gray-300 rounded-xl hover:-translate-y-1 duration-150 ease-in"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 p-2 bg-primary text-white rounded-xl hover:-translate-y-1 duration-150 ease-in"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="md:col-span-12 lg:col-span-6 flex justify-center items-center bg-background relative p-4 md:p-8 lg:p-10 order-2 md:order-1">
        {/* Background decoration */}
        <div className="absolute -top-13 right-0 -z-0 hidden md:block">
          <img
            src="/assets/flower-top.png"
            alt="Flower Top"
            className="w-20 sm:w-24 md:w-90"
          />
        </div>
        <div className="absolute bottom-0 left-0 -z-0 hidden md:block">
          <img
            src="/assets/flower-bottom.png"
            alt="Flower Bottom"
            className="w-20 sm:w-24 md:w-80"
          />
        </div>

        <div className="relative z-10 max-w-lg w-full px-4 py-8 md:py-12">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-black transition-all inline-flex items-center"
          >
            <ChevronLeft /> Kembali ke Homepage
          </Link>
          <h1 className="text-2xl font-medium mb-6">Welcome</h1>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-sm font-medium">
                Email/Nomer Hp
              </label>
              <input
                name="emailOrPhone"
                value={form.emailOrPhone}
                onChange={handleChange}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-xl"
                placeholder="Masukkan email atau nomor hp"
              />
              {errors.emailOrPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="cursor-pointer text-xs md:text-sm text-blue-500 hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded-xl"
                placeholder="Masukkan kata sandi"
              />

              <button
                type="button"
                className="cursor-pointer absolute top-8 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl mt-4 hover:-translate-y-1 duration-150 ease-in text-sm"
            >
              Masuk
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">Atau</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <button
            type="button"
            className="cursor-pointer w-full p-2 bg-gray-300 border-gray-400 border rounded-xl hover:-translate-y-1 duration-150 ease-in text-sm flex items-center gap-2 justify-center"
            onClick={loginWithGoogle}
          >
            <img
              src="/assets/google-logo.png"
              alt="Google Icon"
              width={15}
            />
            Lanjutkan Dengan Google
          </button>
          {/* <button
            type="button"
            className="cursor-pointer w-full p-1.5 bg-gray-300 rounded-xl border-gray-400 border hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 text-sm"
            onClick={loginWithGoogle}
          >
            <img
              src="/assets/google-logo.png"
              alt="Google Icon"
              width={15}
            />
            Lanjutkan Dengan Google
          </button> */}

          <p className="text-center mt-4 text-gray-700 text-sm">
            Belum punya akun?
            <Link
              href="/signup"
              className="text-blue-500 font-medium hover:underline ml-1"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>

      <div
        className="md:col-span-12 lg:col-span-6 min-h-[30vh] md:min-h-[50vh] lg:min-h-screen flex-shrink-0 order-1 md:order-2"
        style={{
          backgroundImage: "url('/assets/login_image.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
