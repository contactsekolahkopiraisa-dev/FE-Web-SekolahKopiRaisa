"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import LayananHeader from "@/components/layanan/LayananHeader";
import SubNavLayananAdmin from "@/components/admin/layanan/SubNavLayananAdmin";
import Link from "next/link";
import {
  fetchAllLayanan,
  LayananItem,
  getStatusColor,
  formatDate,
} from "@/app/utils/layanan";
import Swal from "sweetalert2";

type FilterStatus = "semua" | "disetujui" | "menunggu" | "ditolak";
type PasStatus = "selesai" | "menunggu";

export default function AdminLayananMonitoringPage() {
  const [activeTab, setActiveTab] = useState<"berlangsung" | "selesai">(
    "berlangsung"
  );
  const [query, setQuery] = useState("");
  const [filterMou, setFilterMou] = useState<FilterStatus>("semua");
  const [filterPengajuan, setFilterPengajuan] = useState<FilterStatus>("semua");
  const [filterPas, setFilterPas] = useState<"semua" | PasStatus>("semua");
  const [openMou, setOpenMou] = useState(false);
  const [openP4s, setOpenP4s] = useState(false);
  const [openPengajuan, setOpenPengajuan] = useState(false);

  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLayananData();
  }, []);

  const loadLayananData = async () => {
    try {
      setIsLoading(true);
      console.log("Loading layanan data for admin monitoring...");
      const data = await fetchAllLayanan({
        include_jenis: true,
        include_peserta: true,
        include_mou: true,
        include_sertifikat: true,
        include_laporan: true,
        include_rejection: true,
        include_pengajuan: true,
        include_pelaksanaan: true,
      });
      console.log("Layanan data loaded:", data);
      setLayananList(data);
    } catch (error: any) {
      console.error("Error loading layanan data:", error);
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

  const handleUploadSertifikat = async (row: LayananItem) => {
    const Swal = (await import("sweetalert2")).default;

    const { value: file, isConfirmed } = await Swal.fire({
      title: "Upload Sertifikat",
      html: `
        <input type="file" id="swal-cert-input" accept="application/pdf" class="hidden" />
        <div class="flex items-center gap-3">
          <button id="swal-cert-btn" class="px-3 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950">Pilih File</button>
          <span id="swal-cert-name" class="text-sm text-gray-700">Belum ada file dipilih</span>
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: "Upload",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
      didOpen: () => {
        const input = document.getElementById(
          "swal-cert-input"
        ) as HTMLInputElement | null;
        const btn = document.getElementById(
          "swal-cert-btn"
        ) as HTMLButtonElement | null;
        const name = document.getElementById(
          "swal-cert-name"
        ) as HTMLSpanElement | null;
        if (!input || !btn || !name) return;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          input.click();
        });
        input.addEventListener("change", () => {
          const f = input.files && input.files[0];
          name.textContent = f ? f.name : "Belum ada file dipilih";
        });
      },
      preConfirm: () => {
        const input = document.getElementById(
          "swal-cert-input"
        ) as HTMLInputElement | null;
        const selected = input?.files && input.files[0];
        if (!selected) {
          Swal.showValidationMessage("Silakan pilih file PDF sertifikat");
          return;
        }
        if (selected.type !== "application/pdf") {
          Swal.showValidationMessage("Hanya file PDF yang diperbolehkan");
          return;
        }
        return selected;
      },
    });

    if (!isConfirmed || !file) return;

    // TODO: Replace with actual API upload
    const uploading = Swal.fire({
      title: "Mengunggah...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: { popup: "rounded-xl" },
    });

    try {
      await new Promise((r) => setTimeout(r, 1200));

      await Swal.fire({
        icon: "success",
        title: "Sertifikat berhasil diunggah",
        text: `Sertifikat untuk ${row.nama_kegiatan} berhasil diunggah.`,
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Gagal mengunggah",
        text: "Terjadi kesalahan saat mengunggah sertifikat. Coba lagi.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      Swal.close();
    }
  };

  const filtered = useMemo(() => {
    return layananList.filter((item) => {
      const q = query.toLowerCase();
      // Search: nama pemohon, instansi, jenis kegiatan
      const pemohonNama = item.pemohon?.name || "";
      const jenisNama =
        item.jenis_layanan?.nama_jenis_layanan ||
        item.jenisLayanan?.nama_jenis_layanan ||
        "";
      const namaKegiatan = item.nama_kegiatan || "";
      const instansiAsal = item.instansi_asal || "";

      const matchQ =
        namaKegiatan.toLowerCase().includes(q) ||
        instansiAsal.toLowerCase().includes(q) ||
        jenisNama.toLowerCase().includes(q) ||
        pemohonNama.toLowerCase().includes(q);

      // Filter MOU status
      const mouStatus = (
        item.mou?.statusKode?.nama_status_kode || "menunggu"
      ).toLowerCase();
      const matchMou =
        filterMou === "semua" ||
        (filterMou === "disetujui" && mouStatus.includes("disetujui")) ||
        (filterMou === "menunggu" && mouStatus.includes("menunggu")) ||
        (filterMou === "ditolak" && mouStatus.includes("ditolak"));

      // Filter Pengajuan status
      const pengajuanStatus = (
        item.pengajuan?.nama_status_kode || "menunggu"
      ).toLowerCase();
      const matchPengajuan =
        filterPengajuan === "semua" ||
        (filterPengajuan === "disetujui" &&
          pengajuanStatus.includes("disetujui")) ||
        (filterPengajuan === "menunggu" &&
          pengajuanStatus.includes("menunggu")) ||
        (filterPengajuan === "ditolak" && pengajuanStatus.includes("ditolak"));

      // Filter Pelaksanaan status
      const pelaksanaanStatus = (
        item.pelaksanaan?.nama_status_kode || "menunggu"
      ).toLowerCase();
      const matchPas =
        filterPas === "semua" ||
        (filterPas === "selesai" && pelaksanaanStatus.includes("selesai")) ||
        (filterPas === "menunggu" && !pelaksanaanStatus.includes("selesai"));

      return matchQ && matchMou && matchPengajuan && matchPas;
    });
  }, [layananList, query, filterMou, filterPengajuan, filterPas]);

  const Badge = ({ status }: { status: string }) => {
    const statusLower = status.toLowerCase();
    const isApproved =
      statusLower.includes("disetujui") || statusLower.includes("selesai");
    const isPending = statusLower.includes("menunggu");
    const isRejected = statusLower.includes("ditolak");

    const style = isApproved
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : isPending
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : isRejected
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border ${style}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <LayananHeader
        title="Monitoring Kegiatan"
        subtitle="Kelola dan Review Setiap Kegiatan Peserta"
      />
      <SubNavLayananAdmin />
      <div className="py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b">
            {[
              { key: "berlangsung", label: "Kegiatan Berlangsung" },
              { key: "selesai", label: "Kegiatan Selesai" },
            ].map((t) => (
              <button
                key={t.key}
                className={`pb-2 text-sm font-medium ${
                  activeTab === t.key
                    ? "text-amber-900 border-b-2 border-amber-900"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(t.key as any)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="relative w-full sm:w-96">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-200"
                  placeholder="Cari berdasarkan nama, layanan, instansi..."
                />
              </div>
            </div>
            <div className="flex items-stretch flex-wrap gap-2">
              <div className="relative">
                <button
                  onClick={() => setOpenMou((s) => !s)}
                  className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border"
                >
                  Status MOU
                  <span className="text-gray-500">
                    {filterMou === "semua" ? "Semua" : filterMou}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {openMou && (
                  <div className="absolute z-10 mt-1 w-44 border rounded-md shadow">
                    {(
                      ["semua", "disetujui", "menunggu", "ditolak"] as const
                    ).map((opt) => (
                      <button
                        key={opt}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          opt === filterMou ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setFilterMou(opt as any);
                          setOpenMou(false);
                        }}
                      >
                        {opt === "semua" ? "Semua" : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenP4s((s) => !s)}
                  className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border"
                >
                  Status Pelaksanaan
                  <span className="text-gray-500">
                    {filterPas === "semua" ? "Semua" : filterPas}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {openP4s && (
                  <div className="absolute z-10 mt-1 w-40 border rounded-md shadow">
                    {(["semua", "selesai", "menunggu"] as const).map((opt) => (
                      <button
                        key={opt}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          opt === filterPas ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setFilterPas(opt as any);
                          setOpenP4s(false);
                        }}
                      >
                        {opt === "semua" ? "Semua" : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenPengajuan((s) => !s)}
                  className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border"
                >
                  Status Pengajuan
                  <span className="text-gray-500">
                    {filterPengajuan === "semua" ? "Semua" : filterPengajuan}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {openPengajuan && (
                  <div className="absolute z-10 mt-1 w-44 border rounded-md shadow">
                    {(
                      ["semua", "disetujui", "menunggu", "ditolak"] as const
                    ).map((opt) => (
                      <button
                        key={opt}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          opt === filterPengajuan ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setFilterPengajuan(opt as any);
                          setOpenPengajuan(false);
                        }}
                      >
                        {opt === "semua" ? "Semua" : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="mt-4 rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Jenis Kegiatan
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Instansi
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Diajukan
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Status MOU
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Status Pengajuan
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(activeTab === "berlangsung"
                    ? filtered
                    : filtered.filter((r) => {
                        const pelaksanaanStatus =
                          r.pelaksanaan?.nama_status_kode?.toLowerCase() || "";
                        return pelaksanaanStatus.includes("selesai");
                      })
                  ).map((row) => {
                    const pemohonNama = row.pemohon?.name || "N/A";
                    const jenisNama =
                      row.jenis_layanan?.nama_jenis_layanan || "N/A";
                    const mouStatusText =
                      row.mou?.statusKode?.nama_status_kode || "Menunggu";
                    const pengajuanStatusText =
                      row.pengajuan?.nama_status_kode || "Menunggu";
                    const pelaksanaanStatusText =
                      row.pelaksanaan?.nama_status_kode || "Menunggu";
                    const isPelaksanaanSelesai = pelaksanaanStatusText
                      .toLowerCase()
                      .includes("selesai");

                    return (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {pemohonNama}
                          </div>
                          <div className="text-xs text-gray-500">
                            {row.jumlah_peserta} Peserta •{" "}
                            {formatDate(row.tanggal_mulai)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{jenisNama}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {row.instansi_asal}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          Diajukan pada {formatDate(row.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge status={mouStatusText} />
                        </td>
                        <td className="px-4 py-3">
                          <Badge status={pengajuanStatusText} />
                        </td>
                        <td className="px-4 py-3">
                          {activeTab === "selesai" ? (
                            isPelaksanaanSelesai && (
                              <button
                                onClick={() => handleUploadSertifikat(row)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-amber-900 text-white hover:bg-amber-950"
                              >
                                Upload Sertifikat
                              </button>
                            )
                          ) : (
                            <Link href={`/admin/layanan/monitoring/${row.id}`}>
                              <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border hover:bg-gray-50">
                                <Eye size={14} /> Detail
                              </button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
