"use client";

import { useState } from "react";
import MagangHeader from "../../../components/layanan/magang/MagangHeader";
import MagangForm from "../../../components/layanan/magang/MagangForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function MagangFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaPeserta: "",
    namaNIM: "",
    instansi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    kegiatan: [] as string[],
    proposalFile: null as File | null,
    suratPengantarFile: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (kegiatan: string) => {
    setFormData(prev => ({
      ...prev,
      kegiatan: prev.kegiatan.includes(kegiatan)
        ? prev.kegiatan.filter(k => k !== kegiatan)
        : [...prev.kegiatan, kegiatan]
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
      // TODO: submit to API here
      await Swal.fire({
        title: "Pengajuan Terkirim",
        text: "Mohon menunggu persetujuan admin",
        icon: "success",
        confirmButtonText: "Lihat Progres Pengajuan",
        confirmButtonColor: "#401E12",
        allowOutsideClick: false,
      });

      router.push("/layanan/detail-pelaksanaan-magang");
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


