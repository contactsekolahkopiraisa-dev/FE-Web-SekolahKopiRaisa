"use client";
import { useState } from "react";
import {
  UMKM,
  dummyUMKM,
} from "../../../lib/dummyUMKM";

export default function UmkmAdmin() {

    const [data] = useState<UMKM[]>(dummyUMKM);

    const handleApprove = (id: number) => {
        console.log("Menyetujui UMKM dengan ID:", id);
        // Implementasi logika persetujuan
    };

    const handleReject = (id: number) => {
        console.log("Menolak UMKM dengan ID:", id);
        // Implementasi logika penolakan
    };

    return (
        <>
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
                                className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                                title="View"
                            >
                                Setuju
                            </button>
                            <button
                                onClick={() => handleReject(item.id)}
                                className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                                title="View"
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
    )
}