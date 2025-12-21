"use client";
// test
import { useMemo, useState, useEffect, useCallback } from "react";
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

// Move titleBySlug outside component to avoid re-creation
// IMPORTANT: These must match EXACTLY with nama_jenis_layanan from backend
const titleBySlug: Record<string, string> = {
  kunjungan: "Kunjungan test", // Matches backend: "Kunjungan test"
  magang: "Magang gile anjay", // Matches backend: "Magang gile anjay"
  pelatihan: "Pelatihan", // Matches backend: "Pelatihan" (not "Pelatihan Kopi")
  "undangan-narasumber": "Undangan Narasumber", // Matches backend: "Undangan Narasumber"
  pkl: "Praktek Kerja Lapangan (PKL)", // Matches backend: "Praktek Kerja Lapangan (PKL)"
};

export default function EditLayananPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug || "";

  const [jenisLayanan, setJenisLayanan] = useState<JenisLayananItem | null>(
    null
  );
  const [targetPesertaList, setTargetPesertaList] = useState<
    TargetPesertaItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!slug) {
        console.warn("Slug is empty, skipping load");
        setIsLoading(false);
        return;
      }

      console.log("=== START LOADING DATA ===");
      console.log("1. Slug received:", slug);
      console.log("2. Slug type:", typeof slug);

      // Fetch all jenis layanan
      const allLayanan = await fetchAllJenisLayanan();
      console.log("3. All layanan fetched:", allLayanan);
      console.log("4. Total layanan:", allLayanan.length);

      // Find the one matching the slug
      const targetName = titleBySlug[slug];
      console.log("5. Target name from titleBySlug:", targetName);
      console.log("6. titleBySlug object:", titleBySlug);

      // Log all service names for comparison
      console.log("7. All service names:");
      allLayanan.forEach((l, idx) => {
        console.log(
          `   ${idx}. "${
            l.nama_jenis_layanan
          }" (lowercase: "${l.nama_jenis_layanan.toLowerCase()}")`
        );
      });

      if (targetName) {
        console.log("8. Looking for:", targetName.toLowerCase());
      } else {
        console.warn(
          "8. WARNING: targetName is undefined/null for slug:",
          slug
        );
      }

      const foundLayanan = allLayanan.find(
        (l) => l.nama_jenis_layanan.toLowerCase() === targetName?.toLowerCase()
      );

      console.log("9. Found layanan:", foundLayanan);

      if (!foundLayanan) {
        console.error("10. ERROR: Layanan not found!");
        console.error("    - Slug:", slug);
        console.error("    - Target name:", targetName);
        console.error(
          "    - Available names:",
          allLayanan.map((l) => l.nama_jenis_layanan)
        );
        throw new Error("Layanan tidak ditemukan");
      }

      console.log("11. SUCCESS: Found layanan:", foundLayanan);
      setJenisLayanan(foundLayanan);

      // Fetch target peserta options
      const targetPeserta = await fetchAllTargetPeserta();
      console.log("12. Target peserta fetched:", targetPeserta);
      setTargetPesertaList(targetPeserta);
      console.log("=== END LOADING DATA (SUCCESS) ===");
    } catch (error: any) {
      console.error("=== ERROR IN LOADING DATA ===");
      console.error("Error:", error);
      console.error("Error message:", error.message);
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
  }, [slug, router]); // Remove titleBySlug from dependencies

  useEffect(() => {
    console.log("useEffect triggered, slug:", slug);
    if (slug) {
      loadData();
    } else {
      console.warn("Slug is empty in useEffect");
      setIsLoading(false);
    }
  }, [slug, loadData]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  if (!jenisLayanan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Data layanan tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
