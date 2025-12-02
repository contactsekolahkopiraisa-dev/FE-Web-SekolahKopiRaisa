"use client";

import Footer from "@/components/main/Footer";
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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLayananById, LayananItem, formatDate } from "../../utils/layanan";
import { createLaporanLayanan } from "../../utils/laporan";

export default function DetailPelaksanaanKunjunganPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layananId = searchParams.get('id');
  
  const [layananData, setLayananData] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const valueOrDash = (value?: string) => {
    if (typeof value !== "string") return "-";
    const v = value.trim();
    if (v === "" || v.toLowerCase() === "null" || v.toLowerCase() === "undefined") return "-";
    return v;
  };

  const resolveFileUrl = (path?: string | null): string | null => {
    if (!path) return null;
    const trimmed = path.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return `${base}${trimmed.startsWith("/") ? trimmed : "/" + trimmed}`;
  };

  const openFile = (url: string | null) => {
    if (!url) return;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadFile = (url: string | null, filename?: string) => {
    if (!url || typeof document === "undefined") return;
    
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
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
      .catch(error => {
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
        });
        setLayananData(data);

        // Set decision states from API data
        if (data.status_pengajuan_kode) {
          const statusPengajuan = data.status_pengajuan_kode.toLowerCase();
          if (statusPengajuan.includes('disetujui') || statusPengajuan.includes('diterima')) {
            setPengajuanDecision('disetujui');
          } else if (statusPengajuan.includes('ditolak')) {
            setPengajuanDecision('ditolak');
          }
        }

        // Check if laporan exists and set states (handle array or single object)
        const laporanList = Array.isArray(data.laporan) ? data.laporan : data.laporan ? [data.laporan] : [];
        if (laporanList.length > 0 && laporanList[0]) {
          setLaporanSubmitted(true);
          const laporan: any = laporanList[0];
          setLaporanForm({
            namaP4s: laporan.nama_p4s || "",
            kota: laporan.asal_kab_kota || "",
            jenisKegiatan: "Kunjungan",
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

  // Get participant info
  const pesertaInfo = layananData?.peserta?.[0];
  
  const infoKiri = [
    { label: "Jenis Kegiatan", value: layananData?.jenisLayanan?.nama_jenis_layanan || layananData?.jenis_layanan?.nama_jenis_layanan || "Kunjungan" },
    { label: "Nama Kegiatan", value: layananData?.nama_kegiatan || "-" },
  ];

  const infoKanan = [
    { label: "Tanggal Kegiatan", value: layananData?.tanggal_mulai ? formatDate(layananData.tanggal_mulai) : "-" },
    { label: "Tempat Kegiatan", value: layananData?.tempat_kegiatan || "-" },
  ];

  const dokumen = [
    { label: "Proposal / Surat Permohonan", file: layananData?.file_surat_permohonan || layananData?.file_proposal || "" },
    { label: "Surat Pengantar", file: layananData?.file_surat_pengantar || "" },
  ];

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");

  const [laporanSubmitted, setLaporanSubmitted] = useState<boolean>(false);

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "Kunjungan",
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
    if (!laporanForm.namaP4s.trim() || !laporanForm.kota.trim() || !fotoKegiatan) {
      await Swal.fire({
        title: "Form Tidak Lengkap",
        text: "Mohon lengkapi Nama P4S, Asal Kab/Kota, dan upload Foto Kegiatan",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
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
        foto_kegiatan: fotoKegiatan,
      };

      await createLaporanLayanan(payload);

      setLaporanSubmitted(true);

      await Swal.fire({
        title: "Laporan Berhasil Dikirim!",
        text: "Terima kasih telah menyelesaikan kegiatan Kunjungan.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });

      setTimeout(() => {
        router.push("/layanan");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting laporan:", error);
      await Swal.fire({
        title: "Gagal Mengirim Laporan",
        text: error.message || "Terjadi kesalahan saat mengirim laporan",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
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

  const decisionTextMap = {
    pending: "Belum Terlaksana",
    disetujui: "Disetujui",
  } as const;

  const stepStatuses: Array<"pending" | "disetujui"> = [
    pengajuanDecision === "disetujui" ? "disetujui" : "pending",
    laporanSubmitted ? "disetujui" : "pending",
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
            <h2 className="text-xl font-bold text-[#3B3B3B] mb-2">Gagal Memuat Data</h2>
            <p className="text-[#6B6B6B] mb-6">{error}</p>
            <button
              onClick={() => router.push('/layanan')}
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

          {/* Decision Test */}
          <div className="mb-4 rounded-lg border border-[#E8E2DB] bg-white p-3 text-[12px] text-[#3B3B3B]">
            <p className="font-semibold mb-2">Decision Test</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2">
                <span className="w-28">Pengajuan</span>
                <select
                  className="flex-1 rounded-md border border-[#E8E2DB] px-2 py-1"
                  value={pengajuanDecision}
                  onChange={(e) =>
                    setPengajuanDecision(
                      e.target.value as typeof pengajuanDecision
                    )
                  }
                >
                  <option value="menunggu">menunggu</option>
                  <option value="disetujui">disetujui</option>
                  <option value="ditolak">ditolak</option>
                </select>
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-[#E8E2DB] px-3 py-1"
                  onClick={scrollToLaporan}
                >
                  scroll to laporan
                </button>
              </div>
            </div>
          </div>

          <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B]">
            Detail Pelaksanaan Kunjungan
          </h1>

          {/* PROGRES KEGIATAN + DOKUMEN */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  const firstNonApprovedIndex = stepStatuses.findIndex(
                    (st) => st !== "disetujui"
                  );
                  const activeStepIndex =
                    firstNonApprovedIndex === -1
                      ? stepStatuses.length
                      : firstNonApprovedIndex;
                  const isActive = idx === activeStepIndex;
                  const isCompleted =
                    idx < activeStepIndex && stepStatuses[idx] === "disetujui";
                  const status = stepStatuses[idx];

                  const containerClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#EAF8F0] border-[#D2EBDD]"
                      : "bg-[#EDE6DF] border-[#E0D8D1]"
                    : isCompleted
                    ? "bg-[#F3FBF7] border-[#CFEAD9]"
                    : "bg-white border-[#EFEAE4]";

                  const iconWrapClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#E2F3EA] border-[#CBE6D7]"
                      : "bg-[#DCD3CB] border-[#CFC6BE]"
                    : isCompleted
                    ? "bg-[#E9F7F0] border-[#CBE6D7]"
                    : "bg-[#F4F0EC] border-[#E8E2DB]";

                  const iconColorClass = isActive
                    ? status === "disetujui"
                      ? "text-[#2F8A57]"
                      : "text-[#3B3B3B]"
                    : isCompleted
                    ? "text-[#2F8A57]"
                    : "text-[#6B6B6B]";

                  const descColorClass =
                    stepStatuses[idx] === "disetujui"
                      ? "text-[#2F8A57]"
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
              <p className="text-[12px] text-[#6B6B6B] mb-4">
                Detail informasi dan Dokumen yang telah anda Submit
              </p>

              <div className="rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">
                      Jenis Kegiatan
                    </p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      Kunjungan
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">
                      Jumlah Peserta
                    </p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">1</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">
                      Tanggal Kunjungan
                    </p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      01/10/2025
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">
                      Nama Peserta
                    </p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">-</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Instansi</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      Universitas Jember
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-semibold text-[#3B3B3B] mb-3">
                Dokumen yang diupload
              </p>
              <div className="space-y-2">
                <DocItem
                  name="Surat Permohonan / Surat Tugas"
                  file="Surat Permohonan.pdf"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengajuan Ditolak */}
      {pengajuanDecision === "ditolak" && (
        <div className="container mx-auto px-4 max-w-6xl mt-6 mb-8">
          <div className="rounded-xl border border-[#F0CFCF] bg-[#FFF6F6] p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
              <XCircle className="text-[#CD0300]" />
            </div>
            <p className="text-[15px] md:text-base font-semibold text-[#CD0300]">
              Pengajuan Ditolak
            </p>
            <p className="mt-1 text-[12px] text-[#6B6B6B]">
              Pengajuan Anda Ditolak karena Proposal belum ditandatangani
              pimpinan fakultas dan jadwal pelaksanaan tidak jelas. Silakan
              perbaiki sesuai catatan di atas dan ajukan kembali.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90"
              >
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Akhir */}
      {pengajuanDecision === "disetujui" && (
        <LaporanAkhirForm
          laporanForm={laporanForm}
          handleLaporanChange={handleLaporanChange}
          fotoKegiatan={fotoKegiatan}
          handlePickFoto={handlePickFoto}
          handleFotoChange={handleFotoChange}
          fotoInputRef={fotoInputRef}
          handleSubmitLaporan={handleSubmitLaporan}
        />
      )}

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
}: any) {
  return (
    <div className="container mx-auto px-4 max-w-6xl mb-8" id="laporan-section">
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
              {
                label: "Asal Peserta",
                name: "asalPeserta",
                placeholder: "Contoh : Universitas Jember",
              },
              {
                label: "Jumlah Peserta",
                name: "jumlahPeserta",
                placeholder: "Contoh : 5 orang",
              },
              {
                label: "Lama Pelaksanaan",
                name: "lamaPelaksanaan",
                placeholder: "Contoh : 3 hari",
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
                  className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                />
              </div>
            ))}

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

            {/* Upload Foto */}
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
  );
}
function setLaporanSubmitted(arg0: boolean) {
  throw new Error("Function not implemented.");
}



function setSubmitting(arg0: boolean) {
  throw new Error("Function not implemented.");
}

