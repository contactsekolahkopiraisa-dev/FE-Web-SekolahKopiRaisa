"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { fetchAllPartner } from "@/app/utils/partner";
import { createProduct } from "@/app/utils/product";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup";
import ProductListAdmin from "@/components/product/ProductListAdmin";
import ConfirmModal from "@/components/ConfirmModal";
import { getUserId } from "@/app/utils/auth";

export default function UMKMCreateProductPage() {
  // State for product data
  const [product, setProduct] = useState({
    name: "",
    partnerName: "",
    description: "",
    price: "",
    weight: "",
    stock: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for partners dropdown
  const [partners, setPartners] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);

  // State for image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));

    // Hilangkan error saat field diperbarui
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("partner_id", product.partnerName);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("weight", product.weight.toString());
      formData.append("stock", product.stock.toString());
      if (imageFile) {
        formData.append("productFile", imageFile);
      }
      const response = await createProduct(formData);

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
        router.push("/umkm/product");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors);
        setShowConfirmModal(false);
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error:", error);
        setMessage(error.message || "Terjadi kesalahan saat menyimpan berita.");
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadPartners = async () => {
      setIsLoadingPartners(true);
      try {
        // Dapatkan user_id dari user yang sedang login
        const currentUserId = getUserId();

        // Validasi jika user_id tidak ditemukan
        if (currentUserId === null) {
          console.error("User ID tidak ditemukan. Silakan login kembali.");
          setMessage("User ID tidak ditemukan. Silakan login kembali.");
          setPopupType("error");
          setShowPopup(true);
          setIsLoadingPartners(false);
          return;
        }

        const response = await fetchAllPartner();
        const rawData = response.data;

        // Filter partner berdasarkan user_id yang sedang login
        const filteredPartners = rawData.filter(
          (item: any) => item.user_id === currentUserId
        );

        const formattedData = filteredPartners.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

        setPartners(formattedData);

        // Otomatis set partner pertama (atau satu-satunya partner) yang dimiliki user
        if (formattedData.length > 0) {
          setProduct((prev) => ({
            ...prev,
            partnerName: formattedData[0].id,
          }));
        } else {
          // Jika tidak ada partner ditemukan
          setMessage(
            "Anda belum memiliki mitra. Silakan buat mitra terlebih dahulu."
          );
          setPopupType("error");
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error);
        setMessage("Gagal memuat data mitra.");
        setPopupType("error");
        setShowPopup(true);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    loadPartners();
  }, []);

  return (
    <div className="mx-auto bg-tertiary p-6 rounded-lg shadow-md">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Simpan Produk"
        description="Apakah Anda yakin ingin membuat produk baru? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <h1 className="text-lg font-medium mb-4">Tambah Produk Baru</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 text-sm">
          <div className="space-y-4">
            {/* Image Upload Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Produk
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer font-medium bg-primary text-white px-4 py-2 rounded-xl hover:-translate-y-1 duration-150 ease-in text-sm"
                >
                  Pilih Gambar
                </button>
                <span className="text-sm text-gray-500">
                  {imageFile ? imageFile.name : "Belum ada gambar dipilih"}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG. Maksimal 5MB.
              </p>
              {errors.productFile && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.productFile}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Mitra
              </label>
              {isLoadingPartners ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin w-4" />
                  <span>Memuat daftar mitra...</span>
                </div>
              ) : partners.length === 0 ? (
                <div className="w-full p-2 border border-red-300 bg-red-50 rounded-xl text-red-600 text-sm">
                  Tidak ada mitra tersedia. Silakan buat mitra terlebih dahulu.
                </div>
              ) : (
                <select
                  name="partnerName"
                  value={product.partnerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-gray-50"
                  disabled={partners.length === 1}
                >
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              )}
              {partners.length === 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  Mitra telah dipilih secara otomatis
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Produk
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat (gram)
              </label>
              <input
                type="number"
                name="weight"
                value={product.weight || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
              {errors.weight && (
                <p className="text-sm text-red-600 mt-1">{errors.weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Tersedia
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
              {errors.stock && (
                <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={partners.length === 0}
              className="cursor-pointer w-full bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Simpan Produk
            </button>
          </div>
        </form>

        {/* Product Preview using ProductListAdmin */}
        <div className="w-full md:w-1/2 max-w-100">
          <h2 className="text-lg font-medium mb-4">Pratinjau Produk</h2>
          <ProductListAdmin
            id={0}
            image={imagePreview || "/assets/noimage.png"}
            name={product.name || "Nama Produk"}
            price={product.price ? Number(product.price) : 0}
            stock={Number(product.stock) || 0}
            sold={product.stock ? 0 : 0}
            weight={product.weight ? Number(product.weight) : 0}
            partner={
              partners.length > 0
                ? {
                    name:
                      partners.find(
                        (p) => p.id.toString() === product.partnerName
                      )?.name || "Pilih Mitra",
                    id: Number(product.partnerName) || 0,
                  }
                : { name: "Pilih Mitra" }
            }
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
