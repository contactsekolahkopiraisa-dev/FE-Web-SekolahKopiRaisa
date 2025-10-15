"use client";

import { useState } from "react";
import UndanganHeader from "../../../components/layanan/undangan-narasumber/UndanganHeader";
import UndanganForm from "../../../components/layanan/undangan-narasumber/UndanganForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function UndanganNarasumberFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    instansi: "",
    tanggalKegiatan: "",
    tempatKegiatan: "",
    proposalFile: null as File | null,
    suratPermohonanFile: null as File | null,
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
      // TODO: submit to API here
      await Swal.fire({
        title: "Pengajuan Terkirim",
        text: "Mohon menunggu persetujuan admin",
        icon: "success",
        confirmButtonText: "Lihat Progres Pengajuan",
        confirmButtonColor: "#401E12",
        allowOutsideClick: false,
      });

      router.push("/layanan/detail-pelaksanaan-undangan-narasumber");
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


