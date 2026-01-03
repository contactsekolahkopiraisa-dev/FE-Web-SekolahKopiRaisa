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
  surat_izin_edar?: File | null;
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
const decodeJWT = (token: string): any | null => {
  try {
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
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// ==================== ERROR HANDLER ====================
const handleApiError = (error: any): never => {
  if (error.response) {
    const { data } = error.response;

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

    if (data.errors) {
      throw {
        type: "general",
        message:
          typeof data.errors === "string"
            ? data.errors
            : data.message || "Terjadi kesalahan!"
      } as ErrorResponse;
    }

    throw {
      type: "general",
      message: data.message || "Terjadi kesalahan!"
    } as ErrorResponse;
  }

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
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone_number", formData.phone_number);
    data.append("namaUmkm", formData.namaUmkm);
    data.append("ktp", formData.ktp);

    if (formData.surat_izin_edar && formData.surat_izin_edar instanceof File) {
      data.append("surat_izin_edar", formData.surat_izin_edar);
    }

    data.append("addresses", JSON.stringify(formData.addresses));

    const res = await api.post("/api/v1/auth/umkm", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      const { data, status, statusText } = error.response;

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

      if (data.errors) {
        throw {
          type: "general",
          message:
            typeof data.errors === "string"
              ? data.errors
              : data.message || "Terjadi kesalahan"
        } as ErrorResponse;
      }

      throw {
        type: "general",
        message: data.message || `Error ${status}: ${statusText}`
      } as ErrorResponse;
    }

    if (error.request) {
      throw {
        type: "network",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      } as ErrorResponse;
    }

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

// ==================== USER DATA HELPER ====================
export const getUserId = (): number | null => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.user_id || user.id) {
        return user.user_id || user.id;
      }
    }

    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      if (user.user_id || user.id) {
        return user.user_id || user.id;
      }
    }

    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      const user = JSON.parse(authUserString);
      if (user.user_id || user.id) {
        return user.user_id || user.id;
      }
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken) {
        const userId =
          decodedToken.user_id ||
          decodedToken.userId ||
          decodedToken.id ||
          decodedToken.sub ||
          decodedToken.user?.id ||
          decodedToken.user?.user_id ||
          decodedToken.data?.user_id ||
          decodedToken.data?.id ||
          decodedToken.payload?.user_id ||
          decodedToken.payload?.id;

        if (userId) {
          return typeof userId === "number" ? userId : parseInt(userId);
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user_id:", error);
    return null;
  }
};

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
