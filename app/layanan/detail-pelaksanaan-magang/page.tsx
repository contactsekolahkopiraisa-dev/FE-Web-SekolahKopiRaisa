"use client";

import { Check, Download, Eye, FileText, Handshake, ClipboardList, FileCheck, Award, XCircle, Upload, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Footer from "../../../components/main/Footer";

export default function DetailPelaksanaanMagangPage() {
  const valueOrDash = (value?: string) => {
    if (typeof value !== "string") return "-";
    return value.trim() === "" ? "-" : value;
  };
  const infoKiri = [
    { label: "Jenis Kegiatan", value: "Magang" },
    { label: "Nama Peserta", value: "" },
    { label: "Instansi", value: "" },
  ];

  const infoKanan = [
    { label: "Tanggal Mulai", value: "" },
    { label: "Tanggal Selesai", value: "" },
    { label: "Kegiatan yang dipilih", value: "" },
  ];

  const dokumen = [
    { label: "Proposal / Surat Permohonan", file: "" },
    { label: "Surat Pengantar", file: "" },
  ];

  const steps = [
    { name: "Pengajuan", desc: "Menunggu Persetujuan", icon: FileText },
    { name: "MOU", desc: "Belum Terlaksana", icon: Handshake },
    { name: "Pelaksanaan", desc: "Belum Terlaksana", icon: ClipboardList },
    { name: "Laporan Akhir", desc: "Belum Terlaksana", icon: FileCheck },
    { name: "Sertifikat Kegiatan", desc: "Belum Terlaksana", icon: Award },
  ];

  const [pengajuanDecision, setPengajuanDecision] = useState<"menunggu" | "disetujui" | "ditolak">("menunggu");
  const [mouDecision, setMouDecision] = useState<"menunggu" | "disetujui" | "ditolak">("menunggu");
  const [pelaksanaanDecision, setPelaksanaanDecision] = useState<"menunggu" | "berjalan" | "selesai">("menunggu");
  const [laporanDecision, setLaporanDecision] = useState<"menunggu" | "disetujui" | "ditolak">("menunggu");
  const [sertifikatDecision, setSertifikatDecision] = useState<"menunggu" | "selesai" | "ditolak">("menunggu");

  const [mouFile, setMouFile] = useState<File | null>(null);
  const mouInputRef = useRef<HTMLInputElement | null>(null);
  const handlePickMou = () => mouInputRef.current?.click();
  const handleMouChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setMouFile(file);
  };
  const handleSubmitMou = async () => {
    if (!mouFile) {
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        title: "Pilih File MOU",
        text: "Silakan pilih file MOU terlebih dahulu sebelum mengunggah.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Pilih File",
        cancelButtonText: "Batal",
        reverseButtons: true,
        customClass: {
          confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          cancelButton: "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
          popup: "rounded-xl"
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handlePickMou();
        }
      });
      return;
    }
    
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Yakin Mengirimkan MOU?",
      text: "Pastikan file MOU yang Anda unggah sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Submit",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        cancelButton: "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
        popup: "rounded-xl"
      },
      buttonsStyling: false,
    });
    
    if (result.isConfirmed) {
      await Swal.fire({
        title: "MOU berhasil dikirim",
        text: "Silahkan tunggu persetujuan dari admin.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
          popup: "rounded-xl"
        },
        buttonsStyling: false,
      });
    }
  };

  const [pelaksanaanAgree, setPelaksanaanAgree] = useState<boolean>(false);
  const pelaksanaanModules = [
    { id: 1, title: "Modul 1 : Pengenalan Kopi", desc: "pengetahuan dasar tentang kopi, sejarah kopi" },
    { id: 2, title: "Modul 2 : Proses Roasting", desc: "dasar-dasar roasting dan profil rasa" },
    { id: 3, title: "Modul 3 : Brewing", desc: "metode seduh dan teknik ekstraksi" },
    { id: 4, title: "Modul 4 : Cupping", desc: "evaluasi citarasa dan aroma kopi" },
  ];

  const [laporanForm, setLaporanForm] = useState({
    namaP4s: "",
    kota: "",
    jenisKegiatan: "magang",
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
  const [submitting, setSubmitting] = useState(false);
  const [laporanSubmitted, setLaporanSubmitted] = useState(false);
  const scrollToSertifikat = () => {
    if (typeof window !== "undefined") {
      document.getElementById("sertifikat-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToLaporan = () => {
    if (typeof window !== "undefined") {
      document.getElementById("laporan-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSubmitLaporan = async () => {
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Yakin Mengirimkan Laporan Akhir ?",
      text: "Apakah Anda yakin ingin mengirimkan laporan akhir kegiatan ini? Pastikan semua data sudah lengkap dan benar untuk dapat mengunduh sertifikat.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Submit",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
        cancelButton: "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
        popup: "rounded-xl"
      },
      buttonsStyling: false,
    });
    if (!result.isConfirmed) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSuccessOpen(true);
    setLaporanSubmitted(true);
    setLaporanDecision("menunggu" as typeof laporanDecision);
  };

  const pengajuanDecisionText: Record<typeof pengajuanDecision, string> = {
    menunggu: "Menunggu Persetujuan",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  const decisionTextMap = {
    menunggu: "Belum Terlaksana",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
    berjalan: "Sedang Berjalan",
    selesai: "Selesai",
  } as const;

  const stepStatuses: Array<"menunggu" | "disetujui" | "ditolak" | "berjalan" | "selesai"> = [
    pengajuanDecision,
    mouDecision,
    pelaksanaanDecision,
    laporanDecision,
    sertifikatDecision,
  ];

  useEffect(() => {
    if (laporanDecision === "disetujui") {
      setSertifikatDecision("selesai" as typeof sertifikatDecision);
    } else if (sertifikatDecision !== "ditolak") {
      setSertifikatDecision("menunggu" as typeof sertifikatDecision);
    }
  }, [laporanDecision]);

  return (
    <>
      <div className="min-h-screen bg-tertiary pt-24 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl py-10">
          <div className="mb-4">
            <Link href="/layanan" className="text-sm text-amber-800 hover:underline">
              ← Kembali ke Layanan
            </Link>
          </div>
          {/* Decision Test controls removed */}
          <h1 className="text-center text-2xl md:text-[22px] font-semibold text-[#3B3B3B]">
            Detail Pelaksanaan Magang
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg border border-[#E8E2DB] flex items-center justify-center">
                  <Check className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3B3B3B]">Progres Kegiatan</p>
                  <p className="text-[12px] text-[#6B6B6B]">Pantau Status Pelaksanaan Kegiatan Anda</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const firstNonApprovedIndex = stepStatuses.findIndex((st) => st !== "disetujui" && st !== "selesai");
                  const activeStepIndex = firstNonApprovedIndex === -1 ? stepStatuses.length : firstNonApprovedIndex;
                  const isActive = idx === activeStepIndex;
                  const isCompleted = idx < activeStepIndex && (stepStatuses[idx] === "disetujui" || stepStatuses[idx] === "selesai");
                  const status = stepStatuses[idx];
                  const containerClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#EAF8F0] border-[#D2EBDD]"
                      : status === "ditolak"
                      ? "bg-[#FBECEC] border-[#F0C3C3]"
                      : "bg-[#EDE6DF] border-[#E0D8D1]"
                    : isCompleted
                    ? "bg-[#F3FBF7] border-[#CFEAD9]"
                    : "bg-white border-[#EFEAE4]";

                  const iconWrapClass = isActive
                    ? status === "disetujui"
                      ? "bg-[#E2F3EA] border-[#CBE6D7]"
                      : status === "ditolak"
                      ? "bg-[#FCECEC] border-[#F0C3C3]"
                      : "bg-[#DCD3CB] border-[#CFC6BE]"
                    : isCompleted
                    ? "bg-[#E9F7F0] border-[#CBE6D7]"
                    : "bg-[#F4F0EC] border-[#E8E2DB]";

                  const iconColorClass = isActive
                    ? status === "disetujui"
                      ? "text-[#2F8A57]"
                      : status === "ditolak"
                      ? "text-[#CD0300]"
                      : "text-[#3B3B3B]"
                    : isCompleted
                    ? "text-[#2F8A57]"
                    : "text-[#6B6B6B]";

                  const descColorClass = stepStatuses[idx] === "disetujui" || stepStatuses[idx] === "selesai"
                    ? "text-[#2F8A57]"
                    : stepStatuses[idx] === "ditolak"
                    ? "text-[#CD0300]"
                    : stepStatuses[idx] === "berjalan"
                    ? "text-[#3B3B3B]"
                    : "text-[#6B6B6B]";

                  return (
                    <div key={s.name} className={`rounded-lg border text-left p-3 ${containerClass}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconWrapClass}`}>
                          <Icon className={iconColorClass} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#3B3B3B]">{s.name}</p>
                          <p className={`text-[12px] ${descColorClass}`}>{s.name === "Pengajuan" ? pengajuanDecisionText[pengajuanDecision] : decisionTextMap[stepStatuses[idx]]}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-[#E8E2DB] bg-white p-4 md:p-6">
              <p className="text-[15px] md:text-base font-semibold text-[#3B3B3B]">Ringkasan Pengajuan & Dokumen</p>
              <p className="text-[12px] text-[#6B6B6B] mb-4">Detail informasi dan Dokumen yang telah anda Submit</p>

              <div className="rounded-lg bg-[#F7F4F0] border border-[#E8E2DB] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {infoKiri.map((it) => (
                      <div key={it.label}>
                        <p className="text-sm font-semibold text-[#3B3B3B]">{it.label}</p>
                        <p className="text-[12px] text-[#6B6B6B]">{valueOrDash(it.value)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {infoKanan.map((it) => (
                      <div key={it.label}>
                        <p className="text-sm font-semibold text-[#3B3B3B]">{it.label}</p>
                        <p className="text-[12px] text-[#6B6B6B]">{valueOrDash(it.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-semibold text-[#3B3B3B]">Dokumen yang diupload</p>
              <div className="mt-3 space-y-3">
                {dokumen.filter((d) => !!(d.file && d.file.trim() !== "")).map((d) => (
                  <div key={d.label} className="flex items-center justify-between rounded-lg border border-[#E8E2DB] bg-white p-3">
                    <div>
                      <p className="text-sm font-semibold text-[#3B3B3B]">{d.label}</p>
                      <p className="text-[12px] text-[#6B6B6B]">{d.file}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"><Eye size={16} /> Lihat</button>
                      <button className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-2 text-[12px] hover:opacity-90"><Download size={16} /> Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <Link href="/" className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90">Kembali Ke Beranda</Link>
            </div>
          </div>
        </div>
      )}

      {pengajuanDecision === "disetujui" && mouDecision !== ("disetujui" as typeof mouDecision) && (
        <div className="container mx-auto px-4 max-w-6xl mb-8">
          <div className={`rounded-xl border bg-white p-5 md:p-6 transition-shadow ${
              mouDecision === "ditolak" ? "border-[#F0CFCF] hover:shadow-md" : "border-[#CFEAD9] hover:shadow-md"
            }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  mouDecision === "ditolak" ? "border-[#F0C3C3] bg-[#FBECEC]" : "border-[#CBE6D7] bg-[#E9F7F0]"
                }`}>
                <Handshake size={14} className={mouDecision === "ditolak" ? "text-[#CD0300]" : "text-[#2F8A57]"} />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">Memorandum Of Understanding</p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">Pengajuan anda telah disetujui. Silahkan download template MOU dan upload kembali setelah ditandatangani.</p>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-[#E8E2DB] bg-[#F7F4F0] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-[#3B3B3B]" />
                  <p className="text-sm font-semibold text-[#3B3B3B]">Panduan Pengisian</p>
                </div>
                <ol className="list-decimal pl-5 text-[12px] text-[#6B6B6B] space-y-1">
                  <li>Unduh Template MOU sesuai dengan detail pengajuan anda.</li>
                  <li>Isi data yang diperlukan sesuai petunjuk pada berkas.</li>
                  <li>Tanda tangani berkas oleh pihak terkait yang berwenang.</li>
                  <li>Scan dokumen ke format PDF/JPG/DOCX (max 10MB).</li>
                  <li>Unggah berkas yang telah ditandatangani pada bagian Upload MOU.</li>
                </ol>
              </div>

              {mouDecision === "ditolak" && (
                <div className="rounded-lg border border-[#F0CFCF] bg-[#FFF6F6] p-4">
                  <p className="text-sm font-semibold text-[#CD0300] mb-1">Catatan Penolakan</p>
                  <ul className="list-disc pl-5 text-[12px] text-[#6B6B6B] space-y-1">
                    <li>MoU belum ditandatangani oleh pihak yang berwenang.</li>
                    <li>Format/isi MoU tidak sesuai template yang disediakan.</li>
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-[#E8E2DB] bg-white p-4">
                <p className="text-sm font-semibold text-[#3B3B3B] mb-2">Download Template MOU</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-2 text-[12px] hover:opacity-90"><Download size={16} /> Download Template MOU</button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"><Eye size={16} /> Preview MOU</button>
                </div>
              </div>

              {mouDecision === "ditolak" && (
                <div className="rounded-lg border border-[#F0CFCF] bg-[#FFF6F6] p-4 text-center">
                  <div className="mx-auto mb-2 w-10 h-10 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
                    <XCircle className="text-[#CD0300]" />
                  </div>
                  <p className="text-sm font-semibold text-[#CD0300]">MoU Ditolak</p>
                  <p className="mt-1 text-[12px] text-[#6B6B6B]">MoU yang Anda unggah ditolak. Pastikan format dan isi MoU telah sesuai ketentuan, serta ditandatangani pihak terkait.</p>
                </div>
              )}

              <div className="rounded-lg border border-[#E8E2DB] bg-white p-4">
                <p className="text-sm font-semibold text-[#3B3B3B]">Upload MOU</p>
                <p className="text-[12px] text-[#6B6B6B] mb-3">Unggah Dokumen MOU yang sudah dilengkapi sesuai dengan pengajuan layanan yang dipilih</p>

                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#B9B1A9] bg-[#F3EFEB] p-6 cursor-pointer" onClick={handlePickMou}>
                  <Upload className="text-[#6B6B6B]" />
                  <p className="text-[12px] text-[#6B6B6B]">{mouFile ? mouFile.name : "Klik untuk Upload MOU"}</p>
                  {!mouFile && (<p className="text-[11px] text-[#9A948E]">Format: .pdf, .doc, .docx (Max: 10MB)</p>)}
                  <input ref={mouInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleMouChange} />
                </div>

                <div className="mt-3 justify-center flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90" onClick={handleSubmitMou}>Submit MOU</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mouDecision === "disetujui" && pelaksanaanDecision !== ("selesai" as typeof pelaksanaanDecision) && (
        <div className="container mx-auto px-4 max-w-6xl mb-8">
          <div className={`rounded-xl border bg-white p-5 md:p-6 ${
            pelaksanaanDecision === "selesai" ? "border-[#17cd59] hover:shadow-md transition-shadow" : "border-[#E8E2DB]"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                <ClipboardList size={14} className="text-[#3B3B3B]" />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">Modul Pembelajaran Program</p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">Akses semua materi pada modul pembelajaran pada layanan yang dipilih</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pelaksanaanModules.map((m) => (
                <div key={m.id} className="rounded-lg border border-[#E8E2DB] bg-white p-3 flex gap-3">
                  <div className="w-20 h-20 rounded-md bg-[#F3EFEB] border border-dashed border-[#B9B1A9]" />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#3B3B3B]">{m.title}</p>
                    <p className="text-[12px] text-[#675e5e]">{m.desc}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-1.5 text-[12px] hover:opacity-90">Akses Modul</button>
                      <button className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]">Download Pdf</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-5 rounded-xl border p-6 text-center ${
              pelaksanaanDecision === "selesai" ? "border-[#CFEAD9] bg-[#F3FBF7]" : "border-[#E8E2DB] bg-[#F8F6F3]"
            }`}>
              <div className={`mx-auto mb-2 w-10 h-10 rounded-lg border bg-white flex items-center justify-center ${
                pelaksanaanDecision === "selesai" ? "border-[#CBE6D7]" : "border-[#E8E2DB]"
              }`}>
                <Check className={pelaksanaanDecision === "selesai" ? "text-[#2F8A57]" : "text-primary"} />
              </div>
              <p className={`text-sm font-semibold ${pelaksanaanDecision === "selesai" ? "text-[#2F8A57]" : "text-[#3B3B3B]"}`}>Selesaikan Program</p>
              <p className="mt-1 text-[12px] text-[#6B6B6B]">Setelah menyelesaikan semua kegiatan silahkan klik tombol dibawah untuk menyelesaikan program dan dapat mengajukan sertifikat</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <label className="inline-flex items-center gap-2 text-[12px] text-[#3B3B3B]">
                  <input type="checkbox" className="accent-primary" checked={pelaksanaanAgree} onChange={(e) => setPelaksanaanAgree(e.target.checked)} />
                  Saya telah menyelesaikan kegiatan
                </label>
                <button
                  className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90 disabled:opacity-40"
                  disabled={!pelaksanaanAgree}
                  onClick={async () => {
                    const Swal = (await import("sweetalert2")).default;
                    const result = await Swal.fire({
                      title: "Konfirmasi Selesaikan Program",
                      text: "Apakah Anda yakin telah menyelesaikan semua kegiatan program Magang?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Ya, Selesaikan",
                      cancelButtonText: "Batal",
                      reverseButtons: true,
                      customClass: {
                        confirmButton: "swal2-confirm bg-[#5C3A1E] text-white px-6 py-2 rounded-lg",
                        cancelButton: "swal2-cancel border border-[#E8E2DB] text-[#3B3B3B] px-6 py-2 rounded-lg",
                        popup: "rounded-xl"
                      },
                      buttonsStyling: false,
                    });
                    if (result.isConfirmed) {
                      setPelaksanaanDecision("selesai");
                    }
                  }}
                >
                  Selesaikan Kegiatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pelaksanaanDecision === "selesai" && laporanDecision !== ("disetujui" as typeof laporanDecision) && (
        <div className="container mx-auto px-4 max-w-6xl mb-8" id="laporan-section">
          <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full border border-[#E8E2DB] flex items-center justify-center">
                <FileCheck size={14} className="text-[#3B3B3B]" />
              </span>
              <p className="text-sm font-semibold text-[#3B3B3B]">Laporan Akhir Kegiatan</p>
            </div>
            <p className="text-[12px] text-[#6B6B6B] mb-4">Lengkapi Formulir Laporan Akhir untuk Menyelesaikan Program dan mendapatkan Sertifikat</p>

            <div className="rounded-lg border border-[#F0EAE3] bg-[#FBF9F7] p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Nama P4S *</label>
                  <input name="namaP4s" value={laporanForm.namaP4s} onChange={handleLaporanChange} placeholder="Contoh : P4S Tani Makmur" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Kabupaten / Kota *</label>
                  <input name="kota" value={laporanForm.kota} onChange={handleLaporanChange} placeholder="Contoh : Kota Lumajang" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Jenis Kegiatan *</label>
                  <select name="jenisKegiatan" value={laporanForm.jenisKegiatan} onChange={handleLaporanChange} className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]">
                    <option value="">Pilih Jenis Kegiatan</option>
                    <option value="pkl">PKL</option>
                    <option value="magang">Magang</option>
                    <option value="pelatihan">Pelatihan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Asal Peserta / Mitra Kerjasama *</label>
                  <input name="asalPeserta" value={laporanForm.asalPeserta} onChange={handleLaporanChange} placeholder="Contoh : Universitas Jember" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Jumlah Peserta *</label>
                  <input name="jumlahPeserta" value={laporanForm.jumlahPeserta} onChange={handleLaporanChange} placeholder="Contoh : 1" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Tanggal Pelaksanaan *</label>
                  <input name="tanggalPelaksanaan" value={laporanForm.tanggalPelaksanaan} onChange={handleLaporanChange} type="date" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Lama Pelaksanaan *</label>
                  <input name="lamaPelaksanaan" value={laporanForm.lamaPelaksanaan} onChange={handleLaporanChange} placeholder="Contoh : 4 Bulan" className="w-full rounded-lg border border-[#E8E2DB] bg-white px-3 py-2 text-[12px] text-[#3B3B3B]" />
                </div>

                <div>
                  <label className="block text-[12px] text-[#3B3B3B] mb-1">Foto Kegiatan *</label>
                  <div className="rounded-lg border border-[#E8E2DB] bg-white p-3">
                    <p className="text-[11px] text-[#9A948E] mb-2">Format : Pdf, Image (Max : 10MB)</p>
                    <button type="button" onClick={handlePickFoto} className="inline-flex items-center rounded-lg border border-[#E8E2DB] px-3 py-1.5 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]">
                      {fotoKegiatan ? `Ganti File (${fotoKegiatan.name})` : "Upload Foto Kegiatan"}
                    </button>
                    <input ref={fotoInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFotoChange} />
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button onClick={handleSubmitLaporan} className="inline-flex items-center rounded-lg bg-[#5C3A1E] text-white px-4 py-2 text-[12px] hover:opacity-90">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl mb-8" id="sertifikat-section">
        <div className="rounded-xl border border-[#E8E2DB] bg-white p-5 md:p-6">
          {laporanSubmitted && laporanDecision === "menunggu" && (
            <div className="rounded-xl border border-[#CFEAD9] bg-[#F3FBF7] p-6 text-center">
              <div className="mx-auto mb-2 w-10 h-10 rounded-lg border border-[#CBE6D7] bg-white flex items-center justify-center">
                <Check className="text-[#2F8A57]" />
              </div>
              <p className="text-sm font-semibold text-[#2F8A57]">Selesaikan Program</p>
              <p className="mt-1 text-[12px] text-[#6B6B6B]">Setelah menyelesaikan semua kegiatan silahkan klik tombol dibawah untuk menyelesaikan program dan dapat mengunduh sertifikat</p>
              <div className="mt-3 flex items-center justify-center">
                <button onClick={() => setLaporanDecision("disetujui" as typeof laporanDecision)} className="inline-flex items-center rounded-lg bg-[#2F8A57] text-white px-3 py-2 text-[12px] hover:opacity-90">Lanjut ke Sertifikat</button>
              </div>
            </div>
          )}
          {laporanSubmitted && laporanDecision === "ditolak" && (
            <div className="rounded-lg border border-[#F0CFCF] bg-[#FFF6F6] p-4 text-center">
              <div className="mx-auto mb-2 w-10 h-10 rounded-lg border border-[#F0C3C3] bg-[#FBECEC] flex items-center justify-center">
                <XCircle className="text-[#CD0300]" />
              </div>
              <p className="text-sm font-semibold text-[#CD0300]">Laporan Ditolak</p>
              <p className="mt-1 text-[12px] text-[#6B6B6B]">Silakan perbaiki laporan sesuai catatan verifikator, kemudian kirim ulang.</p>
              <div className="mt-3">
                <button onClick={() => { setLaporanDecision("menunggu" as typeof laporanDecision); scrollToLaporan(); }} className="inline-flex items-center rounded-lg bg-[#CD0300] text-white px-4 py-2 text-[12px] hover:opacity-90">Kembali ke Laporan Akhir</button>
              </div>
            </div>
          )}
          {laporanSubmitted && laporanDecision === "disetujui" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-[#E8E2DB] shadow-sm">
                <Image src="/assets/product.png" alt="Preview Sertifikat" fill className="object-cover" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 border border-[#E8E2DB] px-3 py-1 text-[11px] text-[#3B3B3B] shadow-xs">Sertifikat Preview</div>
              </div>
              <div className="text-center md:text-left">
                <div className="mx-auto md:mx-0 mb-3 w-14 h-14 rounded-full border border-[#CBE6D7] bg-[#E9F7F0] flex items-center justify-center shadow-sm">
                  <span className="text-[#2F8A57] text-xl">🏅</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[#3B3B3B]">Selamat, Program Magang Anda telah selesai!</h3>
                <p className="mt-1 text-[12px] text-[#6B6B6B]">Anda telah menyelesaikan program dan berhak mendapatkan sertifikat resmi dari Sekolah Kopi Raisa.</p>

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
                  <button className="inline-flex items-center gap-1 rounded-lg border border-[#E8E2DB] px-3 py-2 text-[12px] text-[#3B3B3B] hover:bg-[#F5EFE8]"><Eye size={16} /> Preview Sertifikat</button>
                  <button className="inline-flex justify-center items-center gap-1 rounded-lg bg-[#5C3A1E] text-white px-3 py-2 text-[12px] hover:opacity-90"><Download size={16} /> Download Sertifikat PDF</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 md:p-10 max-w-xl w-full shadow-lg relative mx-4 text-center">
            <button onClick={() => setSuccessOpen(false)} className="absolute top-4 right-4 text-[#A99F99] hover:text-primary text-xl">✕</button>
            <div className="mx-auto mb-3 w-12 h-12 rounded-lg border border-[#E8E2DB] bg-[#F7F4F0] flex items-center justify-center">
              <Check className="text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">Laporan Akhir Terkirim</h2>
            <p className="text-sm md:text-[15px] text-[#3B3B3B]">Laporan Anda sudah berhasil dikirim. Tim kami akan memverifikasi terlebih dahulu sebelum sertifikat tersedia.</p>
          </div>
        </div>
      )}


      <Footer />
    </>
  );
}


