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
        errors: data.errors
      } as ErrorResponse;
    }

    // General errors (string or array format)
    if (data.errors) {
      throw {
        type: "general",
        message:
          typeof data.errors === "string"
            ? data.errors
            : data.message || "Terjadi kesalahan!"
      } as ErrorResponse;
    }

    // Fallback error
    throw {
      type: "general",
      message: data.message || "Terjadi kesalahan!"
    } as ErrorResponse;
  }

  // Network error
  throw {
    type: "network",
    message: "Tidak dapat terhubung ke server. Coba lagi nanti."
  } as ErrorResponse;
};

// ==================== OAUTH ====================
export const loginWithGoogle = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
};

export const facebookLogin = async (accessToken: string) => {
  try {
    const response = await api.post("/api/v1/auth/facebook/link", {
      accessToken
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
    console.log("🔧 Membangun FormData...");

    const data = new FormData();

    // Append required fields
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone_number", formData.phone_number);
    data.append("namaUmkm", formData.namaUmkm);
    data.append("ktp", formData.ktp);

    // ✅ HANYA APPEND FILE JIKA ADA DAN VALID
    if (
      formData.sertifikasiHalal &&
      formData.sertifikasiHalal instanceof File
    ) {
      console.log("📎 File akan dikirim:", {
        name: formData.sertifikasiHalal.name,
        type: formData.sertifikasiHalal.type,
        size: `${(formData.sertifikasiHalal.size / 1024).toFixed(2)} KB`
      });

      // PASTIKAN HANYA APPEND SEKALI
      data.append("sertifikasiHalal", formData.sertifikasiHalal);
    } else {
      console.log("ℹ️ Tidak ada file sertifikat");
    }

    // Append addresses as JSON string
    data.append("addresses", JSON.stringify(formData.addresses));

    // ✅ LOG SEMUA ENTRIES DALAM FORMDATA
    console.log("📦 FormData entries:");
    let fileCount = 0;
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        fileCount++;
        console.log(`  ${key} [FILE #${fileCount}]:`, {
          name: value.name,
          type: value.type,
          size: `${(value.size / 1024).toFixed(2)} KB`
        });
      } else {
        console.log(
          `  ${key}:`,
          typeof value === "string" && value.length > 50
            ? value.substring(0, 50) + "..."
            : value
        );
      }
    }

    if (fileCount > 1) {
      console.error("⚠️ WARNING: FormData contains multiple files!");
    }

    console.log("🚀 Mengirim request ke backend...");

    const res = await api.post("/api/v1/auth/umkm", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("✅ Response berhasil:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("💥 Error saat registrasi UMKM:");

    if (error.response) {
      const { data, status, statusText } = error.response;
      console.error("  Status:", status, statusText);
      console.error("  Response data:", data);

      // Handle validation errors
      if (
        data.errors &&
        typeof data.errors === "object" &&
        !Array.isArray(data.errors)
      ) {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        } as ErrorResponse;
      }

      // Handle general errors
      if (data.errors) {
        throw {
          type: "general",
          message:
            typeof data.errors === "string"
              ? data.errors
              : data.message || "Terjadi kesalahan"
        } as ErrorResponse;
      }

      // Fallback error
      throw {
        type: "general",
        message: data.message || `Error ${status}: ${statusText}`
      } as ErrorResponse;
    }

    // Network error
    if (error.request) {
      console.error("  Network error - no response received");
      throw {
        type: "network",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      } as ErrorResponse;
    }

    // Unknown error
    console.error("  Unknown error:", error.message);
    throw {
      type: "unknown",
      message: error.message || "Terjadi kesalahan yang tidak diketahui"
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
      email
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
  newPassword
}: {
  token: string;
  newPassword: string;
}) => {
  try {
    const res = await api.put("/api/v1/auth/reset-password", {
      token,
      newPassword
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

// ==================== UMKM VERIFICATION ====================
export const verifyUMKM = async (id: number, reason?: string) => {
  try {
    const res = await api.post(`/api/v1/auth/umkm/${id}/verify`, {
      approved: true,
      reason: reason || "UMKM Anda telah disetujui."
    });
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Gagal menyetujui UMKM";
    throw new Error(message);
  }
};

export const rejectUMKM = async (id: number, reason: string) => {
  try {
    const res = await api.post(`/api/v1/auth/umkm/${id}/reject`, {
      approved: false,
      reason
    });
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Gagal menolak UMKM";
    throw new Error(message);
  }
};