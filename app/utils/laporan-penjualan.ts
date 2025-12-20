// app/utils/laporan-penjualan.ts
import api from "./api";

// Interface untuk tipe data laporan penjualan
export interface LaporanPenjualanData {
  partner: {
    id: number;
    nama: string;
    owner: string;
  };
  periode: string;
  totalSummary: {
    totalJumlahProdukTerjual: number;
    totalLabaBersih: string;
    totalLabaBersihRaw: number;
    totalLabaKotor: string;
    totalLabaKotorRaw: number;
    totalPajak: string;
    totalPajakRaw: number;
    totalPersentasePajak: string;
  };
  chart: Array<{
    tanggal: number;
    totalPenjualan: number;
  }>;
  topProducts: Array<{
    namaProduk: string;
    namaUMKM: string;
    jumlahTerjual: number;
    totalPendapatan: number;
  }>;
}

export interface LaporanPenjualanResponse {
  message: string;
  data: LaporanPenjualanData;
}

// Fetch laporan penjualan berdasarkan periode (bulan dan tahun)
export const fetchLaporanPenjualanByPeriode = async (
  bulan: number, // 0-11 (JavaScript month index)
  tahun: number
) => {
  try {
    // Format periode sesuai dengan yang diharapkan API (contoh: "September 2025")
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

    const periode = `${bulanNames[bulan]} ${tahun}`;

    // Kirim request dengan query parameter periode
    const response = await api.get("/api/v1/penjualan/my-report", {
      params: { periode },
    });

    return response.data as LaporanPenjualanResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      // Validasi field (errors berbentuk object)
      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      // Error umum (errors berbentuk string)
      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      // Error fallback
      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    // Error koneksi/server down
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};

// Untuk backward compatibility (jika masih digunakan di tempat lain)
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
          errors: data.errors,
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};

export const fetchLaporanPenjualanUMKMByPeriode = async (
  bulan: number, // 0-11 (JavaScript month index)
  tahun: number
) => {
  try {
    // Format periode sesuai dengan yang diharapkan API (contoh: "September 2025")
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

    const periode = `${bulanNames[bulan]} ${tahun}`;

    // Kirim request dengan query parameter periode
    const response = await api.get("/api/v1/penjualan/admin/report", {
      params: { periode },
    });

    return response.data as LaporanPenjualanResponse;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      // Validasi field (errors berbentuk object)
      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      // Error umum (errors berbentuk string)
      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      // Error fallback
      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    // Error koneksi/server down
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};

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
          errors: data.errors,
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};

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
          errors: data.errors,
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};