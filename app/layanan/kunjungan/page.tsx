"use client";

import { useState } from "react";
import KunjunganHeader from "../../../components/layanan/kunjungan/KunjunganHeader";
import KunjunganForm from "../../../components/layanan/kunjungan/KunjunganForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { createLayanan } from "../../utils/layanan";
import { fetchAllJenisLayanan } from "../../utils/jenisLayanan";

export default function KunjunganFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jumlahPeserta: "",
    instansi: "",
    tanggalKunjungan: "",
    suratPengantarFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi ukuran file (max 5MB per file)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (formData.suratPengantarFile && formData.suratPengantarFile.size > MAX_FILE_SIZE) {
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
      html: `Apakah Anda yakin ingin mengajukan layanan <b>Kunjungan</b>?<br/>Pastikan semua data yang diisi sudah benar. Karena Data tidak dapat diubah setelah di submit.`,
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
      try {
        const jenisList = await fetchAllJenisLayanan();
        const jenis = jenisList.find(j => j.nama_jenis_layanan.toLowerCase().includes("kunjungan"));
        if (!jenis) throw new Error("Jenis layanan 'Kunjungan' tidak ditemukan");

        const data = new FormData();
        data.append("id_jenis_layanan", String(jenis.id));
        data.append("instansi_asal", formData.instansi || "");
        data.append("tanggal_mulai", formData.tanggalKunjungan || "");
        data.append("tanggal_selesai", formData.tanggalKunjungan || "");
        data.append("jumlah_peserta", formData.jumlahPeserta || "0");
        // File dengan nama field yang benar
        if (formData.suratPengantarFile) data.append("file_surat_pengantar", formData.suratPengantarFile);

        const created = await createLayanan(data);

        await Swal.fire({
          title: "Pengajuan Terkirim",
          text: "Mohon menunggu persetujuan admin",
          icon: "success",
          confirmButtonText: "Lihat Progres Pengajuan",
          confirmButtonColor: "#401E12",
          allowOutsideClick: false,
        });

        router.push(`/layanan/detail-pelaksanaan-kunjungan?id=${created.id}`);
      } catch (err: any) {
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
        <KunjunganHeader />
        <KunjunganForm
          formData={formData}
          onInputChange={handleInputChange}

          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}


