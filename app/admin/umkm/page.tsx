"use client";
import { useState } from "react";
import {
  UMKM,
  dummyUMKM,
} from "../../../lib/dummyUMKM";
import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";

export default function UmkmAdmin() {
    const [data, setData] = useState<UMKM[]>(dummyUMKM);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

    const handleApprove = (id: number) => {
        setSelectedId(id);
        setActionType("approve");
        setShowConfirmModal(true);
    };

    const handleReject = (id: number) => {
        setSelectedId(id);
        setActionType("reject");
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (!selectedId || !actionType) return;

        setIsSubmitting(true);

        try {
        // Simulasi API call dengan delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (actionType === "approve") {
            console.log("Menyetujui UMKM dengan ID:", selectedId);
            
            // Update data dummy - hapus dari list setelah disetujui
            setData((prev) => prev.filter((item) => item.id !== selectedId));

            // Tutup modal konfirmasi
            setShowConfirmModal(false);

            // Tampilkan popup sukses
            setMessage("Berhasil Disetujui! UMKM berhasil disetujui dan ditambahkan ke daftar.");
            setPopupType("success");
            setShowPopup(true);
        } else if (actionType === "reject") {
            console.log("Menolak UMKM dengan ID:", selectedId);
            
            // Update data dummy - hapus dari list setelah ditolak
            setData((prev) => prev.filter((item) => item.id !== selectedId));

            // Tutup modal konfirmasi
            setShowConfirmModal(false);

            // Tampilkan popup sukses
            setMessage("UMKM Ditolak! UMKM telah ditolak dan dihapus dari daftar.");
            setPopupType("success");
            setShowPopup(true);
        }

        // Reset state
        setTimeout(() => {
            setShowPopup(false);
            setSelectedId(null);
            setActionType(null);
            setIsSubmitting(false);
        }, 2000);
        } catch (error) {
        console.error("Error:", error);
        setShowConfirmModal(false);
        setMessage("Terjadi kesalahan saat memproses UMKM.");
        setPopupType("error");
        setShowPopup(true);
        setIsSubmitting(false);
        }
    };

    const getModalTitle = () => {
        if (actionType === "approve") return "Setujui UMKM";
        if (actionType === "reject") return "Tolak UMKM";
        return "";
    };

    const getModalDescription = () => {
        const umkmName = data.find((item) => item.id === selectedId)?.namaUmkm;
        if (actionType === "approve") {
        return `Apakah Anda yakin ingin menyetujui UMKM "${umkmName}"? UMKM ini akan ditambahkan ke daftar yang disetujui.`;
        }
        if (actionType === "reject") {
        return `Apakah Anda yakin ingin menolak UMKM "${umkmName}"? UMKM ini akan dihapus dari daftar pengajuan.`;
        }
        return "";
    };

    return (
        <>
        {showPopup && (
            <Popup
            message={message}
            type={popupType}
            onClose={() => setShowPopup(false)}
            />
        )}
        
        <ConfirmModal
            title={getModalTitle()}
            description={getModalDescription()}
            isOpen={showConfirmModal}
            isSubmitting={isSubmitting}
            onClose={() => {
            setShowConfirmModal(false);
            setSelectedId(null);
            setActionType(null);
            }}
            onConfirm={handleConfirm}
        />

        {/* Tabel Data */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-primary text-white">
                <tr>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    No
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Nama UMKM
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    KTP
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Sertifikat Halal
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Alamat
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">

                    </th>
                </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-200">
                {data.length > 0 ? (
                    data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        {index + 1}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        {item.namaUmkm}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        {item.ktp}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                        {item.sertifikatHalal}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                        {item.alamat}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2 justify-center">
                            <button
                            onClick={() => handleApprove(item.id)}
                            disabled={isSubmitting}
                            className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Setuju"
                            >
                            Setuju
                            </button>
                            <button
                            onClick={() => handleReject(item.id)}
                            disabled={isSubmitting}
                            className="cursor-pointer p-2 text-white rounded-xl bg-red-600 hover:-translate-y-1 duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Tolak"
                            >
                            Tolak
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                    >
                        Tidak ada data untuk periode yang dipilih
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        </>
    );
}