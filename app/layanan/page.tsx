"use client";

import { 
  Briefcase, 
  User, 
  GraduationCap, 
  Users, 
  MapPin
} from "lucide-react";
import LayananHeader from "../../components/layanan/LayananHeader";
import ServiceGrid from "../../components/layanan/ServiceGrid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../utils/user";
import SubNavLayanan from "../../components/layanan/SubNavLayanan";

export default function LayananPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUser();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
       
      }
    };
    checkAuth();
  }, [router]);

  if (authorized === null) return null;

  const services = [
    {
      id: 1,
      icon: <Briefcase size={48} strokeWidth={1.5} />,
      title: "Praktek Kerja Lapangan (PKL)",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Siswa/Mahasiswa",
      route: "/layanan/pkl"
    },
    {
      id: 2,
      icon: <User size={48} strokeWidth={1.5} />,
      title: "Magang",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Siswa/Mahasiswa",
      route: "/layanan/magang"
    },
    {
      id: 3,
      icon: <GraduationCap size={48} strokeWidth={1.5} />,
      title: "Pelatihan Kopi",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Umum",
      route: "/layanan/pelatihan"
    },
    {
      id: 4,
      icon: <Users size={48} strokeWidth={1.5} />,
      title: "Undangan Narasumber",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Umum",
      route: "/layanan/undangan-narasumber"
    },
    {
      id: 5,
      icon: <MapPin size={48} strokeWidth={1.5} />,
      title: "Kunjungan",
      description: "Program PKL untuk Siswa/ Mahasiswa di Industri Kopi",
      duration: "2 - 4 Bulan",
      target: "Umum",
      route: "/layanan/kunjungan"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader />
      <SubNavLayanan />
      <ServiceGrid services={services} />
    </div>
  );
}