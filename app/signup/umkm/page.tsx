"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/utils/auth";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Popup from "@/components/Popup";
import { Navigation } from 'swiper/modules';

export default function SignupUMKM() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
      });
      const [showPassword, setShowPassword] = useState(false);
      const [errors, setErrors] = useState<Partial<typeof form>>({});
      const [showPopup, setShowPopup] = useState(false);
      const [message, setMessage] = useState("");
      const [popupType, setPopupType] = useState<"success" | "error">("success");
      const router = useRouter();
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for field
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await registerUser(form);
          if (response && response.message) {
            // Simpan ke sessionStorage
            sessionStorage.setItem(
              "popup",
              JSON.stringify({
                message: response.message,
                type: "success",
              })
            );
    
            // Langsung redirect tanpa delay
            router.push("/login");
          }
        } catch (error: any) {
          if (error.type === "validation") {
            setErrors(error.errors); // munculkan pesan error di bawah input
          } else {
            setMessage(error.message || "Terjadi kesalahan");
            setPopupType("error");
            setShowPopup(true); // munculkan popup
          }
        }
      };
    return (
        <>
        <div className="min-h-screen flex flex-col md:grid md:grid-cols-12">
            {showPopup && (
                <Popup
                message={message}
                type={popupType}
                onClose={() => setShowPopup(false)}
                />
            )}

            <div className="md:col-span-12 lg:col-span-6 flex justify-center items-center bg-background relative p-4 md:p-8 lg:p-10 order-2 md:order-1">
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
                            <label className="block text-sm font-medium">Nama</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-xl"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-xl"
                                placeholder="Masukkan email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium">Kata Sandi</label>
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
                                className="cursor-pointer absolute top-7.5 right-3 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">No. HP</label>
                            <input
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-xl"
                                placeholder="Masukkan nomor hp"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">
                                {errors.phone_number}
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-gray-600">
                        Dengan membuat akun, Anda menyetujui{" "}
                        <span className="text-brown-700 font-medium">Syarat Layanan</span>{" "}
                        dan{" "}
                        <span className="text-brown-700 font-medium">
                            Kebijakan Privasi
                        </span>{" "}
                        kami.
                        </p>
                        <button
                        type="submit"
                        className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl hover:-translate-y-1 duration-150 ease-in"
                        >
                        Buat Akun
                        </button>
                    </form>

                    <div className="flex items-center my-3 md:my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-500 text-sm">Atau</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <p className="text-center mt-4 text-gray-700 text-sm">
                        Sudah punya akun?
                        <Link
                        href="/login"
                        className="text-blue-500 font-medium hover:underline ml-1"
                        >
                        Masuk
                        </Link>
                    </p>
                    <p className="text-center mt-4 text-gray-700 text-sm">
                        Daftar sebagai UMKM?
                        <Link
                        href="/signup/umkm"
                        className="text-blue-500 font-medium hover:underline ml-1"
                        >
                        Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}