"use client";

import { PencilIcon } from "lucide-react";
import { useState } from "react";
import {
  LaporanKeuangan,
  dummyLaporanKeuangan,
  getRingkasanKeuangan,
} from "../../lib/dummyLaporanKeuangan";

interface LaporanKeuanganTableProps {
  selectedYear?: number;
  selectedMonth?: number;
  onView: (id: number) => void;
}

export default function LaporanKeuanganTable({
  selectedYear,
  selectedMonth,
  onView,
}: LaporanKeuanganTableProps) {
  // Mendapatkan data yang sudah difilter dan ringkasan
  const { data: filteredData, totalPemasukan, totalPengeluaran, saldoAkhir } = 
    getRingkasanKeuangan(dummyLaporanKeuangan, selectedYear, selectedMonth);

  // Format currency untuk tampilan
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Card Ringkasan Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary border-2 border-secondary rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-primary mb-1">
            Total Pemasukan
          </h3>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(totalPemasukan)}
          </p>
        </div>

        <div className="bg-secondary border-2 border-secondary rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-primary mb-1">
            Total Pengeluaran
          </h3>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(totalPengeluaran)}
          </p>
        </div>

        <div className="bg-secondary border-2 border-secondary rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-primary mb-1">
            Saldo Akhir
          </h3>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(saldoAkhir)}
          </p>
        </div>
      </div>

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
                  Tanggal
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Keterangan
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Pemasukan
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Pengeluaran
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.keterangan}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                      {formatCurrency(item.pemasukan)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                      {formatCurrency(item.pengeluaran)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => onView(item.id)}
                        className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                        title="View"
                      >
                        <PencilIcon size={18} />
                      </button>
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
    </div>
  );
}