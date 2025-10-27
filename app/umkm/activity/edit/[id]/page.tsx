"use client";
import TextEditor from "@/components/TextEditor";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { X, Loader2, LoaderPinwheel, LoaderCircle } from "lucide-react";
import Popup from "@/components/Popup";
import { fetchActivityById, updateActivity } from "@/app/utils/activity";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConfirmModal from "@/components/ConfirmModal";

export default function EditActivityPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [retainedMedia, setRetainedMedia] = useState<string[]>([]);
  const [currentMedia, setCurrentMedia] = useState<string[]>([]);
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();
  const maxWords = 2110;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetchActivityById(id);
        const activity = response.data;

        setTitle(activity.title);
        setContent(activity.content);

        if (activity.newsMedia && activity.newsMedia.length > 0) {
          const thumbnailMedia = activity.newsMedia.find(
            (media: { isThumbnail: boolean }) => media.isThumbnail
          );

          if (thumbnailMedia) {
            setCurrentThumbnail(thumbnailMedia.media_url);
          }

          const additionalImages = activity.newsMedia
            .filter((media: { isThumbnail: boolean }) => !media.isThumbnail)
            .map((media: { media_url: string }) => media.media_url);

          setCurrentMedia(additionalImages);
          setRetainedMedia(additionalImages);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity:", error);
        setError("Gagal memuat data berita");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      // Clear the current thumbnail
      setCurrentThumbnail(null);

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
      const totalImages =
        images.length + retainedMedia.length + newFiles.length;

      if (totalImages > 4) {
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

  const removeCurrentMedia = (url: string) => {
    setRetainedMedia((prev) => prev.filter((mediaUrl) => mediaUrl !== url));
  };

  const handleSubmit = async () => {
    setError(null);
    setErrors({});
    setIsSubmitting(true);
    // setConfirmModalSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("retainedMedia", JSON.stringify(retainedMedia));

      if (thumbnail) formData.append("thumbnail", thumbnail);
      images.forEach((img) => formData.append("media", img));

      const response = await updateActivity(Number(id), formData);

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
        setErrors(error.errors);
      } else {
        console.error("Error:", error);
        setMessage(
          error.message || "Terjadi kesalahan saat memperbarui berita."
        );
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-tertiary rounded-xl shadow-lg">
        <Skeleton height={32} width={200} className="mb-4" />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Skeleton height={300} className="mb-6" />
          </div>
          <div className="w-full md:w-1/3 space-y-6">
            <Skeleton height={48} />
            <Skeleton height={160} />
            <Skeleton height={220} />
            <Skeleton height={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-tertiary rounded-xl shadow-lg">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Simpan Perubahan"
        description="Apakah Anda yakin ingin mengubah berita? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <h1 className="text-lg font-medium mb-4">Edit Kegiatan</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form className="flex flex-col md:flex-row gap-6">
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
        <div className="w-full md:w-1/3">
          {/* Judul */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">
              Judul Berita
            </label>
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
                </div>
              ) : currentThumbnail ? (
                <div className="relative mb-3">
                  <img
                    src={currentThumbnail}
                    alt="Current Thumbnail"
                    className="w-full h-40 object-cover rounded-xl"
                  />
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
              {/* Current Media Images */}
              {currentMedia.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {currentMedia.map(
                    (mediaUrl, index) =>
                      retainedMedia.includes(mediaUrl) && (
                        <div key={`current-${index}`} className="relative">
                          <img
                            src={mediaUrl}
                            alt={`Current Media ${index}`}
                            className="w-full h-24 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => removeCurrentMedia(mediaUrl)}
                            className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-lg"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      )
                  )}
                </div>
              )}

              {/* New Media Images */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative">
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
                    images.length + retainedMedia.length >= 4
                      ? "opacity-50 pointer-events-none"
                      : ""
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
                  disabled={images.length + retainedMedia.length >= 4}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {images.length + retainedMedia.length}/4 gambar terpilih
              </p>
              {errors.media && (
                <p className="text-sm text-red-600 mt-1">{errors.media}</p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="button"
            className="cursor-pointer w-full bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
            onClick={() => setShowConfirmModal(true)}
          >
            Perbarui Berita
          </button>
        </div>
      </form>
    </div>
  );
}
