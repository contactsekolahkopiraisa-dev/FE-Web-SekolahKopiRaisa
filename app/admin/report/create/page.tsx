"use client";
import Popup from "@/app/components/Popup";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import ReportListAdmin from "@/app/components/ReportListAdmin";
import { createReport } from "@/app/utils/report";
import RadioButton from "@/app/components/RadioButton";

export default function CreateReportPage() {
    const [report, setReport] = useState({
        title: "",
        city: "",
        eventType: "",
        domParticipants: "",
        sumParticipants: "",
        date: "",
        duration: "",
        image: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // State for popup
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Router for navigation
    const router = useRouter();

    // State for image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    // Handle input changes
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setReport((prev) => ({ ...prev, [name]: value }));

        // Hilangkan error saat field diperbarui
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const formData = new FormData();
            formData.append("title", report.title);
            formData.append("city", report.city);
            formData.append("eventType", report.eventType);
            formData.append("domParticipants", report.domParticipants);
            formData.append("sumParticipants", report.sumParticipants);
            formData.append("date", report.date);
            formData.append("duration", report.duration);
            if (imageFile) {
                formData.append("productFile", imageFile);
            }

            const response = await createReport(formData);

            if (response && response.message) {
                sessionStorage.setItem(
                    "popup",
                    JSON.stringify({
                        message: response.message,
                        type: "success",
                    })
                );

                router.push("/admin/report");
            }
        } catch (error: any) {
            if (error.type === "validation") {
                setErrors(error.errors); // ✅ Ambil langsung dari backend
            } else {
                console.error("Error:", error);
                setMessage(
                    error.message || "Terjadi kesalahan saat menyimpan berita."
                );
                setPopupType("error");
                setShowPopup(true);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto bg-tertiary p-4 sm:p-6 rounded-lg shadow-md">
            {showPopup && (
                <Popup
                    message={message}
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                />
            )}
            <h1 className="text-xl sm:text-2xl font-bold mb-4">
                Buat Laporan Baru
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:w-2/3 text-sm"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama P4S
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={report.title}
                                onChange={handleInputChange}
                                className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                placeholder="Masukkan nama P4S"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kota/Kabupaten
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={report.city}
                                onChange={handleInputChange}
                                className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                placeholder="Masukkan kota/kabupaten"
                            />
                            {errors.city && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis Kegiatan
                            </label>
                            <div className="flex flex-col gap-2">
                                <RadioButton
                                    name="eventType"
                                    options={[
                                        {
                                            value: "Pelatihan",
                                            label: "Pelatihan",
                                        },
                                        { value: "Magang", label: "Magang" },
                                        {
                                            value: "Undangan Narasumber",
                                            label: "Undangan Narasumber",
                                        },
                                        { value: "PKL", label: "PKL" },
                                        {
                                            value: "Kunjungan",
                                            label: "Kunjungan",
                                        },
                                    ]}
                                    value={report.eventType}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.eventType && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.eventType}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Kiri: Asal Peserta */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Asal Peserta
                                </label>
                                <input
                                    type="text"
                                    name="domParticipants"
                                    value={report.domParticipants}
                                    onChange={handleInputChange}
                                    className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                    placeholder="Masukkan asal peserta"
                                />
                                {errors.domParticipants && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.domParticipants}
                                    </p>
                                )}
                            </div>

                            {/* Kanan: Jumlah Peserta */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah Peserta
                                </label>
                                <input
                                    type="number"
                                    name="sumParticipants"
                                    value={report.sumParticipants}
                                    onChange={handleInputChange}
                                    className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                    placeholder="Masukkan jumlah peserta"
                                />
                                {errors.sumParticipants && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.sumParticipants}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Kiri: Tanggal Kegiatan */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Kegiatan
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={report.date}
                                    onChange={handleInputChange}
                                    className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                    placeholder="Pilih tanggal kegiatan"
                                />
                                {errors.date && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            {/* Kanan: Lama Pelaksanaan */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lama Pelaksanaan
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={report.duration}
                                    onChange={handleInputChange}
                                    className="w-full p-1.5 px-3 border border-gray-300 rounded-xl"
                                    placeholder="Masukkan lama pelaksanaan (misal: 2 jam)"
                                />
                                {errors.duration && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Foto Kegiatan
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="cursor-pointer font-medium bg-primary text-white px-3 py-1.5 rounded-xl hover:-translate-y-1 duration-150 ease-in text-sm"
                                >
                                    Pilih Gambar
                                </button>
                                <span className="text-sm text-gray-500 break-all">
                                    {imageFile
                                        ? imageFile.name
                                        : "Belum ada gambar dipilih"}
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
                    </div>
                </form>

                {/* Product Preview using ProductListAdmin */}
                <div className="w-full lg:w-1/3 max-w-100 mt-8 lg:mt-0">
                    <h2 className="text-lg font-medium mb-4">
                        Pratinjau Gambar
                    </h2>
                    <ReportListAdmin
                        title={report.title}
                        city={report.city}
                        date={report.date}
                        eventType={report.eventType}
                        image={imagePreview || "/assets/noimage.png"}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer bg-primary text-white py-2 px-3 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            Memproses...
                        </>
                    ) : (
                        "Simpan Laporan"
                    )}
                </button>
            </div>
        </div>
    );
}
