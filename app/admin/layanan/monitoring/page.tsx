"use client";

import React, { useMemo, useState } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import LayananHeader from "@/components/layanan/LayananHeader";
import SubNavLayananAdmin from "@/components/admin/layanan/SubNavLayananAdmin";
import Link from "next/link";

type PengajuanStatus = "disetujui" | "menunggu" | "ditolak";
type MouStatus = "disetujui" | "menunggu" | "ditolak";
type PasStatus = "selesai" | "menunggu";

interface MonitoringItem {
  id: number;
  nama: string;
  jenisKegiatan: string;
  jumlahPeserta: number;
  tanggalMulai: string;
  instansi: string;
  mouStatus: MouStatus;
  pengajuanStatus: PengajuanStatus;
  tanggalPengajuan: string;
  pasStatus: PasStatus;
}

const dataSeed: MonitoringItem[] = [
  {
    id: 1,
    nama: "Hanin Zahirah Syabani",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 8,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Jember",
    mouStatus: "disetujui",
    pengajuanStatus: "disetujui",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "selesai",
  },
  {
    id: 2,
    nama: "Aisyah Farah Hanum",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 15,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Indonesia",
    mouStatus: "disetujui",
    pengajuanStatus: "disetujui",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "selesai",
  },
  {
    id: 3,
    nama: "Fahril",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 9,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Brawijaya",
    mouStatus: "menunggu",
    pengajuanStatus: "menunggu",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "selesai",
  },
  {
    id: 4,
    nama: "Farel",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 15,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Jember",
    mouStatus: "ditolak",
    pengajuanStatus: "ditolak",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "menunggu",
  },
  {
    id: 5,
    nama: "Hakim",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 9,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Jember",
    mouStatus: "menunggu",
    pengajuanStatus: "menunggu",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "menunggu",
  },
  {
    id: 6,
    nama: "Dafa",
    jenisKegiatan: "Praktek Kerja Lapangan",
    jumlahPeserta: 12,
    tanggalMulai: "15/12/2024",
    instansi: "Universitas Negeri Malang",
    mouStatus: "disetujui",
    pengajuanStatus: "disetujui",
    tanggalPengajuan: "15/10/2025",
    pasStatus: "selesai",
  },
];

export default function AdminLayananMonitoringPage() {
  const [activeTab, setActiveTab] = useState<"berlangsung" | "selesai">(
    "berlangsung"
  );
  const [query, setQuery] = useState("");
  const [filterMou, setFilterMou] = useState<"semua" | MouStatus>("semua");
  const [filterPengajuan, setFilterPengajuan] = useState<
    "semua" | PengajuanStatus
  >("semua");
  const [filterPas, setFilterPas] = useState<"semua" | PasStatus>("semua");
  const [openMou, setOpenMou] = useState(false);
  const [openP4s, setOpenP4s] = useState(false);
  const [openPengajuan, setOpenPengajuan] = useState(false);

  const handleUploadSertifikat = async (row: MonitoringItem) => {
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
        const input = document.getElementById("swal-cert-input") as HTMLInputElement | null;
        const btn = document.getElementById("swal-cert-btn") as HTMLButtonElement | null;
        const name = document.getElementById("swal-cert-name") as HTMLSpanElement | null;
        if (!input || !btn || !name) return;
        btn.addEventListener("click", (e) => { e.preventDefault(); input.click(); });
        input.addEventListener("change", () => {
          const f = input.files && input.files[0];
          name.textContent = f ? f.name : "Belum ada file dipilih";
        });
      },
      preConfirm: () => {
        const input = document.getElementById("swal-cert-input") as HTMLInputElement | null;
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
        text: `${row.nama} sekarang memiliki sertifikat.`,
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
    return dataSeed.filter((i) => {
      const q = query.toLowerCase();
      const matchQ =
        i.nama.toLowerCase().includes(q) ||
        i.instansi.toLowerCase().includes(q) ||
        i.jenisKegiatan.toLowerCase().includes(q);
      const matchMou = filterMou === "semua" || i.mouStatus === filterMou;
      const matchPengajuan =
        filterPengajuan === "semua" || i.pengajuanStatus === filterPengajuan;
      const matchPas = filterPas === "semua" || i.pasStatus === filterPas;
      return matchQ && matchMou && matchPengajuan && matchPas;
    });
  }, [query, filterMou, filterPengajuan, filterPas]);

  const Badge = ({
    status,
  }: {
    status: "disetujui" | "menunggu" | "ditolak";
  }) => {
    const style =
      status === "disetujui"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : status === "menunggu"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
    const label =
      status === "disetujui" ? "Disetujui" : status === "menunggu" ? "Menunggu" : "Ditolak";
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <LayananHeader title="Monitoring Kegiatan" subtitle="Kelola dan Review Setiap Kegiatan Peserta" />
      <SubNavLayananAdmin />

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b">
          {[
            { key: "berlangsung", label: "Kegiatan Berlangsung" },
            { key: "selesai", label: "Kegiatan Selesai" },
          ].map((t) => (
            <button
              key={t.key}
              className={`pb-2 text-sm font-medium ${
                activeTab === t.key ? "text-amber-900 border-b-2 border-amber-900" : "text-gray-500"
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
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-200 bg-white"
                placeholder="Cari berdasarkan nama, layanan, instansi..."
              />
            </div>
          </div>
          <div className="flex items-stretch flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => setOpenMou((s) => !s)}
                className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border bg-white"
              >
                Status MOU
                <span className="text-gray-500">{filterMou === "semua" ? "Semua" : filterMou}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {openMou && (
                <div className="absolute z-10 mt-1 w-44 bg-white border rounded-md shadow">
                  {(["semua","disetujui","menunggu","ditolak"] as const).map((opt) => (
                    <button
                      key={opt}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 ${opt===filterMou?"bg-neutral-50":""}`}
                      onClick={() => { setFilterMou(opt as any); setOpenMou(false); }}
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
                className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border bg-white"
              >
                Status P4S
                <span className="text-gray-500">{filterPas === "semua" ? "Semua" : filterPas}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {openP4s && (
                <div className="absolute z-10 mt-1 w-40 bg-white border rounded-md shadow">
                  {(["semua","selesai","menunggu"] as const).map((opt) => (
                    <button
                      key={opt}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 ${opt===filterPas?"bg-neutral-50":""}`}
                      onClick={() => { setFilterPas(opt as any); setOpenP4s(false); }}
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
                className="inline-flex w-full sm:w-auto items-center gap-2 px-3 py-2 text-sm rounded-md border bg-white"
              >
                Status Pengajuan
                <span className="text-gray-500">{filterPengajuan === "semua" ? "Semua" : filterPengajuan}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {openPengajuan && (
                <div className="absolute z-10 mt-1 w-44 bg-white border rounded-md shadow">
                  {(["semua","disetujui","menunggu","ditolak"] as const).map((opt) => (
                    <button
                      key={opt}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 ${opt===filterPengajuan?"bg-neutral-50":""}`}
                      onClick={() => { setFilterPengajuan(opt as any); setOpenPengajuan(false); }}
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
        <div className="mt-4 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Nama</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Jenis Kegiatan</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Instansi</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Diajukan</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status MOU</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status Pengajuan</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(activeTab === "berlangsung" ? filtered : filtered.filter((r) => r.pasStatus === "selesai")).map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{row.nama}</div>
                      <div className="text-xs text-gray-500">{row.jumlahPeserta} Peserta • {row.tanggalMulai}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.jenisKegiatan}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.instansi}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">Diajukan pada {row.tanggalPengajuan}</td>
                    <td className="px-4 py-3"><Badge status={row.mouStatus} /></td>
                    <td className="px-4 py-3"><Badge status={row.pengajuanStatus} /></td>
                    <td className="px-4 py-3">
                      {activeTab === "selesai" ? (
                        row.pasStatus === "selesai" && (
                          <button onClick={() => handleUploadSertifikat(row)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-amber-900 text-white hover:bg-amber-950">
                            Upload Sertifikat
                          </button>
                        )
                      ) : (
                        <Link href={`/admin/layanan/monitoring/${row.id}`}>
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-neutral-100">
                            <Eye size={14} /> Detail
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

