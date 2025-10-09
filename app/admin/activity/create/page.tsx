//app/admin/activity/create/page.tsx
"use client";
import TextEditor from "@/components/TextEditor";
import { createActivity } from "@/app/utils/activity";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import Popup from "@/components/Popup";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function CreateActivityPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToFacebook, setPostToFacebook] = useState(Boolean(false));
  const [postToInstagram, setPostToInstagram] = useState(Boolean(false));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const router = useRouter();
  const maxWords = 2110;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (images.length + newFiles.length > 4) {
        setError("Maksimal 4 gambar tambahan.");
        return;
      }

      setImages((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const getWordCount = (html: string) => {
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.split(/\s+/).filter(Boolean).length;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("postToFacebook", String(postToFacebook));
      formData.append("postToInstagram", String(postToInstagram));

      if (thumbnail) formData.append("thumbnail", thumbnail);
      images.forEach((img) => formData.append("media", img));
      const response = await createActivity(formData);

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
        router.push("/admin/activity");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors); // ✅ Ambil langsung dari backend
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

  return (
    <div className="p-6 bg-tertiary rounded-xl shadow-lg">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <h1 className="text-lg font-medium mb-4">Tambah Kegiatan Baru</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Konten Berita */}
        <div className="w-full md:w-2/3">
          <div className="">
            <label className="block mb-1 text-sm font-medium">
              Konten Berita
            </label>
            <TextEditor
              content={content}
              setContent={(value: string) => {
                setContent(value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              maxCharacters={maxWords}
            />

            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
          </div>
        </div>

        {/* Form Tambahan */}
        <div className="w-full md:w-1/3 text-sm">
          {/* Judul */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Judul Berita</label>
            <input
              type="text"
              placeholder="Judul Berita"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className="w-full p-2 border border-gray-300 rounded-xl"
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/90 karakter
            </p>
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">
              Sampul Gambar
            </label>
            <div className="border rounded-xl p-3 border-gray-300">
              {thumbnailPreview ? (
                <div className="relative mb-3">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="border-dashed border-2 border-gray-300 bg-gray-100 rounded-xl flex items-center justify-center h-40 mb-3">
                  <span className="text-gray-500 text-sm">Unggah Sampul</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer font-medium bg-primary text-white px-4 py-2 rounded-xl hover:-translate-y-1 duration-150 ease-in text-sm"
                >
                  Pilih Gambar
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleThumbnailChange(e);
                    setErrors((prev) => ({ ...prev, thumbnail: "" }));
                  }}
                  className="hidden"
                />
              </div>

              {errors.thumbnail && (
                <p className="text-sm text-red-600 mt-1">{errors.thumbnail}</p>
              )}
            </div>
          </div>

          {/* Gambar Tambahan */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">
              Gambar Tambahan (maks 4)
            </label>
            <div className="border rounded-xl p-4 border-gray-300">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-lg"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer bg-primary font-medium text-white text-sm px-4 py-2 rounded-xl hover:-translate-y-1 duration-150 ease-in ${
                    images.length >= 4 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  Tambah Gambar
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleImageChange(e);
                    setError(null);
                    setErrors((prev) => ({ ...prev, media: "" }));
                  }}
                  className="hidden"
                  disabled={images.length >= 4}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {images.length}/4 gambar terpilih
              </p>
              {errors.media && (
                <p className="text-sm text-red-600 mt-1">{errors.media}</p>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-6">
            {/* Switch Post to Facebook */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/facebook_logo.svg"
                alt="Facebook Icon"
                className="w-7.5 h-7.5"
              />
              <button
                type="button"
                onClick={() => setPostToFacebook(!postToFacebook)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  postToFacebook ? "bg-blue-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    postToFacebook ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Switch Post to Instagram */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/instagram_logo.svg"
                alt="Instagram Icon"
                className="w-8 h-8"
              />
              <button
                type="button"
                onClick={() => setPostToInstagram(!postToInstagram)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  postToInstagram ? "bg-fuchsia-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    postToInstagram ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4" />
                Memproses...
              </>
            ) : (
              "Unggah Berita"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
