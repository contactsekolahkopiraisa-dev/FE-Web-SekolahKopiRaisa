"use client";

import { useState } from "react";
import LaporanKeuanganTable from "@/components/laporan-keuangan/dummyLaporanKeuanganTable";

export default function LaporanKeuanganAdmin() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

  const handleView = (id: number) => {
    console.log("View detail untuk ID:", id);
    // Implementasi view detail
  };

  const bulanOptions = [
    { value: undefined, label: "Semua Bulan" },
    { value: 0, label: "Januari" },
    { value: 1, label: "Februari" },
    { value: 2, label: "Maret" },
    { value: 3, label: "April" },
    { value: 4, label: "Mei" },
    { value: 5, label: "Juni" },
    { value: 6, label: "Juli" },
    { value: 7, label: "Agustus" },
    { value: 8, label: "September" },
    { value: 9, label: "Oktober" },
    { value: 10, label: "November" },
    { value: 11, label: "Desember" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Keuangan</h1>
      
      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>

        <select
          value={selectedMonth ?? ""}
          onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : undefined)}
          className="px-4 py-2 border rounded-lg"
        >
          {bulanOptions.map((option) => (
            <option key={option.label} value={option.value ?? ""}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <LaporanKeuanganTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onView={handleView}
      />
    </div>
  );
}