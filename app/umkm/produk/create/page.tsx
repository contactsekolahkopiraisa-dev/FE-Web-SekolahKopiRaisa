"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { createProduct } from "@/app/utils/product";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup";
import ProductListAdmin from "@/components/product/ProductListAdmin";
import ConfirmModal from "@/components/ConfirmModal";

export default function UMKMCreateProductPage() {
  // State for product data
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    stock: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      [name]: name === "price" || name === "stock" ? Number(value) : value
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

    try {
      const formData = new FormData();
      formData.append("name", product.name);
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
            type: "success"
          })
        );

        // Langsung redirect tanpa delay
        router.push("/umkm/produk");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors);
        setShowConfirmModal(false);
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error:", error);
        setMessage(error.message || "Terjadi kesalahan saat menyimpan produk.");
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="cursor-pointer w-full bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2"
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
            sold={0}
            weight={product.weight ? Number(product.weight) : 0}
            partner={{ name: "Mitra Anda", id: 0 }}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
