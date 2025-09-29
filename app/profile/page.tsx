"use client";

import { useEffect, useState } from "react";

import { Mail, Pen, Phone, TriangleAlert, User } from "lucide-react";
import { UserItem } from "@/app/types/userType";
import { getUser, updateUser } from "@/app/utils/user";
import Popup from "@/components/Popup";
import ConfirmModal from "@/components/ConfirmModal";

export default function Profile() {
  const [user, setUser] = useState<UserItem | null>(null);
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

    // Hapus error untuk field yang sedang diedit
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmailErrorOnEdit(false);
    setErrors({}); // Reset errors
    // Reset user data by fetching from server again
    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (data) setUser(data);
      } catch (error) {
        console.error("Gagal mendapatkan user:", error);
      }
    };
    fetchUser();
  };

  const handleSave = async () => {
    try {
      const response = await updateUser({
        name: user?.name || "",
        phone_number: user?.phone_number || "",
        file: imageFile,
      });

      if (response) {
        setErrors({}); // Reset errors
        setEmailErrorOnEdit(false);
        setIsEditing(false); // Pindah ke sini
        setImageUrl(response.image || imageUrl);
        setImageFile(null);
        setMessage(response.message);
        setPopupType("success");
        setShowPopup(true);
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors); // Tampilkan error validasi
        // Jangan setIsEditing(false) di sini, biar user tetap bisa edit
      } else {
        setMessage(error.message || "Terjadi kesalahan saat menyimpan profil.");
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (data) {
          setUser(data);
          setImageUrl(data.image || "/assets/user.png");
        }
      } catch (error) {
        console.error("Gagal mendapatkan user:", error);
      }
    };
    fetchUser();
  }, []);

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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-800 mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600">Kelola informasi profil Anda</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {/* Profile Image Section */}
          <div className="bg-primary px-6 py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform">
                  <img src={imageUrl} alt="Foto Profil" />
                </div>
                <div className="absolute inset-0 rounded-full  transition-all duration-200 flex items-center justify-center">
                  <span className="text-white opacity-0  transition-opacity text-sm font-medium">
                    📸
                  </span>
                </div>
              </div>

              <label className="inline-flex items-center px-6 py-2 bg-white text-primary text-sm font-medium rounded-full shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setImageFile(file);
                      setImageUrl(previewUrl);

                      try {
                        const response = await updateUser({
                          name: user?.name || "",
                          phone_number: user?.phone_number || "",
                          file: file,
                        });

                        if (response) {
                          setImageUrl(response.image || previewUrl);
                          setImageFile(null);
                          setMessage("Foto profil berhasil diperbarui!");
                          setPopupType("success");
                          setShowPopup(true);
                        }
                      } catch (error: any) {
                        if (error.type === "validation") {
                          setErrors(error.errors); // Tampilkan error validasi
                          // Jangan setIsEditing(false) di sini, biar user tetap bisa edit
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
                  <User size={18} className="mr-1" />
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
                  <Mail size={18} className="mr-1" />
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full border-2 bg-gray-50 border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm"
                  placeholder="Email Anda"
                />
                {emailErrorOnEdit && (
                  <p className="text-amber-600 text-sm flex items-center bg-amber-50 p-2 rounded-xl">
                    <span className="mr-1">ℹ️</span>
                    Email tidak dapat diubah untuk keamanan akun
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Phone size={18} className="mr-1" />
                  Nomor Telepon
                </label>
                <input
                  name="phone_number"
                  type="number"
                  value={user?.phone_number || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                    isEditing
                      ? "bg-white border-gray-200 focus:border-primary"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                  placeholder="Contoh: +62 812 3456 7890"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm flex items-center">
                    <TriangleAlert size={15} className="mr-1" />
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setEmailErrorOnEdit(true);
                    }}
                    className="w-full py-2 bg-primary text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Pen size={18} className="mr-2" />
                    Perbarui Profil
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmModal(true);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">💾</span>
                      Simpan Perubahan
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:from-gray-500 hover:to-gray-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">❌</span>
                      Batal
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
