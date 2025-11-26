"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../utils/user";
import LayananHeader from "../../../components/layanan/LayananHeader";
import SubNavLayanan from "../../../components/layanan/SubNavLayanan";
import Link from "next/link";
import Footer from "../../../components/main/Footer";
import {
  fetchAllLayanan,
  LayananItem,
  getStatusColor,
  formatDate,
  getSlugFromJenisLayanan,
} from "../../utils/layanan";
import { Clock, FileText, MapPin, Users, ChevronDown } from "lucide-react";
import api from "../../utils/api";

interface StatusKode {
  id: number;
  nama_status_kode: string;
}

export default function RiwayatKegiatanPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filterKategori, setFilterKategori] = useState<
    "all" | "pengajuan" | "mou" | "pelaksanaan"
  >("all");
  const [filterStatusValue, setFilterStatusValue] = useState<string>("all");
  const [statusKodeList, setStatusKodeList] = useState<StatusKode[]>([]);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUser();
        setAuthorized(true);
        loadLayananHistory();
        loadStatusKode();
      } catch {
        setAuthorized(false);
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  const loadStatusKode = async () => {
    try {
      console.log("Loading status kode...");
      const response = await api.get("/api/v1/status-kode");
      console.log("Status kode response:", response.data);
      if (response.data.success) {
        console.log("Status kode data:", response.data.data);
        setStatusKodeList(response.data.data);
      }
    } catch (error) {
      console.error("Error loading status kode:", error);
      // Fallback: hardcode status list jika endpoint belum ada
      setStatusKodeList([
        { id: 1, nama_status_kode: "Menunggu Persetujuan" },
        { id: 2, nama_status_kode: "Disetujui" },
        { id: 3, nama_status_kode: "Ditolak" },
        { id: 4, nama_status_kode: "Belum Terlaksana" },
        { id: 5, nama_status_kode: "Sedang Berjalan" },
        { id: 6, nama_status_kode: "Selesai" },
      ]);
    }
  };

  const loadLayananHistory = async () => {
    try {
      setIsLoading(true);
      console.log("Loading layanan history...");
      const data = await fetchAllLayanan({
        include_jenis: true,
        include_peserta: true,
        include_mou: true,
        include_laporan: true,
      });
      console.log("Layanan history loaded:", data);

      // Debug: cek semua keys dari item pertama
      if (data.length > 0) {
      }

      setLayananList(data);
    } catch (error: any) {
      console.error("Error loading layanan history:", error);
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Riwayat",
        text: error.message || "Terjadi kesalahan saat memuat riwayat layanan",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authorized === null) return null;

  // Filter layanan berdasarkan kategori dan status
  const filteredLayanan = layananList.filter((item) => {
    // Filter by kategori
    if (filterKategori === "all") {
      // Jika tidak ada filter status spesifik, tampilkan semua
      if (filterStatusValue === "all") return true;

      // Cek semua kategori status
      const pengajuanMatch =
        item.pengajuan?.nama_status_kode === filterStatusValue;
      const mouMatch =
        item.mou?.statusKode?.nama_status_kode === filterStatusValue;
      const pelaksanaanMatch =
        item.pelaksanaan?.nama_status_kode === filterStatusValue;

      return pengajuanMatch || mouMatch || pelaksanaanMatch;
    }

    // Filter specific kategori
    if (filterStatusValue === "all") return true;

    if (filterKategori === "pengajuan") {
      return item.pengajuan?.nama_status_kode === filterStatusValue;
    }
    if (filterKategori === "mou") {
      return item.mou?.statusKode?.nama_status_kode === filterStatusValue;
    }
    if (filterKategori === "pelaksanaan") {
      return item.pelaksanaan?.nama_status_kode === filterStatusValue;
    }

    return true;
  });

  const getKategoriLabel = () => {
    if (filterKategori === "all") return "Semua Kategori";
    if (filterKategori === "pengajuan") return "Status Pengajuan";
    if (filterKategori === "mou") return "Status MOU";
    if (filterKategori === "pelaksanaan") return "Status Pelaksanaan";
    return "Semua Kategori";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LayananHeader />
      <SubNavLayanan />
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Riwayat Kegiatan
          </h2>

          {/* Filter Dropdown */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Kategori Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowKategoriDropdown(!showKategoriDropdown)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
              >
                {getKategoriLabel()}
                <ChevronDown size={16} />
              </button>
              {showKategoriDropdown && (
                <div className="absolute z-10 mt-1 w-52 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      setFilterKategori("all");
                      setShowKategoriDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
                  >
                    Semua Kategori
                  </button>
                  <button
                    onClick={() => {
                      setFilterKategori("pengajuan");
                      setShowKategoriDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Status Pengajuan
                  </button>
                  <button
                    onClick={() => {
                      setFilterKategori("mou");
                      setShowKategoriDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Status MOU
                  </button>
                  <button
                    onClick={() => {
                      setFilterKategori("pelaksanaan");
                      setShowKategoriDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg"
                  >
                    Status Pelaksanaan
                  </button>
                </div>
              )}
            </div>

            {/* Status Value Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
              >
                {filterStatusValue === "all"
                  ? "Semua Status"
                  : filterStatusValue}
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="absolute z-10 mt-1 w-60 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setFilterStatusValue("all");
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg font-medium"
                  >
                    Semua Status
                  </button>
                  {statusKodeList.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => {
                        setFilterStatusValue(status.nama_status_kode);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      {status.nama_status_kode}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Button */}
            {(filterKategori !== "all" || filterStatusValue !== "all") && (
              <button
                onClick={() => {
                  setFilterKategori("all");
                  setFilterStatusValue("all");
                }}
                className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600">Memuat riwayat layanan...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredLayanan.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {filterKategori === "all" && filterStatusValue === "all"
                ? "Belum ada riwayat layanan"
                : "Tidak ada layanan yang sesuai dengan filter"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Ajukan layanan pertama Anda di menu Layanan
            </p>
          </div>
        )}

        {/* Layanan Cards Grid */}
        {!isLoading && filteredLayanan.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLayanan.map((item) => {
              // Prioritas: jenis_layanan > nama_kegiatan > "Layanan Tidak Diketahui"
              const jenisLayanan =
                item.jenis_layanan?.nama_jenis_layanan ||
                item.nama_kegiatan ||
                "Layanan Tidak Diketahui";
              const slug = item.jenis_layanan
                ? getSlugFromJenisLayanan(item.jenis_layanan.nama_jenis_layanan)
                : "";
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 font-mono">
                          #{item.id}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                        {jenisLayanan}
                      </h3>
                      {/* Tampilkan nama_kegiatan sebagai subtitle jika berbeda dari title */}
                      {item.jenis_layanan?.nama_jenis_layanan &&
                        item.nama_kegiatan && (
                          <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                            {item.nama_kegiatan}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* 3 Status Badges */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    {/* Status Pengajuan */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-24 flex-shrink-0">
                        Pengajuan:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                          item.pengajuan?.nama_status_kode || "Menunggu"
                        )}`}
                      >
                        {item.pengajuan?.nama_status_kode || "Menunggu"}
                      </span>
                    </div>

                    {/* Status MOU */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-24 flex-shrink-0">
                        MOU:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                          item.mou?.statusKode?.nama_status_kode ||
                            "Belum Terlaksana"
                        )}`}
                      >
                        {item.mou?.statusKode?.nama_status_kode ||
                          "Belum Terlaksana"}
                      </span>
                    </div>

                    {/* Status Pelaksanaan */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-24 flex-shrink-0">
                        Pelaksanaan:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                          item.pelaksanaan?.nama_status_kode || "Menunggu"
                        )}`}
                      >
                        {item.pelaksanaan?.nama_status_kode || "Menunggu"}
                      </span>
                    </div>
                  </div>

                  {/* Tanggal Pengajuan */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
                    <span className="font-medium">Tanggal Pengajuan:</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock size={14} className="flex-shrink-0" />
                      <span>
                        {formatDate(item.tanggal_mulai)} -{" "}
                        {formatDate(item.tanggal_selesai)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="line-clamp-1">
                        {item.tempat_kegiatan || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users size={14} className="flex-shrink-0" />
                      <span>
                        {item.jumlah_peserta} Peserta • {item.instansi_asal}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <Link
                      href={
                        slug
                          ? `/layanan/detail-pelaksanaan-${slug}?id=${item.id}`
                          : "#"
                      }
                      className="text-sm text-amber-900 hover:text-amber-950 font-medium hover:underline"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
