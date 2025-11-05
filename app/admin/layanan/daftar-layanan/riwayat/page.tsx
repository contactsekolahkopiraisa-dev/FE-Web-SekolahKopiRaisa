"use client";

import React from "react";
import SubNavLayananAdmin from "@/components/admin/layanan/SubNavLayananAdmin";
import ActivityHistoryCard from "@/components/admin/layanan/ActivityHistoryCard";
import LayananHeader from "@/components/layanan/LayananHeader";

export default function RiwayatPage() {
  const activities = [
    {
      id: 1,
      title: "PKL - Universitas Jember",
      submittedDate: "12/02/2025",
      status: "selesai" as const,
      detailHref: "/admin/layanan/daftar-layanan/riwayat/1",
    },
    {
      id: 2,
      title: "PKL - PKL SMAN 2 LUMAJANG",
      submittedDate: "12/02/2025",
      status: "selesai" as const,
      detailHref: "/admin/layanan/daftar-layanan/riwayat/2",
    },
    {
      id: 3,
      title: "Pelatihan - BW COFFEE",
      submittedDate: "12/02/2025",
      status: "ditolak" as const,
      detailHref: "/admin/layanan/daftar-layanan/riwayat/3",
    },
    {
      id: 4,
      title: "PKL - PKL SMAN 2 LUMAJANG",
      submittedDate: "12/02/2025",
      status: "selesai" as const,
      detailHref: "/admin/layanan/daftar-layanan/riwayat/4",
    },
    {
      id: 5,
      title: "Kunjungan - Fasilkom Unej",
      submittedDate: "12/02/2025",
      status: "ditolak" as const,
      detailHref: "/admin/layanan/daftar-layanan/riwayat/5",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <LayananHeader title="Layanan" subtitle="Kelola dan Review Pengajuan dari Peserta" />
      <SubNavLayananAdmin />
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <h1 className="text-2xl font-bold mb-6">Riwayat Aktivitas</h1>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityHistoryCard
              key={activity.id}
              title={activity.title}
              submittedDate={activity.submittedDate}
              status={activity.status}
              detailHref={activity.detailHref} id={0}          />
          ))}
        </div>
      </div> 
    </div>
  );
}