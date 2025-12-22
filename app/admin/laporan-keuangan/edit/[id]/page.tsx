// app/admin/laporan-keuangan/edit/[id]/page.tsx
"use client";

import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import CalendarForm from "@/components/CalenderForm";
import { useRouter, useParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import {
  fetchLaporanKeuanganById,
  updateLaporanKeuangan
} from "@/app/utils/laporan-keuangan";

export default function EditLaporanKeuanganAdmin() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [periode, setPeriode] = useState("");
  const [description, setDescription] = useState("");
  const [income, setIncome] = useState("");
  const [pengeluaranTanggal, setPengeluaranTanggal] = useState("");
  const [jumlahPengeluaran, setJumlahPengeluaran] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Load data saat component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchLaporanKeuanganById(parseInt(id));

        console.log("Data dari API:", result);

        // Sesuaikan dengan struktur response API
        let laporanData = null;

        if (result && result.status === "success" && result.data) {
          laporanData = result.data;
        } else if (result && result.id) {
          laporanData = result;
        }

        if (laporanData) {
          // Set form dengan data dari API
          setSelectedDate(new Date(laporanData.report_date));
          setPeriode(laporanData.periode || "");
          setDescription(laporanData.description || "");
          setIncome(formatRupiah(laporanData.income?.toString() || "0"));

          // Set pengeluaran pertama jika ada
          if (laporanData.pengeluarans && laporanData.pengeluarans.length > 0) {
            const firstPengeluaran = laporanData.pengeluarans[0];
            setPengeluaranTanggal(firstPengeluaran.tanggal || "");
            setJumlahPengeluaran(
              formatRupiah(
                firstPengeluaran.jumlah_pengeluaran?.toString() || "0"
              )
            );
            setKeterangan(firstPengeluaran.keterangan || "");
          }
        } else {
          setMessage("Data laporan keuangan tidak ditemukan.");
          setPopupType("error");
          setShowPopup(true);
          setTimeout(() => {
            router.push("/admin/laporan-keuangan");
          }, 2000);
        }
      } catch (error: any) {
        console.error("Error loading data:", error);

        if (error.type === "validation") {
          setMessage(error.message);
        } else if (error.type === "network") {
          setMessage(error.message);
        } else {
          setMessage(error.message || "Terjadi kesalahan saat memuat data.");
        }

        setPopupType("error");
        setShowPopup(true);

        setTimeout(() => {
          router.push("/admin/laporan-keuangan");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validasi
    const newErrors: Record<string, string> = {};
    if (!selectedDate) newErrors.date = "Tanggal laporan harus diisi";
    if (!periode.trim()) newErrors.periode = "Periode harus diisi";
    if (!description.trim()) newErrors.description = "Deskripsi harus diisi";
    if (!income.trim()) newErrors.income = "Pemasukan harus diisi";
    if (!pengeluaranTanggal.trim())
      newErrors.pengeluaranTanggal = "Tanggal pengeluaran harus diisi";
    if (!jumlahPengeluaran.trim())
      newErrors.jumlahPengeluaran = "Jumlah pengeluaran harus diisi";
    if (!keterangan.trim()) newErrors.keterangan = "Keterangan harus diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Format data sesuai dengan API
      const formData = {
        periode: periode,
        report_date: selectedDate?.toISOString().split("T")[0] || "",
        description: description,
        income: parseFloat(income.replace(/[^0-9]/g, "")),
        pengeluarans: [
          {
            tanggal: pengeluaranTanggal,
            jumlah_pengeluaran: parseFloat(
              jumlahPengeluaran.replace(/[^0-9]/g, "")
            ),
            keterangan: keterangan
          }
        ]
      };

      console.log("Data yang akan diupdate:", formData);

      // Panggil API update
      await updateLaporanKeuangan(parseInt(id), formData);

      // Tutup modal konfirmasi
      setShowConfirmModal(false);

      // Tampilkan popup sukses
      setMessage("Berhasil Diperbarui! Perubahan laporan berhasil disimpan.");
      setPopupType("success");
      setShowPopup(true);

      // Tunggu 2 detik, kemudian redirect
      setTimeout(() => {
        router.push("/admin/laporan-keuangan");
      }, 2000);
    } catch (error: any) {
      console.error("Error:", error);
      setShowConfirmModal(false);

      // Handle error berdasarkan type
      if (error.type === "validation") {
        setMessage(error.message);
        // Convert errors object to single error messages per field
        if (error.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              formattedErrors[field] = messages.join(", ");
            } else {
              formattedErrors[field] = String(messages);
            }
          });
          setErrors(formattedErrors);
        }
        setPopupType("error");
        setShowPopup(true);
      } else if (error.type === "network") {
        setMessage(error.message);
        setPopupType("error");
        setShowPopup(true);
      } else {
        setMessage(
          error.message ||
            "Terjadi kesalahan saat memperbarui laporan keuangan."
        );
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(parseInt(number) || 0);
  };

  // Render error section
  const renderValidationErrors = () => {
    if (Object.keys(errors).length === 0) return null;

    const errorEntries = Object.entries(errors).filter(
      ([key]) =>
        ![
          "date",
          "periode",
          "description",
          "income",
          "pengeluaranTanggal",
          "jumlahPengeluaran",
          "keterangan"
        ].includes(key)
    );

    if (errorEntries.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium mb-2">Validasi Gagal</p>
        <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
          {errorEntries.map(([field, message]) => (
            <li key={field}>
              <span className="font-medium capitalize">{field}:</span> {message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="pl-6 pr-50 py-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-6 pr-50 py-6">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Perbarui Laporan Keuangan"
        description="Apakah Anda yakin ingin memperbarui laporan keuangan ini? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />

      <h1 className="text-2xl font-bold mb-6">Edit Laporan Keuangan</h1>

      {renderValidationErrors()}

      <form onSubmit={handleFormSubmit}>
        <CalendarForm
          selectedDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date);
            setErrors((prev) => ({ ...prev, date: "" }));
          }}
          error={errors.date}
          label="Tanggal Laporan"
        />

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="periode">
            Periode
          </label>
          <input
            type="text"
            id="periode"
            value={periode}
            onChange={(e) => {
              setPeriode(e.target.value);
              setErrors((prev) => ({ ...prev, periode: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan periode (contoh: Januari 2025)"
          />
          {errors.periode && (
            <p className="text-sm text-red-600 mt-1">{errors.periode}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-xl font-medium mb-2"
            htmlFor="description"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Masukkan deskripsi laporan"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="income">
            Pemasukan
          </label>
          <input
            type="text"
            id="income"
            value={income}
            onChange={(e) => {
              setIncome(formatRupiah(e.target.value));
              setErrors((prev) => ({ ...prev, income: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan pemasukan"
          />
          {errors.income && (
            <p className="text-sm text-red-600 mt-1">{errors.income}</p>
          )}
        </div>

        <div className="border-t pt-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Data Pengeluaran</h2>

          <div className="mb-4">
            <label
              className="block text-xl font-medium mb-2"
              htmlFor="pengeluaranTanggal"
            >
              Tanggal Pengeluaran
            </label>
            <input
              type="date"
              id="pengeluaranTanggal"
              value={pengeluaranTanggal}
              onChange={(e) => {
                setPengeluaranTanggal(e.target.value);
                setErrors((prev) => ({ ...prev, pengeluaranTanggal: "" }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.pengeluaranTanggal && (
              <p className="text-sm text-red-600 mt-1">
                {errors.pengeluaranTanggal}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-xl font-medium mb-2"
              htmlFor="jumlahPengeluaran"
            >
              Jumlah Pengeluaran
            </label>
            <input
              type="text"
              id="jumlahPengeluaran"
              value={jumlahPengeluaran}
              onChange={(e) => {
                setJumlahPengeluaran(formatRupiah(e.target.value));
                setErrors((prev) => ({ ...prev, jumlahPengeluaran: "" }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan jumlah pengeluaran"
            />
            {errors.jumlahPengeluaran && (
              <p className="text-sm text-red-600 mt-1">
                {errors.jumlahPengeluaran}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-xl font-medium mb-2"
              htmlFor="keterangan"
            >
              Keterangan Pengeluaran
            </label>
            <textarea
              id="keterangan"
              rows={6}
              value={keterangan}
              onChange={(e) => {
                setKeterangan(e.target.value);
                setErrors((prev) => ({ ...prev, keterangan: "" }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Masukkan keterangan pengeluaran"
            />
            {errors.keterangan && (
              <p className="text-sm text-red-600 mt-1">{errors.keterangan}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            type="button"
            onClick={() => router.push("/admin/laporan-keuangan")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4" />
                Memproses...
              </>
            ) : (
              "Perbarui Laporan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
