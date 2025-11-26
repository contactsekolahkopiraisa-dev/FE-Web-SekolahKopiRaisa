"use client";

import React, { useState, useEffect } from "react";
import SubNavLayananAdmin from "@/components/admin/layanan/SubNavLayananAdmin";
import ActivityHistoryCard from "@/components/admin/layanan/ActivityHistoryCard";
import LayananHeader from "@/components/layanan/LayananHeader";
import { fetchAllLayanan, LayananItem, formatDate } from "@/app/utils/layanan";
import Swal from "sweetalert2";

export default function RiwayatPage() {
  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRiwayatData();
  }, []);

  const loadRiwayatData = async () => {
    try {
      setIsLoading(true);
      console.log("Loading riwayat layanan...");
      const data = await fetchAllLayanan({
        include_jenis: true,
        include_peserta: true,
        include_mou: true,
        include_sertifikat: true,
        include_laporan: true,
      });
      console.log("Riwayat layanan loaded:", data);

      // Debug: log full item structure
      data.forEach((item, idx) => {
        console.log(`Item ${idx + 1}:`, item);
      });

      // Show all data (backend belum return pelaksanaan & pengajuan status)
      setLayananList(data);
    } catch (error: any) {
      console.error("Error loading riwayat data:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data riwayat",
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
        <h1 className="text-2xl font-bold mb-6">Riwayat Aktivitas</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600">Memuat data riwayat...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && layananList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">Belum ada riwayat aktivitas</p>
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

              // Use pelaksanaan status
              const status =
                item.pelaksanaan?.nama_status_kode || "Belum Terlaksana";

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
