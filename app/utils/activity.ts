// services/activity.ts
import api from "../utils/api";


// GET semua berita
export const fetchAllActivity = async () => {
  const response = await api.get("/api/v1/news");
  return response.data;
};

// GET berita berdasarkan ID
export const fetchActivityById = async (id: number | string) => {
  const response = await api.get(`/api/v1/news/${id}`);
  return response.data;
};

// POST berita baru dengan media
export const createActivity = async (formData: FormData) => {
  try {
    const response = await api.post("/api/v1/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

// UPDATE berita
export const updateActivity = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/api/v1/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

// DELETE berita
export const deleteActivity = async (id: number) => {
  const response = await api.delete(`/api/v1/news/${id}`);
  return response.data;
};
