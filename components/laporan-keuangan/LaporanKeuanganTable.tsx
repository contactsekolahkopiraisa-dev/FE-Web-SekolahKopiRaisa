// components/laporan-keuangan/LaporanKeuanganTable.tsx
"use client";

import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllLaporanKeuangan } from "@/app/utils/laporan-keuangan";

interface LaporanKeuangan {
  id: number;
  periode: string;
  description: string;
  pemasukan: number;
  pengeluaran: number;
  saldo?: number;
  tanggal?: string;
  detail_pengeluaran?: DetailPengeluaran[];
}

interface DetailPengeluaran {
  id_pengeluaran: number;
  id_financialreport: number;
  id_user: number;
  tanggal: string;
  jumlah_pengeluaran: number;
  keterangan: string;
}

interface LaporanKeuanganTableProps {
  selectedYear?: number;
  selectedMonth?: number;
  onView: (id: number) => void;
  dataSource?: LaporanKeuangan[];
}

export default function LaporanKeuanganTable({
  selectedYear,
  selectedMonth,
  onView,
  dataSource
}: LaporanKeuanganTableProps) {
  const [laporan, setLaporan] = useState<LaporanKeuangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dataSource) {
      if (Array.isArray(dataSource)) {
        setLaporan(dataSource);
      } else {
        console.error("dataSource bukan array:", dataSource);
        setLaporan([]);
      }
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchAllLaporanKeuangan();

        if (result?.status === "success" && Array.isArray(result.data)) {
          setLaporan(result.data);
        } else if (Array.isArray(result)) {
          setLaporan(result);
        } else if (result?.data && Array.isArray(result.data)) {
          setLaporan(result.data);
        } else {
          console.error("Format data API tidak sesuai:", result);
          setLaporan([]);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Gagal memuat data laporan keuangan");
        setLaporan([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  const parseDate = (item: LaporanKeuangan): Date | null => {
    if (!item.periode) return null;

    const bulanMap: { [key: string]: number } = {
      januari: 0,
      februari: 1,
      maret: 2,
      april: 3,
      mei: 4,
      juni: 5,
      juli: 6,
      agustus: 7,
      september: 8,
      oktober: 9,
      november: 10,
      desember: 11
    };

    const match = item.periode.match(/(\w+)\s+(\d{4})/i);
    if (match) {
      const [, bulan, tahun] = match;
      const monthIndex = bulanMap[bulan.toLowerCase()];

      if (monthIndex !== undefined) {
        return new Date(parseInt(tahun), monthIndex, 1);
      }
    }

    return null;
  };

  const filteredData = laporan.filter((item) => {
    if (!selectedYear && selectedMonth === undefined) {
      return true;
    }

    const date = parseDate(item);
    if (!date) return true;

    const year = date.getFullYear();
    const month = date.getMonth();

    const matchYear = selectedYear ? year === selectedYear : true;
    const matchMonth =
      selectedMonth !== undefined ? month === selectedMonth : true;

    return matchYear && matchMonth;
  });

  const totalPemasukan = filteredData.reduce(
    (sum, item) => sum + (item.pemasukan || 0),
    0
  );

  const totalPengeluaran = filteredData.reduce(
    (sum, item) => sum + (item.pengeluaran || 0),
    0
  );

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);

  const formatDate = (item: LaporanKeuangan) => {
    const date = parseDate(item);
    if (!date) return "Invalid Date";

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Fungsi untuk format keterangan pengeluaran
  const formatKeteranganPengeluaran = (item: LaporanKeuangan) => {
    // Cek detail_pengeluaran dulu (dari API)
    if (item.detail_pengeluaran && item.detail_pengeluaran.length > 0) {
      return item.detail_pengeluaran
        .map((detail) => detail.keterangan)
        .filter(Boolean)
        .join(", ");
    }

    return "-";
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Memuat data laporan keuangan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Terjadi kesalahan: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* RINGKASAN */}
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
          <h3 className="text-sm font-medium text-primary mb-1">Saldo Akhir</h3>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(saldoAkhir)}
          </p>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">No</th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
                  Tanggal
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
                  Keterangan Pemasukan
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
                  Pemasukan
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
                  Keterangan Pengeluaran
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
                  Pengeluaran
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">
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
                      {formatDate(item)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.description}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                      {formatCurrency(item.pemasukan || 0)}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      {formatKeteranganPengeluaran(item)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium">
                      {formatCurrency(item.pengeluaran || 0)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => onView(item.id)}
                        className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                        title="Edit"
                      >
                        <PencilIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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
