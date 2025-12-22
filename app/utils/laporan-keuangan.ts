// app/utils/laporan-keuangan.ts
import api from "./api";

export const fetchAllLaporanKeuangan = async () => {
  try {
    const response = await api.get("/api/v1/laporan-keuangan");
    return response.data;
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

export const fetchLaporanKeuanganById = async (id: number) => {
  try {
    const response = await api.get(`/api/v1/laporan-keuangan/${id}`);
    return response.data;
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

export const createLaporanKeuangan = async (data: {
  periode: string;
  report_date: string;
  description: string;
  income: number;
  pengeluarans: Array<{
    tanggal: string;
    jumlah_pengeluaran: number;
    keterangan: string;
  }>;
}) => {
  try {
    const response = await api.post("/api/v1/laporan-keuangan/", data);
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

export const updateLaporanKeuangan = async (
  id: number,
  data: {
    periode: string;
    report_date: string;
    description: string;
    income: number;
    pengeluarans: Array<{
      tanggal: string;
      jumlah_pengeluaran: number;
      keterangan: string;
    }>;
  }
) => {
  try {
    const response = await api.put(`/api/v1/laporan-keuangan/${id}`, data);
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

export const deleteLaporanKeuangan = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/laporan-keuangan/${id}`);
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
