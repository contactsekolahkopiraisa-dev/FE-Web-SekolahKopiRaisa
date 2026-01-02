// app\signup\umkm\page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUMKM } from "@/app/utils/auth";
import {
  fetchProvinces,
  fetchRegencies,
  fetchDistricts,
  fetchVillages,
} from "@/app/utils/wilayah";
import { ChevronLeft, Eye, EyeOff, FileUp, X } from "lucide-react";
import Popup from "@/components/Popup";

export default function SignupUMKM() {
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    phone_number: string;
    nik: string;
    umkm_name: string;
    suratIzinEdar: File | null;
    addresses: Array<{
      id_desa: string;
      alamat: string;
      kode_pos: string;
    }>;
  }>({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    nik: "",
    umkm_name: "",
    suratIzinEdar: null,
    addresses: [
      {
        id_desa: "",
        alamat: "",
        kode_pos: "",
      },
    ],
  });

  const [tempAddress, setTempAddress] = useState({
    province: "",
    province_code: "",
    regency: "",
    regency_code: "",
    district: "",
    district_code: "",
    village: "",
    village_code: "",
    postal_code: "",
    address: "",
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<
    Array<{
      code: string;
      name: string;
      postal_code?: string;
    }>
  >([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<{
      name: string;
      email: string;
      password: string;
      phone_number: string;
      nik: string;
      umkm_name: string;
      suratIzinEdar: string;
      postal_code: string;
      province: string;
      regency: string;
      district: string;
      village: string;
      address: string;
    }>
  >({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load provinces
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetchProvinces();
        if (response.success && response.data) {
          setProvinces(response.data);
        }
      } catch (error: any) {
        console.error("Error loading provinces:", error.message);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load regencies
  useEffect(() => {
    const loadRegencies = async () => {
      if (!tempAddress.province_code) {
        setRegencies([]);
        return;
      }

      setLoadingRegencies(true);
      try {
        const response = await fetchRegencies(tempAddress.province_code);
        if (response.success && response.data) {
          setRegencies(response.data);
        }
      } catch (error: any) {
        console.error("Error loading regencies:", error.message);
      } finally {
        setLoadingRegencies(false);
      }
    };

    loadRegencies();
  }, [tempAddress.province_code]);

  // Load districts
  useEffect(() => {
    const loadDistricts = async () => {
      if (!tempAddress.regency_code) {
        setDistricts([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const response = await fetchDistricts(tempAddress.regency_code);
        if (response.success && response.data) {
          setDistricts(response.data);
        }
      } catch (error: any) {
        console.error("Error loading districts:", error.message);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [tempAddress.regency_code]);

  // Load villages
  useEffect(() => {
    const loadVillages = async () => {
      if (!tempAddress.district_code) {
        setVillages([]);
        return;
      }

      setLoadingVillages(true);
      try {
        const response = await fetchVillages(tempAddress.district_code);
        if (response.success && response.data) {
          setVillages(response.data);
        }
      } catch (error: any) {
        console.error("Error loading village:", error.message);
      } finally {
        setLoadingVillages(false);
      }
    };

    loadVillages();
  }, [tempAddress.district_code]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 13) return;
      setForm({ ...form, phone_number: numericValue });
      if (errors.phone_number) {
        setErrors((prev) => ({ ...prev, phone_number: "" }));
      }
      return;
    }

    if (name === "nik") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 16) return;
      setForm({ ...form, nik: numericValue });
      if (errors.nik) {
        setErrors((prev) => ({ ...prev, nik: "" }));
      }
      return;
    }

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.name === value);
      setTempAddress({
        ...tempAddress,
        province: value,
        province_code: selectedProvince?.code || "",
        regency: "",
        regency_code: "",
        district: "",
        district_code: "",
        village: "",
        village_code: "",
      });
    } else if (name === "regency") {
      const selectedRegency = regencies.find((r) => r.name === value);
      setTempAddress({
        ...tempAddress,
        regency: value,
        regency_code: selectedRegency?.code || "",
        district: "",
        district_code: "",
        village: "",
        village_code: "",
      });
    } else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setTempAddress({
        ...tempAddress,
        district: value,
        district_code: selectedDistrict?.code || "",
        village: "",
        village_code: "",
      });
    } else if (name === "village") {
      const selectedVillage = villages.find((v) => v.name === value);

      setTempAddress({
        ...tempAddress,
        village: value,
        village_code: selectedVillage?.code || "",
      });

      setForm({
        ...form,
        addresses: [
          {
            id_desa: selectedVillage?.code || "",
            alamat: tempAddress.address,
            kode_pos: tempAddress.postal_code,
          },
        ],
      });
    } else if (name === "postal_code") {
      setTempAddress({
        ...tempAddress,
        postal_code: value,
      });

      setForm({
        ...form,
        addresses: [
          {
            ...form.addresses[0],
            kode_pos: value,
          },
        ],
      });
    } else if (name === "address") {
      setTempAddress({
        ...tempAddress,
        address: value,
      });

      setForm({
        ...form,
        addresses: [
          {
            ...form.addresses[0],
            alamat: value,
          },
        ],
      });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ PERBAIKAN: Handler file yang lebih ketat
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;

  // Reset error
  setErrors((prev) => ({ ...prev, suratIzinEdar: "" }));

  // Validasi: pastikan hanya 1 file
  if (!files || files.length === 0) {
    setForm({ ...form, suratIzinEdar: null });
    return;
  }

  if (files.length > 1) {
    setErrors((prev) => ({
      ...prev,
      suratIzinEdar: "Hanya boleh upload 1 file",
    }));
    e.target.value = "";
    setForm({ ...form, suratIzinEdar: null }); // ✅ Reset form state
    return;
  }

  const file = files[0];

  // Validasi ukuran file (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    setErrors((prev) => ({
      ...prev,
      suratIzinEdar: `Ukuran file terlalu besar (${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB). Maksimal 5MB`,
    }));
    e.target.value = "";
    setForm({ ...form, suratIzinEdar: null });
    return;
  }

  // Validasi format file
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (!allowedTypes.includes(file.type)) {
    setErrors((prev) => ({
      ...prev,
      suratIzinEdar: `Format tidak didukung (${file.type}). Gunakan PDF, JPG, atau PNG`,
    }));
    e.target.value = "";
    setForm({ ...form, suratIzinEdar: null });
    return;
  }

  setForm({ ...form, suratIzinEdar: file });
};

  // ✅ PERBAIKAN: Handler hapus file
  const handleRemoveFile = () => {
    setForm({ ...form, suratIzinEdar: null });
    setErrors((prev) => ({ ...prev, suratIzinEdar: "" }));

    // Reset input file
    const input = document.getElementById(
      "halal-certificate-input"
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!form.phone_number.trim()) {
      newErrors.phone_number = "No. HP wajib diisi";
    } else if (!/^08\d{8,11}$/.test(form.phone_number)) {
      newErrors.phone_number =
        "Format tidak valid. Gunakan 08xxxxxxxxxx (10-13 digit)";
    }

    if (!form.nik.trim()) {
      newErrors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(form.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }

    if (!form.umkm_name.trim()) newErrors.umkm_name = "Nama UMKM wajib diisi";

    if (!form.addresses[0].kode_pos) {
      newErrors.postal_code = "Kode Pos wajib diisi";
    } else if (!/^\d{5}$/.test(form.addresses[0].kode_pos)) {
      newErrors.postal_code = "Kode Pos harus 5 digit angka";
    }

    if (!tempAddress.province) newErrors.province = "Provinsi wajib dipilih";
    if (!tempAddress.regency) newErrors.regency = "Kabupaten wajib dipilih";
    if (!tempAddress.district) newErrors.district = "Kecamatan wajib dipilih";
    if (!tempAddress.village) newErrors.village = "Desa wajib dipilih";
    if (!form.addresses[0].alamat.trim())
      newErrors.address = "Alamat wajib diisi";
    if (!form.addresses[0].id_desa) newErrors.village = "Desa wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSubmitting) return;

  if (!validateForm()) {
    setMessage("Mohon lengkapi semua field yang wajib diisi dengan benar");
    setPopupType("error");
    setShowPopup(true);
    return;
  }

  setIsSubmitting(true);

  try {
    // ✅ PERBAIKAN: Jangan gunakan || undefined
    const submitData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone_number: form.phone_number,
      namaUmkm: form.umkm_name.trim(),
      ktp: form.nik,
      suratIzinEdar: form.suratIzinEdar, // ✅ Kirim langsung tanpa || undefined
      addresses: form.addresses.map((addr) => ({
        id_desa: parseInt(addr.id_desa),
        alamat: addr.alamat.trim(),
        kode_pos: addr.kode_pos,
      })),
    };

    console.log("🚀 Submitting data:", {
      ...submitData,
      suratIzinEdar: submitData.suratIzinEdar
        ? `FILE: ${submitData.suratIzinEdar.name} (${submitData.suratIzinEdar.size} bytes)`
        : "NO FILE",
    });

    const response = await registerUMKM(submitData);

    if (response && response.message) {
      sessionStorage.setItem(
        "popup",
        JSON.stringify({
          message: response.message,
          type: "success",
        })
      );
      router.push("/signup/umkm/verification");
    }
  } catch (error: any) {
    if (error.type === "validation") {
      setErrors(error.errors || {});
      setMessage(error.message || "Validasi gagal");
    } else {
      setMessage(error.message || "Terjadi kesalahan saat mendaftar");
    }
    setPopupType("error");
    setShowPopup(true);
  } finally {
    setIsSubmitting(false);
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium">
                      Kata Sandi
                    </label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      placeholder="Masukkan kata sandi (min. 6 karakter)"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="cursor-pointer absolute top-7.5 right-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">No. HP</label>
                    <input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      placeholder="Contoh: 08xxxxxxxxxx"
                      disabled={isSubmitting}
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
                      placeholder="Masukkan NIK (16 digit)"
                      maxLength={16}
                      disabled={isSubmitting}
                    />
                    {errors.nik && (
                      <p className="text-red-500 text-sm mt-1">{errors.nik}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: 16 digit angka
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Nama UMKM
                    </label>
                    <input
                      name="umkm_name"
                      value={form.umkm_name}
                      onChange={handleChange}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      placeholder="Masukkan nama UMKM"
                      disabled={isSubmitting}
                    />
                    {errors.umkm_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.umkm_name}
                      </p>
                    )}
                  </div>

                  {/* ✅ PERBAIKAN: Upload file yang lebih jelas */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Surat Izin Edar (Opsional)
                    </label>

                    {!form.suratIzinEdar ? (
                      <div className="relative w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
                        <input
                          name="suratIzinEdar"
                          onChange={handleFileChange}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="halal-certificate-input"
                          disabled={isSubmitting}
                          multiple={false}
                        />
                        <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                          <FileUp size={32} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            Klik atau drag file ke sini
                          </p>
                          <p className="text-xs text-gray-400">
                            PDF, JPG, PNG (Max 5MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileUp
                              size={24}
                              className="text-green-600 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-green-800 truncate">
                                {form.suratIzinEdar.name}
                              </p>
                              <p className="text-xs text-green-600">
                                {(form.suratIzinEdar.size / 1024).toFixed(2)}{" "}
                                KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                            disabled={isSubmitting}
                          >
                            <X size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    {errors.suratIzinEdar && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.suratIzinEdar}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4 mt-4 md:mt-0">
                  <div>
                    <label className="block text-sm font-medium">
                      Kode Pos
                    </label>
                    <input
                      name="postal_code"
                      type="text"
                      value={tempAddress.postal_code}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      placeholder="Contoh: 68124"
                      maxLength={5}
                    />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postal_code}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: 5 digit angka
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Provinsi
                    </label>
                    <select
                      name="province"
                      value={tempAddress.province}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      disabled={loadingProvinces}
                    >
                      <option value="">
                        {loadingProvinces ? "Loading..." : "Pilih Provinsi"}
                      </option>
                      {provinces.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.province}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium">
                      Kabupaten
                    </label>
                    <select
                      name="regency"
                      value={tempAddress.regency}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-xl disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!tempAddress.province || loadingRegencies}
                    >
                      <option value="">
                        {!tempAddress.province
                          ? "Pilih provinsi terlebih dahulu"
                          : loadingRegencies
                          ? "Loading..."
                          : "Pilih Kabupaten"}
                      </option>
                      {regencies.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.regency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.regency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Kecamatan
                    </label>
                    <select
                      name="district"
                      value={tempAddress.district}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-xl  disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!tempAddress.regency || loadingDistricts}
                    >
                      <option value="">
                        {!tempAddress.regency
                          ? "Pilih kabupaten terlebih dahulu"
                          : loadingDistricts
                          ? "Loading..."
                          : "Pilih Kecamatan"}
                      </option>
                      {districts.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Desa</label>
                    <select
                      name="village"
                      value={tempAddress.village}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-xl disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!tempAddress.district || loadingVillages}
                    >
                      <option value="">
                        {!tempAddress.district
                          ? "Pilih kecamatan terlebih dahulu"
                          : loadingVillages
                          ? "Loading..."
                          : "Pilih Desa"}
                      </option>
                      {villages.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.village && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.village}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Alamat</label>
                    <input
                      name="address"
                      value={tempAddress.address}
                      onChange={handleChange}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-xl"
                      placeholder="Masukkan alamat lengkap"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">
                      Dengan membuat akun, Anda menyetujui{" "}
                      <span className="text-brown-700 font-medium">
                        Syarat Layanan
                      </span>{" "}
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
