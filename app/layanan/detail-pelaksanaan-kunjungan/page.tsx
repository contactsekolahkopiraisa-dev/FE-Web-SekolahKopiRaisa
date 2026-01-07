"use client";

import Footer from "@/components/main/Footer";
import {
  Check,
  Download,
  Eye,
  FileText,
  FileCheck,
  XCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLayananById, LayananItem, formatDate } from "../../utils/layanan";
import { createLaporanLayanan } from "../../utils/laporan";

function DetailPelaksanaanKunjunganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layananId = searchParams.get("id");

  const [layananData, setLayananData] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const valueOrDash = (value?: string) => {
    if (typeof value !== "string") return "-";
    const v = value.trim();
    if (
      v === "" ||
      v.toLowerCase() === "null" ||
      v.toLowerCase() === "undefined"
    )
      return "-";
    return v;
  };

  const resolveFileUrl = (path?: string | null): string | null => {
    if (!path) return null;
    const trimmed = path.trim();
    if (
      trimmed === "" ||
      trimmed.toLowerCase() === "null" ||
      trimmed.toLowerCase() === "undefined"
    )
      return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return `${base}${trimmed.startsWith("/") ? trimmed : "/" + trimmed}`;
  };

  const openFile = (url: string | null) => {
    if (!url) return;
    if (typeof window !== "undefined")
      window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadFile = (url: string | null, filename?: string) => {
    if (!url || typeof document === "undefined") return;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename || "download.pdf";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Download error:", error);
        window.open(url, "_blank");
      });
  };

  // Fetch layanan data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!layananId) {
        setError("ID Layanan tidak ditemukan");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchLayananById(Number(layananId), {
          include_jenis: true,
          include_peserta: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(data);

        // Set decision states from API data
        if (data.pengajuan?.nama_status_kode) {
          const statusPengajuan = data.pengajuan.nama_status_kode.toLowerCase();
          if (
            statusPengajuan.includes("disetujui") ||
            statusPengajuan.includes("diterima")
          ) {
            setPengajuanDecision("disetujui");
          } else if (statusPengajuan.includes("ditolak")) {
            setPengajuanDecision("ditolak");
          }
        }

        // Check if laporan exists and populate form (handle array or single object)
        const laporanList = Array.isArray(data.laporan)
          ? data.laporan
          : data.laporan
          ? [data.laporan]
          : [];
        if (laporanList.length > 0 && laporanList[0]) {
          const laporan: any = laporanList[0];
          // Only populate form with existing data, don't set laporanSubmitted
          setLaporanForm({
            namaP4s: laporan.nama_p4s || "",
            kota: laporan.asal_kab_kota || "",
            jenisKegiatan: "Kunjungan",
            asalPeserta: data.instansi_asal || "",
            jumlahPeserta: data.jumlah_peserta?.toString() || "",
            tanggalPelaksanaan: data.tanggal_mulai?.split("T")[0] || "",
            lamaPelaksanaan: "1 hari",
          });
          // Note: File object cannot be restored from URL, just show that photo exists
        }

        setError(null);
      } catch (e: any) {
        console.error("Error fetching layanan:", e);
        setError(e.message || "Gagal memuat data layanan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [layananId]);

  // Add polling for real-time status updates
  useEffect(() => {
    if (!layananId) return;

    const pollInterval = setInterval(async () => {
      try {
        const data = await fetchLayananById(Number(layananId), {
          include_jenis: true,
          include_peserta: true,
          include_laporan: true,
          include_rejection: true,
          include_pengajuan: true,
          include_pelaksanaan: true,
        });

        // Update pengajuan decision if status changed
        if (data.pengajuan?.nama_status_kode) {
          const statusPengajuan = data.pengajuan.nama_status_kode.toLowerCase();
          if (
            statusPengajuan.includes("disetujui") ||
            statusPengajuan.includes("diterima")
          ) {
            setPengajuanDecision("disetujui");
          } else if (statusPengajuan.includes("ditolak")) {
            setPengajuanDecision("ditolak");
          } else {
            setPengajuanDecision("menunggu");
          }
        }

        setLayananData(data);
      } catch (e) {
        console.error("Error polling layanan data:", e);
      }
    }, 10000); // 10 seconds - auto refresh untuk melihat perubahan dari admin

    return () => clearInterval(pollInterval);
  }, [layananId]);

  // Get participant info
  const pesertaInfo = layananData?.peserta?.[0];

  const infoKiri = [
    {
      label: "Jenis Kegiatan",
      value:
        layananData?.jenisLayanan?.nama_jenis_layanan ||
        layananData?.jenis_layanan?.nama_jenis_layanan ||
        "Kunjungan",
    },
    {
      label: "Penanggungjawab",
      value: pesertaInfo?.nama || pesertaInfo?.nama_peserta || "-",
    },
    {
      label: "Jumlah Peserta",
      value: layananData?.jumlah_peserta?.toString() || "-",
    },
  ];

  const infoKanan = [
    { label: "Instansi", value: layananData?.instansi_asal || "-" },
    {
      label: "Tanggal Kunjungan",
      value: layananData?.tanggal_mulai
        ? formatDate(layananData.tanggal_mulai)
        : "-",
    },
  ];

  const dokumen = [
    {
      label: "Surat Permohonan / Surat Tugas",
      file:
        layananData?.file_surat_permohonan || layananData?.file_proposal || "",
    },
  ];

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");

  const [laporanSubmitted, setLaporanSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "Kunjungan",
    asalPeserta: "",
    jumlahPeserta: "",
    tanggalPelaksanaan: "",
    lamaPelaksanaan: "",
  });

  // Auto-fill laporanForm dari layananData
  useEffect(() => {
    if (layananData) {
      setLaporanForm((prev) => ({
        ...prev,
        jenisKegiatan: "Kunjungan",
        asalPeserta: layananData?.instansi_asal || "",
        jumlahPeserta: layananData?.jumlah_peserta?.toString() || "",
        tanggalPelaksanaan: layananData?.tanggal_mulai || "",
        lamaPelaksanaan: "1 hari",
      }));
    }
  }, [layananData]);

  const [fotoKegiatan, setFotoKegiatan] = useState<File | null>(null);
  const fotoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFoto = () => fotoInputRef.current?.click();
  const handleFotoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFotoKegiatan(f);
  };

  const handleLaporanChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setLaporanForm((prev) => ({ ...prev, [name]: value }));
  };

  const [successOpen, setSuccessOpen] = useState(false);

  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document
        .getElementById("laporan-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitLaporan = async () => {
    const Swal = (await import("sweetalert2")).default;

    // Validasi form
    if (
      !laporanForm.namaP4s.trim() ||
      !laporanForm.kota.trim() ||
      !fotoKegiatan
    ) {
      await Swal.fire({
        title: "Form Tidak Lengkap",
        text: "Mohon lengkapi Nama P4S, Asal Kab/Kota, dan upload Foto Kegiatan",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Yakin Mengirimkan Laporan Akhir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Submit",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        cancelButton:
          "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);

    try {
      if (!layananId) {
        throw new Error("ID Layanan tidak ditemukan");
      }

      const payload = {
        id_layanan: Number(layananId),
        nama_p4s: laporanForm.namaP4s,
        asal_kab_kota: laporanForm.kota,
        jenis_kegiatan: laporanForm.jenisKegiatan,
        asal_peserta: laporanForm.asalPeserta,
        jumlah_peserta: laporanForm.jumlahPeserta,
        tanggal_pelaksanaan: laporanForm.tanggalPelaksanaan,
        lama_pelaksanaan: laporanForm.lamaPelaksanaan,
        foto_kegiatan: fotoKegiatan,
      };

      await createLaporanLayanan(payload);

      setLaporanSubmitted(true);

      // Refresh data to get updated laporan status
      const updatedData = await fetchLayananById(Number(layananId), {
        include_jenis: true,
        include_peserta: true,
        include_laporan: true,
        include_rejection: true,
      });
      setLayananData(updatedData);

      await Swal.fire({
        title: "Laporan Berhasil Dikirim!",
        text: "Terima kasih telah menyelesaikan kegiatan Kunjungan.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });
    } catch (error: any) {
      console.error("Error submitting laporan:", error);
      await Swal.fire({
        title: "Gagal Mengirim Laporan",
        text: error.message || "Terjadi kesalahan saat mengirim laporan",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pengajuanDecisionText: Record<typeof pengajuanDecision, string> = {
    menunggu: "Menunggu Persetujuan",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  // Check if laporan already submitted (handle array or single object)
  const laporanData = Array.isArray(layananData?.laporan)
    ? layananData.laporan[0]
    : layananData?.laporan;

  // Check if laporan exists by checking backend data only
  const isLaporanTerisi = !!(laporanData?.id_laporan || laporanData?.id);

  // Status laporan untuk progress indicator
  const laporanStatusText = isLaporanTerisi
    ? "Telah Terisi"
    : "Belum Terlaksana";

  const decisionTextMap = {
    pending: "Belum Terlaksana",
    berjalan: "Sedang Berlangsung",
    selesai: "Selesai",
  } as const;

  // Step statuses untuk progress indicator
  const stepStatuses: Array<"pending" | "berjalan" | "selesai"> = [
    pengajuanDecision === "disetujui" ? "selesai" : "pending",
    isLaporanTerisi ? "selesai" : "pending",
  ];

  // Show loading state
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#FCFBF7] pt-24 md:pt-28 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A1E]"></div>
            <p className="mt-4 text-[#3B3B3B]">Memuat data layanan...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-[#FCFBF7] pt-24 md:pt-28 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-[#3B3B3B] mb-2">
              Gagal Memuat Data
            </h2>
            <p className="text-[#6B6B6B] mb-6">{error}</p>
            <button
              onClick={() => router.push("/layanan")}
              className="px-6 py-2 bg-[#5C3A1E] text-white rounded-lg hover:bg-[#4A2F18] transition-colors"
            >
              Kembali ke Layanan
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FCFBF7] pt-16 md:pt-20">
        <div className="container mx-auto px-5 max-w-5l py-15">
          <div className="mb-4">
            <Link
              href="/layanan"
              className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Kembali ke Layanan</span>
            </Link>
          </div>

          <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B]">
            Detail Pelaksanaan Kunjungan
          </h1>

          {/* PROGRES KEGIATAN + DOKUMEN */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PROGRES */}
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg border border-[#E8E2DB] flex items-center justify-center">
                  <Check className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3B3B3B]">
                    Progres Kegiatan
                  </p>
                  <p className="text-[12px] text-[#6B6B6B]">
                    Pantau Status Pelaksanaan Kegiatan Anda
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const firstNonCompletedIndex = stepStatuses.findIndex(
                    (st) => st !== "selesai"
                  );
                  const activeStepIndex =
                    firstNonCompletedIndex === -1
                      ? stepStatuses.length
                      : firstNonCompletedIndex;
                  const isActive = idx === activeStepIndex;
                  const isCompleted =
                    idx < activeStepIndex && stepStatuses[idx] === "selesai";
                  const status = stepStatuses[idx];

                  const containerClass = isActive
                    ? status === "selesai"
                      ? "bg-[#EAF8F0] border-[#D2EBDD]"
                      : status === "berjalan"
                      ? "bg-[#E3F2FD] border-[#90CAF9]"
                      : "bg-[#EDE6DF] border-[#E0D8D1]"
                    : isCompleted
                    ? "bg-[#F3FBF7] border-[#CFEAD9]"
                    : s.name === "Pengajuan" && pengajuanDecision === "ditolak"
                    ? "bg-[#FEE2E2] border-[#F87171]"
                    : "bg-white border-[#EFEAE4]";

                  const iconWrapClass = isActive
                    ? status === "selesai"
                      ? "bg-[#E2F3EA] border-[#CBE6D7]"
                      : status === "berjalan"
                      ? "bg-[#BBDEFB] border-[#90CAF9]"
                      : "bg-[#DCD3CB] border-[#CFC6BE]"
                    : isCompleted
                    ? "bg-[#E9F7F0] border-[#CBE6D7]"
                    : s.name === "Pengajuan" && pengajuanDecision === "ditolak"
                    ? "bg-[#FCECEC] border-[#F0C3C3]"
                    : "bg-[#F4F0EC] border-[#E8E2DB]";

                  const iconColorClass = isActive
                    ? status === "selesai"
                      ? "text-[#2F8A57]"
                      : status === "berjalan"
                      ? "text-[#1976D2]"
                      : "text-[#3B3B3B]"
                    : isCompleted
                    ? "text-[#2F8A57]"
                    : s.name === "Pengajuan" && pengajuanDecision === "ditolak"
                    ? "text-[#CD0300]"
                    : "text-[#6B6B6B]";

                  const descColorClass =
                    s.name === "Pengajuan"
                      ? pengajuanDecision === "disetujui"
                        ? "text-[#2F8A57]"
                        : pengajuanDecision === "ditolak"
                        ? "text-[#CD0300]"
                        : "text-[#6B6B6B]"
                      : stepStatuses[idx] === "selesai"
                      ? "text-[#2F8A57]"
                      : stepStatuses[idx] === "berjalan"
                      ? "text-[#1976D2]"
                      : "text-[#6B6B6B]";

                  return (
                    <div
                      key={s.name}
                      className={`rounded-lg border text-left p-3 ${containerClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconWrapClass}`}
                        >
                          <Icon className={iconColorClass} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#3B3B3B]">
                            {s.name}
                          </p>
                          <p className={`text-[12px] ${descColorClass}`}>
                            {s.name === "Pengajuan"
                              ? pengajuanDecisionText[pengajuanDecision]
                              : s.name === "Laporan Akhir"
                              ? laporanStatusText
                              : decisionTextMap[stepStatuses[idx]]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RINGKASAN + DOKUMEN */}
            <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-[#3B3B3B]" />
                <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">
                  Ringkasan Pengajuan & Dokumen
                </p>
              </div>
              <p className="text-[12px] text-[#6B6B6B] mb-3">
                Detail informasi dan Dokumen yang telah anda Submit
              </p>

              {/* Status Badge Pengajuan */}
              {(() => {
                const status =
                  layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
                const isApproved = status.includes("disetujui");
                const isRejected = status.includes("ditolak");
                const isPending = status.includes("menunggu");

                if (!isPending && (isApproved || isRejected)) {
                  return (
                    <div
                      className={`mb-3 rounded-lg border-2 p-4 shadow-sm ${
                        isApproved
                          ? "bg-green-50 border-green-400"
                          : "bg-red-100 border-red-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isApproved ? (
                          <CheckCircle2 className="text-green-600" size={20} />
                        ) : (
                          <XCircle className="text-red-600" size={20} />
                        )}
                        <p
                          className={`text-sm font-semibold ${
                            isApproved ? "text-green-800" : "text-red-800"
                          }`}
                        >
                          Pengajuan {isApproved ? "Disetujui" : "Ditolak"}
                        </p>
                      </div>
                      <p
                        className={`text-[12px] ${
                          isApproved ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isApproved
                          ? "Pengajuan Anda telah disetujui oleh admin. Silakan lanjutkan ke tahap berikutnya."
                          : "Pengajuan Anda ditolak oleh admin. Silakan lihat alasan penolakan di bawah."}
                      </p>

                      {/* Alasan Penolakan */}
                      {isRejected &&
                        (() => {
                          const rejection = layananData?.layananRejection;
                          const alasan = Array.isArray(rejection)
                            ? rejection[0]?.alasan
                            : rejection?.alasan ||
                              layananData?.pengajuanRejection?.alasan ||
                              layananData?.rejection?.alasan ||
                              layananData?.pengajuan?.alasan_penolakan ||
                              layananData?.alasan_penolakan;

                          return alasan ? (
                            <div className="mt-3 rounded-lg bg-white border border-red-200 p-3">
                              <p className="text-[12px] font-semibold text-red-800 mb-1">
                                Alasan Penolakan:
                              </p>
                              <p className="text-[12px] text-red-700 whitespace-pre-wrap">
                                {alasan}
                              </p>
                            </div>
                          ) : null;
                        })()}

                      {/* Tombol Ajukan Ulang */}
                      {isRejected && (
                        <div className="mt-3">
                          <Link
                            href="/layanan"
                            className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90 w-full justify-center"
                          >
                            Ajukan Ulang
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="rounded-lg border border-[#E8E2DB] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {infoKiri.map((it) => (
                      <div key={it.label}>
                        <p className="text-sm font-semibold text-[#3B3B3B]">
                          {it.label}
                        </p>
                        <p className="text-[12px] text-[#6B6B6B]">
                          {valueOrDash(it.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {infoKanan.map((it) => (
                      <div key={it.label}>
                        <p className="text-sm font-semibold text-[#3B3B3B]">
                          {it.label}
                        </p>
                        <p className="text-[12px] text-[#6B6B6B]">
                          {valueOrDash(it.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-semibold text-[#3B3B3B]">
                Dokumen yang diupload
              </p>
              <div className="mt-3 space-y-3">
                {dokumen
                  .filter((d) => !!(d.file && d.file.trim() !== ""))
                  .map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#3B3B3B]">
                          {d.label}
                        </p>
                        <p className="text-[12px] text-[#6B6B6B]">
                          {d.label}.pdf
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const url = resolveFileUrl(d.file);
                          return (
                            <>
                              <button
                                onClick={() => openFile(url)}
                                disabled={!url}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8] disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Eye size={16} /> Lihat
                              </button>
                              <button
                                onClick={() => downloadFile(url, d.file)}
                                disabled={!url}
                                className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-2 text-[12px] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Download size={16} /> Download
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Laporan Akhir */}
          {(() => {
            // Check if this is admin view (URL contains /admin/)
            const isAdminView =
              typeof window !== "undefined" &&
              window.location.pathname.includes("/admin/");
            // Show for admin always, or for user only when approved
            const shouldShowLaporan =
              isAdminView || pengajuanDecision === "disetujui";

            if (!shouldShowLaporan) return null;

            // For admin, if laporan not filled yet, show message
            if (isAdminView && !isLaporanTerisi) {
              return (
                <div className="mt-4" id="laporan-section">
                  <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                        <FileCheck size={14} className="text-[#3B3B3B]" />
                      </span>
                      <p className="text-sm font-semibold text-[#3B3B3B]">
                        Laporan Akhir Kegiatan
                      </p>
                      <span className="ml-auto px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-medium">
                        Belum Terisi
                      </span>
                    </div>
                    <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-6 text-center">
                      <p className="text-[14px] text-[#6B6B6B]">
                        User belum mengisi laporan akhir kegiatan.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <LaporanAkhirForm
                laporanForm={laporanForm}
                handleLaporanChange={handleLaporanChange}
                fotoKegiatan={fotoKegiatan}
                handlePickFoto={handlePickFoto}
                handleFotoChange={handleFotoChange}
                fotoInputRef={fotoInputRef}
                handleSubmitLaporan={handleSubmitLaporan}
                submitting={submitting}
                isReadOnly={isAdminView ? true : isLaporanTerisi}
                laporanData={laporanData}
                openFile={openFile}
                downloadFile={downloadFile}
                isAdminView={isAdminView}
              />
            );
          })()}
        </div>
      </div>

      <Footer />
    </>
  );
}

/* Komponen kecil: Dokumen item */
function DocItem({ name, file }: { name: string; file: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3 hover:bg-[#FAFAF9] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-[#6B6B6B]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#3B3B3B]">{name}</p>
          <p className="text-[11px] text-[#6B6B6B]">{file}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[11px] text-[#3B3B3B] hover:bg-[#F5EFE8] transition-colors">
          <Eye size={14} /> Lihat
        </button>
        <button className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-1.5 text-[11px] hover:opacity-90 transition-opacity">
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
}

/* Komponen kecil: Form Laporan Akhir */
function LaporanAkhirForm({
  laporanForm,
  handleLaporanChange,
  fotoKegiatan,
  handlePickFoto,
  handleFotoChange,
  fotoInputRef,
  handleSubmitLaporan,
  submitting,
  isReadOnly = false,
  laporanData,
  openFile,
  downloadFile,
}: any) {
  return (
    <div className="mt-4" id="laporan-section">
      <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
            <FileCheck size={14} className="text-[#3B3B3B]" />
          </span>
          <p className="text-sm font-semibold text-[#3B3B3B]">
            Laporan Akhir Kegiatan
          </p>
          {isReadOnly && (
            <span className="ml-auto px-3 py-1 rounded-full bg-green-100 border border-green-300 text-green-700 text-[11px] font-medium">
              ✓ Telah Terisi
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#6B6B6B] mb-4">
          {isReadOnly
            ? "Laporan akhir telah berhasil dikirim"
            : "Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program"}
        </p>

        <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-3">
          <div className="space-y-2">
            {/* Field yang bisa diedit: Nama P4S dan Kota */}
            {[
              {
                label: "Nama P4S",
                name: "namaP4s",
                placeholder: "Contoh : P4S Tani Makmur",
              },
              {
                label: "Kabupaten / Kota",
                name: "kota",
                placeholder: "Contoh : Banyuwangi",
              },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[12px] text-[#3B3B3B] mb-1">
                  {f.label} *
                </label>
                <input
                  type="text"
                  name={f.name}
                  value={laporanForm[f.name]}
                  onChange={handleLaporanChange}
                  placeholder={f.placeholder}
                  disabled={isReadOnly}
                  className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            ))}

            {/* Jenis Kegiatan - Auto-filled */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Jenis Kegiatan *
              </label>
              <input
                type="text"
                value="Kunjungan"
                disabled
                className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Asal Peserta - Auto-filled from layananData */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Asal Peserta / Mitra Kerjasama *
              </label>
              <input
                type="text"
                value={laporanForm.asalPeserta}
                disabled
                className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Jumlah Peserta - Auto-filled */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Jumlah Peserta *
              </label>
              <input
                type="text"
                value={laporanForm.jumlahPeserta}
                disabled
                className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Tanggal Pelaksanaan - Auto-filled */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Tanggal Pelaksanaan *
              </label>
              <input
                type="text"
                value={
                  laporanForm.tanggalPelaksanaan
                    ? formatDate(laporanForm.tanggalPelaksanaan)
                    : "-"
                }
                disabled
                className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Lama Pelaksanaan - Auto-filled */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Lama Pelaksanaan *
              </label>
              <input
                type="text"
                value="1 hari"
                disabled
                className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-[12px] text-[#3B3B3B] mb-1">
                Foto Kegiatan *
              </label>
              {isReadOnly && laporanData?.foto_kegiatan ? (
                <div className="rounded-lg border border-[#E8E2DB] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600" size={18} />
                      <div>
                        <p className="text-[12px] font-semibold text-[#3B3B3B]">
                          Foto Kegiatan
                        </p>
                        <p className="text-[11px] text-[#6B6B6B]">
                          Foto telah diupload
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openFile(laporanData.foto_kegiatan)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[11px] text-[#3B3B3B] hover:bg-[#F5EFE8] transition-colors"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            laporanData.foto_kegiatan,
                            "foto-kegiatan.jpg"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-1.5 text-[11px] hover:opacity-90 transition-opacity"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`border border-dashed border-[#E8E2DB] rounded-lg bg-white p-4 flex flex-col items-center justify-center ${
                    isReadOnly
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:bg-[#F9F7F5]"
                  }`}
                  onClick={isReadOnly ? undefined : handlePickFoto}
                >
                  {fotoKegiatan ? (
                    <div className="text-center">
                      <p className="text-[12px] text-[#3B3B3B]">
                        {fotoKegiatan.name}
                      </p>
                      {!isReadOnly && (
                        <p className="text-[11px] text-[#6B6B6B] mt-1">
                          Klik untuk ganti
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center text-[#6B6B6B]">
                      <Download size={20} />
                      <p className="text-[12px] mt-2">Upload Foto Kegiatan</p>
                      <p className="text-[11px] text-[#A0A0A0]">
                        Format: JPG, PNG (maks. 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fotoInputRef}
                    className="hidden"
                    onChange={handleFotoChange}
                    disabled={isReadOnly}
                  />
                </div>
              )}
            </div>

            {/* Tombol Submit - Hidden when read-only */}
            {!isReadOnly && (
              <div className="pt-2 text-right">
                <button
                  onClick={handleSubmitLaporan}
                  disabled={submitting}
                  className="w-full md:w-auto bg-[#5C3A1E] text-white text-[13px] px-6 py-2 rounded-lg hover:bg-[#4C2E15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Mengirim..." : "Submit"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-24 md:pt-28 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A1E]"></div>
        <p className="mt-4 text-[#3B3B3B]">Memuat halaman...</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function DetailPelaksanaanKunjunganPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DetailPelaksanaanKunjunganContent />
    </Suspense>
  );
}
