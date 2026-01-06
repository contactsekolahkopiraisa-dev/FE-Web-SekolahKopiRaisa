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
  markLayananAsOpened
} from "@/app/utils/layanan";
import { createSertifikat } from "@/app/utils/sertifikat";
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
  // Pagination state (match user riwayat style)
  const [pageBerlangsung, setPageBerlangsung] = useState(1);
  const [pageSelesai, setPageSelesai] = useState(1);
  const ITEMS_PER_PAGE = 6;

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
      // Just log the error, no popup alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSertifikat = async (row: LayananItem) => {
    const Swal = (await import("sweetalert2")).default;

    const { value: formData, isConfirmed } = await Swal.fire({
      title: "Upload Sertifikat",
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Sertifikat (Opsional)</label>
            <input type="url" id="swal-cert-link" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">File Sertifikat (PDF) <span class="text-red-500">*</span></label>
            <input type="file" id="swal-cert-input" accept="application/pdf" class="hidden" />
            <div class="flex items-center gap-3">
              <button id="swal-cert-btn" class="px-3 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950">Pilih File</button>
              <span id="swal-cert-name" class="text-sm text-gray-700">Belum ada file dipilih</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Format: PDF, Maksimal 10MB</p>
          </div>
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
        const linkInput = document.getElementById(
          "swal-cert-link"
        ) as HTMLInputElement | null;
        const fileInput = document.getElementById(
          "swal-cert-input"
        ) as HTMLInputElement | null;
        const selectedFile = fileInput?.files && fileInput.files[0];
        const link = linkInput?.value || "";

        if (!selectedFile) {
          Swal.showValidationMessage("Silakan pilih file PDF sertifikat");
          return;
        }
        if (selectedFile.type !== "application/pdf") {
          Swal.showValidationMessage("Hanya file PDF yang diperbolehkan");
          return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
          Swal.showValidationMessage("Ukuran file maksimal 10MB");
          return;
        }
        return { file: selectedFile, link };
      },
    });

    if (!isConfirmed || !formData) return;

    // Upload sertifikat via API
    const uploading = Swal.fire({
      title: "Mengunggah...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: { popup: "rounded-xl" },
    });

    try {
      await createSertifikat({
        id_layanan: row.id,
        link_sertifikat: formData.link || undefined,
        file_sertifikat: formData.file,
      });

      // Reload data setelah upload
      await loadLayananData();

      const jenisNama =
        row.jenis_layanan?.nama_jenis_layanan ||
        row.jenisLayanan?.nama_jenis_layanan ||
        "kegiatan ini";

      await Swal.fire({
        icon: "success",
        title: "Sertifikat Berhasil Diupload",
        text: `Sertifikat untuk ${jenisNama} telah tersedia dan dapat diunduh oleh peserta.`,
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Upload Sertifikat",
        text: error.message || "Terjadi kesalahan saat mengunggah sertifikat",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
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

  // Determine which records are considered "selesai" (completed)
  const selesaiList = useMemo(() => {
    return filtered.filter((r) => {
      const jenisNama = r.jenis_layanan?.nama_jenis_layanan || "";
      const isSimpleWorkflow = [
        "Kunjungan",
        "Undangan Narasumber",
      ].some((j) => jenisNama.includes(j));

      if (isSimpleWorkflow) {
        // Kunjungan & Undangan Narasumber tidak ada di tab selesai (tidak ada sertifikat)
        return false;
      } else {
        // For MOU workflows (PKL, Magang, Pelatihan): selesai if laporan submitted
        const hasLaporan = r.laporan && (r.laporan.id || r.laporan.length > 0);
        return !!hasLaporan;
      }
    });
  }, [filtered]);

  // Decide current list and page state per tab
  const currentPage = activeTab === "berlangsung" ? pageBerlangsung : pageSelesai;
  const currentList = activeTab === "berlangsung" ? filtered : selesaiList;
  const totalPages = Math.max(1, Math.ceil(currentList.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = currentList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset page when filters/search change
  useEffect(() => {
    setPageBerlangsung(1);
    setPageSelesai(1);
  }, [query, filterMou, filterPengajuan, filterPas]);

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
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg border ${style}`}
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
                className={`pb-2 text-sm font-medium ${activeTab === t.key
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
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${opt === filterMou ? "bg-gray-50" : ""
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

              {/* Status Pelaksanaan filter - Hidden */}
              {/* <div className="relative">
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
              </div> */}

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
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${opt === filterPengajuan ? "bg-gray-50" : ""
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
          {isLoading ? (
            <div className="mt-4 rounded-xl border border-gray-100 bg-white p-8 text-center">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-900" />
              <p className="text-sm font-semibold text-gray-800">Memuat data...</p>
              <p className="text-xs text-gray-500">Mohon tunggu, sedang mengambil daftar layanan.</p>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="mt-4 rounded-xl border border-gray-100 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-gray-800">Data pengajuan belum ada</p>
              <p className="text-xs text-gray-500 mt-2">Belum ada data yang sesuai dengan filter yang dipilih</p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Jenis Kegiatan
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Instansi
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Diajukan
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Status MOU
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Status Pengajuan
                      </th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pageItems.map((row) => {
                      const pemohonNama = row.pemohon?.name || "N/A";
                      const jenisNama =
                        row.jenis_layanan?.nama_jenis_layanan || "N/A";

                      // Check if it's simple workflow (Kunjungan, Undangan Narasumber - no MOU)
                      const isSimpleWorkflow = [
                        "Kunjungan",
                        "Undangan Narasumber",
                      ].some((j) => jenisNama.includes(j));

                      const mouStatusText = isSimpleWorkflow
                        ? "-"
                        : row.mou?.statusKode?.nama_status_kode || "Menunggu";
                      const pengajuanStatusText =
                        row.pengajuan?.nama_status_kode || "Menunggu";

                      // Check if laporan has been submitted (has valid id or length)
                      const hasLaporan =
                        row.laporan &&
                        (row.laporan.id ||
                          (row.laporan.length && row.laporan.length > 0));

                      // Handle sertifikat union type
                      const sertifikat = Array.isArray(row.sertifikat)
                        ? row.sertifikat[0]
                        : row.sertifikat;

                      // Check if sertifikat already uploaded
                      const hasSertifikat = !!sertifikat?.file_sertifikat;
                      const isUnopened = !row.opened_at;
                      return (
                        <tr key={row.id}
                          className={`${isUnopened
                            ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500"
                            : "hover:bg-gray-50"
                            }`}>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              {isUnopened && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                              )}
                              <div>
                                <div className={`font-medium ${isUnopened ? "text-blue-900" : "text-gray-900"}`}>
                                  {pemohonNama}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {jenisNama.includes("Undangan Narasumber")
                                    ? formatDate(row.tanggal_mulai)
                                    : `${row.jumlah_peserta} Peserta • ${formatDate(
                                      row.tanggal_mulai
                                    )}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {jenisNama}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">
                            {row.instansi_asal}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">
                            Diajukan pada {formatDate(row.created_at)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {mouStatusText === "-" ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              <Badge status={mouStatusText} />
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge status={pengajuanStatusText} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {activeTab === "selesai" ? (
                              hasLaporan &&
                              (hasSertifikat ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Sertifikat telah di upload
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleUploadSertifikat(row)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-amber-900 text-white hover:bg-amber-950"
                                >
                                  Upload Sertifikat
                                </button>
                              ))
                            ) : (
                              <Link href={`/admin/layanan/monitoring/${row.id}`}
                                onClick={async () => {
                                  if (isUnopened) {
                                    await markLayananAsOpened(row.id);
                                    // Reload data setelah mark as opened
                                    await loadLayananData();
                                  }
                                }}>
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
          )}
          {/* Pagination Controls (match user riwayat style) */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => {
                  if (activeTab === "berlangsung")
                    setPageBerlangsung((p) => Math.max(1, p - 1));
                  else setPageSelesai((p) => Math.max(1, p - 1));
                }}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => {
                        if (activeTab === "berlangsung") setPageBerlangsung(page);
                        else setPageSelesai(page);
                      }}
                      className={`px-3 py-2 text-sm rounded-lg ${currentPage === page
                        ? "bg-amber-900 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => {
                  if (activeTab === "berlangsung")
                    setPageBerlangsung((p) => Math.min(totalPages, p + 1));
                  else setPageSelesai((p) => Math.min(totalPages, p + 1));
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
