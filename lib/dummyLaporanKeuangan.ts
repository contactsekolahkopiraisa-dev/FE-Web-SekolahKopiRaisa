// lib/dummyLaporanKeuangan.ts
export interface LaporanKeuangan {
    id: number;
    tanggal: string;
    keterangan: string;
    pemasukan: number;
    pengeluaran: number;
}

export const dummyLaporanKeuangan: LaporanKeuangan[] = [
    {
        id: 1,
        tanggal: "15 September 2025",
        keterangan: "Penjualan Produk A",
        pemasukan: 500000,
        pengeluaran: 100000,
    },
    {
        id: 2,
        tanggal: "13 September 2025",
        keterangan: "Penjualan Produk B",
        pemasukan: 1000000,
        pengeluaran: 200000,
    },
    {
        id: 3,
        tanggal: "17 September 2025",
        keterangan: "Penjualan Produk C",
        pemasukan: 400000,
        pengeluaran: 10000,
    },
    {
        id: 4,
        tanggal: "01 September 2025",
        keterangan: "Penjualan Produk D",
        pemasukan: 50000,
        pengeluaran: 10000,
    },
    {
        id: 5,
        tanggal: "19 September 2025",
        keterangan: "Penjualan Produk E",
        pemasukan: 550000,
        pengeluaran: 110000,
    },
    {
        id: 6,
        tanggal: "05 Oktober 2025",
        keterangan: "Penjualan Produk F",
        pemasukan: 750000,
        pengeluaran: 150000,
    },
    {
        id: 7,
        tanggal: "20 Agustus 2025",
        keterangan: "Penjualan Produk G",
        pemasukan: 300000,
        pengeluaran: 50000,
    },
    {
        id: 8,
        tanggal: "10 Januari 2024",
        keterangan: "Penjualan Produk H",
        pemasukan: 600000,
        pengeluaran: 100000,
    },
];

// Helper function untuk parse tanggal Indonesia
const parseTanggalIndonesia = (tanggal: string): Date => {
    const bulanMap: { [key: string]: number } = {
        "Januari": 0, "Februari": 1, "Maret": 2, "April": 3,
        "Mei": 4, "Juni": 5, "Juli": 6, "Agustus": 7,
        "September": 8, "Oktober": 9, "November": 10, "Desember": 11
    };
    
    const parts = tanggal.split(" ");
    const hari = parseInt(parts[0]);
    const bulan = bulanMap[parts[1]];
    const tahun = parseInt(parts[2]);
    
    return new Date(tahun, bulan, hari);
};

// Fungsi untuk filter data berdasarkan tahun
export const filterByTahun = (data: LaporanKeuangan[], tahun: number): LaporanKeuangan[] => {
    return data.filter(item => {
        const date = parseTanggalIndonesia(item.tanggal);
        return date.getFullYear() === tahun;
    });
};

// Fungsi untuk filter data berdasarkan bulan dan tahun
export const filterByBulan = (
    data: LaporanKeuangan[], 
    bulan: number, 
    tahun: number
): LaporanKeuangan[] => {
    return data.filter(item => {
        const date = parseTanggalIndonesia(item.tanggal);
        return date.getMonth() === bulan && date.getFullYear() === tahun;
    });
};

// Fungsi untuk menghitung total pemasukan
export const getTotalPemasukan = (data: LaporanKeuangan[]): number => {
    return data.reduce((total, item) => total + item.pemasukan, 0);
};

// Fungsi untuk menghitung total pengeluaran
export const getTotalPengeluaran = (data: LaporanKeuangan[]): number => {
    return data.reduce((total, item) => total + item.pengeluaran, 0);
};

// Fungsi untuk menghitung saldo akhir
export const getSaldoAkhir = (data: LaporanKeuangan[]): number => {
    const totalPemasukan = getTotalPemasukan(data);
    const totalPengeluaran = getTotalPengeluaran(data);
    return totalPemasukan - totalPengeluaran;
};

// Fungsi untuk mendapatkan ringkasan berdasarkan filter
export const getRingkasanKeuangan = (
    data: LaporanKeuangan[], 
    tahun?: number, 
    bulan?: number
) => {
    let filteredData = data;
    
    if (tahun && bulan !== undefined) {
        filteredData = filterByBulan(data, bulan, tahun);
    } else if (tahun) {
        filteredData = filterByTahun(data, tahun);
    }
    
    return {
        data: filteredData,
        totalPemasukan: getTotalPemasukan(filteredData),
        totalPengeluaran: getTotalPengeluaran(filteredData),
        saldoAkhir: getSaldoAkhir(filteredData)
    };
};