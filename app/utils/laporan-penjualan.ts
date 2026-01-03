// app/utils/laporan-penjualan.ts
import api from "./api";

// Interface untuk top products (sesuai API gambar 2)
export interface TopProduct {
  ranking: number;
  productId: number;
  namaProduk: string;
  gambarProduk: string;
  namaUMKM: string;
  partnerId: number;
  jumlahTerjual: number;
  totalPendapatan: string;
}

// Interface untuk laporan penjualan UMKM (individu)
export interface LaporanPenjualanUMKMData {
  partner: {
    id: number;
    nama: string;
    owner: string;
  };
  periode: string;
  summary: {
    jumlahProdukTerjual: number;
    labaBersih: string;
    labaBersihRaw: number;
    labaKotor: string;
    labaKotorRaw: number;
    pajak: string;
    pajakRaw: number;
    persentasePajak: string;
  };
  chart: Array<{
    tanggal: number;
    totalPenjualan: number;
  }>;
  topProducts: TopProduct[];
}

// Interface untuk laporan penjualan Admin (semua UMKM)
export interface LaporanPenjualanAdminData {
  periode: string;
  totalSummary: {
    totalJumlahProdukTerjual: number;
    totalLabaBersih: string | number;
    totalLabaKotor: string | number;
    totalPajak: string | number;
  };
  chart: Array<{
    tanggal: number;
    totalPenjualan: number;
  }>;
  umkmList: Array<{
    partnerId: number;
    namaUMKM: string;
    owner: string;
    jumlahProdukTerjual: number;
    labaBersih: string;
    labaKotor: string;
  }>;
}

// Response interfaces
export interface LaporanPenjualanUMKMResponse {
  message: string;
  data: LaporanPenjualanUMKMData;
}

export interface LaporanPenjualanAdminResponse {
  message: string;
  data: LaporanPenjualanAdminData;
}

export interface TopProductsResponse {
  message: string;
  data: {
    periode: string;
    limit: number;
    totalProducts: number;
    products: TopProduct[];
  };
}

// Untuk backward compatibility
export type LaporanPenjualanData = LaporanPenjualanAdminData;
export type LaporanPenjualanResponse = LaporanPenjualanAdminResponse;

// ============================================
// UMKM APIs (untuk partner/UMKM individual)
// ============================================

// Fetch laporan penjualan UMKM berdasarkan periode
export const fetchLaporanPenjualanByPeriode = async (
  bulan: number, // 0-11 (JavaScript month index)
  tahun: number
) => {
  try {
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

    const periode = `${bulanNames[bulan]} ${tahun}`;

    const response = await api.get("/api/v1/penjualan/my-report", {
      params: { periode }
    });

    return response.data as LaporanPenjualanUMKMResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// Fetch semua laporan penjualan UMKM (tanpa filter periode)
export const fetchAllLaporanPenjualan = async () => {
  try {
    const response = await api.get("/api/v1/penjualan/my-report");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// ============================================
// ADMIN APIs (untuk melihat semua UMKM)
// ============================================

// Fetch laporan penjualan semua UMKM berdasarkan periode (Admin)
export const fetchLaporanPenjualanUMKMByPeriode = async (
  bulan: number,
  tahun: number
) => {
  try {
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

    const periode = `${bulanNames[bulan]} ${tahun}`;

    const response = await api.get("/api/v1/penjualan/admin/report", {
      params: {
        bulan: bulan + 1, // API expects 1-12
        tahun: tahun
      }
    });

    return response.data as LaporanPenjualanAdminResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// Fetch top products (API dari gambar 2)
export const fetchTopProducts = async (
  bulan: number,
  tahun: number,
  limit: number = 10
) => {
  try {
    const response = await api.get("/api/v1/penjualan/admin/top-products", {
      params: {
        bulan: bulan + 1, // API expects 1-12
        tahun: tahun,
        limit: limit
      }
    });

    return response.data as TopProductsResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// Fetch semua laporan penjualan Admin (tanpa filter)
export const fetchAllLaporanPenjualanAdmin = async () => {
  try {
    const response = await api.get("/api/v1/penjualan/admin/report");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// Fetch laporan penjualan by ID
export const fetchLaporanPenjualanById = async (id: number) => {
  try {
    const response = await api.get(`/api/v1/laporan-penjualan/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};

// Interface untuk laporan by partner ID
export interface LaporanPenjualanByPartnerData {
  partner: {
    id: number;
    nama: string;
    owner: string;
    user: {
      id: number;
      name: string;
    };
  };
  periode: string;
  summary: {
    jumlahProdukTerjual: number;
    labaBersih: string;
    labaKotor: string;
    pajak: string;
    persentasePajak: string;
  };
  chart: Array<{
    tanggal: number;
    totalPenjualan: number;
  }>;
  topProducts: TopProduct[];
}

export interface LaporanPenjualanByPartnerResponse {
  message: string;
  data: LaporanPenjualanByPartnerData;
}

// Fetch laporan penjualan by Partner ID (Admin)
export const fetchLaporanPenjualanByIdPartner = async (
  partnerId: number,
  bulan: number, // 0-11 (JavaScript month index)
  tahun: number
) => {
  try {
    const response = await api.get(`/api/v1/penjualan/admin/partner/${partnerId}`, {
      params: {
        bulan: bulan + 1, // API expects 1-12
        tahun: tahun
      }
    });

    return response.data as LaporanPenjualanByPartnerResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti."
    };
  }
};