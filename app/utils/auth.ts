// app/utils/auth.ts
import api from "./api";

// ==================== TYPES ====================
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

interface RegisterUMKMData extends RegisterUserData {
  namaUmkm: string;
  ktp: string;
  sertifikasiHalal?: File;
  addresses: Array<{
    id_desa: number;
    alamat: string;
    kode_pos: string;
  }>;
}

interface LoginData {
  emailOrPhone: string;
  password: string;
}

interface ErrorResponse {
  type: "validation" | "general" | "network" | "unknown";
  message: string;
  errors?: Record<string, string[]>;
}

// ==================== TOKEN MANAGEMENT ====================
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}`;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

// ==================== ERROR HANDLER ====================
const handleApiError = (error: any): never => {
  if (error.response) {
    const { data } = error.response;

    // Validation errors (object format)
    if (
      data.errors &&
      typeof data.errors === "object" &&
      !Array.isArray(data.errors)
    ) {
      throw {
        type: "validation",
        message: data.message || "Validasi gagal!",
        errors: data.errors,
      } as ErrorResponse;
    }

    // General errors (string or array format)
    if (data.errors) {
      throw {
        type: "general",
        message:
          typeof data.errors === "string"
            ? data.errors
            : data.message || "Terjadi kesalahan!",
      } as ErrorResponse;
    }

    // Fallback error
    throw {
      type: "general",
      message: data.message || "Terjadi kesalahan!",
    } as ErrorResponse;
  }

  // Network error
  throw {
    type: "network",
    message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
  } as ErrorResponse;
};

// ==================== OAUTH ====================
export const loginWithGoogle = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
};

export const facebookLogin = async (accessToken: string) => {
  try {
    const response = await api.post("/api/v1/auth/facebook/link", {
      accessToken,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Gagal menautkan akun Facebook";
    throw new Error(errorMessage);
  }
};

// ==================== AUTHENTICATION ====================
export const registerUser = async (formData: RegisterUserData) => {
  try {
    const res = await api.post("/api/v1/auth/daftar", formData);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const registerUMKM = async (formData: RegisterUMKMData) => {
  try {
    const data = new FormData();

    // Append required fields
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone_number", formData.phone_number);
    data.append("namaUmkm", formData.namaUmkm);
    data.append("ktp", formData.ktp);

    // Append certificate file if exists
    if (formData.sertifikasiHalal instanceof File) {
      data.append("sertifikasiHalal", formData.sertifikasiHalal);
    }

    // Append addresses as JSON string
    data.append("addresses", JSON.stringify(formData.addresses));

    const res = await api.post("/api/v1/auth/umkm", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      const { data, status, statusText } = error.response;

      // Handle validation errors
      if (
        data.errors &&
        typeof data.errors === "object" &&
        !Array.isArray(data.errors)
      ) {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        } as ErrorResponse;
      }

      // Handle general errors
      if (data.errors) {
        throw {
          type: "general",
          message:
            typeof data.errors === "string"
              ? data.errors
              : data.message || "Terjadi kesalahan",
        } as ErrorResponse;
      }

      // Fallback error
      throw {
        type: "general",
        message: data.message || `Error ${status}: ${statusText}`,
      } as ErrorResponse;
    }

    // Network error
    if (error.request) {
      throw {
        type: "network",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      } as ErrorResponse;
    }

    // Unknown error
    throw {
      type: "unknown",
      message: error.message || "Terjadi kesalahan yang tidak diketahui",
    } as ErrorResponse;
  }
};

export const loginUser = async (formData: LoginData) => {
  try {
    const res = await api.post("/api/v1/auth/login", formData);
    const { token } = res.data.data;
    setToken(token);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/api/v1/auth/logout");
    removeToken();
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ==================== PASSWORD RESET ====================
export const resetPasswordRequest = async (email: string) => {
  try {
    const res = await api.post("/api/v1/auth/reset-password-request", {
      email,
    });
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Tidak dapat terhubung ke server. Coba lagi nanti.";
    throw new Error(message);
  }
};

export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  try {
    const res = await api.put("/api/v1/auth/reset-password", {
      token,
      newPassword,
    });
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Tidak dapat terhubung ke server. Coba lagi nanti.";
    throw new Error(message);
  }
};

// ==================== UMKM MANAGEMENT ====================
export const getAllUMKM = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    // Jangan kirim status ke API jika tidak diperlukan
    // Filtering akan dilakukan di frontend
    // if (params?.status) queryParams.append("status", params.status);

    const url = `/api/v1/auth/umkm${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const res = await api.get(url);

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Gagal mengambil data UMKM";
    throw new Error(message);
  }
};

export const getUMKMById = async (id: string | number) => {
  try {
    const res = await api.get(`/api/v1/auth/umkm/${id}`);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Gagal mengambil detail UMKM";
    throw new Error(message);
  }
};
