"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../utils/user";
import LayananHeader from "../../../components/layanan/LayananHeader";
import SubNavLayanan from "../../../components/layanan/SubNavLayanan";
import Link from "next/link";
import Footer from "../../../components/main/Footer";

export default function RiwayatKegiatanPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUser();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  if (authorized === null) return null;

  // Contoh data riwayat (mock)
  const historyItems = [
    {
      id: "PKL-2025-001",
      jenis: "PKL",
      judul: "PKL SMK N 1 Banda Aceh",
      tanggalPengajuan: "2025-02-12",
      status: "Disetujui",
      href: "/layanan/detail-pelaksanaan-pkl",
    },
    {
      id: "MG-2025-014",
      jenis: "Magang",
      judul: "Magang Prodi Teknologi Pangan",
      tanggalPengajuan: "2025-03-01",
      status: "Menunggu",
      href: "/layanan/detail-pelaksanaan-magang",
    },
    {
      id: "PLT-2025-007",
      jenis: "Pelatihan",
      judul: "Pelatihan Kopi Batch 7",
      tanggalPengajuan: "2025-03-10",
      status: "Selesai",
      href: "/layanan/detail-pelaksanaan-pelatihan",
    },
  ];

  const statusClass = (s: string) =>
    s === "Disetujui"
      ? "bg-green-100 text-green-700"
      : s === "Selesai"
      ? "bg-blue-100 text-blue-700"
      : s === "Ditolak"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"; // Menunggu

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <LayananHeader />
      <SubNavLayanan />
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Riwayat Kegiatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#E8E2DB] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">{item.id}</p>
                  <h3 className="text-base font-semibold text-gray-900 mt-1">
                    {item.jenis} — {item.judul}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Diajukan:{" "}
                    {new Date(item.tanggalPengajuan).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${statusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={item.href}
                  className="text-sm text-amber-800 hover:underline"
                >
                  Lihat detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
