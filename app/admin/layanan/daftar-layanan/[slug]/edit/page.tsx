"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayananHeader from "../../../../../../components/layanan/LayananHeader";
import ServiceForm from "../../../../../../components/admin/layanan/ServiceForm";


export default function EditLayananPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { slug } = params || { slug: "" };

  const titleBySlug: Record<string, string> = {
    kunjungan: "Kunjungan",
    magang: "Magang",
    pelatihan: "Pelatihan Kopi",
    "undangan-narasumber": "Undangan Narasumber",
    pkl: "Praktek Kerja Lapangan (PKL)",
  };

  const initialData = useMemo(() => {
    const defaultData = {
      nama: titleBySlug[slug] || "",
      deskripsiLengkap: "",
      deskripsiSingkat: "",
      durasi: "",
      targetPeserta: "",
      image: "/assets/tk1.png",
    };
    return defaultData;
  }, [slug]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any, file: File | null) => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        title: data?.nama,
        full_description: data?.deskripsiLengkap,
        short_description: data?.deskripsiSingkat,
        duration: data?.durasi,
        target: data?.targetPeserta,
      };
      // Note: file/image upload can be supported later via multipart if backend supports it
      await updateServiceBySlug(slug, payload);
      router.push("/admin/layanan/daftar-layanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader title="Edit Layanan" subtitle={titleBySlug[slug] || ""} />
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <ServiceForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}


function updateServiceBySlug(slug: string, payload: any) {
  throw new Error("Function not implemented.");
}

