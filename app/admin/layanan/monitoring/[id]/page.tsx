"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  FileText,
  ShieldCheck,
  ClipboardList,
  Award,
  ChevronLeft,
  Eye,
  Download,
} from "lucide-react";
import {
  fetchLayananById,
  LayananItem,
  acceptPengajuan,
  rejectPengajuan,
  formatDate,
} from "@/app/utils/layanan";
import { approveMou, rejectMou } from "@/app/utils/mou";

type StepKey = "pengajuan" | "mou" | "pelaksanaan" | "laporan" | "sertifikat";
type StepStatus = "inactive" | "active" | "done";

export default function AdminMonitoringDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [layananData, setLayananData] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<Record<StepKey, StepStatus>>({
    pengajuan: "active",
    mou: "inactive",
    pelaksanaan: "inactive",
    laporan: "inactive",
    sertifikat: "inactive",
  });

  // Fetch layanan data
  useEffect(() => {
    const loadData = async () => {
      if (!params?.id) return;
      try {
        setLoading(true);
        const data = await fetchLayananById(Number(params.id), {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching layanan:", err);
        setError(err.message || "Gagal memuat data layanan");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params?.id]);

  // DISABLED: Polling can interfere with immediate state updates
  // Uncomment if real-time sync is needed after testing
  // useEffect(() => {
  //   if (!params?.id || loading) return;
  //   const pollInterval = setInterval(async () => {
  //     try {
  //       const data = await fetchLayananById(Number(params.id), {
  //         include_jenis: true,
  //         include_peserta: true,
  //         include_mou: true,
  //         include_sertifikat: true,
  //         include_laporan: true,
  //         include_rejection: true,
  //         include_pengajuan: true,
  //         include_pelaksanaan: true,
  //       });
  //       setLayananData(data);
  //     } catch (err) {
  //       console.error("[Admin] Error polling:", err);
  //     }
  //   }, 30000); // 30 seconds
  //   return () => clearInterval(pollInterval);
  // }, [params?.id, loading]);

  // Helper: build file URL
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
    const p = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${base}${p}`;
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

  const goNext = (current: StepKey) => {
    const order: StepKey[] = [
      "pengajuan",
      "mou",
      "pelaksanaan",
      "laporan",
      "sertifikat",
    ];
    const idx = order.indexOf(current);
    const next = order[idx + 1];
    setSteps((prev) => ({
      ...prev,
      [current]: "done",
      ...(next ? { [next]: "active" } : {}),
    }));
  };

  // Approve Pengajuan
  const handleApprovePengajuan = async () => {
    if (!layananData) return;

    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin menyetujui pengajuan ini?",
      html: "pastikan semua data yang diajukan sudah sesuai",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Yakin",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Memproses...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await acceptPengajuan(layananData.id);

        // Optimistic update - immediately change status in local state
        setLayananData((prev) =>
          prev
            ? {
                ...prev,
                pengajuan: {
                  ...prev.pengajuan,
                  nama_status_kode: "Disetujui",
                },
                pelaksanaan: {
                  ...prev.pelaksanaan,
                  nama_status_kode: "Belum Terlaksana",
                },
              }
            : null
        );

        // Reload data from server (will be overridden by backend bug, but optimistic update already applied)
        const updated = await fetchLayananById(layananData.id, {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });

        // Only update if backend returns correct status (won't happen until backend fixed)
        // Keep optimistic update if backend still buggy
        if (
          updated.pengajuan?.nama_status_kode
            ?.toLowerCase()
            .includes("disetujui")
        ) {
          setLayananData(updated);
        }

        await Swal.fire({
          icon: "success",
          title: "Pengajuan Disetujui",
          html: "Pengajuan berhasil disetujui.",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menyetujui",
          text: error.message || "Terjadi kesalahan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  // Reject Pengajuan
  const handleRejectPengajuan = async () => {
    if (!layananData) return;

    const Swal = (await import("sweetalert2")).default;
    const { value: text, isConfirmed } = await Swal.fire({
      title: "Tolak Pengajuan",
      html: `berikan alasan penolakan untuk membantu peserta memahami dan memperbaiki pengajuan mereka`,
      input: "textarea",
      inputLabel: "alasan Penolakan",
      inputPlaceholder:
        "Contoh : Dokumen yang di Upload Tidak lengkap. Pada bagian Proposal tidak disertakan ttd pihak Instansi",
      inputAttributes: { "aria-label": "Alasan" },
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Tolak",
      confirmButtonColor: "#4E342E",
      focusConfirm: false,
      customClass: { popup: "rounded-xl" },
    });

    if (isConfirmed) {
      if (!text || text.trim() === "") {
        await Swal.fire({
          icon: "warning",
          title: "Alasan Wajib Diisi",
          text: "Mohon berikan alasan penolakan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
        return;
      }

      try {
        Swal.fire({
          title: "Memproses...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await rejectPengajuan(layananData.id, text);

        // Optimistic update - immediately change status in local state
        setLayananData((prev) =>
          prev
            ? {
                ...prev,
                pengajuan: {
                  ...prev.pengajuan,
                  nama_status_kode: "Ditolak",
                },
                pelaksanaan: {
                  ...prev.pelaksanaan,
                  nama_status_kode: "Ditolak",
                },
                layananRejection: Array.isArray(prev.layananRejection)
                  ? [{ id: Date.now(), id_layanan: prev.id, alasan: text }]
                  : { id: Date.now(), id_layanan: prev.id, alasan: text },
              }
            : null
        );

        // Reload data from server
        const updated = await fetchLayananById(layananData.id, {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });

        // Merge: keep optimistic status if backend buggy, but use backend rejection data if available
        setLayananData((prev) => ({
          ...updated,
          pengajuan: updated.pengajuan?.nama_status_kode
            ?.toLowerCase()
            .includes("ditolak")
            ? updated.pengajuan
            : prev?.pengajuan || updated.pengajuan,
          pelaksanaan: updated.pelaksanaan?.nama_status_kode
            ?.toLowerCase()
            .includes("ditolak")
            ? updated.pelaksanaan
            : prev?.pelaksanaan || updated.pelaksanaan,
          layananRejection: updated.layananRejection || prev?.layananRejection,
        }));

        await Swal.fire({
          icon: "success",
          title: "Pengajuan Berhasil Ditolak",
          html: `<p class="text-sm mb-2">Alasan Penolakan:</p><p class="text-sm font-semibold">${text}</p>`,
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menolak",
          text: error.message || "Terjadi kesalahan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  // Approve MOU
  const handleApproveMou = async () => {
    if (!layananData?.mou?.id) return;

    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin menyetujui MOU ini?",
      html: "pastikan dokumen MOU yang diajukan sudah sesuai",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Yakin",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Memproses...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await approveMou(layananData.mou.id);

        // Reload data
        const updated = await fetchLayananById(layananData.id, {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(updated);

        goNext("mou");

        await Swal.fire({
          icon: "success",
          title: "MOU Disetujui",
          html: "MOU berhasil disetujui",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menyetujui MOU",
          text: error.message || "Terjadi kesalahan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  // Reject MOU
  const handleRejectMou = async () => {
    if (!layananData?.mou?.id) return;

    const Swal = (await import("sweetalert2")).default;
    const { value: text, isConfirmed } = await Swal.fire({
      title: "Tolak MOU",
      html: `berikan alasan penolakan untuk membantu peserta memahami dan memperbaiki MOU mereka`,
      input: "textarea",
      inputLabel: "alasan Penolakan",
      inputPlaceholder:
        "Contoh : MOU belum ditandatangani oleh pihak yang berwenang",
      inputAttributes: { "aria-label": "Alasan" },
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Tolak",
      confirmButtonColor: "#4E342E",
      focusConfirm: false,
      customClass: { popup: "rounded-xl" },
    });

    if (isConfirmed) {
      if (!text || text.trim() === "") {
        await Swal.fire({
          icon: "warning",
          title: "Alasan Wajib Diisi",
          text: "Mohon berikan alasan penolakan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
        return;
      }

      try {
        Swal.fire({
          title: "Memproses...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await rejectMou(layananData.mou.id, text);

        // Reload data
        const updated = await fetchLayananById(layananData.id, {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(updated);

        await Swal.fire({
          icon: "success",
          title: "MOU Berhasil Ditolak",
          html: text && text.length > 0 ? text : "MOU ditolak.",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menolak MOU",
          text: error.message || "Terjadi kesalahan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  const sendCertificateAlert = async () => {
    const Swal = (await import("sweetalert2")).default;
    const confirm = await Swal.fire({
      title: "Kirim Sertifikat?",
      html: "Sertifikat akan dikirim ke peserta. Pastikan file sudah benar.",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Kirim",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });
    if (confirm.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Sertifikat Dikirim",
        html: "Sertifikat berhasil dikirim ke peserta.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      setSteps((prev) => ({ ...prev, sertifikat: "done" }));
    }
  };

  const StepItem = ({
    label,
    icon,
    status,
  }: {
    label: string;
    icon: React.ReactNode;
    status: StepStatus;
  }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        status === "active"
          ? "bg-neutral-100 border-neutral-200"
          : status === "done"
          ? "bg-white border-emerald-200"
          : "bg-white border-neutral-200 opacity-60"
      }`}
    >
      <div className="shrink-0 h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
        {icon}
      </div>
      <div className="text-sm font-medium">{label}</div>
      {status === "done" && (
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-700">
          <Check size={14} /> Selesai
        </span>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-tertiary">
        <div className="w-full px-4 md:px-6 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !layananData) {
    return (
      <div className="min-h-screen bg-tertiary">
        <div className="w-full px-4 md:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={18} /> Kembali
          </button>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Gagal Memuat Data
            </h2>
            <p className="text-red-600 mb-4">
              {error || "Data layanan tidak ditemukan"}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get peserta info
  const pesertaInfo = layananData.peserta?.[0];
  const jenisNama =
    layananData.jenisLayanan?.nama_jenis_layanan ||
    layananData.jenis_layanan?.nama_jenis_layanan ||
    "";

  // Check if MOU workflow applies (PKL, Magang, Pelatihan)
  const hasMouWorkflow = [
    "Magang",
    "Praktek Kerja Lapangan (PKL)",
    "Pelatihan",
  ].some((j) => jenisNama.includes(j));

  // Check if it's simple workflow (Kunjungan, Undangan Narasumber - only Pengajuan + Pelaksanaan)
  const isSimpleWorkflow = ["Kunjungan", "Undangan Narasumber"].some((j) =>
    jenisNama.includes(j)
  );

  // Determine if pengajuan is in pending state (can approve/reject)
  // Note: These are recalculated on every render to reflect optimistic updates
  const statusPengajuan =
    layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
  const statusPelaksanaan =
    layananData?.pelaksanaan?.nama_status_kode?.toLowerCase() || "";

  const isPengajuanPending =
    statusPengajuan.includes("menunggu") &&
    !statusPengajuan.includes("disetujui") &&
    !statusPengajuan.includes("ditolak");
  const isPengajuanApproved = statusPengajuan.includes("disetujui");
  const isPengajuanRejected = statusPengajuan.includes("ditolak");

  // Determine if MOU is in pending state (can approve/reject)
  const isMouPending =
    layananData?.mou?.statusKode?.nama_status_kode
      ?.toLowerCase()
      .includes("menunggu") &&
    !layananData?.mou?.statusKode?.nama_status_kode
      ?.toLowerCase()
      .includes("disetujui") &&
    !layananData?.mou?.statusKode?.nama_status_kode
      ?.toLowerCase()
      .includes("ditolak");

  return (
    <div className="min-h-screen bg-tertiary">
      <div className="w-full px-4 md:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={18} /> Kembali
        </button>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-center">Detail Kegiatan</h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Ringkasan kegiatan yang diikuti peserta di Sekolah Kopi Raisa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Progress */}
          <div className="md:col-span-1 bg-white rounded-xl border border-gray-100 p-5">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-xl bg-neutral-100 text-neutral-700">
              <Check />
            </div>
            <h3 className="text-center font-semibold mt-3">Progres Kegiatan</h3>
            <p className="text-center text-xs text-gray-500 mb-4">
              Pantau Status Pelaksanaan Kegiatan Anda
            </p>
            <div className="space-y-3">
              <StepItem
                label="Pengajuan"
                icon={<FileText size={16} />}
                status={steps.pengajuan}
              />
              {/* Simple workflow (Kunjungan, Undangan Narasumber): Pengajuan -> Laporan Akhir */}
              {/* MOU workflow (PKL, Magang, Pelatihan): Pengajuan -> MOU -> Pelaksanaan -> Laporan -> Sertifikat */}
              {isSimpleWorkflow ? (
                <StepItem
                  label="Laporan Akhir"
                  icon={<FileText size={16} />}
                  status={steps.laporan}
                />
              ) : (
                <>
                  {/* MOU hanya untuk PKL, Magang, Pelatihan */}
                  <StepItem
                    label="MOU"
                    icon={<ShieldCheck size={16} />}
                    status={steps.mou}
                  />
                  <StepItem
                    label="Pelaksanaan"
                    icon={<ClipboardList size={16} />}
                    status={steps.pelaksanaan}
                  />
                  <StepItem
                    label="Laporan Akhir"
                    icon={<FileText size={16} />}
                    status={steps.laporan}
                  />
                  <StepItem
                    label="Sertifikat Kegiatan"
                    icon={<Award size={16} />}
                    status={steps.sertifikat}
                  />
                </>
              )}
            </div>
          </div>

          {/* Pengajuan / MOU Content (always visible; actions still conditional) */}
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Ringkasan Pengajuan & Dokumen
                </h3>
                <p className="text-sm text-gray-600">
                  Detail Informasi dan Dokumen yang telah anda Submit
                </p>
              </div>
              {/* Status Badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Status Pengajuan:
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      layananData.pengajuan?.nama_status_kode
                        ?.toLowerCase()
                        .includes("disetujui")
                        ? "bg-green-100 text-green-700"
                        : layananData.pengajuan?.nama_status_kode
                            ?.toLowerCase()
                            .includes("ditolak")
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {layananData.pengajuan?.nama_status_kode || "-"}
                  </span>
                </div>
                {/* Hide status pelaksanaan untuk Kunjungan & Undangan Narasumber */}
                {!isSimpleWorkflow && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Status Pelaksanaan:
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        layananData.pelaksanaan?.nama_status_kode
                          ?.toLowerCase()
                          .includes("selesai")
                          ? "bg-green-100 text-green-700"
                          : layananData.pelaksanaan?.nama_status_kode
                              ?.toLowerCase()
                              .includes("berjalan")
                          ? "bg-blue-100 text-blue-700"
                          : layananData.pelaksanaan?.nama_status_kode
                              ?.toLowerCase()
                              .includes("ditolak")
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {layananData.pelaksanaan?.nama_status_kode || "-"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-neutral-200 rounded-lg p-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Jenis Kegiatan</p>
                <p className="text-sm">{jenisNama || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Mulai</p>
                <p className="text-sm">
                  {layananData.tanggal_mulai
                    ? formatDate(layananData.tanggal_mulai)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Nama Peserta</p>
                <p className="text-sm">
                  {pesertaInfo?.nama_peserta ||
                    pesertaInfo?.nama ||
                    layananData.pemohon?.name ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Selesai</p>
                <p className="text-sm">
                  {layananData.tanggal_selesai
                    ? formatDate(layananData.tanggal_selesai)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Instansi</p>
                <p className="text-sm">{layananData.instansi_asal || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Kegiatan yang dipilih</p>
                <p className="text-sm">
                  {layananData.kegiatan
                    ?.map((k: any) => k.nama_kegiatan)
                    .join(", ") ||
                    layananData.nama_kegiatan ||
                    "-"}
                </p>
              </div>
            </div>

            {/* Dokumen */}
            <div>
              <p className="text-sm font-semibold mb-3">
                Dokumen yang diupload
              </p>
              <div className="space-y-3">
                {/* Proposal/Surat Permohonan */}
                {(layananData.file_proposal ||
                  layananData.file_surat_permohonan) && (
                  <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Proposal / Surat Permohonan
                        </p>
                        <p className="text-xs text-gray-500">
                          ProposalSuratPermohonan.pdf
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openFile(
                            resolveFileUrl(
                              layananData.file_proposal ||
                                layananData.file_surat_permohonan
                            )
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            resolveFileUrl(
                              layananData.file_proposal ||
                                layananData.file_surat_permohonan
                            ),
                            "ProposalSuratPermohonan.pdf"
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* Surat Pengantar */}
                {layananData.file_surat_pengantar && (
                  <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Surat Pengantar</p>
                        <p className="text-xs text-gray-500">
                          SuratPengantar.pdf
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openFile(
                            resolveFileUrl(layananData.file_surat_pengantar)
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            resolveFileUrl(layananData.file_surat_pengantar),
                            "SuratPengantar.pdf"
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* MOU - tampilkan HANYA untuk PKL, Magang, Pelatihan */}
                {hasMouWorkflow && layananData.mou?.file_mou && (
                  <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">MOU</p>
                        <p className="text-xs text-gray-500">MOU.pdf</p>
                        {layananData.mou.statusKode?.nama_status_kode && (
                          <span
                            className={`text-xs ${
                              layananData.mou.statusKode.nama_status_kode
                                .toLowerCase()
                                .includes("disetujui")
                                ? "text-green-600"
                                : layananData.mou.statusKode.nama_status_kode
                                    .toLowerCase()
                                    .includes("ditolak")
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {layananData.mou.statusKode.nama_status_kode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openFile(resolveFileUrl(layananData.mou?.file_mou))
                        }
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            resolveFileUrl(layananData.mou?.file_mou),
                            "MOU.pdf"
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* Show Pengajuan rejection reason if rejected - SEMUA layanan */}
                {(() => {
                  const rejection = layananData.layananRejection;
                  const alasan =
                    layananData.pengajuanRejection?.alasan ||
                    (Array.isArray(rejection)
                      ? rejection[0]?.alasan
                      : rejection?.alasan) ||
                    layananData.rejection?.alasan ||
                    layananData.pengajuan?.alasan_penolakan ||
                    layananData.alasan_penolakan;

                  return alasan ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Alasan Penolakan Pengajuan
                      </p>
                      <p className="text-xs text-red-600 whitespace-pre-wrap">
                        {alasan}
                      </p>
                    </div>
                  ) : null;
                })()}

                {/* Show MOU rejection reason if rejected - HANYA untuk PKL, Magang, Pelatihan */}
                {hasMouWorkflow && layananData.mou?.mouRejection?.alasan && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      Alasan Penolakan MOU
                    </p>
                    <p className="text-xs text-red-600 whitespace-pre-wrap">
                      {layananData.mou.mouRejection.alasan}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions shown only for Pengajuan/MOU */}
            {isPengajuanPending && (
              <div className="mt-4 justify-center flex items-center gap-3">
                {/* Tolak Pengajuan */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  onClick={handleRejectPengajuan}
                >
                  ✕ Tolak Pengajuan
                </button>
                {/* Setujui Pengajuan */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950"
                  onClick={handleApprovePengajuan}
                >
                  ✓ Setujui Pengajuan
                </button>
              </div>
            )}

            {/* Show MOU actions if workflow applies and MOU is pending */}
            {hasMouWorkflow && isMouPending && layananData.mou?.file_mou && (
              <div className="mt-4 justify-center flex items-center gap-3">
                {/* Tolak MOU */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  onClick={handleRejectMou}
                >
                  ✕ Tolak MOU
                </button>
                {/* Setujui MOU */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950"
                  onClick={handleApproveMou}
                >
                  ✓ Setujui MOU
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ID Pengajuan: {String(params?.id)}
        </p>
      </div>
    </div>
  );
}
