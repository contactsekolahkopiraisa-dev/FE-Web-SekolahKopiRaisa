// app/admin/laporan-keuangan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import CalendarPicker from "@/components/CalenderPickerFilter";
import Link from "next/link";
import LaporanKeuanganTable from "@/components/laporan-keuangan/LaporanKeuanganTable";
import { fetchAllLaporanKeuangan } from "@/app/utils/laporan-keuangan";

export default function LaporanKeuanganAdmin() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [laporanData, setLaporanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth(); // 0-11

  // 🧠 Fetch data laporan keuangan dari API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllLaporanKeuangan();

        console.log("Data dari API:", result);

        // API mengembalikan struktur: { status: "success", data: [...] }
        let dataArray = [];

        if (
          result &&
          result.status === "success" &&
          Array.isArray(result.data)
        ) {
          dataArray = result.data;
          console.log("Jumlah data:", dataArray.length);
        } else if (Array.isArray(result)) {
          dataArray = result;
        } else if (result && Array.isArray(result.data)) {
          dataArray = result.data;
        } else {
          console.error("Format response tidak dikenali:", result);
          dataArray = [];
        }

        setLaporanData(dataArray);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Gagal memuat data laporan keuangan");
        setLaporanData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 📆 Tutup kalender jika klik di luar
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

  // 🗓️ Teks tampilan periode
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

  // 🔗 Aksi saat tombol Edit diklik
  const handleView = (id: number) => {
    window.location.href = `/admin/laporan-keuangan/edit/${id}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Keuangan</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Periode */}
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

        {/* Tombol Tambah */}
        <div>
          <Link href={"/admin/laporan-keuangan/create"}>
            <button className="mb-4 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus />
              <p>Tambah Baris</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Status Loading / Error */}
      {loading ? (
        <p className="text-gray-500 mt-4">Memuat data...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        // ✅ Pass data dari parent ke child component
        <LaporanKeuanganTable
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onView={handleView}
          dataSource={laporanData}
        />
      )}
    </div>
  );
}
