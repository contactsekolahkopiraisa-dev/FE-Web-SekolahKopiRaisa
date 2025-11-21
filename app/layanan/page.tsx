"use client";

import { Briefcase, User, GraduationCap, Users, MapPin } from "lucide-react";
import LayananHeader from "../../components/layanan/LayananHeader";
import ServiceGrid from "../../components/layanan/ServiceGrid";
import Footer from "../../components/main/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../utils/user";
import SubNavLayanan from "../../components/layanan/SubNavLayanan";
import { fetchAllJenisLayanan } from "../utils/jenisLayanan";
import { JenisLayananItem } from "../types/jenisLayananType";

interface ServiceActivity {
  category: string;
  items: string[];
}

// Helper function to get icon by service name
const getIconByName = (nama_jenis_layanan: string | undefined) => {
  if (!nama_jenis_layanan) return <Briefcase size={48} strokeWidth={1.5} />;
  const nameLower = nama_jenis_layanan.toLowerCase();
  if (nameLower.includes("kunjungan"))
    return <MapPin size={48} strokeWidth={1.5} />;
  if (nameLower.includes("magang")) return <User size={48} strokeWidth={1.5} />;
  if (nameLower.includes("pelatihan"))
    return <GraduationCap size={48} strokeWidth={1.5} />;
  if (nameLower.includes("narasumber"))
    return <Users size={48} strokeWidth={1.5} />;
  if (nameLower.includes("pkl"))
    return <Briefcase size={48} strokeWidth={1.5} />;
  return <Briefcase size={48} strokeWidth={1.5} />;
};

// Helper function to get route from service name
const getRouteFromName = (nama_jenis_layanan: string | undefined): string => {
  if (!nama_jenis_layanan) return "/layanan";
  const nameLower = nama_jenis_layanan.toLowerCase();
  if (nameLower.includes("kunjungan")) return "/layanan/kunjungan";
  if (nameLower.includes("magang")) return "/layanan/magang";
  if (nameLower.includes("pelatihan")) return "/layanan/pelatihan";
  if (nameLower.includes("narasumber")) return "/layanan/undangan-narasumber";
  if (nameLower.includes("pkl")) return "/layanan/pkl";
  return "/layanan";
};

export default function LayananPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [services, setServices] = useState<JenisLayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUser();
        setAuthorized(true);
        // Load services after auth check
        loadServices();
      } catch {
        setAuthorized(false);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllJenisLayanan();
      setServices(data);
    } catch (error: any) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  // Transform services data for ServiceGrid
  const transformedServices = services.map((s) => {
    // Transform konfigurasiLayanans to activities format
    const activities: ServiceActivity[] = [];
    if (s.konfigurasiLayanans && s.konfigurasiLayanans.length > 0) {
      const activeConfig = s.konfigurasiLayanans.find((k) => k.is_active);
      if (
        activeConfig &&
        activeConfig.detailKonfigurasis &&
        activeConfig.detailKonfigurasis.length > 0
      ) {
        // Group by kegiatan
        const groupedByKegiatan = activeConfig.detailKonfigurasis.reduce(
          (acc: Record<number, ServiceActivity>, detail) => {
            const kegiatanId = detail.kegiatan.id;
            if (!acc[kegiatanId]) {
              acc[kegiatanId] = {
                category: detail.kegiatan.nama_kegiatan,
                items: [],
              };
            }
            acc[kegiatanId].items.push(detail.subKegiatan.nama_sub_kegiatan);
            return acc;
          },
          {}
        );
        activities.push(...Object.values(groupedByKegiatan));
      }
    }

    return {
      id: s.id,
      icon: getIconByName(s.nama_jenis_layanan),
      title: s.nama_jenis_layanan,
      description: s.deskripsi_singkat,
      duration: s.estimasi_waktu || "Belum ditentukan",
      target: s.targetPeserta?.nama_target || "",
      route: getRouteFromName(s.nama_jenis_layanan),
      image: s.image || "/assets/tk1.png",
      fullDescription: [s.deskripsi_lengkap],
      activities: activities,
    };
  });

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <LayananHeader />
      <SubNavLayanan />
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat layanan...</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 flex justify-center items-center">
          <div className="text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada layanan tersedia</p>
          </div>
        </div>
      ) : (
        <ServiceGrid services={transformedServices} />
      )}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
