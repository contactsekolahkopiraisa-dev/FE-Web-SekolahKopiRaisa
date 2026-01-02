// app/umkm/laporan-penjualan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import CalendarPicker from "@/components/CalenderPickerFilter";
import Link from "next/link";
// Import fungsi asli (commented untuk sementara)
// import {
//   fetchLaporanPenjualanUMKMByPeriode,
//   LaporanPenjualanData
// } from "@/app/utils/laporan-penjualan";

// Import data dummy
import {
  fetchDummyLaporanPenjualan,
  LaporanPenjualanData,
} from "@/lib/dummyLaporanPenjualan";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Toggle untuk menggunakan data dummy atau real API
const USE_DUMMY_DATA = true; // Ubah ke false untuk menggunakan API asli

export default function LaporanPenjualanUMKM() {
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

        let result;

        if (USE_DUMMY_DATA) {
          // Gunakan data dummy
          result = await fetchDummyLaporanPenjualan(bulan, tahun);
        } else {
          // Gunakan API asli (uncomment baris import di atas jika mau pakai ini)
          // result = await fetchLaporanPenjualanUMKMByPeriode(bulan, tahun);
        }

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
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Laporan Penjualan Admin</h1>
        {USE_DUMMY_DATA && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
            Mode Data Dummy
          </span>
        )}
      </div>

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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-sm text-gray-600 mb-2 font-medium">
                Jumlah Produk Terjual
              </h3>
              <p className="text-3xl font-bold text-blue-700">
                {laporanData.totalSummary.totalJumlahProdukTerjual.toLocaleString(
                  "id-ID"
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData.periode}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-sm text-gray-600 mb-2 font-medium">
                Laba Bersih
              </h3>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(laporanData.totalSummary.totalLabaBersih)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData.periode}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
              <h3 className="text-sm text-gray-600 mb-2 font-medium">
                Laba Kotor
              </h3>
              <p className="text-3xl font-bold text-purple-700">
                {formatCurrency(laporanData.totalSummary.totalLabaKotor)}
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
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={laporanData.chart}
                margin={{ top: 5, right: 30, left: 60, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="tanggal"
                  label={{
                    value: "Tanggal",
                    position: "insideBottom",
                    offset: -30,
                    style: { fontSize: "14px", fontWeight: 600 },
                  }}
                  tick={{ fontSize: 12 }}
                  height={30}
                />
                <YAxis
                  label={{
                    value: "Total Penjualan (Rp)",
                    angle: -90,
                    dx: -50,
                    position: "center",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      textAnchor: "middle",
                    },
                  }}
                  tick={{ fontSize: 12 }}
                  width={10}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}jt`;
                    }
                    return `${(value / 1000).toFixed(0)}rb`;
                  }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `Tanggal ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
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
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">{product.namaProduk}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.namaUMKM}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {product.jumlahTerjual}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
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
