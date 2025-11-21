"use client";

import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, MapPin, User, Users } from "lucide-react";
import LayananHeader from "../../../../components/layanan/LayananHeader";
import SubNavLayananAdmin from "../../../../components/admin/layanan/SubNavLayananAdmin";
import ServiceCardAdmin from "../../../../components/admin/layanan/ServiceCardAdmin";
import { fetchAllJenisLayanan } from "@/app/utils/jenisLayanan";
import { JenisLayananItem } from "@/app/types/jenisLayananType";

interface ServiceActivity {
  category: string;
  items: string[];
}

// Helper function to get icon by service name
const getIconByName = (nama_jenis_layanan: string | undefined) => {
  if (!nama_jenis_layanan) return <Briefcase size={36} strokeWidth={1.5} />;
  const nameLower = nama_jenis_layanan.toLowerCase();
  if (nameLower.includes("kunjungan"))
    return <MapPin size={36} strokeWidth={1.5} />;
  if (nameLower.includes("magang")) return <User size={36} strokeWidth={1.5} />;
  if (nameLower.includes("pelatihan"))
    return <GraduationCap size={36} strokeWidth={1.5} />;
  if (nameLower.includes("narasumber"))
    return <Users size={36} strokeWidth={1.5} />;
  if (nameLower.includes("pkl"))
    return <Briefcase size={36} strokeWidth={1.5} />;
  return <Briefcase size={36} strokeWidth={1.5} />;
};

// Helper function to get slug from service name
const getSlugFromName = (nama_jenis_layanan: string | undefined): string => {
  if (!nama_jenis_layanan) return "";
  const nameLower = nama_jenis_layanan.toLowerCase();
  if (nameLower.includes("kunjungan")) return "kunjungan";
  if (nameLower.includes("magang")) return "magang";
  if (nameLower.includes("pelatihan")) return "pelatihan";
  if (nameLower.includes("narasumber")) return "undangan-narasumber";
  if (nameLower.includes("pkl")) return "pkl";
  return nama_jenis_layanan.toLowerCase().replace(/\s+/g, "-");
};

export default function AdminLayananPage() {
  const [services, setServices] = useState<JenisLayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      console.log("Loading jenis layanan...");
      const data = await fetchAllJenisLayanan();
      console.log("Jenis layanan loaded:", data);
      setServices(data);
    } catch (error: any) {
      console.error("Error loading services:", error);
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data layanan",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader
        title="Layanan"
        subtitle="Kelola dan Review Pengajuan dari Peserta"
      />
      <SubNavLayananAdmin />
      <div className="py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-600">Memuat data layanan...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && services.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Briefcase size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Belum ada layanan</p>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => {
                console.log(
                  "Service item:",
                  s.nama_jenis_layanan,
                  "estimasi_waktu:",
                  s.estimasi_waktu,
                  "type:",
                  typeof s.estimasi_waktu
                );

                // Transform konfigurasiLayanans to activities format
                const activities: ServiceActivity[] = [];
                if (s.konfigurasiLayanans && s.konfigurasiLayanans.length > 0) {
                  const activeConfig = s.konfigurasiLayanans.find(
                    (k) => k.is_active
                  );
                  if (
                    activeConfig &&
                    activeConfig.detailKonfigurasis &&
                    activeConfig.detailKonfigurasis.length > 0
                  ) {
                    // Group by kegiatan
                    const groupedByKegiatan =
                      activeConfig.detailKonfigurasis.reduce(
                        (acc: Record<number, ServiceActivity>, detail) => {
                          const kegiatanId = detail.kegiatan.id;
                          if (!acc[kegiatanId]) {
                            acc[kegiatanId] = {
                              category: detail.kegiatan.nama_kegiatan,
                              items: [],
                            };
                          }
                          acc[kegiatanId].items.push(
                            detail.subKegiatan.nama_sub_kegiatan
                          );
                          return acc;
                        },
                        {}
                      );
                    activities.push(...Object.values(groupedByKegiatan));
                  }
                }

                return (
                  <ServiceCardAdmin
                    key={s.id}
                    id={s.id}
                    icon={getIconByName(s.nama_jenis_layanan)}
                    title={s.nama_jenis_layanan}
                    description={s.deskripsi_singkat}
                    duration={s.estimasi_waktu || "Belum ditentukan"}
                    target={s.targetPeserta?.nama_target || ""}
                    image={s.image || "/assets/tk1.png"}
                    fullDescription={[s.deskripsi_lengkap]}
                    activities={activities}
                    editHref={`/admin/layanan/daftar-layanan/${getSlugFromName(
                      s.nama_jenis_layanan
                    )}/edit`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
