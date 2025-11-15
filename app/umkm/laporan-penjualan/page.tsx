//app/admin/laporan-keuangan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import LaporanKeuanganTable from "@/components/laporan-keuangan/LaporanKeuanganTable";
import {
  dummyLaporanKeuangan,
  getRingkasanKeuangan,
} from "@/lib/dummyLaporanKeuangan";
import { Calendar, Plus } from "lucide-react";
import CalendarPicker from "@/components/CalenderPickerFilter";
import Link from "next/link";

export default function LaporanKeuanganAdmin() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2025, 8)
  ); // September 2025
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth();

  const {
    data: filteredData,
    totalPemasukan,
    totalPengeluaran,
    saldoAkhir,
  } = getRingkasanKeuangan(dummyLaporanKeuangan, selectedYear, selectedMonth);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDisplayText = () => {
    if (!selectedDate) return "Pilih Periode";
    const bulanNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${
      bulanNames[selectedDate.getMonth()]
    } ${selectedDate.getFullYear()}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Keuangan</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter dengan Date Picker */}
        <div className="mb-6 relative" ref={calendarRef}>
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:border-gray-400 transition-colors bg-white"
          >
            <Calendar size={18} className="text-gray-600" />
            <span className="text-gray-700">{getDisplayText()}</span>
          </button>

          {isCalendarOpen && (
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onClose={() => setIsCalendarOpen(false)}
            />
          )}
        </div>

        <div>
          <Link href={"/admin/laporan-keuangan/create"}>
            <button className="mb-4 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus></Plus>
              <p className="">Tambah Baris</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Card Ringkasan Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <h3 className="text-sm font-medium text-primary mb-1">Saldo Akhir</h3>
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
                      <Link href={`/admin/laporan-keuangan/edit/${item.id}`}>
                        <button
                          className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                      </Link>
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
