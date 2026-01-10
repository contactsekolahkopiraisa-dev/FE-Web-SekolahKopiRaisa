"use client";

import {
  Check,
  Download,
  Eye,
  FileText,
  Handshake,
  ClipboardList,
  FileCheck,
  Award,
  XCircle,
  CheckCircle2,
  Upload,
  Info,
} from "lucide-react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../../../components/main/Footer";
import {
  fetchLayananById,
  LayananItem,
  formatDate,
  submitLogbook,
  updateLogbook,
  updateStatusPelaksanaan,
} from "../../utils/layanan";
import { createMou, updateMou } from "../../utils/mou";
import { fetchAllModul } from "../../utils/modul";
import type { ModulItem } from "../../types/modulType";
import { createLaporanLayanan } from "../../utils/laporan";
import {
  fetchSertifikatById,
  type SertifikatItem,
} from "../../utils/sertifikat";

function DetailPelaksanaanPKLContent() {
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

  // Tambahkan fungsi helper di bagian atas component (setelah helper functions yang sudah ada)
  const canFinishProgram = (): boolean => {
    if (!layananData?.tanggal_selesai) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset ke awal hari

    const endDate = new Date(layananData.tanggal_selesai);
    endDate.setHours(0, 0, 0, 0); // Reset ke awal hari

    // Return true jika hari ini >= tanggal selesai
    return today >= endDate;
  };

  const getDaysRemaining = (): number => {
    if (!layananData?.tanggal_selesai) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(layananData.tanggal_selesai);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Helper: bangun URL file absolut dari path relatif/absolut
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

    // Fetch file as blob then trigger download
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
        // Fallback: open in new tab if fetch fails
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
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(data);

        // Set link logbook jika sudah ada
        if (data.link_logbook) {
          setLogbookLink(data.link_logbook);
          setIsLogbookSubmitted(true);
        }

        // Set status berdasarkan data API dengan null checks
        if (data.pengajuan?.nama_status_kode) {
          setPengajuanDecision(
            mapStatusToDecision(
              data.pengajuan.nama_status_kode,
              "pengajuan"
            ) as typeof pengajuanDecision
          );
        }
        if (data.mou?.statusKode?.nama_status_kode) {
          setMouDecision(
            mapStatusToDecision(
              data.mou.statusKode.nama_status_kode,
              "mou"
            ) as typeof mouDecision
          );
        }
        if (data.pelaksanaan?.nama_status_kode) {
          setPelaksanaanDecision(
            mapStatusToDecision(
              data.pelaksanaan.nama_status_kode,
              "pelaksanaan"
            ) as typeof pelaksanaanDecision
          );
        }
        if (data.laporan?.nama_status_kode) {
          setLaporanDecision(
            mapStatusToDecision(
              data.laporan.nama_status_kode,
              "laporan"
            ) as typeof laporanDecision
          );
        } else if (data.laporan?.statusPelaporan?.nama_status_kode) {
          setLaporanDecision(
            mapStatusToDecision(
              data.laporan.statusPelaporan.nama_status_kode,
              "laporan"
            ) as typeof laporanDecision
          );
        } else if (data.laporan?.status?.nama_status_kode) {
          setLaporanDecision(
            mapStatusToDecision(
              data.laporan.status.nama_status_kode,
              "laporan"
            ) as typeof laporanDecision
          );
        }
        const sertifikat = Array.isArray(data.sertifikat)
          ? data.sertifikat[0]
          : data.sertifikat;
        if (sertifikat?.nama_status_kode) {
          setSertifikatDecision(
            mapStatusToDecision(
              sertifikat.nama_status_kode,
              "sertifikat"
            ) as typeof sertifikatDecision
          );
        } else if (sertifikat?.status?.nama_status_kode) {
          setSertifikatDecision(
            mapStatusToDecision(
              sertifikat.status.nama_status_kode,
              "sertifikat"
            ) as typeof sertifikatDecision
          );
        }

        setError(null);
      } catch (err: any) {
        console.error("Error fetching layanan:", err);
        setError(err.message || "Gagal memuat data layanan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [layananId]);

  // Auto-refresh polling untuk sync data real-time
  useEffect(() => {
    if (!layananId) return;

    const pollInterval = setInterval(async () => {
      try {
        const data = await fetchLayananById(Number(layananId), {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
          include_pengajuan: true,
          include_pelaksanaan: true,
        });

        // Update decision states from polling
        if (data.pengajuan?.nama_status_kode) {
          setPengajuanDecision(
            mapStatusToDecision(
              data.pengajuan.nama_status_kode,
              "pengajuan"
            ) as typeof pengajuanDecision
          );
        }
        if (data.mou?.statusKode?.nama_status_kode) {
          setMouDecision(
            mapStatusToDecision(
              data.mou.statusKode.nama_status_kode,
              "mou"
            ) as typeof mouDecision
          );
        }
        if (data.pelaksanaan?.nama_status_kode) {
          setPelaksanaanDecision(
            mapStatusToDecision(
              data.pelaksanaan.nama_status_kode,
              "pelaksanaan"
            ) as typeof pelaksanaanDecision
          );
        }

        setLayananData(data);
      } catch (e) {
        console.error("Error polling layanan data:", e);
      }
    }, 10000); // 10 seconds - auto refresh untuk melihat perubahan dari admin

    return () => clearInterval(pollInterval);
  }, [layananId]);

  // Helper function to map API status to component decision states
  const mapStatusToDecision = (
    statusKode: string,
    type: string
  ): "menunggu" | "disetujui" | "ditolak" | "berjalan" | "selesai" => {
    const kode = statusKode.toLowerCase();
    if (kode.includes("disetujui") || kode.includes("diterima"))
      return "disetujui";
    if (kode.includes("ditolak")) return "ditolak";
    if (kode.includes("berlangsung") || kode.includes("berjalan"))
      return "berjalan";
    if (kode.includes("selesai")) return "selesai";
    return "menunggu";
  };

  // Get participant info - using first peserta if available
  const pesertaInfo = layananData?.peserta?.[0];

  const infoKiri = [
    {
      label: "Jenis Kegiatan",
      value:
        layananData?.jenisLayanan?.nama_jenis_layanan ||
        layananData?.jenis_layanan?.nama_jenis_layanan ||
        "Praktek Kerja Lapangan",
    },
    {
      label: "Nama Peserta",
      value: pesertaInfo?.nama_peserta || layananData?.pemohon?.name || "-",
    },
    { label: "NIM / NIS", value: pesertaInfo?.nim || "-" },
    { label: "Fakultas", value: pesertaInfo?.fakultas || "-" },
    { label: "Prodi / Jurusan", value: pesertaInfo?.program_studi || "-" },
  ];

  const infoKanan = [
    { label: "Instansi", value: layananData?.instansi_asal || "-" },
    {
      label: "Tanggal Mulai",
      value: layananData?.tanggal_mulai
        ? formatDate(layananData.tanggal_mulai)
        : "-",
    },
    {
      label: "Tanggal Selesai",
      value: layananData?.tanggal_selesai
        ? formatDate(layananData.tanggal_selesai)
        : "-",
    },
    {
      label: "Kegiatan yang dipilih",
      value:
        layananData?.kegiatan?.map((k) => k.nama_kegiatan).join(", ") ||
        layananData?.nama_kegiatan ||
        "-",
    },
  ];

  const dokumen = [
    {
      label: "Proposal / Surat Permohonan",
      file:
        layananData?.file_surat_permohonan || layananData?.file_proposal || "",
    },
    { label: "Surat Pengantar", file: layananData?.file_surat_pengantar || "" },
  ];

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "MOU", desc: "Belum Terlaksana", icon: Handshake },
    { name: "Pelaksanaan", desc: "Belum Terlaksana", icon: ClipboardList },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
    { name: "Sertifikat Kegiatan", desc: "Belum Terlaksana", icon: Award },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");
  const [mouDecision, setMouDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");
  const [pelaksanaanDecision, setPelaksanaanDecision] = useState<
    "menunggu" | "berjalan" | "selesai"
  >("menunggu");
  const [laporanDecision, setLaporanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");
  const [sertifikatDecision, setSertifikatDecision] = useState<
    "menunggu" | "selesai" | "ditolak"
  >("menunggu");

  const [mouFile, setMouFile] = useState<File | null>(null);
  const mouInputRef = useRef<HTMLInputElement | null>(null);
  const handlePickMou = () => mouInputRef.current?.click();
  const handleMouChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setMouFile(file);
  };
  const handleSubmitMou = async () => {
    if (!mouFile) {
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        title: "Pilih File MOU",
        text: "Silakan pilih file MOU terlebih dahulu sebelum mengunggah.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Pilih File",
        cancelButtonText: "Batal",
        reverseButtons: true,
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          cancelButton:
            "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
          actions: "gap-2",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handlePickMou();
        }
      });
      return;
    }

    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Yakin Mengirimkan MOU?",
      text: "Pastikan file MOU yang Anda unggah sudah benar.",
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
        actions: "gap-2",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Mengunggah MOU...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        if (layananData?.mou?.id) {
          await updateMou(layananData.mou.id, mouFile);
        } else {
          await createMou({ id_layanan: Number(layananId), file_mou: mouFile });
        }

        const updatedData = await fetchLayananById(Number(layananId), {
          include_jenis: true,
          include_peserta: true,
          include_mou: true,
          include_sertifikat: true,
          include_laporan: true,
          include_rejection: true,
        });
        setLayananData(updatedData);

        if (updatedData.mou?.statusKode?.nama_status_kode) {
          setMouDecision(
            mapStatusToDecision(
              updatedData.mou.statusKode.nama_status_kode,
              "mou"
            ) as typeof mouDecision
          );
        }

        setMouFile(null);

        await Swal.fire({
          title: "MOU berhasil dikirim",
          text: "Silahkan tunggu persetujuan dari admin.",
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
        await Swal.fire({
          title: "Gagal Mengirim MOU",
          text: error.message || "Terjadi kesalahan saat mengirim MOU",
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
    }
  };

  const [pelaksanaanAgree, setPelaksanaanAgree] = useState<boolean>(false);
  const [logbookLink, setLogbookLink] = useState<string>("");
  const [isLogbookSubmitted, setIsLogbookSubmitted] = useState<boolean>(false);
  const [isEditingLogbook, setIsEditingLogbook] = useState<boolean>(false);
  const [pelaksanaanModules, setPelaksanaanModules] = useState<ModulItem[]>([]);
  const [modulLoading, setModulLoading] = useState<boolean>(false);
  const [modulError, setModulError] = useState<string | null>(null);

  // Fetch modul saat MOU sudah disetujui
  useEffect(() => {
    const loadModuls = async () => {
      // Hanya fetch jika MOU sudah disetujui
      if (mouDecision !== "disetujui") return;
      try {
        setModulLoading(true);
        const moduls = await fetchAllModul();
        setPelaksanaanModules(moduls || []);
        setModulError(null);
      } catch (e: any) {
        setModulError(e.message || "Gagal memuat modul");
      } finally {
        setModulLoading(false);
      }
    };
    loadModuls();
  }, [mouDecision]);

  // Ambil sertifikat dari layananData (sudah di-include saat fetch layanan)
  useEffect(() => {
    if (!layananData) {
      return;
    }

    // Auto-set laporanSubmitted jika pelaksanaan sudah selesai
    if (pelaksanaanDecision === "selesai") {
      setLaporanSubmitted(true);
    }

    // Ambil sertifikat dari layananData
    const sertifikatFromLayanan = Array.isArray(layananData.sertifikat)
      ? layananData.sertifikat[0]
      : layananData.sertifikat;

    if (sertifikatFromLayanan && sertifikatFromLayanan.file_sertifikat) {
      setSertifikatData(sertifikatFromLayanan as any);
      setSertifikatDecision("selesai");
      setSertifikatError(null);
    } else {
      // Sertifikat belum diupload - ini normal
      setSertifikatData(null);
      setSertifikatDecision("menunggu");
    }
  }, [layananData, pelaksanaanDecision]);

  const handleLogbookLinkChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setLogbookLink(e.target.value);
  };

  const handleSubmitLogbook = async () => {
    if (!logbookLink.trim()) {
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        title: "Link Logbook Kosong",
        text: "Silakan masukkan link logbook terlebih dahulu.",
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
      title: "Kirim Link Logbook?",
      text: "Apakah Anda yakin ingin mengirim link logbook ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        cancelButton:
          "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
        actions: "gap-2",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: "Mengirim Logbook...",
          text: "Mohon tunggu sebentar",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Call API to submit or update logbook (both use PUT)
        if (isLogbookSubmitted && !isEditingLogbook) {
          // Jika sudah pernah submit, tidak perlu update lagi
          Swal.close();
          return;
        }

        // Both create and update use the same PUT endpoint
        await submitLogbook(Number(layananId), {
          id_layanan: Number(layananId),
          link_logbook: logbookLink,
        });

        setIsLogbookSubmitted(true);
        setIsEditingLogbook(false);

        await Swal.fire({
          title: "Logbook Berhasil Dikirim",
          text: "Link logbook Anda telah berhasil dikirim.",
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
        await Swal.fire({
          title: "Gagal Mengirim Logbook",
          text: error.message || "Terjadi kesalahan saat mengirim logbook.",
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
    }
  };

  const handleEditLogbook = () => {
    setIsEditingLogbook(true);
  };

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "pkl",
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
        jenisKegiatan: "PKL",
        asalPeserta: layananData?.instansi_asal || "",
        jumlahPeserta: "1",
        tanggalPelaksanaan: layananData?.tanggal_mulai
          ? formatDate(layananData.tanggal_mulai)
          : "",
        lamaPelaksanaan: (() => {
          if (
            !layananData?.tanggal_mulai ||
            !layananData?.tanggal_selesai
          )
            return "";
          const start = new Date(layananData.tanggal_mulai);
          const end = new Date(layananData.tanggal_selesai);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return `${diffDays} hari`;
        })(),
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
  const [submitting, setSubmitting] = useState(false);
  const [laporanSubmitted, setLaporanSubmitted] = useState(false);
  const [sertifikatData, setSertifikatData] = useState<SertifikatItem | null>(
    null
  );
  const [sertifikatLoading, setSertifikatLoading] = useState<boolean>(false);
  const [sertifikatError, setSertifikatError] = useState<string | null>(null);
  const scrollToSertifikat = () => {
    if (typeof window !== "undefined") {
      document
        .getElementById("sertifikat-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document
        .getElementById("laporan-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSubmitLaporan = async () => {
    const Swal = (await import("sweetalert2")).default;

    // Debug log untuk cek nilai form
    console.log("Validasi Laporan:", {
      namaP4s: laporanForm.namaP4s,
      kota: laporanForm.kota,
      fotoKegiatan: fotoKegiatan ? fotoKegiatan.name : null,
    });

    // Validasi form - hanya field yang diisi manual oleh user
    const missingFields = [];
    if (!laporanForm.namaP4s.trim()) missingFields.push("Nama P4S");
    if (!laporanForm.kota.trim()) missingFields.push("Kabupaten/Kota");
    if (!fotoKegiatan) missingFields.push("Foto Kegiatan");

    if (missingFields.length > 0) {
      await Swal.fire({
        title: "Form Tidak Lengkap",
        text: `Mohon lengkapi field berikut: ${missingFields.join(", ")}`,
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
      title: "Yakin Mengirimkan Laporan Akhir ?",
      text: "Apakah Anda yakin ingin mengirimkan laporan akhir kegiatan ini? Setelah dikirim Anda dapat langsung mengunduh sertifikat.",
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
        actions: "gap-2",
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
        foto_kegiatan: fotoKegiatan!,
      });

      setSubmitting(false);
      setLaporanSubmitted(true);
      setLaporanDecision("disetujui" as typeof laporanDecision); // Auto-approve laporan

      // Show success alert
      await Swal.fire({
        title: "Laporan Berhasil Dikirim!",
        text: "Selamat! Laporan Anda sudah berhasil dikirim. Anda dapat mengunduh sertifikat sekarang.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl",
        },
        buttonsStyling: false,
      });

      scrollToSertifikat();
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

  const decisionTextMap = {
    menunggu: "Belum Terlaksana",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
    berjalan: "Sedang Berjalan",
    selesai: "Selesai",
  } as const;

  const stepStatuses: Array<
    "menunggu" | "disetujui" | "ditolak" | "berjalan" | "selesai"
  > = [
      pengajuanDecision,
      mouDecision,
      pelaksanaanDecision,
      laporanDecision,
      sertifikatDecision,
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
      <div>
        <div className="min-h-screen bg-tertiary pt-16 md:pt-20 pb-4">
          <div className="container mx-auto px-5 max-w-5l py-8">
            <div className="mb-4">
              <Link
                href="/layanan"
                className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Kembali ke Layanan</span>
              </Link>
            </div>
            <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B] mb-6">
              Detail Pelaksanaan Praktek Kerja Lapangan
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-lg border border-[#E8E2DB] flex items-center justify-center">
                    <Check className="text-primary" />
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
                      (st) => st !== "disetujui" && st !== "selesai"
                    );
                    const activeStepIndex =
                      firstNonApprovedIndex === -1
                        ? stepStatuses.length
                        : firstNonApprovedIndex;
                    const isActive = idx === activeStepIndex;
                    const isCompleted =
                      idx < activeStepIndex &&
                      (stepStatuses[idx] === "disetujui" ||
                        stepStatuses[idx] === "selesai");
                    const status = stepStatuses[idx];
                    const containerClass = isActive
                      ? status === "disetujui"
                        ? "bg-[#EAF8F0] border-[#D2EBDD]"
                        : status === "ditolak"
                          ? "bg-[#FEE2E2] border-[#F87171]"
                          : "bg-[#EDE6DF] border-[#E0D8D1]"
                      : isCompleted
                        ? "bg-[#F3FBF7] border-[#CFEAD9]"
                        : "bg-white border-[#EFEAE4]";

                    const iconWrapClass = isActive
                      ? status === "disetujui"
                        ? "bg-[#E2F3EA] border-[#CBE6D7]"
                        : status === "ditolak"
                          ? "bg-[#FEE2E2] border-[#EF4444]"
                          : "bg-[#DCD3CB] border-[#CFC6BE]"
                      : isCompleted
                        ? "bg-[#E9F7F0] border-[#CBE6D7]"
                        : "bg-[#F4F0EC] border-[#E8E2DB]";

                    const iconColorClass = isActive
                      ? status === "disetujui"
                        ? "text-[#2F8A57]"
                        : status === "ditolak"
                          ? "text-[#CD0300]"
                          : "text-[#3B3B3B]"
                      : isCompleted
                        ? "text-[#2F8A57]"
                        : "text-[#6B6B6B]";

                    const descColorClass =
                      s.name === "Pengajuan"
                        ? pengajuanDecision === "disetujui"
                          ? "text-[#2F8A57]"
                          : pengajuanDecision === "ditolak"
                            ? "text-[#CD0300]"
                            : "text-[#6B6B6B]"
                        : stepStatuses[idx] === "disetujui" ||
                          stepStatuses[idx] === "selesai"
                          ? "text-[#2F8A57]"
                          : stepStatuses[idx] === "ditolak"
                            ? "text-[#CD0300]"
                            : stepStatuses[idx] === "berjalan"
                              ? "text-[#3B3B3B]"
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

              <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
                <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">
                  Ringkasan Pengajuan & Dokumen
                </p>
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
                        className={`mb-3 rounded-lg border-2 p-4 shadow-sm ${isApproved
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
                            className={`text-sm font-semibold ${isApproved ? "text-green-800" : "text-red-800"
                              }`}
                          >
                            Pengajuan {isApproved ? "Disetujui" : "Ditolak"}
                          </p>
                        </div>
                        <p
                          className={`text-[12px] ${isApproved ? "text-green-700" : "text-red-700"
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

                  {/* Dokumen MOU - Tampilkan jika file MOU tersedia (apapun statusnya) */}
                  {(() => {
                    const resolved = resolveFileUrl(layananData?.mou?.file_mou);
                    return !!resolved;
                  })() && (
                      <div className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3">
                        <div>
                          <p className="text-sm font-semibold text-[#3B3B3B]">
                            Memorandum of Understanding
                          </p>
                          <p className="text-[12px] text-[#6B6B6B]">MOU.pdf</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const url = resolveFileUrl(layananData?.mou?.file_mou);
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
                                  onClick={() => downloadFile(url, "MOU.pdf")}
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
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-tertiary pt-0 md:pt-0 pb-4">

          {/* ===================== PENGAJUAN DITOLAK ===================== */}
          {pengajuanDecision === "ditolak" && (
            <div className="container mx-auto px-4 max-w-6xl mt-8 mb-6">
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

                {(() => {
                  const rejection = layananData?.layananRejection;
                  const alasan =
                    (Array.isArray(rejection) ? rejection[0]?.alasan : rejection?.alasan) ||
                    layananData?.pengajuanRejection?.alasan ||
                    layananData?.rejection?.alasan ||
                    layananData?.pengajuan?.alasan_penolakan ||
                    layananData?.alasan_penolakan;

                  return alasan ? (
                    <div className="mt-4 rounded-lg border border-[#F0C3C3] bg-white p-4">
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

          {/* ===================== MOU SECTION ===================== */}
          {pengajuanDecision === "disetujui" &&
            mouDecision !== ("disetujui" as typeof mouDecision) && (
              <div className="mt-4">
                <div
                  className={`rounded-xl border bg-white p-5 md:p-6 transition-shadow ${mouDecision === "ditolak"
                      ? "border-[#F0CFCF] hover:shadow-md"
                      : "border-[#CFEAD9] hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${mouDecision === "ditolak"
                          ? "border-[#F0C3C3] bg-[#FBECEC]"
                          : "border-[#CBE6D7] bg-[#E9F7F0]"
                        }`}
                    >
                      <Handshake
                        size={14}
                        className={
                          mouDecision === "ditolak"
                            ? "text-[#CD0300]"
                            : "text-[#2F8A57]"
                        }
                      />
                    </span>
                    <p className="text-sm font-semibold text-[#3B3B3B]">
                      Memorandum Of Understanding
                    </p>
                  </div>

                  <p className="text-[12px] text-[#6B6B6B] mb-4">
                    Pengajuan anda telah disetujui. Silahkan upload MoU setelah
                    ditandatangani.
                  </p>

                  <div className="grid grid-cols-1 gap-4">

                    <div className="rounded-lg border border-[#E8E2DB] bg-[#F7F4F0] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-[#3B3B3B]" />
                        <p className="text-sm font-semibold text-[#3B3B3B]">
                          Panduan Pengisian
                        </p>
                      </div>
                      <ol className="list-decimal pl-5 text-[12px] text-[#6B6B6B] space-y-1">
                        <li>Buatlah dokumen MOU sesuai ketentuan instansi.</li>
                        <li>Isi data yang diperlukan.</li>
                        <li>Tanda tangani oleh pihak berwenang.</li>
                        <li>Scan ke PDF/DOC/DOCX (max 10MB).</li>
                        <li>Unggah pada bagian Upload MOU.</li>
                      </ol>
                    </div>

                    {mouDecision === "ditolak" && (
                      <div className="rounded-lg border border-[#F0CFCF] bg-[#FFF6F6] p-4">
                        <p className="text-sm font-semibold text-[#CD0300] mb-2">
                          Alasan Penolakan MOU
                        </p>
                        <p className="text-[12px] text-[#3B3B3B] whitespace-pre-wrap">
                          {layananData?.mou?.mouRejection?.alasan ||
                            "MoU tidak memenuhi persyaratan."}
                        </p>
                      </div>
                    )}

                    {(mouDecision === "ditolak" || !layananData?.mou?.file_mou) && (
                      <div className="rounded-lg border border-[#E8E2DB] bg-white p-4">
                        <p className="text-sm font-semibold text-[#3B3B3B]">
                          {mouDecision === "ditolak" ? "Upload Ulang MOU" : "Upload MOU"}
                        </p>

                        <div
                          className="mt-3 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#B9B1A9] bg-[#F3EFEB] p-6 cursor-pointer"
                          onClick={handlePickMou}
                        >
                          <Upload />
                          <p className="text-[12px] text-[#6B6B6B]">
                            {mouFile ? mouFile.name : "Klik untuk Upload MOU"}
                          </p>
                          <input
                            ref={mouInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            hidden
                            onChange={handleMouChange}
                          />
                        </div>

                        <div className="mt-3 text-center">
                          <button
                            onClick={handleSubmitMou}
                            className="rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px]"
                          >
                            Submit MOU
                          </button>
                        </div>
                      </div>
                    )}

                    {mouDecision === "menunggu" && layananData?.mou?.file_mou && (
                      <div className="rounded-lg border border-[#FFF3CD] bg-[#FFF9E6] p-4 text-center">
                        <p className="text-sm font-semibold text-[#997404]">
                          MOU Menunggu Review Admin
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )
          }

          {/* ===================== MODUL PEMBELAJARAN ===================== */}
          {mouDecision === "disetujui" &&
            pelaksanaanDecision !== ("selesai" as typeof pelaksanaanDecision) && (
              <div className="mt-4">
                <div className="rounded-xl border bg-white p-5 md:p-6">
                  <p className="text-sm font-semibold">Modul Pembelajaran Program</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {pelaksanaanModules.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-[#E8E2DB] bg-white p-3 flex gap-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{m.judul_modul}</p>
                          <p className="text-[12px]">{m.deskripsi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

        </div>

        {mouDecision === "disetujui" &&
          pelaksanaanDecision !== ("selesai" as typeof pelaksanaanDecision) && (
            <div className="mt-4">
              <div
                className={`rounded-xl border bg-white p-5 md:p-6 ${pelaksanaanDecision === "selesai"
                  ? "border-[#17cd59] hover:shadow-md transition-shadow"
                  : "border-[#E8E2DB]"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                    <ClipboardList size={14} className="text-[#3B3B3B]" />
                  </span>
                  <p className="text-sm font-semibold text-[#3B3B3B]">
                    Modul Pembelajaran Program
                  </p>
                </div>
                <p className="text-[12px] text-[#6B6B6B] mb-4">
                  Akses semua materi pada modul pembelajaran pada layanan yang
                  dipilih
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulLoading && (
                    <div className="col-span-1 md:col-span-2 text-center text-[12px] text-[#6B6B6B]">
                      Memuat modul…
                    </div>
                  )}
                  {modulError && (
                    <div className="col-span-1 md:col-span-2 text-center text-[12px] text-red-600">
                      {modulError}
                    </div>
                  )}
                  {!modulLoading &&
                    !modulError &&
                    pelaksanaanModules.length === 0 && (
                      <div className="col-span-1 md:col-span-2 text-center text-[12px] text-[#6B6B6B]">
                        Belum ada modul tersedia.
                      </div>
                    )}
                  {pelaksanaanModules.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-[#E8E2DB] bg-white p-3 flex gap-3"
                    >
                      <div className="w-20 h-20 rounded-md bg-[#F3EFEB] border border-dashed border-[#B9B1A9] overflow-hidden">
                        <img
                          src={m.foto_sampul || "/assets/coffee.jpg"}
                          alt={m.judul_modul}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/coffee.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-[#3B3B3B]">
                          {m.judul_modul}
                        </p>
                        <p className="text-[12px] text-[#675e5e]">
                          {m.deskripsi}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          {m.file_modul && (
                            <>
                              <a
                                href={m.file_modul}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-1.5 text-[12px] hover:opacity-90"
                              >
                                Akses Modul
                              </a>
                              <a
                                href={m.file_modul}
                                download
                                className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"
                              >
                                Download PDF
                              </a>
                            </>
                          )}
                          {!m.file_modul && (
                            <span className="text-[12px] text-[#9A948E]">
                              File modul belum tersedia
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input link logbook */}
                <div className="mt-4 rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
                  <h3 className="text-sm font-semibold text-[#3B3B3B] mb-3">
                    Link Logbook
                  </h3>
                  <p className="text-[12px] text-[#6B6B6B] mb-4">
                    Masukkan link logbook
                  </p>

                  {isLogbookSubmitted && !isEditingLogbook ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                          Link Logbook Terkirim
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Status: Logbook telah dikirim
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">
                          Link yang dikirim:
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={logbookLink}
                            readOnly
                            className="flex-1 rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B] focus:outline-none"
                          />
                          <button
                            onClick={() => window.open(logbookLink, "_blank")}
                            className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90"
                          >
                            Buka Link
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleEditLogbook}
                          className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={logbookLink}
                        onChange={handleLogbookLinkChange}
                        placeholder="Masukkan link logbook (contoh: https://drive.google.com/...)"
                        className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B] focus:outline-none focus:ring-2 focus:ring-[#5C3A1E] focus:border-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSubmitLogbook}
                          className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-4 py-2 text-[12px] hover:opacity-90"
                        >
                          Kirim
                        </button>
                        {isEditingLogbook && (
                          <button
                            onClick={() => setIsEditingLogbook(false)}
                            className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`mt-5 rounded-xl border p-6 text-center ${pelaksanaanDecision === "selesai"
                    ? "border-[#CFEAD9] bg-[#F3FBF7]"
                    : "border-[#E8E2DB] bg-[#F8F6F3]"
                    }`}
                >
                  <div
                    className={`mx-auto mb-2 w-10 h-10 rounded-lg border bg-white flex items-center justify-center ${pelaksanaanDecision === "selesai"
                      ? "border-[#CBE6D7]"
                      : "border-[#E8E2DB]"
                      }`}
                  >
                    <Check
                      className={
                        pelaksanaanDecision === "selesai"
                          ? "text-[#2F8A57]"
                          : "text-primary"
                      }
                    />
                  </div>
                  <p
                    className={`text-sm font-semibold ${pelaksanaanDecision === "selesai"
                      ? "text-[#2F8A57]"
                      : "text-[#3B3B3B]"
                      }`}
                  >
                    Selesaikan Program
                  </p>
                  <p className="mt-1 text-[12px] text-[#6B6B6B]">
                    {!canFinishProgram() && getDaysRemaining() > 0
                      ? `Program dapat diselesaikan ${getDaysRemaining()} hari lagi (${formatDate(
                        layananData?.tanggal_selesai || ""
                      )})`
                      : "Setelah menyelesaikan semua kegiatan silahkan klik tombol dibawah untuk menyelesaikan program dan dapat mengajukan sertifikat"}
                  </p>

                  {/* Peringatan jika belum sampai tanggal */}
                  {!canFinishProgram() && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-center justify-center gap-2 text-amber-800">
                        <Info size={16} />
                        <p className="text-[12px] font-medium">
                          Program belum mencapai tanggal selesai
                        </p>
                      </div>
                      <p className="text-[11px] text-amber-700 mt-1">
                        Anda baru dapat menyelesaikan program pada tanggal{" "}
                        <strong>
                          {formatDate(layananData?.tanggal_selesai || "")}
                        </strong>
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col items-center justify-center gap-3">
                    <label className="inline-flex items-center gap-2 text-[12px] text-[#3B3B3B]">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={pelaksanaanAgree}
                        onChange={(e) => setPelaksanaanAgree(e.target.checked)}
                        disabled={!canFinishProgram()}
                      />
                      <span
                        className={!canFinishProgram() ? "text-gray-400" : ""}
                      >
                        Saya telah menyelesaikan kegiatan
                      </span>
                    </label>
                    <button
                      className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={!pelaksanaanAgree || !canFinishProgram()}
                      onClick={async () => {
                        const Swal = (await import("sweetalert2")).default;
                        const result = await Swal.fire({
                          title: "Konfirmasi Selesaikan Program",
                          text: "Apakah Anda yakin telah menyelesaikan semua kegiatan Program Magang?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Ya, Selesaikan",
                          cancelButtonText: "Batal",
                          reverseButtons: true,
                          customClass: {
                            confirmButton:
                              "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
                            cancelButton:
                              "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
                            actions: "gap-2",
                            popup: "rounded-xl",
                          },
                          buttonsStyling: false,
                        });
                        if (result.isConfirmed) {
                          try {
                            // Show loading
                            Swal.fire({
                              title: "Menyelesaikan Program...",
                              text: "Mohon tunggu sebentar",
                              allowOutsideClick: false,
                              didOpen: () => {
                                Swal.showLoading();
                              },
                            });

                            // Update status pelaksanaan di backend
                            await updateStatusPelaksanaan(
                              Number(layananId),
                              "SELESAI"
                            );

                            // Re-fetch layanan data to get updated status
                            const updatedData = await fetchLayananById(
                              Number(layananId),
                              {
                                include_jenis: true,
                                include_peserta: true,
                                include_mou: true,
                                include_sertifikat: true,
                                include_laporan: true,
                              }
                            );
                            setLayananData(updatedData);

                            setPelaksanaanDecision("selesai");
                            await Swal.fire({
                              title: "Kegiatan Berhasil Diselesaikan",
                              text: "Status pelaksanaan telah diupdate. Silakan lanjutkan dengan mengisi laporan akhir.",
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
                            await Swal.fire({
                              title: "Gagal Menyelesaikan Kegiatan",
                              text:
                                error.message ||
                                "Terjadi kesalahan saat mengupdate status.",
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
                        }
                      }}
                    >
                      Selesaikan Kegiatan
                    </button>

                    {/* Info tambahan jika belum bisa diselesaikan */}
                    {!canFinishProgram() && (
                      <p className="text-[11px] text-gray-500">
                        Tombol akan aktif setelah{" "}
                        {formatDate(layananData?.tanggal_selesai || "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {pelaksanaanDecision === "selesai" &&
          laporanDecision !== ("disetujui" as typeof laporanDecision) && (
            <div
              className="mt-4"
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
                  Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program dan
                  mendapatkan Sertifikat
                </p>

                <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
                  <div className="space-y-3">
                    {/* Field yang bisa diedit: hanya Nama P4S dan Kota */}
                    {[
                      {
                        label: "Nama P4S",
                        name: "namaP4s" as const, // ✅
                        placeholder: "Contoh : P4S Tani Makmur",
                      },
                      {
                        label: "Kabupaten / Kota",
                        name: "kota" as const,
                        placeholder: "Contoh : Kota Lumajang",
                      },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-[12px] text-[#3B3B3B] mb-1">
                          {f.label} *
                        </label>
                        <input
                          name={f.name}
                          value={laporanForm[f.name]}
                          onChange={handleLaporanChange}
                          placeholder={f.placeholder}
                          className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                        />
                      </div>
                    ))}

                    {/* Jenis Kegiatan - Read-only, sesuaikan value untuk masing-masing */}
                    <div>
                      <label className="block text-[12px] text-[#3B3B3B] mb-1">
                        Jenis Kegiatan *
                      </label>
                      <input
                        type="text"
                        value="PKL" // Ganti dengan "Magang" atau "Pelatihan" sesuai file
                        disabled
                        className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Asal Peserta - Auto-filled */}
                    <div>
                      <label className="block text-[12px] text-[#3B3B3B] mb-1">
                        Asal Peserta / Mitra Kerjasama *
                      </label>
                      <input
                        type="text"
                        value={layananData?.instansi_asal || "-"}
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
                        value="1" // atau ambil dari layananData jika ada
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
                          layananData?.tanggal_mulai
                            ? formatDate(layananData.tanggal_mulai)
                            : "-"
                        }
                        disabled
                        className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Lama Pelaksanaan - Auto-calculated or from data */}
                    <div>
                      <label className="block text-[12px] text-[#3B3B3B] mb-1">
                        Lama Pelaksanaan *
                      </label>
                      <input
                        type="text"
                        value={(() => {
                          if (
                            !layananData?.tanggal_mulai ||
                            !layananData?.tanggal_selesai
                          )
                            return "-";
                          const start = new Date(layananData.tanggal_mulai);
                          const end = new Date(layananData.tanggal_selesai);
                          const diffTime = Math.abs(
                            end.getTime() - start.getTime()
                          );
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                          return `${diffDays} hari`;
                        })()}
                        disabled
                        className="w-full rounded-lg border border-[#E8E2DB] bg-gray-50 px-3 py-2 text-[12px] text-gray-500 cursor-not-allowed"
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
                            <p className="text-[12px] mt-2">
                              Upload Foto Kegiatan
                            </p>
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

                    <div className="pt-2 text-right">
                      <button
                        onClick={handleSubmitLaporan}
                        disabled={submitting}
                        className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-4 py-2 text-[12px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Mengirim..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {laporanSubmitted && (
          <div
            className="mt-4"
            id="sertifikat-section"
          >
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
              {/* Jika Laporan Ditolak */}
              {laporanSubmitted && laporanDecision === "ditolak" && (
                <div className="rounded-lg border border-[#F0CFCF] bg-[#FFF6F6] p-4 text-center">
                  <div className="mx-auto mb-2 w-10 h-10 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
                    <XCircle className="text-[#CD0300]" />
                  </div>
                  <p className="text-sm font-semibold text-[#CD0300]">
                    Laporan Ditolak
                  </p>
                  <p className="mt-1 text-[12px] text-[#6B6B6B]">
                    Silakan perbaiki laporan sesuai catatan verifikator, kemudian
                    kirim ulang.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setLaporanDecision("menunggu" as typeof laporanDecision);
                        scrollToLaporan();
                      }}
                      className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90"
                    >
                      Kembali ke Laporan Akhir
                    </button>
                  </div>
                </div>
              )}

              {/* Jika Laporan Sudah Disubmit tapi Sertifikat Belum Ada */}
              {laporanSubmitted && sertifikatDecision !== "selesai" && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#F7F4F0] border border-[#E8E2DB] flex items-center justify-center">
                    <Award size={32} className="text-[#A99F99]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#3B3B3B] mb-2">
                    Sertifikat Belum Tersedia
                  </h3>
                  <p className="text-[12px] text-[#6B6B6B] max-w-md mx-auto">
                    Sertifikat sedang dalam proses pembuatan. Harap tunggu
                    beberapa saat.
                  </p>
                </div>
              )}

              {/* Jika Sertifikat Sudah Ada (Bisa Didownload) */}
              {sertifikatDecision === "selesai" && (
                <div>
                  {sertifikatLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin mx-auto mb-4 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-[12px] text-[#6B6B6B]">
                        Memuat sertifikat...
                      </p>
                    </div>
                  ) : sertifikatError ? (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                        <XCircle size={32} className="text-red-500" />
                      </div>
                      <h3 className="text-base font-semibold text-red-800 mb-2">
                        Gagal Memuat Sertifikat
                      </h3>
                      <p className="text-[12px] text-red-600 max-w-md mx-auto">
                        {sertifikatError}
                      </p>
                    </div>
                  ) : sertifikatData &&
                    (sertifikatData.file_sertifikat ||
                      sertifikatData.link_sertifikat) ? (
                    <div>
                      {/* Display File if exists */}
                      {sertifikatData.file_sertifikat && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                          <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-[#E8E2DB] shadow-sm bg-gray-100 flex items-center justify-center">
                            <iframe
                              src={
                                resolveFileUrl(sertifikatData.file_sertifikat) ||
                                ""
                              }
                              className="w-full h-full"
                              title="Preview Sertifikat"
                            />
                            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 border border-[#E8E2DB] px-3 py-1 text-[11px] text-[#3B3B3B] shadow-xs">
                              Sertifikat Preview
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="mx-auto mb-3 w-14 h-14 rounded-full border border-[#CBE6D7] bg-[#E9F7F0] flex items-center justify-center shadow-sm">
                              <Award size={28} className="text-[#2F8A57]" />
                            </div>
                            <h3 className="text-base md:text-lg font-semibold text-[#3B3B3B]">
                              Selamat, Program PKL Anda telah selesai!
                            </h3>
                            <p className="mt-1 text-[12px] text-gray-500">
                              Anda telah menyelesaikan program dan berhak
                              mendapatkan sertifikat resmi dari Sekolah Kopi
                              Raisa.
                            </p>
                            {sertifikatData.created_at && (
                              <p className="mt-2 text-[11px] text-[#6B6B6B]">
                                Tanggal Terbit:{" "}
                                {formatDate(sertifikatData.created_at)}
                              </p>
                            )}

                            <div className="mt-4 justify-center flex flex-wrap items-center gap-2">
                              <button
                                onClick={() =>
                                  openFile(
                                    resolveFileUrl(sertifikatData.file_sertifikat)
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"
                              >
                                <Eye size={16} /> Preview Sertifikat
                              </button>
                              <button
                                onClick={() =>
                                  downloadFile(
                                    resolveFileUrl(
                                      sertifikatData.file_sertifikat
                                    ),
                                    "Sertifikat_PKL.pdf"
                                  )
                                }
                                className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90"
                              >
                                <Download size={16} /> Download Sertifikat PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Display Link if exists */}
                      {sertifikatData.link_sertifikat && (
                        <div className="rounded-lg border border-[#E3F2FD] bg-[#F0F8FF] p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Award size={20} className="text-[#1976D2]" />
                            <p className="text-sm font-semibold text-[#1565C0]">
                              Link Sertifikat Online
                            </p>
                          </div>
                          <p className="text-[12px] text-[#424242] mb-3">
                            Akses sertifikat Anda secara online melalui link
                            berikut:
                          </p>
                          <a
                            href={sertifikatData.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all block mb-3"
                          >
                            {sertifikatData.link_sertifikat}
                          </a>
                          <a
                            href={sertifikatData.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1976D2] text-white px-4 py-2 text-[12px] hover:bg-[#1565C0]"
                          >
                            <Eye size={16} /> Buka Link Sertifikat
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#F7F4F0] border border-[#E8E2DB] flex items-center justify-center">
                        <Award size={32} className="text-[#A99F99]" />
                      </div>
                      <h3 className="text-base font-semibold text-[#3B3B3B] mb-2">
                        Sertifikat Belum Tersedia
                      </h3>
                      <p className="text-[12px] text-[#6B6B6B] max-w-md mx-auto">
                        Sertifikat sedang dalam proses pembuatan. Harap tunggu
                        beberapa saat.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 md:p-10 max-w-xl w-full shadow-lg relative mx-4 text-center">
            <button
              onClick={() => setSuccessOpen(false)}
              className="absolute top-4 right-4 text-[#A99F99] hover:text-primary text-xl"
            >
              ✕
            </button>
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#E8E2DB] bg-[#F7F4F0] flex items-center justify-center">
              <Check className="text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Laporan Akhir Terkirim
            </h2>
            <p className="text-sm md:text-[15px] text-[#3B3B3B]">
              Laporan Anda sudah berhasil dikirim. Tim kami akan memverifikasi
              terlebih dahulu sebelum sertifikat tersedia.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

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
export default function DetailPelaksanaanPKLPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DetailPelaksanaanPKLContent />
    </Suspense>
  );
}
