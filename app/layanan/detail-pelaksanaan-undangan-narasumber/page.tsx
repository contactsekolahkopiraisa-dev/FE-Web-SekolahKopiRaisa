"use client";

import { Check, Download, Eye, FileText, FileCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function DetailPelaksanaanUndanganNarasumberPage() {
  

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<"menunggu" | "disetujui" | "ditolak">("menunggu");

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
  
  const handleLaporanChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    setLaporanForm((prev) => ({ ...prev, [name]: value }));
  };

  const [successOpen, setSuccessOpen] = useState(false);
  const [laporanSubmitted, setLaporanSubmitted] = useState(false);
  
  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document.getElementById("laporan-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handleSubmitLaporan = async () => {
    const confirmed = window.confirm("Yakin Mengirimkan Laporan Akhir? Pastikan semua data sudah lengkap dan benar.");
    if (!confirmed) return;
    
    await new Promise((r) => setTimeout(r, 800));
    setSuccessOpen(true);
    setLaporanSubmitted(true);
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
    (pengajuanDecision === "disetujui" ? "disetujui" : "menunggu"),
    (/* laporan akhir */ laporanSubmitted ? "disetujui" : "menunggu"),
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl py-10">
          <div className="mb-4">
            <Link href="/layanan" className="text-sm text-amber-800 hover:underline">
              ← Kembali ke Layanan
            </Link>
          </div>
          <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B]">
            Detail Pelaksanaan Undangan Narasumber
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg border border-[#E8E2DB] flex items-center justify-center">
                  <Check className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3B3B3B]">Progres Kegiatan</p>
                  <p className="text-[12px] text-[#6B6B6B]">Pantau Status Pelaksanaan Kegiatan Anda</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const firstNonApprovedIndex = stepStatuses.findIndex((st) => st !== "disetujui");
                  const activeStepIndex = firstNonApprovedIndex === -1 ? stepStatuses.length : firstNonApprovedIndex;
                  const isActive = idx === activeStepIndex;
                  const isCompleted = idx < activeStepIndex && stepStatuses[idx] === "disetujui";
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

                  const descColorClass = stepStatuses[idx] === "disetujui"
                    ? "text-[#2F8A57]"
                    : "text-[#6B6B6B]";

                  return (
                    <div key={s.name} className={`rounded-lg border text-left p-3 ${containerClass}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconWrapClass}`}>
                          <Icon className={iconColorClass} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#3B3B3B]">{s.name}</p>
                          <p className={`text-[12px] ${descColorClass}`}>
                            {s.name === "Pengajuan" ? pengajuanDecisionText[pengajuanDecision] : decisionTextMap[stepStatuses[idx]]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-[#3B3B3B]" />
                <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">Ringkasan Pengajuan & Dokumen</p>
              </div>
              <p className="text-[12px] text-[#6B6B6B] mb-4">Detail informasi dan Dokumen yang telah anda Submit</p>

              <div className="rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Jenis Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">Undangan Narasumber</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Tanggal Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">01/10/2025</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Nama Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">From Bean to Brand: Workshop Bersama CEO Sekolah Kopi</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Tempat Kegiatan</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">Zoom Meeting</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B6B6B] mb-1">Instansi</p>
                    <p className="text-[13px] font-medium text-[#3B3B3B]">Universitas Jember</p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-semibold text-[#3B3B3B] mb-3">Dokumen yang diupload</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3 hover:bg-[#FAFAF9] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#6B6B6B]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#3B3B3B]">Proposal</p>
                      <p className="text-[11px] text-[#6B6B6B]">Proposal.pdf</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[11px] text-[#3B3B3B] hover:bg-[#F5EFE8] transition-colors">
                      <Eye size={14} /> Lihat
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg bg-amber-700 text-white px-3 py-1.5 text-[11px] hover:opacity-90 transition-opacity">
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3 hover:bg-[#FAFAF9] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#6B6B6B]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#3B3B3B]">Surat Permohonan</p>
                      <p className="text-[11px] text-[#6B6B6B]">Surat Permohonan .pdf</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[11px] text-[#3B3B3B] hover:bg-[#F5EFE8] transition-colors">
                      <Eye size={14} /> Lihat
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg bg-amber-700 text-white px-3 py-1.5 text-[11px] hover:opacity-90 transition-opacity">
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pengajuan Ditolak */}
      {pengajuanDecision === "ditolak" && (
        <div className="container mx-auto px-4 max-w-6xl mt-6 mb-8">
          <div className="rounded-xl border border-[#F0CFCF] bg-[#FFF6F6] p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
              <XCircle className="text-[#CD0300]" />
            </div>
            <p className="text-[15px] md:text-base font-semibold text-[#CD0300]">Pengajuan Ditolak</p>
            <p className="mt-1 text-[12px] text-[#6B6B6B]">
              Pengajuan Anda Ditolak karena Proposal belum ditandatangani pimpinan fakultas dan jadwal pelaksanaan tidak jelas.
              Silakan perbaiki sesuai catatan di atas dan ajukan kembali.
            </p>
            <div className="mt-4">
              <Link href="/" className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90">
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Akhir Section */}
      {pengajuanDecision === "disetujui" && !laporanSubmitted && (
        <div className="container mx-auto px-4 max-w-6xl mb-8" id="laporan-section">
          <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                <FileCheck size={14} className="text-[#3B3B3B]" />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">Laporan Akhir Kegiatan</p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">
              Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program dan mendapatkan Sertifikat
            </p>

            <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Nama P4S *</label>
                  <input 
                    name="namaP4s" 
                    value={laporanForm.namaP4s} 
                    onChange={handleLaporanChange} 
                    placeholder="Contoh : P4S Tani Makmur" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Kabupaten / Kota *</label>
                  <input 
                    name="kota" 
                    value={laporanForm.kota} 
                    onChange={handleLaporanChange} 
                    placeholder="Contoh : Kota Lumajang" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Jenis Kegiatan *</label>
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
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Asal Peserta / Mitra Kerjasama *</label>
                  <input 
                    name="asalPeserta" 
                    value={laporanForm.asalPeserta} 
                    onChange={handleLaporanChange} 
                    placeholder="Contoh : Universitas Jember" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Jumlah Peserta *</label>
                  <input 
                    name="jumlahPeserta" 
                    value={laporanForm.jumlahPeserta} 
                    onChange={handleLaporanChange} 
                    placeholder="Contoh : 1" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Tanggal Pelaksanaan *</label>
                  <input 
                    name="tanggalPelaksanaan" 
                    value={laporanForm.tanggalPelaksanaan} 
                    onChange={handleLaporanChange} 
                    type="date" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Lama Pelaksanaan *</label>
                  <input 
                    name="lamaPelaksanaan" 
                    value={laporanForm.lamaPelaksanaan} 
                    onChange={handleLaporanChange} 
                    placeholder="Contoh : 4 Bulan" 
                    className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" 
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Foto Kegiatan *</label>
                  <div className="rounded-lg border border-[#E8E2DB] bg-white p-3">
                    <p className="text-[11px] text-[#9A948E] mb-2">Format : Pdf, Image (Max : 10MB)</p>
                    <button 
                      type="button" 
                      onClick={handlePickFoto} 
                      className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"
                    >
                      {fotoKegiatan ? `Ganti File (${fotoKegiatan.name})` : "Upload Foto Kegiatan"}
                    </button>
                    <input 
                      ref={fotoInputRef} 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      className="hidden" 
                      onChange={handleFotoChange} 
                    />
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button 
                    onClick={handleSubmitLaporan} 
                    className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-4 py-2 text-[12px] hover:opacity-90"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sertifikat Section */}
      {laporanSubmitted && (
        <div className="container mx-auto px-4 max-w-6xl mb-8" id="sertifikat-section">
          <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-[#E8E2DB] shadow-sm bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Sertifikat Preview
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="mx-auto md:mx-0 mb-3 w-14 h-14 rounded-full border border-[#CBE6D7] bg-[#E9F7F0] flex items-center justify-center shadow-sm">
                  <span className="text-[#2F8A57] text-xl">🏅</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[#3B3B3B]">
                  Selamat, Program Pelatihan Kopi Anda telah selesai!
                </h3>
                <p className="mt-1 text-[12px] text-[#6B6B6B]">
                  Anda telah menyelesaikan program dan berhak mendapatkan sertifikat resmi dari Sekolah Kopi Raisa.
                </p>

                <div className="mt-4 justify-center flex flex-col md:flex-row items-center gap-3 md:gap-4">
                  <div className="rounded-md border border-[#CFEAD9] bg-[#F3FBF7] px-5 py-2 text-center shadow-sm">
                    <p className="text-[11px] text-[#2F8A57] font-semibold">Predikat</p>
                    <p className="text-[11px] text-[#2F8A57]">Sangat Memuaskan</p>
                  </div>
                  <div className="rounded-md justify-center border border-[#CFEAD9] bg-[#F3FBF7] px-5 py-2 text-center shadow-sm">
                    <p className="text-[11px] text-[#2F8A57] font-semibold">Jumlah Jam</p>
                    <p className="text-[11px] text-[#2F8A57]">896 Jam</p>
                  </div>
                </div>

                <div className="mt-4 justify-center flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]">
                    <Eye size={16} /> Preview Sertifikat
                  </button>
                  <button className="inline-flex justify-center items-center gap-1 rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90">
                    <Download size={16} /> Download Sertifikat PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-8 md:p-10 max-w-xl w-full shadow-lg relative text-center">
            <button 
              onClick={() => setSuccessOpen(false)} 
              className="absolute top-4 right-4 text-[#A99F99] hover:text-amber-700 text-xl"
            >
              ✕
            </button>
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#E8E2DB] bg-[#F7F4F0] flex items-center justify-center">
              <Check className="text-amber-700" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">Laporan Akhir Terkirim</h2>
            <p className="text-sm md:text-[15px] text-[#3B3B3B]">
              Laporan Anda sudah berhasil dikirim. Tim kami akan memverifikasi terlebih dahulu sebelum sertifikat tersedia.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Detail Pelaksanaan Pengajuan Undangan Narasumber. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}