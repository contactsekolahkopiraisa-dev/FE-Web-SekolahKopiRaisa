// app/utils/dummy-laporan-penjualan.ts

export interface LaporanPenjualanData {
  periode: string;
  totalSummary: {
    totalJumlahProdukTerjual: number;
    totalLabaBersih: string;
    totalLabaKotor: string;
  };
  chart: Array<{
    tanggal: string;
    totalPenjualan: number;
  }>;
  topProducts: Array<{
    namaProduk: string;
    namaUMKM: string;
    jumlahTerjual: number;
    totalPendapatan: string;
  }>;
}

// Helper function untuk generate data chart harian
const generateChartData = (bulan: number, tahun: number) => {
  const daysInMonth = new Date(tahun, bulan + 1, 0).getDate();
  const chartData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // Generate random penjualan antara 500.000 - 5.000.000
    const totalPenjualan = Math.floor(Math.random() * 4500000) + 500000;
    chartData.push({
      tanggal: day.toString(),
      totalPenjualan: totalPenjualan,
    });
  }

  return chartData;
};

// Data dummy produk UMKM
const dummyProducts = [
  {
    nama: "Kopi Arabica Java Ijen Raung",
    umkm: "Kopi Ijen Lestari",
    harga: 95000,
  },
  {
    nama: "Kopi Robusta Bondowoso Premium",
    umkm: "Kopi Sukosari Sejahtera",
    harga: 75000,
  },
  {
    nama: "Kopi Arabica Specialty Sumberjambe",
    umkm: "Gayo Kopi Sumberjambe",
    harga: 125000,
  },
  {
    nama: "Kopi Luwak Arabica Ijen",
    umkm: "Kopi Luwak Ijen Makmur",
    harga: 350000,
  },
  { nama: "Kopi Robusta Sidomulyo", umkm: "UMKM Kopi Sidomulyo", harga: 65000 },
];

// Generate top products berdasarkan random selection
const generateTopProducts = (count: number = 10) => {
  const shuffled = [...dummyProducts].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map((product, index) => {
    // Semakin tinggi ranking, semakin banyak terjual
    const baseJumlah = 100 - index * 8;
    const jumlahTerjual = Math.floor(Math.random() * 50) + baseJumlah;
    const totalPendapatan = jumlahTerjual * product.harga;

    return {
      namaProduk: product.nama,
      namaUMKM: product.umkm,
      jumlahTerjual: jumlahTerjual,
      totalPendapatan: totalPendapatan.toString(),
    };
  });
};

/**
 * Fetch dummy data laporan penjualan berdasarkan periode
 * @param bulan - Bulan (0-11, dimana 0 = Januari)
 * @param tahun - Tahun (contoh: 2024)
 */
export const fetchDummyLaporanPenjualan = async (
  bulan: number,
  tahun: number
): Promise<{ data: LaporanPenjualanData }> => {
  // Simulasi delay API
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  const chartData = generateChartData(bulan, tahun);
  const topProducts = generateTopProducts(10);

  // Hitung total dari chart data
  const totalPenjualanBulan = chartData.reduce(
    (sum, item) => sum + item.totalPenjualan,
    0
  );

  // Hitung total produk terjual
  const totalJumlahProdukTerjual = topProducts.reduce(
    (sum, item) => sum + item.jumlahTerjual,
    0
  );

  // Simulasi laba kotor (70% dari total penjualan)
  const totalLabaKotor = Math.floor(totalPenjualanBulan * 0.7);

  // Simulasi laba bersih (50% dari total penjualan)
  const totalLabaBersih = Math.floor(totalPenjualanBulan * 0.5);

  const data: LaporanPenjualanData = {
    periode: `${bulanNames[bulan]} ${tahun}`,
    totalSummary: {
      totalJumlahProdukTerjual: totalJumlahProdukTerjual,
      totalLabaBersih: totalLabaBersih.toString(),
      totalLabaKotor: totalLabaKotor.toString(),
    },
    chart: chartData,
    topProducts: topProducts,
  };

  return { data };
};

// Export untuk digunakan sebagai mock data
export const mockLaporanData = {
  fetchLaporanPenjualanUMKMByPeriode: fetchDummyLaporanPenjualan,
};
