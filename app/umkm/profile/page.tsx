"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, TriangleAlert, User } from "lucide-react";
import { getProfile, getProfileById, updateProfile } from "@/app/utils/profile";
import Popup from "@/components/Popup";
import ConfirmModal from "@/components/ConfirmModal";

interface Address {
  id_address: number;
  id_umkm: number;
  id_desa: number;
  alamat: string;
  kode_pos: string;
  desa: {
    id_desa: number;
    id_kecamatan: number;
    nama_desa: string;
    kecamatan: {
      id_kecamatan: number;
      id_kabupaten: number;
      nama_kecamatan: string;
      kabupaten: {
        id_kabupaten: number;
        id_provinsi: number;
        nama_kabupaten: string;
        provinsi: {
          id_provinsi: number;
          nama_provinsi: string;
        };
      };
    };
  };
}

interface UserProfile {
  id: number;
  name: string;
  image: string | null;
  email: string;
  phone_number: string;
}

interface UMKMData {
  id_umkm: number;
  id_user: number;
  nama_umkm: string;
  ktp: string;
  addresses: Address[];
  User: UserProfile;
}

export default function AdminProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [umkmData, setUmkmData] = useState<UMKMData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailErrorOnEdit, setEmailErrorOnEdit] = useState(false);

  const [errors, setErrors] = useState<
    Partial<{ name: string; email: string; phone_number: string }>
  >({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [imageUrl, setImageUrl] = useState("/assets/user.png");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : null));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmailErrorOnEdit(false);
    setErrors({});
    fetchUser();
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile({
        name: user?.name,
        phone_number: user?.phone_number,
        media: imageFile
      });

      if (response) {
        setErrors({});
        setEmailErrorOnEdit(false);
        setIsEditing(false);
        setImageUrl(response.image || imageUrl);
        setImageFile(null);
        setMessage(response.message);
        setPopupType("success");
        setShowPopup(true);
        fetchUser();
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors);
      } else {
        setMessage(error.message || "Terjadi kesalahan saat menyimpan profil.");
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  const fetchUser = async () => {
    try {
      // Ambil ID UMKM dari localStorage atau session
      const storedIdUmkm = localStorage.getItem("id_umkm");

      if (storedIdUmkm) {
        const idUmkm = parseInt(storedIdUmkm);
        console.log("UMKM ID:", idUmkm);

        // Langsung ambil data lengkap berdasarkan ID UMKM
        const detailedData = await getProfileById(idUmkm);
        console.log("Detailed API Response:", detailedData);

        if (detailedData) {
          setUmkmData(detailedData);
          setUser(detailedData.User);
          setImageUrl(detailedData.User.image || "/assets/user.png");
          console.log("User data:", detailedData.User);
          console.log("Addresses:", detailedData.addresses);
        }
      } else {
        console.error("ID UMKM tidak ditemukan di localStorage");
        setMessage("Sesi Anda telah berakhir. Silakan login kembali.");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Gagal mendapatkan user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Get the first address or null
  const primaryAddress = umkmData?.addresses?.[0] || null;

  return (
    <div className="min-h-screen bg-secondary py-8 p-4 pt-20">
      <div className="max-w-3xl mx-auto">
        {showPopup && (
          <Popup
            message={message}
            type={popupType}
            onClose={() => setShowPopup(false)}
          />
        )}

        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-800 mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600">Kelola informasi profil Anda</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {/* Profile Image Section */}
          <div className="bg-primary px-6 py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform">
                  <img
                    src={imageUrl}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <label className="inline-flex items-center px-6 py-2 bg-white text-primary text-sm font-medium rounded-full shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setImageFile(file);
                      setImageUrl(previewUrl);

                      try {
                        const response = await updateProfile({
                          name: user?.name,
                          phone_number: user?.phone_number,
                          media: file
                        });

                        if (response) {
                          setImageUrl(response.image || previewUrl);
                          setImageFile(null);
                          setMessage("Foto profil berhasil diperbarui!");
                          setPopupType("success");
                          setShowPopup(true);
                          fetchUser();
                        }
                      } catch (error: any) {
                        if (error.type === "validation") {
                          setErrors(error.errors);
                        } else {
                          setMessage(
                            error.message ||
                              "Terjadi kesalahan saat menyimpan profil."
                          );
                          setPopupType("error");
                          setShowPopup(true);
                        }
                      }
                    }
                  }}
                />
                <span className="mr-2">📸</span>
                Ubah Foto Profil
              </label>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <User size={15} className="mr-1" />
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  value={user?.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                    isEditing
                      ? "bg-white border-gray-200 focus:border-primary"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                  placeholder="Masukkan nama lengkap Anda"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center">
                    <TriangleAlert size={15} className="mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Mail size={15} className="mr-1" />
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  disabled={true}
                  className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                  placeholder="Email Anda"
                />
                {emailErrorOnEdit && (
                  <p className="text-amber-600 text-sm flex items-center bg-amber-50 p-2 rounded-lg">
                    <span className="mr-1">ℹ️</span>
                    Email tidak dapat diubah untuk keamanan akun
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Phone size={15} className="mr-1" />
                  Nomor Telepon
                </label>
                <input
                  name="phone_number"
                  type="tel"
                  value={user?.phone_number || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                    isEditing
                      ? "bg-white border-gray-200 focus:border-primary"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                  placeholder="Contoh: 089536841351"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm flex items-center">
                    <TriangleAlert size={15} className="mr-1" />
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {/* Address Information */}
              {primaryAddress && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <MapPin size={15} className="mr-1" />
                      Alamat
                    </label>
                    <input
                      type="text"
                      value={primaryAddress.alamat || ""}
                      disabled={true}
                      className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Desa
                      </label>
                      <input
                        type="text"
                        value={primaryAddress.desa.nama_desa || ""}
                        disabled={true}
                        className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Kecamatan
                      </label>
                      <input
                        type="text"
                        value={
                          primaryAddress.desa.kecamatan.nama_kecamatan || ""
                        }
                        disabled={true}
                        className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Kabupaten
                      </label>
                      <input
                        type="text"
                        value={
                          primaryAddress.desa.kecamatan.kabupaten
                            .nama_kabupaten || ""
                        }
                        disabled={true}
                        className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        value={
                          primaryAddress.desa.kecamatan.kabupaten.provinsi
                            .nama_provinsi || ""
                        }
                        disabled={true}
                        className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={primaryAddress.kode_pos || ""}
                      disabled={true}
                      className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setEmailErrorOnEdit(true);
                    }}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    ✏️ Perbarui Profil
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                    >
                      💾 Simpan Perubahan
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:from-gray-500 hover:to-gray-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                    >
                      ❌ Batal
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        <ConfirmModal
          title="Simpan Perubahan"
          description="Apakah Anda yakin ingin menyimpan perubahan ini?"
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            handleSave();
          }}
        />
      </div>
    </div>
  );
}
