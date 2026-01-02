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
  suratIzinEdar?: File | null;
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

// ==================== JWT DECODER ====================
/**
 * Decode JWT token untuk mendapatkan payload
 * @param token JWT token string
 * @returns decoded payload atau null jika gagal
 */
const decodeJWT = (token: string): any | null => {
  try {
    // JWT format: header.payload.signature
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("❌ Error decoding JWT:", error);
    return null;
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
    console.log("🔧 Membangun FormData...");
    console.log("📋 Raw formData input:", {
      name: formData.name,
      email: formData.email,
      namaUmkm: formData.namaUmkm,
      ktp: formData.ktp,
      hasFile: !!formData.suratIzinEdar,
      fileDetails: formData.suratIzinEdar
        ? {
            name: formData.suratIzinEdar.name,
            type: formData.suratIzinEdar.type,
            size: formData.suratIzinEdar.size,
          }
        : null,
      addresses: formData.addresses,
    });

    const data = new FormData();

    // Append required fields
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone_number", formData.phone_number);
    data.append("namaUmkm", formData.namaUmkm);
    data.append("ktp", formData.ktp);

    // ✅ CRITICAL FIX: Append file HANYA jika ada dan valid
    if (
      formData.suratIzinEdar &&
      formData.suratIzinEdar instanceof File
    ) {
      console.log("📎 File akan dikirim:", {
        name: formData.suratIzinEdar.name,
        type: formData.suratIzinEdar.type,
        size: `${(formData.suratIzinEdar.size / 1024).toFixed(2)} KB`,
      });

      // PASTIKAN HANYA APPEND SEKALI
      data.append("suratIzinEdar", formData.suratIzinEdar);
    } else {
      console.log("ℹ️ NO FILE - skipping suratIzinEdar");
    }

    // Append addresses
    data.append("addresses", JSON.stringify(formData.addresses));

    // ✅ DETAILED DEBUG: Count all entries
    console.log("📦 === FORMDATA INSPECTION ===");
    const allEntries: Array<[string, any]> = [];
    const fileCounts: Record<string, number> = {};

    for (let pair of data.entries()) {
      const [key, value] = pair;
      allEntries.push([key, value]);

      if (value instanceof File) {
        fileCounts[key] = (fileCounts[key] || 0) + 1;
        console.log(`  📄 ${key} [FILE #${fileCounts[key]}]:`, {
          name: value.name,
          type: value.type,
          size: `${(value.size / 1024).toFixed(2)} KB`,
        });
      } else {
        console.log(
          `  📝 ${key}:`,
          typeof value === "string" && value.length > 50
            ? value.substring(0, 50) + "..."
            : value
        );
      }
    }

    console.log("📊 Summary:");
    console.log("  Total entries:", allEntries.length);
    console.log("  File fields:", fileCounts);

    // ❌ CRITICAL CHECK: Detect duplicates
    const suratIzinEdarCount = fileCounts["suratIzinEdar"] || 0;
    if (suratIzinEdarCount > 1) {
      console.error(
        "❌ CRITICAL ERROR: Multiple suratIzinEdar files detected!"
      );
      console.error("   Count:", suratIzinEdarCount);
      throw new Error(
        `DUPLICATE FILES DETECTED: ${suratIzinEdarCount} files with key 'suratIzinEdar'`
      );
    }

    console.log("✅ FormData validation passed");
    console.log("🚀 Sending request to backend...");

    const res = await api.post("/api/v1/auth/umkm", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Response berhasil:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("💥 Error saat registrasi UMKM:");

    if (error.response) {
      const { data, status, statusText } = error.response;
      console.error("  Status:", status, statusText);
      console.error("  Response data:", data);

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

      if (data.errors) {
        throw {
          type: "general",
          message:
            typeof data.errors === "string"
              ? data.errors
              : data.message || "Terjadi kesalahan",
        } as ErrorResponse;
      }

      throw {
        type: "general",
        message: data.message || `Error ${status}: ${statusText}`,
      } as ErrorResponse;
    }

    if (error.request) {
      console.error("  Network error - no response received");
      throw {
        type: "network",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      } as ErrorResponse;
    }

    console.error("  Unknown error:", error.message);
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
      reason: reason || "UMKM Anda telah disetujui.",
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
      reason,
    });
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Gagal menolak UMKM";
    throw new Error(message);
  }
};

// ==================== USER DATA HELPER ====================
/**
 * Mendapatkan user_id dari user yang sedang login
 * @returns user_id atau null jika tidak ditemukan
 */
export const getUserId = (): number | null => {
  console.log("=== DEBUG getUserId ===");

  try {
    // Coba ambil dari localStorage dengan key 'user'
    const userString = localStorage.getItem("user");
    console.log('localStorage.getItem("user"):', userString);

    if (userString) {
      const user = JSON.parse(userString);
      console.log("Parsed user from localStorage:", user);
      console.log("user.user_id or user.id:", user.user_id || user.id);

      if (user.user_id || user.id) {
        const userId = user.user_id || user.id;
        console.log("✅ User ID found in localStorage:", userId);
        return userId;
      }
    }

    // Coba ambil dari sessionStorage sebagai fallback
    const sessionUser = sessionStorage.getItem("user");
    console.log('sessionStorage.getItem("user"):', sessionUser);

    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      console.log("Parsed user from sessionStorage:", user);
      console.log("user.user_id or user.id:", user.user_id || user.id);

      if (user.user_id || user.id) {
        const userId = user.user_id || user.id;
        console.log("✅ User ID found in sessionStorage:", userId);
        return userId;
      }
    }

    // Jika menggunakan nama key yang berbeda, sesuaikan di sini
    // Contoh: 'authUser', 'currentUser', dll
    const authUserString = localStorage.getItem("authUser");
    console.log('localStorage.getItem("authUser"):', authUserString);

    if (authUserString) {
      const user = JSON.parse(authUserString);
      console.log("Parsed user from authUser:", user);
      console.log("user.user_id or user.id:", user.user_id || user.id);

      if (user.user_id || user.id) {
        const userId = user.user_id || user.id;
        console.log("✅ User ID found in authUser:", userId);
        return userId;
      }
    }

    // === DECODE JWT TOKEN ===
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log(
      "Token found:",
      token ? "Yes (" + token.substring(0, 30) + "...)" : "No"
    );

    if (token) {
      console.log("🔓 Attempting to decode JWT token...");
      const decodedToken = decodeJWT(token);
      console.log("📋 Decoded token payload:", decodedToken);

      if (decodedToken) {
        // Cek berbagai kemungkinan nama field untuk user_id
        const userId =
          decodedToken.user_id ||
          decodedToken.userId ||
          decodedToken.id ||
          decodedToken.sub || // 'sub' adalah standard JWT claim untuk user identifier
          decodedToken.user?.id ||
          decodedToken.user?.user_id ||
          decodedToken.data?.user_id ||
          decodedToken.data?.id ||
          decodedToken.payload?.user_id ||
          decodedToken.payload?.id;

        console.log("🔍 Extracted user_id from token:", userId);

        if (userId) {
          const numericUserId =
            typeof userId === "number" ? userId : parseInt(userId);
          console.log("✅ User ID found in JWT token:", numericUserId);
          return numericUserId;
        }

        console.log(
          "⚠️ Token decoded successfully but user_id not found in any expected field"
        );
        console.log("Available token fields:", Object.keys(decodedToken));
      }
    }

    // Log semua keys di localStorage untuk debugging
    console.log("📦 All localStorage keys:", Object.keys(localStorage));
    console.log("📦 All sessionStorage keys:", Object.keys(sessionStorage));

    console.log("❌ User ID not found in any storage or token");
    return null;
  } catch (error) {
    console.error("❌ Error getting user_id:", error);
    return null;
  } finally {
    console.log("=== END DEBUG getUserId ===");
  }
};

/**
 * Mendapatkan data user lengkap yang sedang login
 * @returns user object atau null jika tidak ditemukan
 */
export const getCurrentUser = (): any | null => {
  try {
    const userString =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
