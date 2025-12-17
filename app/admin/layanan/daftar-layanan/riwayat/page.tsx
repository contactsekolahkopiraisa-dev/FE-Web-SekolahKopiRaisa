"use client";

import React, { useState, useEffect } from "react";
import SubNavLayananAdmin from "@/components/admin/layanan/SubNavLayananAdmin";
import ActivityHistoryCard from "@/components/admin/layanan/ActivityHistoryCard";
import LayananHeader from "@/components/layanan/LayananHeader";
import { fetchAllLayanan, LayananItem, formatDate } from "@/app/utils/layanan";
import Swal from "sweetalert2";

export default function KegiatanSelesaiPage() {
  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKegiatanSelesaiData();
  }, []);

  const loadKegiatanSelesaiData = async () => {
    try {
      setIsLoading(true);
      console.log("Loading kegiatan selesai...");
      const data = await fetchAllLayanan({
        include_jenis: true,
        include_peserta: true,
        include_mou: true,
        include_sertifikat: true,
        include_laporan: true,
      });
      console.log("All layanan loaded:", data);

      // Filter kegiatan yang selesai berdasarkan kriteria:
      // - Kunjungan & Undangan Narasumber: user sudah submit laporan (laporan.length > 0)
      // - PKL, Magang, Pelatihan: admin sudah upload sertifikat (sertifikat exists)
      const kegiatanSelesai = data.filter((item) => {
        const jenisNama =
          item.jenis_layanan?.nama_jenis_layanan?.toLowerCase() || "";

        // Untuk Kunjungan dan Undangan Narasumber: cek apakah ada laporan
        if (
          jenisNama.includes("kunjungan") ||
          jenisNama.includes("narasumber")
        ) {
          const hasLaporan =
            item.laporan &&
            (Array.isArray(item.laporan)
              ? item.laporan.length > 0
              : item.laporan.id);
          console.log(
            `${item.nama_kegiatan} (${jenisNama}): hasLaporan=${hasLaporan}`
          );
          return hasLaporan;
        }

        // Untuk PKL, Magang, dan Pelatihan: cek apakah admin sudah upload sertifikat
        if (
          jenisNama.includes("pkl") ||
          jenisNama.includes("magang") ||
          jenisNama.includes("pelatihan")
        ) {
          const sertifikat = Array.isArray(item.sertifikat)
            ? item.sertifikat[0]
            : item.sertifikat;
          const hasSertifikat = sertifikat && sertifikat.id;
          console.log(
            `${item.nama_kegiatan} (${jenisNama}): hasSertifikat=${hasSertifikat}`
          );
          return hasSertifikat;
        }

        return false;
      });

      console.log("Kegiatan selesai filtered:", kegiatanSelesai);
      setLayananList(kegiatanSelesai);
    } catch (error: any) {
      console.error("Error loading kegiatan selesai:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.message ||
          "Terjadi kesalahan saat memuat data kegiatan selesai",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <LayananHeader
        title="Layanan"
        subtitle="Kelola dan Review Pengajuan dari Peserta"
      />
      <SubNavLayananAdmin />
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <h1 className="text-2xl font-bold mb-6">Kegiatan Selesai</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-900" />
            <p className="text-sm font-semibold text-gray-800">Memuat data...</p>
            <p className="text-xs text-gray-500">Mohon tunggu, sedang mengambil daftar kegiatan selesai.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && layananList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">Belum ada kegiatan selesai</p>
          </div>
        )}

        {/* Activities List */}
        {!isLoading && layananList.length > 0 && (
          <div className="space-y-4">
            {layananList.map((item) => {
              const jenisNama =
                item.jenis_layanan?.nama_jenis_layanan || "Layanan";
              const instansi = item.instansi_asal || "Instansi Tidak Diketahui";
              const namaKegiatan = item.nama_kegiatan || jenisNama;
              const title = `${namaKegiatan} - ${instansi}`;
              const submittedDate = formatDate(item.created_at);

              // Semua item di tab ini sudah selesai
              const status = "Selesai";

              return (
                <ActivityHistoryCard
                  key={item.id}
                  id={item.id}
                  title={title}
                  submittedDate={submittedDate}
                  submitterName={item.pemohon?.name}
                  status={status}
                  detailHref={`/admin/layanan/monitoring/${item.id}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
