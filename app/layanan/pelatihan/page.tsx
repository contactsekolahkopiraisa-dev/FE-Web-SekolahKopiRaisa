"use client";

import { useState } from "react";
import PelatihanHeader from "../../../components/layanan/pelatihan/PelatihanHeader";
import PelatihanForm from "../../../components/layanan/pelatihan/PelatihanForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { createLayanan } from "../../utils/layanan";
import { fetchAllJenisLayanan } from "../../utils/jenisLayanan";

export default function PelatihanFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    penanggungjawab: "",
    jumlahPeserta: "",
    instansi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    kegiatan: [] as string[],
    suratPermohonanFile: null as File | null,
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
    if (
      formData.suratPermohonanFile &&
      formData.suratPermohonanFile.size > MAX_FILE_SIZE
    ) {
      await Swal.fire({
        title: "File Terlalu Besar",
        text: "Ukuran file Surat Permohonan maksimal 5MB",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#401E12",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi Pengajuan",
      html: `Apakah Anda yakin ingin mengajukan layanan <b>Pelatihan</b>?<br/>Pastikan semua data yang diisi sudah benar. Karena Data tidak dapat diubah setelah di submit.`,
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
          j.nama_jenis_layanan.toLowerCase().includes("pelatihan")
        );
        if (!jenis)
          throw new Error("Jenis layanan 'Pelatihan' tidak ditemukan");

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
        data.append("jumlah_peserta", formData.jumlahPeserta || "0");
        // Kegiatan dalam format isi_konfigurasi_layanan
        // Backend expect array of IDs, not names
        const kegiatanMapping: Record<string, number> = {
          "Pengenalan Tanaman Kopi": 1,
          "Persiapan Lahan": 2,
          Pembibitan: 3,
          Penanaman: 4,
          Pemeliharaan: 5,
          Pemanenan: 6,
          Panen: 6, // alias
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
        // Penanggungjawab sebagai pesertas dengan format {urutan, nama}
        if (formData.penanggungjawab) {
          const peserta = [{ urutan: 1, nama: formData.penanggungjawab }];
          data.append("pesertas", JSON.stringify(peserta));
        }
        // File dengan nama field yang benar
        if (formData.suratPermohonanFile)
          data.append("file_surat_permohonan", formData.suratPermohonanFile);

        const created = await createLayanan(data);

        await Swal.fire({
          title: "Pengajuan Terkirim",
          text: "Mohon menunggu persetujuan admin",
          icon: "success",
          confirmButtonText: "Lihat Progres Pengajuan",
          confirmButtonColor: "#401E12",
          allowOutsideClick: false,
        });

        router.push(`/layanan/detail-pelaksanaan-pelatihan?id=${created.id}`);
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
        <PelatihanHeader />
        <PelatihanForm
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
