"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { fetchAllPartner } from "@/app/utils/partner";
import {
  createProduct,
  fetchProductById,
  updateProduct,
} from "@/app/utils/product";
import { useParams, useRouter } from "next/navigation";
import Popup from "@/components/Popup";
import ProductListAdmin from "@/components/product/ProductListAdmin";
import ConfirmModal from "@/components/ConfirmModal";

export default function EditProductPage() {
  // State for product data
  const [product, setProduct] = useState({
    name: "",
    partnerId: "",
    description: "",
    price: "",
    weight: "",
    stock: "",
  });

  const params = useParams();
  const productId = params?.id;

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
      [name]: value, // ✅ Simpan sebagai string, jangan konversi langsung
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
      formData.append("partner_id", product.partnerId);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("weight", product.weight.toString());
      formData.append("stock", product.stock.toString());
      if (imageFile) {
        formData.append("productFile", imageFile); // ⬅️ Ini ditambahkan
      }
      const response = await updateProduct(
        Number(productId), // Convert productId to number
        formData
      );

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
        router.push("/admin/product");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors); // ✅ Ambil langsung dari backend
        setShowConfirmModal(false);
      } else {
        console.error("Error:", error);
        setMessage(error.message || "Terjadi kesalahan saat menyimpan berita.");
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    const loadPartners = async () => {
      setIsLoadingPartners(true);
      try {
        const response = await fetchAllPartner();
        const rawData = response.data;
        const formattedData = rawData.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setPartners(formattedData);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    loadPartners();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      try {
        const response = await fetchProductById(Number(productId)); // Convert productId to number
        const product = response.data;
        setProduct({
          name: product.name || "",
          partnerId: product.partner_id?.toString() || "", // ✅ ganti ke partner_id
          description: product.description || "",
          price: product.price?.toString() || "",
          weight: product.weight?.toString() || "",
          stock: product.inventory?.stock?.toString() || "",
        });

        setImagePreview(product.image); // asumsi field image_url dari backend
      } catch (error) {
        console.error("Gagal ambil produk:", error);
      }
    };

    loadProduct();
  }, [productId]);

  return (
    <div className="mx-auto bg-tertiary p-6 rounded-xl shadow-lg">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Simpan Perubahan"
        description="Apakah Anda yakin ingin mengubah produk? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <h1 className="text-lg font-medium mb-4">Edit Produk</h1>

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
                  className="cursor-pointer font-medium bg-primary text-white px-3 py-1.5 rounded-xl hover:-translate-y-1 duration-150 ease-in text-sm"
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
                Format: JPG, PNG. Maksimal 2MB.
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
              ) : (
                <select
                  name="partnerId"
                  value={product.partnerId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Pilih Mitra</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
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
              className="cursor-pointer w-full bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
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
            image={imagePreview || "/assets/activity.png"}
            name={product.name || "Nama Produk"}
            price={product.price ? Number(product.price) : 0}
            stock={Number(product.stock) || 0}
            sold={product.stock ? 0 : 0}
            weight={product.weight ? Number(product.weight) : 0}
            partner={
              product.partnerId && partners.length > 0
                ? {
                    name:
                      partners.find(
                        (p) => p.id.toString() === product.partnerId
                      )?.name || "Pilih Mitra",
                    id: Number(product.partnerId),
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
