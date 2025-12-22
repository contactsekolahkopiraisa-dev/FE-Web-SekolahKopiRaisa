"use client";

import { Check, Download, Eye, FileText, FileCheck, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import Footer from "@/components/main/Footer";
import { useRouter } from "next/navigation";

export default function DetailPelaksanaanUndanganNarasumberPage() {
  const router = useRouter(); // ✅ gunakan useRouter di sini

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<
    "menunggu" | "disetujui" | "ditolak"
  >("menunggu");

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "Undangan Narasumber",
    asalPeserta: "",
    jumlahPeserta: "",
    tanggalPelaksanaan: "",
    lamaPelaksanaan: "",
  });

  const [fotoKegiatan, setFotoKegiatan] = useState<File | null>(null);
  const fotoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFoto = () => fotoInputRef.current?.click();

  const handleFotoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFotoKegiatan(f);
  };

  const handleLaporanChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setLaporanForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document.getElementById("laporan-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitLaporan = async () => {
    const Swal = (await import("sweetalert2")).default;

    const result = await Swal.fire({
      title: "Yakin Mengirimkan Laporan Akhir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Submit",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        cancelButton:
          "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    await new Promise((r) => setTimeout(r, 800));

    // Success modal
    await Swal.fire({
      title: "Laporan Akhir Terkirim",
      text: "Laporan Anda sudah berhasil dikirim. Tim kami akan memverifikasi terlebih dahulu.",
      icon: "success",
      confirmButtonText: "Kembali ke Layanan",
      customClass: {
        confirmButton:
          "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    });

    // ✅ Redirect ke halaman layanan
    router.push("/layanan");
  };

  const pengajuanDecisionText: Record<typeof pengajuanDecision, string> = {
    menunggu: "Menunggu Persetujuan",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  const decisionTextMap = {
    menunggu: "Belum Terlaksana",
    disetujui: "Disetujui",
  } as const;

  const stepStatuses: Array<"menunggu" | "disetujui"> = [
    pengajuanDecision === "disetujui" ? "disetujui" : "menunggu",
    "menunggu",
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl py-10">
          <div className="mb-4">
            <Link
              href="/layanan"
              className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Kembali ke Layanan</span>
            </Link>
          </div>

          {/* Decision Test */}
          <div className="mb-4 rounded-lg border border-[#E8E2DB] bg-white p-3 text-[12px] text-[#3B3B3B]">
            <p className="font-semibold mb-2">Decision Test</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2">
                <span className="w-28">Pengajuan</span>
                <select
                  className="flex-1 rounded-md border border-[#E8E2DB] px-2 py-1"
                  value={pengajuanDecision}
                  onChange={(e) =>
                    setPengajuanDecision(e.target.value as typeof pengajuanDecision)
                  }
                >
                  <option value="menunggu">menunggu</option>
                  <option value="disetujui">disetujui</option>
                  <option value="ditolak">ditolak</option>
                </select>
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-[#E8E2DB] px-3 py-1"
                  onClick={scrollToLaporan}
                >
                  scroll to laporan
                </button>
              </div>
            </div>
          </div>

          <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B]">
            Detail Pelaksanaan Undangan Narasumber
          </h1>

          {/* ---- Ringkasan Pengajuan ---- */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              {/* Progress Kegiatan */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg border border-[#E8E2DB] flex items-center justify-center">
                  <Check className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3B3B3B]">Progres Kegiatan</p>
                  <p className="text-[12px] text-[#6B6B6B]">
                    Pantau Status Pelaksanaan Kegiatan Anda
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const firstNonApprovedIndex = stepStatuses.findIndex(
                    (st) => st !== "disetujui"
                  );
                  const activeStepIndex =
                    firstNonApprovedIndex === -1
                      ? stepStatuses.length
                      : firstNonApprovedIndex;
                  const isActive = idx === activeStepIndex;
                  const isCompleted =
                    idx < activeStepIndex && stepStatuses[idx] === "disetujui";
                  const status = stepStatuses[idx];

                  const containerClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#EAF8F0] border-[#D2EBDD]"
                      : "bg-[#EDE6DF] border-[#E0D8D1]"
                    : isCompleted
                    ? "bg-[#F3FBF7] border-[#CFEAD9]"
                    : "bg-white border-[#EFEAE4]";

                  const iconWrapClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#E2F3EA] border-[#CBE6D7]"
                      : "bg-[#DCD3CB] border-[#CFC6BE]"
                    : isCompleted
                    ? "bg-[#E9F7F0] border-[#CBE6D7]"
                    : "bg-[#F4F0EC] border-[#E8E2DB]";

                  const iconColorClass = isActive
                    ? status === "disetujui"
                      ? "text-[#2F8A57]"
                      : "text-[#3B3B3B]"
                    : isCompleted
                    ? "text-[#2F8A57]"
                    : "text-[#6B6B6B]";

                  const descColorClass =
                    stepStatuses[idx] === "disetujui"
                      ? "text-[#2F8A57]"
                      : "text-[#6B6B6B]";

                  return (
                    <div
                      key={s.name}
                      className={`rounded-lg border text-left p-3 ${containerClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconWrapClass}`}
                        >
                          <Icon className={iconColorClass} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#3B3B3B]">
                            {s.name}
                          </p>
                          <p className={`text-[12px] ${descColorClass}`}>
                            {s.name === "Pengajuan"
                              ? pengajuanDecisionText[pengajuanDecision]
                              : decisionTextMap[stepStatuses[idx]]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan pengajuan sebelah kanan */}
            <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-[#3B3B3B]" />
                <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">
                  Ringkasan Pengajuan & Dokumen
                </p>
              </div>
              <p className="text-[12px] text-[#6B6B6B] mb-4">
                Detail informasi dan Dokumen yang telah anda Submit
              </p>

              <div className="rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Jenis Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      Undangan Narasumber
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">
                      Tanggal Kegiatan
                    </p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      01/10/2025
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Nama Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      From Bean to Brand: Workshop Bersama CEO Sekolah Kopi
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Tempat Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      Zoom Meeting
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Instansi</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">
                      Universitas Jember
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jika Pengajuan Ditolak */}
      {pengajuanDecision === "ditolak" && (
        <div className="container mx-auto px-4 max-w-6xl mt-6 mb-8">
          <div className="rounded-xl border border-[#F0CFCF] bg-[#FFF6F6] p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
              <XCircle className="text-[#CD0300]" />
            </div>
            <p className="text-[15px] md:text-base font-semibold text-[#CD0300]">
              Pengajuan Ditolak
            </p>
            <p className="mt-1 text-[12px] text-[#6B6B6B]">
              Pengajuan Anda Ditolak karena Proposal belum ditandatangani pimpinan
              fakultas dan jadwal pelaksanaan tidak jelas. Silakan perbaiki sesuai
              catatan di atas dan ajukan kembali.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90"
              >
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Akhir Section */}
      {pengajuanDecision === "disetujui" && (
        <div
          className="container mx-auto px-4 max-w-6xl mb-8"
          id="laporan-section"
        >
          <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                <FileCheck size={14} className="text-[#3B3B3B]" />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">
                Laporan Akhir Kegiatan
              </p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">
              Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program
            </p>

            <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
              <div className="space-y-3">
                {/* Input Fields */}
                {[
                  { label: "Nama P4S", name: "namaP4s", placeholder: "Contoh : P4S Tani Makmur" },
                  { label: "Kabupaten / Kota", name: "kota", placeholder: "Contoh : Kota Lumajang" },
                  { label: "Asal Peserta / Mitra Kerjasama", name: "asalPeserta", placeholder: "Contoh : Universitas Jember" },
                  { label: "Jumlah Peserta", name: "jumlahPeserta", placeholder: "Contoh : 1" },
                  { label: "Lama Pelaksanaan", name: "lamaPelaksanaan", placeholder: "Contoh : 4 Bulan" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-[12px] text-[#3B3B3B] mb-1">
                      {f.label} *
                    </label>
                    <input
                      name={f.name}
                      value={laporanForm[f.name as keyof typeof laporanForm]}
                      onChange={handleLaporanChange}
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                    />
                  </div>
                ))}

                {/* Jenis Kegiatan */}
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Jenis Kegiatan *
                  </label>
                  <select
                    name="jenisKegiatan"
                    value={laporanForm.jenisKegiatan}
                    onChange={handleLaporanChange}
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                  >
                    <option value="">Pilih Jenis Kegiatan</option>
                    <option value="pkl">PKL</option>
                    <option value="Magang">Magang</option>
                    <option value="pelatihan">Pelatihan Kopi</option>
                  </select>
                </div>

                                {/* Tanggal Pelaksanaan */}
                                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Tanggal Pelaksanaan *
                  </label>
                  <input
                    type="date"
                    name="tanggalPelaksanaan"
                    value={laporanForm.tanggalPelaksanaan}
                    onChange={handleLaporanChange}
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]"
                  />
                </div>

                {/* Upload Foto Kegiatan */}
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">
                    Foto Kegiatan *
                  </label>
                  <div
                    className="border border-dashed border-[#E8E2DB] rounded-lg bg-white p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F7F5]"
                    onClick={handlePickFoto}
                  >
                    {fotoKegiatan ? (
                      <div className="text-center">
                        <p className="text-[12px] text-[#3B3B3B]">
                          {fotoKegiatan.name}
                        </p>
                        <p className="text-[11px] text-[#6B6B6B] mt-1">Klik untuk ganti</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center text-[#6B6B6B]">
                        <Download size={20} />
                        <p className="text-[12px] mt-2">Upload Foto Kegiatan</p>
                        <p className="text-[11px] text-[#A0A0A0]">
                          Format: JPG, PNG (maks. 2MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fotoInputRef}
                      className="hidden"
                      onChange={handleFotoChange}
                    />
                  </div>
                </div>

                {/* Tombol Submit */}
                <div className="pt-2 text-right" >
                  <button
                    onClick={handleSubmitLaporan}
                    className="w-full md:w-auto bg-[#5C3A1E] text-white text-[13px] px-6 py-2 rounded-lg hover:bg-[#4C2E15] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}

