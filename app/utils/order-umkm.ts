
// app\utils\order-umkm.ts
import api from "./api";

export const fetchAllUMKMOrder = async () => {
  try {
    const response = await api.get("/api/v1/order/history");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal mengambil daftar pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const fetchOrderById = async (id: number) => {
  try {
    const response = await api.get(`/api/v1/order/umkm/${id}/detail`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal mengambil detail pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const updateStatusOrder = async (id: number, status: string) => {
  try {
    const response = await api.put(`/api/v1/order/umkm/${id}/update-status`, {
      status,
    });
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
