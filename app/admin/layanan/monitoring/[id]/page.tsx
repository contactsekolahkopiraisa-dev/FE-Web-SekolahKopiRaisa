"use client";
//test commit
import React, { useState, useEffect, useRef } from "react";
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
  Upload,
} from "lucide-react";
import {
  fetchLayananById,
  LayananItem,
  acceptPengajuan,
  rejectPengajuan,
  formatDate,
} from "@/app/utils/layanan";
import { approveMou, rejectMou } from "@/app/utils/mou";
import { createSertifikat, SertifikatItem } from "@/app/utils/sertifikat";

type StepKey = "pengajuan" | "mou" | "pelaksanaan" | "laporan" | "sertifikat";
type StepStatus = "inactive" | "active" | "done";

export default function AdminMonitoringDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [layananData, setLayananData] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sertifikat upload states
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);
  const [sertifikatLink, setSertifikatLink] = useState<string>("");
  const [uploadingSertifikat, setUploadingSertifikat] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [steps, setSteps] = useState<Record<StepKey, StepStatus>>({
    pengajuan: "active",
    mou: "inactive",
    pelaksanaan: "inactive",
    laporan: "inactive",
    sertifikat: "inactive",
  });

  // Stable state untuk display status (tidak akan berubah setelah disetujui/ditolak)
  const [displayPengajuanStatus, setDisplayPengajuanStatus] =
    useState<string>("");
  const [displayPelaksanaanStatus, setDisplayPelaksanaanStatus] =
    useState<string>("");
  const [isStatusInitialized, setIsStatusInitialized] =
    useState<boolean>(false);

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

        // Set initial display status ONLY if not already set (first load)
        if (!isStatusInitialized) {
          let pengajuanStatus = data?.pengajuan?.nama_status_kode || "";
          const pelaksanaanStatus = data?.pelaksanaan?.nama_status_kode || "";

          // NORMALISASI STATUS PENGAJUAN: Jika "Berlangsung" tapi ada progress (MOU/Pelaksanaan),
          // maka PASTI pengajuan sudah pernah disetujui - override jadi "Disetujui"
          if (pengajuanStatus.toLowerCase().includes("berlangsung")) {
            if (data?.mou?.id || data?.pelaksanaan?.id || pelaksanaanStatus) {
              pengajuanStatus = "Disetujui";
            }
          }

          setDisplayPengajuanStatus(pengajuanStatus);
          setDisplayPelaksanaanStatus(pelaksanaanStatus);
          setIsStatusInitialized(true);
        }

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

  // Update all steps status based on actual data
  useEffect(() => {
    if (!layananData) return;

    // GUNAKAN STABLE STATUS dari state, bukan langsung dari backend
    const statusPengajuan =
      displayPengajuanStatus.toLowerCase() ||
      layananData?.pengajuan?.nama_status_kode?.toLowerCase() ||
      "";
    const statusPelaksanaan =
      displayPelaksanaanStatus.toLowerCase() ||
      layananData?.pelaksanaan?.nama_status_kode?.toLowerCase() ||
      "";
    const statusMou =
      layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase() || "";

    const laporanData = Array.isArray(layananData?.laporan)
      ? layananData.laporan[0]
      : layananData?.laporan;
    const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);

    const sertifikatData = Array.isArray(layananData?.sertifikat)
      ? layananData.sertifikat[0]
      : layananData?.sertifikat;
    const hasSertifikat = !!(
      sertifikatData?.id || sertifikatData?.file_sertifikat
    );

    const jenisNama =
      layananData.jenisLayanan?.nama_jenis_layanan ||
      layananData.jenis_layanan?.nama_jenis_layanan ||
      "";
    const hasMouWorkflow = [
      "Magang",
      "Praktek Kerja Lapangan (PKL)",
      "Pelatihan",
    ].some((j) => jenisNama.includes(j));
    const isSimpleWorkflow = ["Kunjungan", "Undangan Narasumber"].some((j) =>
      jenisNama.includes(j)
    );

    let newSteps: Record<StepKey, StepStatus> = {
      pengajuan: "inactive",
      mou: "inactive",
      pelaksanaan: "inactive",
      laporan: "inactive",
      sertifikat: "inactive",
    };

    // 1. PENGAJUAN - Gunakan stable status
    if (
      statusPengajuan.includes("selesai") || // PENTING: Cek "selesai" dulu!
      statusPengajuan.includes("disetujui") ||
      statusPengajuan.includes("ditolak")
    ) {
      newSteps.pengajuan = "done";
    } else if (statusPengajuan.includes("menunggu")) {
      newSteps.pengajuan = "active";
    } else {
      newSteps.pengajuan = "active";
    }

    // 2. MOU - Hanya untuk workflow yang pakai MOU (PKL, Magang, Pelatihan)
    if (hasMouWorkflow) {
      if (statusMou.includes("disetujui") || statusMou.includes("ditolak")) {
        newSteps.mou = "done";
      } else if (statusMou.includes("menunggu") || layananData.mou?.id) {
        newSteps.mou = "active";
      } else if (statusPengajuan.includes("disetujui")) {
        // Pengajuan sudah disetujui tapi belum ada MOU, berarti MOU aktif
        newSteps.mou = "active";
      }
    }

    // 3. PELAKSANAAN - Hanya untuk workflow yang pakai MOU
    if (hasMouWorkflow) {
      if (statusPelaksanaan.includes("selesai")) {
        newSteps.pelaksanaan = "done";
      } else if (
        statusPelaksanaan.includes("berjalan") ||
        statusPelaksanaan.includes("belum")
      ) {
        // Jika MOU sudah disetujui, pelaksanaan jadi aktif
        if (statusMou.includes("disetujui")) {
          newSteps.pelaksanaan = "active";
        }
      }
    }

    // 4. LAPORAN AKHIR - Untuk semua workflow
    if (hasLaporan) {
      newSteps.laporan = "done";
    } else {
      // Laporan jadi aktif kalau:
      // - Simple workflow: pengajuan disetujui
      // - MOU workflow: pelaksanaan selesai atau berjalan
      if (isSimpleWorkflow && statusPengajuan.includes("disetujui")) {
        newSteps.laporan = "active";
      } else if (
        hasMouWorkflow &&
        (statusPelaksanaan.includes("selesai") ||
          statusPelaksanaan.includes("berjalan"))
      ) {
        newSteps.laporan = "active";
      }
    }

    // 5. SERTIFIKAT - HANYA untuk MOU workflow (PKL, Magang, Pelatihan)
    // Undangan Narasumber & Kunjungan TIDAK ada sertifikat
    if (hasMouWorkflow) {
      if (hasSertifikat) {
        newSteps.sertifikat = "done";
      } else if (hasLaporan) {
        // Kalau laporan sudah ada, sertifikat jadi aktif
        newSteps.sertifikat = "active";
      }
    }

    setSteps(newSteps);
  }, [layananData, displayPengajuanStatus, displayPelaksanaanStatus]);

  // Auto-update display status ketika ada perubahan data yang signifikan
  useEffect(() => {
    if (!layananData || !isStatusInitialized) return;

    const laporanData = Array.isArray(layananData?.laporan)
      ? layananData.laporan[0]
      : layananData?.laporan;
    const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);

    // Jika laporan sudah ada, PAKSA status pelaksanaan jadi "Selesai"
    if (hasLaporan && displayPelaksanaanStatus !== "Selesai") {
      console.log(
        "[ADMIN DEBUG] Forcing pelaksanaan to Selesai because laporan exists"
      );
      setDisplayPelaksanaanStatus("Selesai");
    }

    // PENTING: Jika status pengajuan tiba-tiba berubah dari backend jadi "Berlangsung"
    // tapi sudah pernah "Disetujui", PAKSA kembali ke "Disetujui"
    const currentPengajuanFromBackend =
      layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
    const currentDisplayLower = displayPengajuanStatus.toLowerCase();

    // UPGRADE: Jika backend return "Selesai", upgrade display status ke "Selesai" (status tertinggi)
    if (
      currentPengajuanFromBackend.includes("selesai") &&
      !currentDisplayLower.includes("selesai")
    ) {
      console.log(
        "[ADMIN DEBUG] Upgrading pengajuan status to Selesai from backend"
      );
      setDisplayPengajuanStatus("Selesai");
      return; // Stop further processing
    }

    // Jika backend return "berlangsung" tapi ada indikasi sudah disetujui
    if (currentPengajuanFromBackend.includes("berlangsung")) {
      // Cek: apakah sudah ada progress (MOU, pelaksanaan, atau display status sebelumnya "disetujui")
      const hasProgress =
        layananData?.mou?.id ||
        layananData?.pelaksanaan?.id ||
        currentDisplayLower.includes("disetujui") ||
        currentDisplayLower.includes("selesai");

      if (
        hasProgress &&
        !currentDisplayLower.includes("disetujui") &&
        !currentDisplayLower.includes("selesai")
      ) {
        console.log(
          "[ADMIN DEBUG] Backend returned Berlangsung but has progress - forcing back to Disetujui"
        );
        setDisplayPengajuanStatus("Disetujui");
      }
    }

    // Extra defense: Jika display status sudah "Disetujui" tapi backend coba override ke apapun
    // KECUALI "Ditolak" atau "Selesai" (status yang lebih tinggi)
    if (
      currentDisplayLower.includes("disetujui") &&
      !currentPengajuanFromBackend.includes("disetujui") &&
      !currentPengajuanFromBackend.includes("ditolak") &&
      !currentPengajuanFromBackend.includes("selesai") // EXCEPTION: "Selesai" boleh override "Disetujui"
    ) {
      console.log(
        "[ADMIN DEBUG] Protecting Disetujui status from backend override:",
        currentPengajuanFromBackend
      );
      setDisplayPengajuanStatus("Disetujui");
    }
  }, [
    layananData,
    isStatusInitialized,
    displayPengajuanStatus,
    displayPelaksanaanStatus,
  ]);

  // Auto-refresh polling untuk sync data real-time
  useEffect(() => {
    if (!params?.id || loading) return;
    const pollInterval = setInterval(async () => {
      try {
        const data = await fetchLayananById(Number(params.id), {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
          include_pengajuan: true,
          include_pelaksanaan: true,
        });
        setLayananData(data);
      } catch (err) {
        console.error("[Admin] Error polling:", err);
      }
    }, 10000); // 10 seconds - auto refresh untuk melihat perubahan dari user
    return () => clearInterval(pollInterval);
  }, [params?.id, loading]);

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
        setDisplayPengajuanStatus("Disetujui");
        setDisplayPelaksanaanStatus("Belum Terlaksana");

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
        setDisplayPengajuanStatus("Ditolak");
        setDisplayPelaksanaanStatus("Ditolak");

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

  // Handle File Select for Sertifikat
  const handleSertifikatFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type (PDF only)
      if (file.type !== "application/pdf") {
        import("sweetalert2").then(({ default: Swal }) => {
          Swal.fire({
            icon: "error",
            title: "File Tidak Valid",
            text: "Hanya file PDF yang diperbolehkan",
            confirmButtonColor: "#4E342E",
            customClass: { popup: "rounded-xl" },
          });
        });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        import("sweetalert2").then(({ default: Swal }) => {
          Swal.fire({
            icon: "error",
            title: "File Terlalu Besar",
            text: "Ukuran file maksimal 10MB",
            confirmButtonColor: "#4E342E",
            customClass: { popup: "rounded-xl" },
          });
        });
        return;
      }
      setSertifikatFile(file);
    }
  };

  // Handle Upload Sertifikat
  const handleUploadSertifikat = async () => {
    console.log("=== handleUploadSertifikat called ===");
    console.log("layananData:", layananData?.id);
    console.log("sertifikatFile:", sertifikatFile?.name);

    if (!layananData || !sertifikatFile) {
      console.log("Validation failed - missing data");
      return;
    }

    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Upload Sertifikat?",
      text: "Pastikan file sertifikat sudah benar",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Upload",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });

    console.log("SweetAlert result:", result.isConfirmed);

    if (result.isConfirmed) {
      try {
        console.log("Starting upload process...");
        setUploadingSertifikat(true);
        Swal.fire({
          title: "Mengupload...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        console.log("Calling createSertifikat API...");
        await createSertifikat({
          id_layanan: layananData.id,
          link_sertifikat: sertifikatLink || undefined,
          file_sertifikat: sertifikatFile,
        });

        console.log("Upload successful, reloading data...");
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

        // Reset form
        setSertifikatFile(null);
        setSertifikatLink("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Get jenis layanan name
        const jenisLayananName =
          updated?.jenisLayanan?.nama_jenis_layanan ||
          updated?.jenis_layanan?.nama_jenis_layanan ||
          layananData?.jenisLayanan?.nama_jenis_layanan ||
          layananData?.jenis_layanan?.nama_jenis_layanan ||
          "kegiatan ini";

        await Swal.fire({
          icon: "success",
          title: "Sertifikat Berhasil Diupload",
          text: `Sertifikat untuk ${jenisLayananName} telah tersedia dan dapat diunduh oleh peserta.`,
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Upload Sertifikat",
          text: error.message || "Terjadi kesalahan",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      } finally {
        setUploadingSertifikat(false);
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
        status === "active"
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm"
          : status === "done"
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
          : "bg-gray-50 border-gray-200 opacity-50"
      }`}
    >
      <div
        className={`shrink-0 h-9 w-9 grid place-items-center rounded-lg transition-all ${
          status === "active"
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md animate-pulse"
            : status === "done"
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        {icon}
      </div>
      <div
        className={`text-sm font-semibold ${
          status === "active"
            ? "text-blue-900"
            : status === "done"
            ? "text-green-900"
            : "text-gray-500"
        }`}
      >
        {label}
      </div>
      {status === "done" && (
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
          <Check size={12} /> Selesai
        </span>
      )}
      {status === "active" && (
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>{" "}
          Berlangsung
        </span>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="w-full px-4 md:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
          >
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </button>
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
      <div className="min-h-screen">
        <div className="w-full px-4 md:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
          >
            <ChevronLeft size={18} />
            <span>Kembali</span>
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

  // Compute display status untuk UI yang lebih akurat
  // PENTING: Gunakan state yang stable, bukan langsung dari backend
  const getDisplayPengajuanStatus = () => {
    // Jika sudah ada display status yang di-set, gunakan itu (FINAL)
    if (displayPengajuanStatus) {
      const lower = displayPengajuanStatus.toLowerCase();
      // Status final tidak boleh berubah
      if (lower.includes("ditolak")) return "Ditolak";
      if (lower.includes("disetujui")) return "Disetujui";

      // Jika backend tiba-tiba return "berlangsung" tapi sudah ada progress, override ke "Disetujui"
      if (
        lower.includes("berlangsung") &&
        (layananData?.mou?.id || layananData?.pelaksanaan)
      ) {
        return "Disetujui";
      }

      return displayPengajuanStatus;
    }

    // Fallback ke backend (hanya untuk initial render)
    const rawStatus = layananData?.pengajuan?.nama_status_kode || "-";
    return rawStatus;
  };

  const getDisplayPelaksanaanStatus = () => {
    // Untuk workflow simple (Kunjungan, Undangan Narasumber), skip pelaksanaan
    if (isSimpleWorkflow) return "-";

    const laporanData = Array.isArray(layananData?.laporan)
      ? layananData.laporan[0]
      : layananData?.laporan;
    const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);

    // Jika laporan sudah ada, pelaksanaan PASTI selesai (FINAL)
    if (hasLaporan) return "Selesai";

    // Gunakan stable state jika ada
    if (displayPelaksanaanStatus) {
      const lower = displayPelaksanaanStatus.toLowerCase();

      // Status final
      if (lower.includes("selesai")) return "Selesai";
      if (lower.includes("ditolak")) return "Ditolak";

      // Status in-progress
      if (lower.includes("berjalan") || lower.includes("berlangsung"))
        return "Berlangsung";

      return displayPelaksanaanStatus;
    }

    // Fallback ke backend status
    if (statusPelaksanaan.includes("selesai")) return "Selesai";
    if (statusPelaksanaan.includes("berjalan")) return "Berlangsung";
    if (statusPelaksanaan.includes("ditolak")) return "Ditolak";

    // Untuk MOU workflow, cek apakah MOU sudah disetujui
    if (hasMouWorkflow) {
      const statusMou =
        layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase() || "";
      if (statusMou.includes("disetujui")) {
        return "Belum Terlaksana";
      }
    }

    return layananData?.pelaksanaan?.nama_status_kode || "-";
  };

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
    <div className="min-h-screen">
      <div className="w-full px-4 md:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
        >
          <ChevronLeft size={18} />
          <span>Kembali</span>
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
                      (getDisplayPengajuanStatus() || "")
                        .toLowerCase()
                        .includes("disetujui")
                        ? "bg-green-100 text-green-700"
                        : (getDisplayPengajuanStatus() || "")
                            .toLowerCase()
                            .includes("ditolak")
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {getDisplayPengajuanStatus()}
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
                        (getDisplayPelaksanaanStatus() || "")
                          .toLowerCase()
                          .includes("selesai")
                          ? "bg-green-100 text-green-700"
                          : (getDisplayPelaksanaanStatus() || "")
                              .toLowerCase()
                              .includes("berlangsung")
                          ? "bg-blue-100 text-blue-700"
                          : (getDisplayPelaksanaanStatus() || "")
                              .toLowerCase()
                              .includes("ditolak")
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getDisplayPelaksanaanStatus()}
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
              {/* Conditional: Show different fields based on jenis layanan */}
              {jenisNama.includes("Undangan Narasumber") ? (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Nama Kegiatan</p>
                    <p className="text-sm">
                      {layananData.nama_kegiatan || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tempat Kegiatan</p>
                    <p className="text-sm">
                      {layananData.tempat_kegiatan || "-"}
                    </p>
                  </div>
                </>
              ) : !jenisNama.includes("Kunjungan") ? (
                <div>
                  <p className="text-xs text-gray-500">Kegiatan yang dipilih</p>
                  <p className="text-sm">
                    {layananData.kegiatan
                      ?.map((k: any) => k.nama_kegiatan)
                      .join(", ") || "-"}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Dokumen */}
            <div>
              <p className="text-sm font-semibold mb-3">
                Dokumen yang diupload
              </p>
              <div className="space-y-3">
                {/* Undangan Narasumber: file_proposal (terpisah) */}
                {isSimpleWorkflow &&
                  jenisNama.includes("Undangan Narasumber") &&
                  layananData.file_proposal && (
                    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Proposal</p>
                          <p className="text-xs text-gray-500">Proposal.pdf</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            openFile(resolveFileUrl(layananData.file_proposal))
                          }
                          className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                        >
                          <Eye size={14} /> Lihat
                        </button>
                        <button
                          onClick={() =>
                            downloadFile(
                              resolveFileUrl(layananData.file_proposal),
                              "Proposal.pdf"
                            )
                          }
                          className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    </div>
                  )}

                {/* Proposal/Surat Permohonan (untuk layanan lain) */}
                {!jenisNama.includes("Undangan Narasumber") &&
                  (layananData.file_proposal ||
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

                {/* Surat Undangan - untuk Undangan Narasumber */}
                {layananData.file_surat_undangan && (
                  <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Surat Undangan</p>
                        <p className="text-xs text-gray-500">
                          SuratUndangan.pdf
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openFile(
                            resolveFileUrl(layananData.file_surat_undangan)
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            resolveFileUrl(layananData.file_surat_undangan),
                            "SuratUndangan.pdf"
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
              <>
                {/* Badge indikator jika MOU pernah ditolak (upload ulang) */}
                {layananData.mou?.mouRejection && (
                  <div className="mt-4 mb-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      MOU Upload Ulang (Revisi)
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      User telah mengupload ulang MOU setelah sebelumnya ditolak
                    </p>
                  </div>
                )}

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
              </>
            )}
          </div>

          {/* Logbook Section - Hanya untuk PKL, Magang, Pelatihan */}
          {hasMouWorkflow && layananData.link_logbook && (
            <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 grid place-items-center rounded-xl bg-blue-100 text-blue-700">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Logbook Kegiatan</h3>
                    <p className="text-sm text-gray-600">
                      Link logbook yang telah disubmit oleh peserta
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  ✓ Tersedia
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Link Logbook:</p>
                <a
                  href={layananData.link_logbook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {layananData.link_logbook}
                </a>
                <div className="mt-3">
                  <a
                    href={layananData.link_logbook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Eye size={16} /> Buka Logbook
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Laporan Akhir Section */}
          {(() => {
            const laporanData = Array.isArray(layananData?.laporan)
              ? layananData.laporan[0]
              : layananData?.laporan;
            const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);

            if (!hasLaporan) return null;

            const fotoUrl = resolveFileUrl(laporanData?.foto_kegiatan);

            return (
              <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 grid place-items-center rounded-xl bg-green-100 text-green-700">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Laporan Akhir Kegiatan
                      </h3>
                      <p className="text-sm text-gray-600">
                        Laporan yang telah disubmit oleh peserta
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                    ✓ Telah Terisi
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Nama P4S */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama P4S / Balai Benih Kopi
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {laporanData?.nama_p4s || "-"}
                    </div>
                  </div>

                  {/* Kota */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asal Kab/Kota
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {laporanData?.asal_kab_kota || "-"}
                    </div>
                  </div>

                  {/* Jenis Kegiatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kegiatan
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {jenisNama || "-"}
                    </div>
                  </div>

                  {/* Asal Peserta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asal Peserta
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {layananData?.instansi_asal || "-"}
                    </div>
                  </div>

                  {/* Jumlah Peserta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Peserta
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {layananData?.jumlah_peserta || "-"} orang
                    </div>
                  </div>

                  {/* Tanggal Pelaksanaan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Pelaksanaan
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      {layananData?.tanggal_mulai
                        ? formatDate(layananData.tanggal_mulai)
                        : "-"}
                    </div>
                  </div>

                  {/* Lama Pelaksanaan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lama Pelaksanaan
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                      1 hari
                    </div>
                  </div>

                  {/* Foto Kegiatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Kegiatan
                    </label>
                    {fotoUrl ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 grid place-items-center rounded-lg bg-green-100 text-green-700">
                              <Check size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Foto Kegiatan Telah Diupload
                              </p>
                              <p className="text-xs text-green-600">
                                FotoKegiatan.jpg
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openFile(fotoUrl)}
                              className="px-3 py-1.5 text-xs rounded-md border border-green-300 bg-white hover:bg-green-50 text-green-700 flex items-center gap-1"
                            >
                              <Eye size={14} /> Lihat
                            </button>
                            <button
                              onClick={() =>
                                downloadFile(fotoUrl, "FotoKegiatan.jpg")
                              }
                              className="px-3 py-1.5 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                            >
                              <Download size={14} /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        Tidak ada foto yang diupload
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Sertifikat Section - HANYA untuk MOU workflow (PKL, Magang, Pelatihan) */}
          {/* Undangan Narasumber & Kunjungan TIDAK ada sertifikat */}
          {hasMouWorkflow &&
            (() => {
              const laporanData = Array.isArray(layananData?.laporan)
                ? layananData.laporan[0]
                : layananData?.laporan;
              const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);

              const sertifikatData = Array.isArray(layananData?.sertifikat)
                ? layananData.sertifikat[0]
                : layananData?.sertifikat;
              const hasSertifikat = !!(
                sertifikatData?.id || sertifikatData?.file_sertifikat
              );

              // Hanya tampilkan section sertifikat jika sudah ada laporan
              if (!hasLaporan) return null;

              return (
                <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-5 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 grid place-items-center rounded-xl bg-amber-100 text-amber-700">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Sertifikat Kegiatan
                        </h3>
                        <p className="text-sm text-gray-600">
                          {hasSertifikat
                            ? "Sertifikat telah diupload"
                            : "Upload sertifikat untuk peserta"}
                        </p>
                      </div>
                    </div>
                    {hasSertifikat && (
                      <div className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                        ✓ Tersedia
                      </div>
                    )}
                  </div>

                  {hasSertifikat ? (
                    // Tampilkan sertifikat yang sudah diupload
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {/* File Sertifikat */}
                      {sertifikatData?.file_sertifikat && (
                        <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 grid place-items-center rounded-md bg-amber-200 text-amber-700">
                              <Award size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Sertifikat Kegiatan (File)
                              </p>
                              <p className="text-xs text-gray-500">
                                Sertifikat.pdf
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const url = sertifikatData?.file_sertifikat;
                                if (url) {
                                  const fullUrl = url.startsWith("http")
                                    ? url
                                    : `${
                                        process.env.NEXT_PUBLIC_API_URL || ""
                                      }${url}`;
                                  window.open(fullUrl, "_blank");
                                }
                              }}
                              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                            >
                              <Eye size={14} /> Lihat
                            </button>
                            <button
                              onClick={() => {
                                const url = sertifikatData?.file_sertifikat;
                                if (url) {
                                  const fullUrl = url.startsWith("http")
                                    ? url
                                    : `${
                                        process.env.NEXT_PUBLIC_API_URL || ""
                                      }${url}`;
                                  const link = document.createElement("a");
                                  link.href = fullUrl;
                                  link.download = "Sertifikat.pdf";
                                  link.click();
                                }
                              }}
                              className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                            >
                              <Download size={14} /> Download
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Link Sertifikat */}
                      {sertifikatData?.link_sertifikat && (
                        <div className="bg-white rounded-lg border border-gray-100 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Award size={16} className="text-amber-700" />
                            <p className="text-xs font-medium text-gray-700">
                              Link Sertifikat:
                            </p>
                          </div>
                          <a
                            href={sertifikatData.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {sertifikatData.link_sertifikat}
                          </a>
                          <div className="mt-2">
                            <a
                              href={sertifikatData.link_sertifikat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Eye size={14} /> Buka Link
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Form upload sertifikat
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-4">
                        {/* Link Sertifikat (Optional) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link Sertifikat (Opsional)
                          </label>
                          <input
                            type="url"
                            value={sertifikatLink}
                            onChange={(e) => setSertifikatLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        {/* File Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File Sertifikat (PDF){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleSertifikatFileChange}
                            className="hidden"
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                              <Upload size={16} /> Pilih File
                            </button>
                            {sertifikatFile && (
                              <span className="text-sm text-gray-600">
                                {sertifikatFile.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: PDF, Maksimal 10MB
                          </p>
                        </div>

                        {/* Upload Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={handleUploadSertifikat}
                            disabled={!sertifikatFile || uploadingSertifikat}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md text-white ${
                              !sertifikatFile || uploadingSertifikat
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-amber-900 hover:bg-amber-950"
                            }`}
                          >
                            <Award size={16} />
                            {uploadingSertifikat
                              ? "Mengupload..."
                              : "Upload Sertifikat"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ID Pengajuan: {String(params?.id)}
        </p>
      </div>
    </div>
  );
}
