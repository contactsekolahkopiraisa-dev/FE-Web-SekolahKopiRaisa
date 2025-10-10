"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/utils/auth";
import { ChevronLeft, Eye, EyeOff, FileUp } from "lucide-react";
import Popup from "@/components/Popup";

export default function SignupUMKM() {
    const [form, setForm] = useState<{
        name: string;
        email: string;
        password: string;
        phone_number: string;
        nik: string;
        umkm_name: string;
        halal_certificate: File | null;
        postal_code: string;
        province: string;
        district: string;
        subdistrict: string;
        village: string;
        address: string;
      }>({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        nik: "",
        umkm_name: "",
        halal_certificate: null,
        postal_code: "",
        province: "",
        district: "",
        subdistrict: "",
        village: "",
        address: "",
      });
      const [showPassword, setShowPassword] = useState(false);
      const [errors, setErrors] = useState<Partial<{
        name: string;
        email: string;
        password: string;
        phone_number: string;
        nik: string;
        umkm_name: string;
        halal_certificate: string;
        postal_code: string;
        province: string;
        district: string;
        subdistrict: string;
        village: string;
        address: string;
      }>>({});
      const [showPopup, setShowPopup] = useState(false);
      const [message, setMessage] = useState("");
      const [popupType, setPopupType] = useState<"success" | "error">("success");
      const router = useRouter();
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for field
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setForm({ ...form, halal_certificate: file ?? null });
        setErrors((prev) => ({ ...prev, halal_certificate: "" }));
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          // Membuat copy form tanpa halal_certificate jika masih dummy/testing
          const submitData = { ...form };
          
          // Bypass halal_certificate untuk testing (bisa dihapus nanti)
          if (!submitData.halal_certificate) {
            // Bisa di-comment jika sudah production
            console.log("Halal certificate bypassed for testing");
          }
          
          const response = await registerUser(submitData);
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
        <div className="min-h-screen flex flex-col">
            {showPopup && (
                <Popup
                message={message}
                type={popupType}
                onClose={() => setShowPopup(false)}
                />
            )}

            <div className="flex justify-center items-center bg-background relative p-4 md:p-8 lg:p-10">
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

                <div className="relative z-10 max-w-4xl w-full shadow-2xl bg-white rounded-2xl px-10 py-8 md:py-12">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-black transition-all inline-flex items-center"
                    >
                        <ChevronLeft /> Kembali ke Homepage
                    </Link>
                    <h1 className="text-2xl font-medium mb-6">Welcome</h1>
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div className="flex flex-col md:flex-row md:gap-14">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nama</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan nama pemilik umkm"
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

                                <div>
                                    <label className="block text-sm font-medium">NIK</label>
                                    <input
                                        name="nik"
                                        value={form.nik}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan NIK"
                                    />
                                    {errors.nik && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nik}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Nama UMKM</label>
                                    <input
                                        name="umkm_name"
                                        value={form.umkm_name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan nama UMKM"
                                    />
                                    {errors.umkm_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.umkm_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Sertifikasi Halal <span className="text-gray-400 text-xs">(Opsional)</span>
                                    </label>
                                    <div className="relative w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
                                        <input
                                            name="halal_certificate"
                                            onChange={handleFileChange}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <FileUp size={32} className="text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                {form.halal_certificate 
                                                    ? form.halal_certificate.name 
                                                    : "Klik atau drag file ke sini"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Format: .pdf, .jpg, .png (Max 5MB)
                                            </p>
                                        </div>
                                    </div>
                                    {errors.halal_certificate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.halal_certificate}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mt-4 md:mt-0">
                                <div>
                                    <label className="block text-sm font-medium">Kode Pos</label>
                                    <input
                                        name="postal_code"
                                        value={form.postal_code}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan kode pos"
                                    />
                                    {errors.postal_code && (
                                        <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Provinsi</label>
                                    <input
                                        name="province"
                                        value={form.province}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan provinsi"
                                    />
                                    {errors.province && (
                                        <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium">Kabupaten</label>
                                    <input
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan kabupaten"
                                    />
                                    {errors.district && (
                                        <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Kecamatan</label>
                                    <input
                                        name="subdistrict"
                                        value={form.subdistrict}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan kecamatan"
                                    />
                                    {errors.subdistrict && (
                                        <p className="text-red-500 text-sm mt-1">
                                        {errors.subdistrict}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium">Desa</label>
                                    <input
                                        name="village"
                                        value={form.village}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan desa"
                                    />
                                    {errors.village && (
                                        <p className="text-red-500 text-sm mt-1">{errors.village}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium">Alamat</label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-xl"
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-600">
                                    Dengan membuat akun, Anda menyetujui{" "}
                                    <span className="text-brown-700 font-medium">Syarat Layanan</span>{" "}
                                    dan{" "}
                                    <span className="text-brown-700 font-medium">
                                        Kebijakan Privasi
                                    </span>{" "}
                                    kami.
                                    </p>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl hover:-translate-y-1 duration-150 ease-in"
                                >
                                    Buat Akun
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center my-1 md:my-2">
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
                            Daftar sebagai Customer?
                            <Link
                            href="/signup"
                            className="text-blue-500 font-medium hover:underline ml-1"
                            >
                            Daftar
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}