"use client";

import { useState } from "react";
import MagangHeader from "../../../components/layanan/magang/MagangHeader";
import MagangForm from "../../../components/layanan/magang/MagangForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { createLayanan } from "../../utils/layanan";
import { fetchAllJenisLayanan } from "../../utils/jenisLayanan";

export default function MagangFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaPeserta: "",
    namaNIM: "",
    fakultas: "",
    prodi: "",
    instansi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    kegiatan: [] as string[],
    proposalFile: null as File | null,
    suratPengantarFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (kegiatan: string) => {
    setFormData((prev) => ({
      ...prev,
      kegiatan: prev.kegiatan.includes(kegiatan)
        ? prev.kegiatan.filter((k) => k !== kegiatan)
        : [...prev.kegiatan, kegiatan],
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi ukuran file (max 5MB per file)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (formData.proposalFile && formData.proposalFile.size > MAX_FILE_SIZE) {
      await Swal.fire({
        title: "File Terlalu Besar",
        text: "Ukuran file Proposal maksimal 5MB",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#401E12",
      });
      return;
    }
    if (
      formData.suratPengantarFile &&
      formData.suratPengantarFile.size > MAX_FILE_SIZE
    ) {
      await Swal.fire({
        title: "File Terlalu Besar",
        text: "Ukuran file Surat Pengantar maksimal 5MB",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#401E12",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi Pengajuan",
      html: `Apakah Anda yakin ingin mengajukan layanan <b>Magang</b>?<br/>Pastikan semua data yang diisi sudah benar. Karena Data tidak dapat diubah setelah di submit.`,
      showCancelButton: true,
      confirmButtonText: "Ya, Submit",
      cancelButtonText: "Batal",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#401E12",
      cancelButtonColor: "#E5E7EB",
      customClass: {
        cancelButton: "text-gray-700",
      },
    });

    if (result.isConfirmed) {
      setIsLoading(true);

      // Tampilkan loading alert
      Swal.fire({
        title: "Mengirim Pengajuan...",
        html: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const jenisList = await fetchAllJenisLayanan();
        const jenis = jenisList.find((j) =>
          j.nama_jenis_layanan.toLowerCase().includes("magang")
        );
        if (!jenis) throw new Error("Jenis layanan 'Magang' tidak ditemukan");

        const data = new FormData();
        data.append("id_jenis_layanan", String(jenis.id));
        data.append("instansi_asal", formData.instansi || "");
        // Convert date to ISO-8601 DateTime format
        if (formData.tanggalMulai) {
          const tanggalMulaiISO = new Date(formData.tanggalMulai).toISOString();
          data.append("tanggal_mulai", tanggalMulaiISO);
        }
        if (formData.tanggalSelesai) {
          const tanggalSelesaiISO = new Date(
            formData.tanggalSelesai
          ).toISOString();
          data.append("tanggal_selesai", tanggalSelesaiISO);
        }
        data.append("jumlah_peserta", "1");
        // Field Magang spesifik - hanya kirim jika ada nilai
        if (formData.namaNIM) data.append("nim", formData.namaNIM);
        if (formData.fakultas) data.append("fakultas", formData.fakultas);
        if (formData.prodi) data.append("prodi", formData.prodi);
        // Kegiatan dalam format isi_konfigurasi_layanan
        // Backend expect array of IDs, not names
        const kegiatanMapping: Record<string, number> = {
          "Pengenalan Tanaman Kopi": 1,
          "Persiapan Lahan": 2,
          Pembibitan: 3,
          Penanaman: 4,
          Pemeliharaan: 5,
          Pemanenan: 6,
          Panen: 6,
          "Pasca Panen": 7,
          Pemasaran: 8,
        };
        const kegiatanArray = Array.isArray(formData.kegiatan)
          ? formData.kegiatan
          : [];
        const kegiatanIds = kegiatanArray
          .map((name) => kegiatanMapping[name])
          .filter((id) => id !== undefined);
        if (kegiatanIds.length > 0) {
          const isiKonfigurasi = [{ id_kegiatan: kegiatanIds }];
          data.append(
            "isi_konfigurasi_layanan",
            JSON.stringify(isiKonfigurasi)
          );
        }
        // Untuk magang, TIDAK kirim field pesertas karena backend tidak menerimanya
        // Data peserta sudah terinput di field nama_peserta, nim, fakultas, prodi
        // File dengan nama field yang benar
        if (formData.proposalFile)
          data.append("file_proposal", formData.proposalFile);
        if (formData.suratPengantarFile)
          data.append("file_surat_pengantar", formData.suratPengantarFile);

        const created = await createLayanan(data);

        await Swal.fire({
          title: "Pengajuan Terkirim",
          text: "Mohon menunggu persetujuan admin",
          icon: "success",
          confirmButtonText: "Lihat Progres Pengajuan",
          confirmButtonColor: "#401E12",
          allowOutsideClick: false,
        });

        router.push(`/layanan/detail-pelaksanaan-magang?id=${created.id}`);
      } catch (err: any) {
        setIsLoading(false);
        await Swal.fire({
          title: "Gagal Mengajukan",
          text: err?.message || "Terjadi kesalahan saat mengirim pengajuan",
          icon: "error",
          confirmButtonText: "Tutup",
          confirmButtonColor: "#401E12",
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <MagangHeader />
        <MagangForm
          formData={formData}
          onInputChange={handleInputChange}
          onKegiatanChange={handleCheckboxChange}
          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
