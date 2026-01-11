// app/admin/laporan-penjualan/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import CalendarPicker from "@/components/CalenderPickerFilter";
import {
  fetchLaporanPenjualanByIdPartner,
  LaporanPenjualanByPartnerData,
  TopProduct
} from "@/app/utils/laporan-penjualan";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ChartDataPoint {
  tanggal: string;
  totalPenjualan: number;
}

export default function LaporanPenjualanAdmin() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [laporanData, setLaporanData] =
    useState<LaporanPenjualanByPartnerData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // TODO: Ganti dengan partner ID admin yang sebenarnya
  // Bisa didapat dari session/auth atau dari API profile admin
  const ADMIN_PARTNER_ID = 28; // Contoh: ID partner admin

  // Fetch data laporan penjualan admin
  useEffect(() => {
    const loadData = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const bulan = selectedDate.getMonth(); // 0-11
        const tahun = selectedDate.getFullYear();

        // Fetch laporan penjualan admin berdasarkan partner ID
        const laporanResult = await fetchLaporanPenjualanByIdPartner(
          ADMIN_PARTNER_ID,
          bulan,
          tahun
        );

        console.log("Laporan Result:", laporanResult);

        if (laporanResult && laporanResult.data) {
          setLaporanData(laporanResult.data);

          // Convert chart data dari API ke format yang dibutuhkan komponen
          const processedChartData = laporanResult.data.chart.map((item) => ({
            tanggal: item.tanggal.toString(),
            totalPenjualan: item.totalPenjualan
          }));
          setChartData(processedChartData);

          // Set top products
          setTopProducts(laporanResult.data.topProducts || []);
        } else {
          setLaporanData(null);
          setChartData([]);
          setTopProducts([]);
        }
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Gagal memuat data laporan penjualan");
        setChartData([]);
        setLaporanData(null);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  // Tutup kalender jika klik di luar
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

  // Teks tampilan periode
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
      "Desember"
    ];
    return `${
      bulanNames[selectedDate.getMonth()]
    } ${selectedDate.getFullYear()}`;
  };

  // Format currency
  const formatCurrency = (value: number | string) => {
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.-]/g, "");
      const numValue = parseFloat(cleaned);
      if (isNaN(numValue)) return value;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numValue);
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Penjualan Admin</h1>

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
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">
                Jumlah Produk Terjual
              </h3>
              <p className="text-3xl font-bold">
                {laporanData?.summary.jumlahProdukTerjual || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getDisplayText()}</p>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">Laba Bersih</h3>
              <p className="text-3xl font-bold">
                {laporanData?.summary.labaBersih || "Rp 0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getDisplayText()}</p>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">Laba Kotor</h3>
              <p className="text-3xl font-bold">
                {laporanData?.summary.labaKotor || "Rp 0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getDisplayText()}</p>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-2">Pajak</h3>
              <p className="text-3xl font-bold">
                {laporanData?.summary.pajak || "Rp 0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {laporanData?.summary.persentasePajak || "0%"}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Statistik Penjualan Harian
            </h2>

            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart 
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="tanggal"
                    label={{
                      value: "Tanggal",
                      position: "insideBottom",
                      offset: -15,
                      style: { textAnchor: "middle" }
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Total Penjualan (Rp)",
                      angle: -90,
                      dx: -20,
                      position: "insideLeft",
                      style: { textAnchor: "middle" }
                    }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data penjualan harian untuk periode ini
              </div>
            )}
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">TOP PRODUK SAYA</h2>
            </div>

            {topProducts.length > 0 ? (
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
                        Jumlah Terjual
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Total Pendapatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr
                        key={product.productId}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4">{product.ranking}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span>{product.namaProduk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.jumlahTerjual}</td>
                        <td className="px-6 py-4">
                          {(product.totalPendapatan)}
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
      )}
    </div>
  );
}