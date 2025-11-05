"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, FileText, ShieldCheck, ClipboardList, Award, ChevronLeft } from "lucide-react";

type StepKey = "pengajuan" | "mou" | "pelaksanaan" | "laporan" | "sertifikat";
type StepStatus = "inactive" | "active" | "done";

export default function AdminMonitoringDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [steps, setSteps] = useState<Record<StepKey, StepStatus>>({
    pengajuan: "active",
    mou: "inactive",
    pelaksanaan: "inactive",
    laporan: "inactive",
    sertifikat: "inactive",
  });

  const goNext = (current: StepKey) => {
    const order: StepKey[] = ["pengajuan", "mou", "pelaksanaan", "laporan", "sertifikat"];
    const idx = order.indexOf(current);
    const next = order[idx + 1];
    setSteps((prev) => ({
      ...prev,
      [current]: "done",
      ...(next ? { [next]: "active" } : {}),
    }));
  };

  const confirmApprove = async (current: StepKey) => {
    const Swal = (await import("sweetalert2")).default;
    const titles: Record<StepKey, string> = {
      pengajuan: "Apakah Anda yakin ingin menyetujui pengajuan ini?",
      mou: "Apakah Anda yakin ingin menyetujui MOU ini?",
      pelaksanaan: "Tandai pelaksanaan selesai dan lanjut ke Laporan?",
      laporan: "Apakah Anda yakin menyetujui Laporan Akhir?",
      sertifikat: "Kirim Sertifikat ke peserta?",
    };
    const descriptions: Record<StepKey, string> = {
      pengajuan: "pastikan semua data yang diajukan sudah sesuai",
      mou: "pastikan dokumen MOU yang diajukan sudah sesuai",
      pelaksanaan: "Pastikan seluruh kegiatan telah dilaksanakan sesuai rencana",
      laporan: "Pastikan isi laporan akhir sudah lengkap dan valid",
      sertifikat: "Sertifikat akan dikirim ke peserta",
    };
    const res = await Swal.fire({
      title: titles[current],
      html: descriptions[current],
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Yakin",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });
    if (res.isConfirmed) {
      goNext(current);
    }
  };

  const rejectWithReason = async (title: string) => {
    const Swal = (await import("sweetalert2")).default;
    const { value: text, isConfirmed } = await Swal.fire({
      title,
      html: `berikan alasan penolakan untuk membantu peserta memahami dan memperbaiki pengajuan mereka`,
      input: "textarea",
      inputLabel: "alasan Penolakan",
      inputPlaceholder:
        "Contoh : Dokumen yang di Upload Tidak lengkap. Pada bagian Proposal tidak disertakan ttd pihak Instansi",
      inputAttributes: { "aria-label": "Alasan" },
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Tolak",
      confirmButtonColor: "#4E342E",
      focusConfirm: false,
      customClass: { popup: "rounded-xl" },
    });
    if (isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Pengajuan Berhasil Ditolak",
        html:
          (text && text.length > 0)
            ? text
            : "Pengajuan ditolak.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    }
  };

  const sendCertificateAlert = async () => {
    const Swal = (await import("sweetalert2")).default;
    const confirm = await Swal.fire({
      title: "Kirim Sertifikat?",
      html: "Sertifikat akan dikirim ke peserta. Pastikan file sudah benar.",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Kirim",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });
    if (confirm.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Sertifikat Dikirim",
        html: "Sertifikat berhasil dikirim ke peserta.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      setSteps((prev) => ({ ...prev, sertifikat: "done" }));
    }
  };

  const StepItem = ({
    label,
    icon,
    status,
  }: {
    label: string;
    icon: React.ReactNode;
    status: StepStatus;
  }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        status === "active"
          ? "bg-neutral-100 border-neutral-200"
          : status === "done"
          ? "bg-white border-emerald-200"
          : "bg-white border-neutral-200 opacity-60"
      }`}
    >
      <div className="shrink-0 h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
        {icon}
      </div>
      <div className="text-sm font-medium">{label}</div>
      {status === "done" && (
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-700">
          <Check size={14} /> Selesai
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-tertiary">
      <div className="w-full px-4 md:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={18} /> Kembali
        </button>
        <div className="mb-10">
            <h1 className="text-2xl font-bold text-center">Detail Kegiatan</h1>
            <p className="text-sm text-gray-500 text-center mt-1">Ringkasan kegiatan yang diikuti peserta di Sekolah Kopi Raisa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Progress */}
          <div className="md:col-span-1 bg-white rounded-xl border border-gray-100 p-5">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-xl bg-neutral-100 text-neutral-700">
              <Check />
            </div>
            <h3 className="text-center font-semibold mt-3">Progres Kegiatan</h3>
            <p className="text-center text-xs text-gray-500 mb-4">
              Pantau Status Pelaksanaan Kegiatan Anda
            </p>
            <div className="space-y-3">
              <StepItem label="Pengajuan" icon={<FileText size={16} />} status={steps.pengajuan} />
              <StepItem label="MOU" icon={<ShieldCheck size={16} />} status={steps.mou} />
              <StepItem label="Pelaksanaan" icon={<ClipboardList size={16} />} status={steps.pelaksanaan} />
              <StepItem label="Laporan Akhir" icon={<FileText size={16} />} status={steps.laporan} />
              <StepItem label="Sertifikat Kegiatan" icon={<Award size={16} />} status={steps.sertifikat} />
            </div>
          </div>

          {/* Pengajuan / MOU Content (always visible; actions still conditional) */}
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-lg font-semibold">Ringkasan Pengajuan & Dokumen</h3>
            <p className="text-sm text-gray-600 mb-4">
              Detail Informasi dan Dokumen yang telah anda Submit
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Jenis Kegiatan</p>
                <p className="text-sm">Praktek Kerja Lapangan</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Mulai</p>
                <p className="text-sm">01/10/2025</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Nama Peserta</p>
                <p className="text-sm">Hanin Zahirah Syabani</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Selesai</p>
                <p className="text-sm">01/02/2026</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Instansi</p>
                <p className="text-sm">Universitas Jember</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Kegiatan yang dipilih</p>
                <p className="text-sm">Persiapan Lahan, Penanaman</p>
              </div>
            </div>

            {/* Dokumen */}
            <div>
              <p className="text-sm font-semibold mb-3">Dokumen yang diupload</p>
              <div className="space-y-3">
                {([
                  "Proposal / Surat Permohonan",
                  "Surat Pengantar",
                  ...(steps.mou !== "inactive" ? ["MOU"] : []),
                ] as string[]).map((label) => (
                  <div key={label} className="bg-neutral-50 rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700">
                        {label === "MOU" ? <ShieldCheck size={16} /> : <FileText size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-gray-500">{label.replace(/\s+/g, '')}.pdf</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50">Lihat</button>
                      <button className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions shown only for Pengajuan/MOU */}
            {(steps.pengajuan === "active" || steps.mou === "active") && (
              <div className="mt-4 justify-center flex items-center gap-3">
                {/* Tolak */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  onClick={() => rejectWithReason(steps.mou === "active" ? "Tolak MOU" : "Tolak Pengajuan")}
                >
                  {steps.mou === "active" ? "✕ Tolak MOU" : "✕ Tolak Pengajuan"}
                </button>
                {/* Setujui */}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950"
                  onClick={() => {
                    if (steps.pengajuan === "active") return confirmApprove("pengajuan");
                    if (steps.mou === "active") return confirmApprove("mou");
                  }}
                >
                  {steps.mou === "active" ? "✓ Setujui MOU" : "✓ Setujui Pengajuan"}
                </button>
              </div>
            )}
          </div>

          {/* Pelaksanaan Content (only when active) */}
          {steps.pelaksanaan === "active" && (
            <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-lg font-semibold mb-2">Link Logbook</h3>
              <p className="text-xs text-gray-600 mb-3">
                Link Logbook adalah catatan terkait kegiatan yang dilakukan selama Praktek Kerja Lapangan
              </p>
              <div className="flex items-center gap-2">
                <input
                  className="w-full bg-white rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder="belum diisi"
                  readOnly
                />
                <button className="px-4 py-2 text-sm rounded-lg bg-amber-900 text-white hover:bg-amber-950 whitespace-nowrap">
                  Buka Link
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950"
                  onClick={() => confirmApprove("pelaksanaan")}
                >
                  Tandai Selesai
                </button>
              </div>
            </div>
          )}

          {/* Laporan Akhir (only when active) */}
          {steps.laporan === "active" && (
            <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b">
                  <h4 className="text-sm font-semibold">Laporan Akhir Kegiatan</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Lengkapi formulir Laporan Akhir untuk menyelesaikan program dan mendapatkan Sertifikat
                  </p>
                </div>
                <div className="p-4 grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">Nama P4S *</label>
                    <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="Sekolah Kopi Raisa" readOnly />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Kabupaten / Kota *</label>
                      <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="Bondowoso" readOnly />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Kecamatan *</label>
                      <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Jenis Kegiatan *</label>
                    <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="Praktek Kerja Lapangan" readOnly />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Asal Peserta / Mitra Kerjasama *</label>
                    <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="Universitas Jember" readOnly />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Jumlah Peserta *</label>
                    <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="15" readOnly />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Tanggal Pelaksanaan *</label>
                      <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="02/10/2025" readOnly />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Lama Pelaksanaan *</label>
                      <input className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50" defaultValue="4 Bulan" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Foto Kegiatan *</label>
                    <div className="mt-1 w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-neutral-50 flex items-center justify-between">
                      <span>Dokumentasi_PKL.jpg</span>
                      <button className="px-3 py-1 text-xs rounded-md border bg-white">Download</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  onClick={() => rejectWithReason("Tolak Laporan Akhir")}
                >
                  ✕ Tolak Laporan
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950"
                  onClick={() => confirmApprove("laporan")}
                >
                  ✓ Setujui Laporan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sertifikat Section (only when active) */}
        {steps.sertifikat === "active" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="hidden md:block rounded-xl overflow-hidden">
            <img
              src="/assets/coffee.jpg"
              alt="coffee"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full border-2 border-amber-900 grid place-items-center mb-4">
              <Award className="text-amber-900" size={20} />
            </div>
            <p className="font-semibold">Kegiatan telah diselesaikan oleh peserta</p>
            <p className="text-sm text-gray-600">Silahkan Upload Sertifikat</p>

            <div className="mt-6 w-full">
              <label className="text-xs text-gray-600">Upload Sertifikat</label>
              <div className="mt-2 w-full rounded-lg border border-dashed border-gray-300 p-6 bg-neutral-50 text-gray-500 text-sm">
                Klik area ini untuk upload sertifikat
              </div>
            </div>

            <div className="mt-4 w-full flex items-center gap-2">
              <input
                className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm"
                placeholder="Link Sertifikat (opsional)"
              />
              <button
                className="px-4 py-2 text-sm rounded-lg bg-amber-900 text-white hover:bg-amber-950"
                onClick={sendCertificateAlert}
              >
                Kirim Sertifikat
              </button>
            </div>
          </div>
        </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">ID Pengajuan: {String(params?.id)}</p>
      </div>
    </div>
  );
}


