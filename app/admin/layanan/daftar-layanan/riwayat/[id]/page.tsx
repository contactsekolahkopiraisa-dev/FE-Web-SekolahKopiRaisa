"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Check, ChevronLeft, X, XCircle } from "lucide-react";

export default function DetailKegiatanAdminPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Simple mock status based on id: some ids are rejected
  const rejectedIds = new Set(["3", "5"]);
  const status: "selesai" | "ditolak" = rejectedIds.has(String(id))
    ? "ditolak"
    : "selesai";

  return (
    <div className="min-h-screen bg-tertiary">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <button 
          onClick={() => history.back()}
          className="mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={18} />
          Kembali ke halaman
        </button>

        <h1 className="text-2xl font-bold text-center">Detail Kegiatan</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Ringkasan kegiatan yang diikuti peserta di Sekolah Kopi Raisa
        </p>

        {/* Status + Tanggal Pengajuan */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Status Pengajuan</p>
            {status === "selesai" ? (
              <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50">
                <Check size={14} /> Selesai
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border border-rose-200 text-rose-700 bg-rose-50">
                <XCircle size={14} /> Ditolak
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Tanggal Pengajuan</p>
            <p className="text-sm mt-2">15/10/2025</p>
          </div>
        </div>

        {/* Informasi Peserta & Kegiatan */}
        <div className="mt-4 bg-white rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div>
              <p className="text-xs text-gray-500">Nama Peserta</p>
              <p className="text-sm mt-1">Hanin Zahirah Syabrani</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Jenis Kegiatan</p>
              <p className="text-sm mt-1">Praktek Kerja Lapangan</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tanggal Mulai</p>
              <p className="text-sm mt-1">01/09/2025</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tanggal Selesai</p>
              <p className="text-sm mt-1">01/02/2026</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Instansi</p>
              <p className="text-sm mt-1">Universitas Jember</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Kegiatan yang dipilih</p>
              <p className="text-sm mt-1">Persiapan Lahan, Penanaman</p>
            </div>
          </div>
        </div>

        {/* Dokumen yang diupload */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-3">Dokumen yang diupload</p>
          <div className="space-y-3">
            {[
              { label: "Proposal / Surat Permohonan", file: "Proposal.pdf" },
              { label: "Surat Pengantar", file: "SuratPengantar.pdf" },
              { label: "MOU", file: "MOU.pdf" },
            ].map((doc) => (
              <div key={doc.label} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium">{doc.label}</p>
                    <p className="text-xs text-gray-500">{doc.file}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50">
                    Lihat
                  </button>
                  <button className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link Logbook */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-3">Link Logbook</p>
          <div className="bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <input
                className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm"
                defaultValue="https://drive.google.Logbook-HaninZahirah"
                readOnly
              />
              <button className="px-4 py-2 text-sm rounded-lg bg-amber-900 text-white hover:bg-amber-950 whitespace-nowrap">
                Buka Link
              </button>
            </div>
          </div>
        </div>

        {/* Sertifikat Peserta */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-3">Sertifikat Peserta</p>
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-gray-100" />
              <div>
                <p className="text-sm font-medium">MOU</p>
                <p className="text-xs text-gray-500">Surat Pengantar.pdf</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50">
                Lihat
              </button>
              <button className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Rejection Notice */}
        {status === "ditolak" && (
          <div className="mt-6 bg-white rounded-xl border border-rose-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full border-2 border-rose-500 grid place-items-center mb-3">
                <X className="text-rose-600" size={20} />
              </div>
              <p className="font-semibold text-rose-700">Pengajuan Ditolak</p>
              <p className="text-sm text-gray-600 mt-2 max-w-3xl">
                Pengajuan Anda ditolak karena pada bulan ini tidak bisa dilakukan pelatihan pasca panen
                karena bulan tidak sesuai.
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">ID Pengajuan: {String(id)}</p>
      </div>
    </div>
  );
}


