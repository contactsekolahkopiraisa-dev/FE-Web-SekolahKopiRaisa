"use client";

import {
  Check,
  Download,
  Eye,
  FileText,
  FileCheck,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/main/Footer";
import { useRouter } from "next/navigation";
import { fetchLayananById, LayananItem, formatDate } from "../../utils/layanan";
import { createLaporanLayanan } from "../../utils/laporan";

export default function DetailPelaksanaanUndanganNarasumberPage() {
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
          include_pengajuan: true,
          include_pelaksanaan: true,
        });
        setLayananData(data);

        // Debug: Check if pengajuanRejection is returned
        console.log("[Undangan] pengajuanRejection:", data.pengajuanRejection);

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

        // Check if laporan exists and set states (handle array or single object)
        const laporanList = Array.isArray(data.laporan)
          ? data.laporan
          : data.laporan
          ? [data.laporan]
          : [];
        if (laporanList.length > 0 && laporanList[0]) {
          setLaporanSubmitted(true);
          const laporan: any = laporanList[0];
          // Set form with existing data
          setLaporanForm({
            namaP4s: laporan.nama_p4s || "",
            kota: laporan.asal_kab_kota || "",
            jenisKegiatan: "Undangan Narasumber",
            asalPeserta: "",
            jumlahPeserta: "",
            tanggalPelaksanaan: "",
            lamaPelaksanaan: "",
          });
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
    }, 15000); // Poll every 15 seconds

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
        "Undangan Narasumber",
    },
    { label: "Nama Kegiatan", value: layananData?.nama_kegiatan || "-" },
    { label: "Instansi", value: layananData?.instansi_asal || "-" },
  ];

  const infoKanan = [
    {
      label: "Tanggal Kegiatan",
      value: layananData?.tanggal_mulai
        ? formatDate(layananData.tanggal_mulai)
        : "-",
    },
    { label: "Tempat Kegiatan", value: layananData?.tempat_kegiatan || "-" },
  ];

  const dokumen = [
    {
      label: "Proposal / Surat Permohonan",
      file:
        layananData?.file_surat_permohonan || layananData?.file_proposal || "",
    },
    {
      label: "Surat Undangan Narasumber",
      file: layananData?.file_undangan_narasumber || "",
    },
  ];

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");

  const [laporanSubmitted, setLaporanSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "Undangan Narasumber",
    asalPeserta: "",
    jumlahPeserta: "",
    tanggalPelaksanaan: "",
    lamaPelaksanaan: "",
  });

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

  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document
        .getElementById("laporan-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitLaporan = async () => {
    // Validasi form
    if (
      !laporanForm.namaP4s ||
      !laporanForm.kota ||
      !laporanForm.jenisKegiatan ||
      !laporanForm.asalPeserta ||
      !laporanForm.jumlahPeserta ||
      !laporanForm.tanggalPelaksanaan ||
      !laporanForm.lamaPelaksanaan ||
      !fotoKegiatan
    ) {
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        title: "Form Tidak Lengkap",
        text: "Mohon lengkapi semua field yang wajib diisi.",
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

    const Swal = (await import("sweetalert2")).default;

    const result = await Swal.fire({
      title: "Yakin Mengirimkan Laporan Akhir?",
      text: "Apakah Anda yakin ingin mengirimkan laporan akhir kegiatan ini?",
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
      await createLaporanLayanan({
        id_layanan: Number(layananId),
        nama_p4s: laporanForm.namaP4s,
        asal_kab_kota: laporanForm.kota,
        foto_kegiatan: fotoKegiatan,
      });

      setSubmitting(false);
      setLaporanSubmitted(true);

      // Success modal
      await Swal.fire({
        title: "Laporan Akhir Terkirim",
        text: "Laporan Anda sudah berhasil dikirim. Tim kami akan memverifikasi terlebih dahulu.",
        icon: "success",
        confirmButtonText: "Kembali ke Layanan",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });

      // Redirect ke halaman layanan
      router.push("/layanan");
    } catch (error: any) {
      setSubmitting(false);
      await Swal.fire({
        title: "Gagal Mengirim Laporan",
        text: error.message || "Terjadi kesalahan saat mengirim laporan.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });
    }
  };

  const pengajuanDecisionText: Record<typeof pengajuanDecision, string> = {
    menunggu: "Menunggu Persetujuan",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  // Status pelaksanaan dari API
  const isPelaksanaanSelesai = layananData?.pelaksanaan?.nama_status_kode
    ?.toLowerCase()
    .includes("selesai");
  const isPelaksanaanBerjalan = layananData?.pelaksanaan?.nama_status_kode
    ?.toLowerCase()
    .includes("berjalan");

  const pelaksanaanStatusText = isPelaksanaanSelesai
    ? "Selesai"
    : isPelaksanaanBerjalan
    ? "Sedang Berlangsung"
    : "Belum Terlaksana";

  const decisionTextMap = {
    pending: "Belum Terlaksana",
    berjalan: "Sedang Berlangsung",
    selesai: "Selesai",
  } as const;

  // Step statuses untuk progress indicator
  const stepStatuses: Array<"pending" | "berjalan" | "selesai"> = [
    pengajuanDecision === "disetujui" ? "selesai" : "pending",
    isPelaksanaanSelesai
      ? "selesai"
      : isPelaksanaanBerjalan
      ? "berjalan"
      : "pending",
  ];

  // Loading state
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-tertiary pt-24 md:pt-28">
          <div className="container mx-auto px-4 max-w-6xl py-10">
            <div className="mb-4">
              <Link
                href="/layanan"
                className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Kembali ke Layanan</span>
              </Link>
            </div>
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-6 text-center">
              <div className="animate-spin mx-auto mb-4 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-[12px] text-[#6B6B6B]">
                Memuat data layanan...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !layananData) {
    return (
      <>
        <div className="min-h-screen bg-tertiary pt-24 md:pt-28">
          <div className="container mx-auto px-4 max-w-6xl py-10">
            <div className="mb-4">
              <Link
                href="/layanan"
                className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Kembali ke Layanan</span>
              </Link>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <XCircle className="mx-auto mb-3 text-red-500" size={48} />
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Gagal Memuat Data
              </h2>
              <p className="text-red-600 mb-4">
                {error || "Data layanan tidak ditemukan"}
              </p>
              <Link
                href="/layanan"
                className="inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
              >
                Kembali ke Layanan
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FCFBF7] pt-24 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl py-10">
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
            Detail Pelaksanaan Undangan Narasumber
          </h1>

          {/* ---- Ringkasan Pengajuan ---- */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              {/* Progress Kegiatan */}
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
                    : "bg-white border-[#EFEAE4]";

                  const iconWrapClass = isActive
                    ? status === "selesai"
                      ? "bg-[#E2F3EA] border-[#CBE6D7]"
                      : status === "berjalan"
                      ? "bg-[#BBDEFB] border-[#90CAF9]"
                      : "bg-[#DCD3CB] border-[#CFC6BE]"
                    : isCompleted
                    ? "bg-[#E9F7F0] border-[#CBE6D7]"
                    : "bg-[#F4F0EC] border-[#E8E2DB]";

                  const iconColorClass = isActive
                    ? status === "selesai"
                      ? "text-[#2F8A57]"
                      : status === "berjalan"
                      ? "text-[#1976D2]"
                      : "text-[#3B3B3B]"
                    : isCompleted
                    ? "text-[#2F8A57]"
                    : "text-[#6B6B6B]";

                  const descColorClass =
                    stepStatuses[idx] === "selesai"
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
                              ? pelaksanaanStatusText
                              : decisionTextMap[stepStatuses[idx]]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan pengajuan sebelah kanan */}
            <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-[#3B3B3B]" />
                <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">
                  Ringkasan Pengajuan & Dokumen
                </p>
              </div>
              <p className="text-[12px] text-[#6B6B6B] mb-4">
                Detail informasi dan Dokumen yang telah anda Submit
              </p>

              <div className="rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] p-4">
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
        </div>
      </div>

      {/* Jika Pengajuan Ditolak */}
      {pengajuanDecision === "ditolak" && (
        <div className="container mx-auto px-4 max-w-6xl mt-6 mb-8">
          <div className="rounded-xl border border-[#F0CFCF] bg-[#FFF6F6] p-6 shadow-sm">
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
              <XCircle className="text-[#CD0300]" />
            </div>
            <p className="text-[15px] md:text-base font-semibold text-[#CD0300] text-center">
              Pengajuan Ditolak
            </p>
            <p className="mt-2 text-[12px] text-[#6B6B6B] text-center">
              Pengajuan Anda ditolak oleh admin. Silakan perbaiki sesuai catatan
              di bawah dan ajukan kembali.
            </p>

            {/* Alasan Penolakan dari API */}
            {(() => {
              const rejection = layananData?.layananRejection;
              const alasan =
                (Array.isArray(rejection)
                  ? rejection[0]?.alasan
                  : rejection?.alasan) ||
                layananData?.pengajuanRejection?.alasan ||
                layananData?.rejection?.alasan ||
                layananData?.pengajuan?.alasan_penolakan ||
                layananData?.alasan_penolakan;

              return alasan ? (
                <div className="mt-4 rounded-lg border border-[#F0C3C3] bg-white p-4 text-left">
                  <p className="text-sm font-semibold text-[#CD0300] mb-2">
                    Alasan Penolakan:
                  </p>
                  <p className="text-[12px] text-[#3B3B3B] whitespace-pre-wrap">
                    {alasan}
                  </p>
                </div>
              ) : null;
            })()}

            <div className="mt-4 text-center">
              <Link
                href="/layanan"
                className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90"
              >
                Ajukan Ulang
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Akhir Section */}
      {pengajuanDecision === "disetujui" && (
        <div
          className="container mx-auto px-4 max-w-6xl mb-8"
          id="laporan-section"
        >
          <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                <FileCheck size={14} className="text-[#3B3B3B]" />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">
                Laporan Akhir Kegiatan
              </p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">
              Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program
            </p>

            <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
              <div className="space-y-3">
                {/* Input Fields */}
                {[
                  {
                    label: "Nama P4S",
                    name: "namaP4s",
                    placeholder: "Contoh : P4S Tani Makmur",
                  },
                  {
                    label: "Kabupaten / Kota",
                    name: "kota",
                    placeholder: "Contoh : Kota Lumajang",
                  },
                  {
                    label: "Asal Peserta / Mitra Kerjasama",
                    name: "asalPeserta",
                    placeholder: "Contoh : Universitas Jember",
                  },
                  {
                    label: "Jumlah Peserta",
                    name: "jumlahPeserta",
                    placeholder: "Contoh : 1",
                  },
                  {
                    label: "Lama Pelaksanaan",
                    name: "lamaPelaksanaan",
                    placeholder: "Contoh : 4 Bulan",
                  },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-[12px] text-[#3B3B3B] mb-1">
                      {f.label} *
                    </label>
                    <input
                      name={f.name}
                      value={laporanForm[f.name as keyof typeof laporanForm]}
                      onChange={handleLaporanChange}
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                    />
                  </div>
                ))}

                {/* Jenis Kegiatan */}
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Jenis Kegiatan *
                  </label>
                  <select
                    name="jenisKegiatan"
                    value={laporanForm.jenisKegiatan}
                    onChange={handleLaporanChange}
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                  >
                    <option value="">Pilih Jenis Kegiatan</option>
                    <option value="pkl">PKL</option>
                    <option value="Magang">Magang</option>
                    <option value="pelatihan">Pelatihan Kopi</option>
                  </select>
                </div>

                {/* Tanggal Pelaksanaan */}
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Tanggal Pelaksanaan *
                  </label>
                  <input
                    type="date"
                    name="tanggalPelaksanaan"
                    value={laporanForm.tanggalPelaksanaan}
                    onChange={handleLaporanChange}
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                  />
                </div>

                {/* Upload Foto Kegiatan */}
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Foto Kegiatan *
                  </label>
                  <div
                    className="border border-dashed border-[#E8E2DB] rounded-lg bg-white p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F7F5]"
                    onClick={handlePickFoto}
                  >
                    {fotoKegiatan ? (
                      <div className="text-center">
                        <p className="text-[12px] text-[#3B3B3B]">
                          {fotoKegiatan.name}
                        </p>
                        <p className="text-[11px] text-[#6B6B6B] mt-1">
                          Klik untuk ganti
                        </p>
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
                    />
                  </div>
                </div>

                {/* Tombol Submit */}
                <div className="pt-2 text-right">
                  <button
                    onClick={handleSubmitLaporan}
                    className="w-full md:w-auto bg-[#5C3A1E] text-white text-[13px] px-6 py-2 rounded-lg hover:bg-[#4C2E15] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
