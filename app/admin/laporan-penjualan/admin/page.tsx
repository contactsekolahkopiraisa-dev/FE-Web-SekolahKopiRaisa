// app/umkm/laporan-penjualan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import CalendarPicker from "@/components/CalenderPickerFilter";
import Link from "next/link";
import {
  fetchLaporanPenjualanUMKMByPeriode,
  LaporanPenjualanData,
} from "@/app/utils/laporan-penjualan";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LaporanPenjualanSemuaUmkm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [laporanData, setLaporanData] = useState<LaporanPenjualanData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth(); // 0-11

  // 🧠 Fetch data laporan penjualan berdasarkan periode yang dipilih
  useEffect(() => {
    const loadData = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const bulan = selectedDate.getMonth(); // 0-11
        const tahun = selectedDate.getFullYear();

        const result = await fetchLaporanPenjualanUMKMByPeriode(bulan, tahun);

        console.log("API Response:", result);

        if (result && result.data && result.data.totalSummary) {
          setLaporanData(result.data);
        } else {
          setError("Data tidak ditemukan untuk periode ini");
          setLaporanData(null);
        }
      } catch (err: any) {
        console.error("Error loading laporan penjualan:", err);
        setError(err.message || "Gagal memuat data laporan penjualan");
        setLaporanData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

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

  // Format currency untuk tampilan
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Penjualan UMKM</h1>

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
      </div>

      {/* Status Loading / Error */}
      {loading ? (
        <p className="text-gray-500 mt-4">Memuat data...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : laporanData ? (
        <div>
          {/* totalSummary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">
                Jumlah Produk Terjual
              </h3>
              <p className="text-3xl font-bold">
                {laporanData.totalSummary.totalJumlahProdukTerjual}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData.periode}
              </p>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">Laba Bersih</h3>
              <p className="text-3xl font-bold">
                {laporanData.totalSummary.totalLabaBersih}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData.periode}
              </p>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">Laba Kotor</h3>
              <p className="text-3xl font-bold">
                {laporanData.totalSummary.totalLabaKotor}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData.periode}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Statistik Penjualan Harian
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={laporanData.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="tanggal"
                  label={{
                    value: "Tanggal",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Total Penjualan",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Tanggal ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="totalPenjualan"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">TOP PRODUK UMKM</h2>
            </div>

            {(laporanData?.topProducts ?? []).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Nama Produk
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Nama UMKM
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Jumlah Terjual
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Total Pendapatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporanData.topProducts.map((product, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{product.namaProduk}</td>
                        <td className="px-6 py-4">{product.namaUMKM}</td>
                        <td className="px-6 py-4">{product.jumlahTerjual}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(product.totalPendapatan)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Belum ada data produk terjual untuk periode ini
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Tidak ada data tersedia</p>
      )}
    </div>
  );
}
