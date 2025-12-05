// app\utils\product.ts
import api from "./api";

export const fetchAllProduct = async () => {
  try {
    const response = await api.get("/api/v1/product");
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

export const fetchProductById = async (id: number) => {
  try {
    const response = await api.get(`/api/v1/product/${id}`);
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

export const createProduct = async (formData: FormData) => {
  try {
    const response = await api.post("/api/v1/product", formData, {
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

export const updateProduct = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/api/v1/product/${id}`, formData, {
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

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/api/v1/product/${id}`);
  return response.data;
};
