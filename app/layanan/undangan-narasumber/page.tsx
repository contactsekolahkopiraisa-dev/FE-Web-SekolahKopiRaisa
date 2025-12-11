"use client";

import { useState } from "react";
import UndanganHeader from "../../../components/layanan/undangan-narasumber/UndanganHeader";
import UndanganForm from "../../../components/layanan/undangan-narasumber/UndanganForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { createLayanan } from "../../utils/layanan";
import { fetchAllJenisLayanan } from "../../utils/jenisLayanan";

export default function UndanganNarasumberFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    instansi: "",
    tanggalKegiatan: "",
    tempatKegiatan: "",
    proposalFile: null as File | null,
    suratUndaganNarasumberFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      formData.suratUndaganNarasumberFile &&
      formData.suratUndaganNarasumberFile.size > MAX_FILE_SIZE
    ) {
      await Swal.fire({
        title: "File Terlalu Besar",
        text: "Ukuran file Surat Undangan maksimal 5MB",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#401E12",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi Pengajuan",
      html: `Apakah Anda yakin ingin mengajukan layanan <b>Undangan Narasumber</b>?<br/>Pastikan semua data yang diisi sudah benar. Karena Data tidak dapat diubah setelah di submit.`,
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
        const jenis = jenisList.find((j) =>
          j.nama_jenis_layanan.toLowerCase().includes("undangan")
        );
        if (!jenis)
          throw new Error(
            "Jenis layanan 'Undangan Narasumber' tidak ditemukan"
          );

        const data = new FormData();
        data.append("id_jenis_layanan", String(jenis.id));
        // Untuk Undangan Narasumber, field khusus yang wajib diisi
        if (formData.namaKegiatan) {
          data.append("nama_kegiatan", formData.namaKegiatan);
        }
        if (formData.tempatKegiatan) {
          data.append("tempat_kegiatan", formData.tempatKegiatan);
        }
        if (formData.instansi) {
          data.append("instansi_asal", formData.instansi);
        }
        // Convert date to ISO-8601 DateTime format
        if (formData.tanggalKegiatan) {
          const tanggalKegiatanISO = new Date(
            formData.tanggalKegiatan
          ).toISOString();
          data.append("tanggal_mulai", tanggalKegiatanISO);
          data.append("tanggal_selesai", tanggalKegiatanISO);
        }
        data.append("jumlah_peserta", "0");
        // Backend butuh field ini bahkan untuk undangan narasumber
        // Kirim format minimal yang valid - array dengan objek kosong untuk id_kegiatan
        data.append(
          "isi_konfigurasi_layanan",
          JSON.stringify([{ id_kegiatan: [] }])
        );
        data.append("pesertas", JSON.stringify([]));
        // File dengan nama field yang benar
        if (formData.proposalFile)
          data.append("file_proposal", formData.proposalFile);
        if (formData.suratUndaganNarasumberFile)
          data.append(
            "file_surat_undangan",
            formData.suratUndaganNarasumberFile
          );

        // Debug: Log data yang akan dikirim
        console.log("=== DEBUG UNDANGAN NARASUMBER ===");
        const debugData: Record<string, any> = {};
        data.forEach((value, key) => {
          debugData[key] =
            value instanceof File ? `File(${value.name})` : value;
        });
        console.log("Data yang dikirim:", debugData);

        const created = await createLayanan(data);

        await Swal.fire({
          title: "Pengajuan Terkirim",
          text: "Mohon menunggu persetujuan admin",
          icon: "success",
          confirmButtonText: "Lihat Progres Pengajuan",
          confirmButtonColor: "#401E12",
          allowOutsideClick: false,
        });

        router.push(
          `/layanan/detail-pelaksanaan-undangan-narasumber?id=${created.id}`
        );
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
        <UndanganHeader />
        <UndanganForm
          formData={formData}
          onInputChange={handleInputChange}
          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
