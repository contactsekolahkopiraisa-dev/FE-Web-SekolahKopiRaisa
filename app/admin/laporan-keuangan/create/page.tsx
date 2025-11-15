// app/admin/laporan-keuangan/create/page.tsx
"use client";

import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import CalendarForm from "@/components/CalenderForm";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { createLaporanKeuangan } from "@/app/utils/laporan-keuangan";

interface ErrorState {
  type: "validation" | "general" | "network";
  message: string;
  errors?: Record<string, string[]>;
}

export default function CreateLaporanKeuanganAdmin() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            keterangan: keterangan,
          },
        ],
      };

      console.log("Data yang dikirim:", formData);

      // Panggil API
      await createLaporanKeuangan(formData);

      // Tutup modal konfirmasi
      setShowConfirmModal(false);

      // Tampilkan popup sukses
      setMessage("Berhasil Disimpan! Laporan keuangan berhasil ditambahkan.");
      setPopupType("success");
      setShowPopup(true);

      // Tunggu 2 detik, kemudian redirect
      setTimeout(() => {
        router.push("/admin/laporan-keuangan");
      }, 2000);
    } catch (error: any) {
      console.error("Error:", error);
      setShowConfirmModal(false);

      // Handle error berdasarkan type - sesuai dengan struktur di page.tsx
      if (error.type === "validation") {
        setMessage(error.message);
        // Convert errors object to single error messages per field
        if (error.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
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
          error.message || "Terjadi kesalahan saat menyimpan laporan keuangan."
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
      minimumFractionDigits: 0,
    }).format(parseInt(number) || 0);
  };

  // Render error section similar to page.tsx
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
          "keterangan",
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
        title="Simpan Laporan Keuangan"
        description="Apakah Anda yakin ingin menyimpan laporan keuangan ini? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />

      <h1 className="text-2xl font-bold mb-6">Tambah Laporan Keuangan</h1>

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

        <div className="flex justify-end mt-10">
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
              "Simpan Laporan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
