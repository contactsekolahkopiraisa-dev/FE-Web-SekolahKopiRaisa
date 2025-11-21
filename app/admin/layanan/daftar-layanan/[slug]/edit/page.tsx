"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LayananHeader from "../../../../../../components/layanan/LayananHeader";
import ServiceForm from "../../../../../../components/admin/layanan/ServiceForm";
import {
  fetchAllJenisLayanan,
  updateJenisLayanan,
  fetchAllTargetPeserta,
} from "@/app/utils/jenisLayanan";
import {
  JenisLayananItem,
  TargetPesertaItem,
} from "@/app/types/jenisLayananType";

export default function EditLayananPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { slug } = params || { slug: "" };

  const [jenisLayanan, setJenisLayanan] = useState<JenisLayananItem | null>(
    null
  );
  const [targetPesertaList, setTargetPesertaList] = useState<
    TargetPesertaItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleBySlug: Record<string, string> = {
    kunjungan: "Kunjungan",
    magang: "Magang",
    pelatihan: "Pelatihan Kopi",
    "undangan-narasumber": "Undangan Narasumber",
    pkl: "Praktek Kerja Lapangan (PKL)",
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log("Loading data for slug:", slug);

      // Fetch all jenis layanan
      const allLayanan = await fetchAllJenisLayanan();
      console.log("All layanan:", allLayanan);

      // Find the one matching the slug
      const targetName = titleBySlug[slug];
      const foundLayanan = allLayanan.find(
        (l) => l.nama_jenis_layanan.toLowerCase() === targetName?.toLowerCase()
      );

      if (!foundLayanan) {
        throw new Error("Layanan tidak ditemukan");
      }

      console.log("Found layanan:", foundLayanan);
      setJenisLayanan(foundLayanan);

      // Fetch target peserta options
      const targetPeserta = await fetchAllTargetPeserta();
      console.log("Target peserta:", targetPeserta);
      setTargetPesertaList(targetPeserta);
    } catch (error: any) {
      console.error("Error loading data:", error);
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      router.push("/admin/layanan/daftar-layanan");
    } finally {
      setIsLoading(false);
    }
  };

  const initialData = useMemo(() => {
    if (!jenisLayanan) {
      return {
        nama: "",
        deskripsiLengkap: "",
        deskripsiSingkat: "",
        durasi: "",
        targetPeserta: "",
        image: "",
      };
    }

    return {
      nama: jenisLayanan.nama_jenis_layanan,
      deskripsiLengkap: jenisLayanan.deskripsi_lengkap,
      deskripsiSingkat: jenisLayanan.deskripsi_singkat,
      durasi: jenisLayanan.estimasi_waktu || "",
      targetPeserta: jenisLayanan.id_target_peserta.toString(),
      image: jenisLayanan.image,
    };
  }, [jenisLayanan]);

  const handleSubmit = async (data: any, file: File | null) => {
    if (!jenisLayanan) return;

    try {
      setIsSubmitting(true);

      await updateJenisLayanan(jenisLayanan.id, {
        nama: data.nama,
        deskripsi_lengkap: data.deskripsiLengkap,
        deskripsi_singkat: data.deskripsiSingkat,
        durasi: data.durasi,
        id_target_peserta: parseInt(data.targetPeserta),
        image: file || undefined,
      });

      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "success",
        title: "Layanan Berhasil Diperbarui",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });

      router.push("/admin/layanan/daftar-layanan");
    } catch (error: any) {
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Layanan",
        text: error.message || "Silakan coba lagi.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader title="Edit Layanan" subtitle={titleBySlug[slug] || ""} />
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <ServiceForm
            initialData={initialData}
            targetPesertaOptions={targetPesertaList}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
