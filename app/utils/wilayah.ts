// app/utils/wilayah.ts
import api from "./api";

export const fetchProvinces = async () => {
  try {
    const response = await api.get("/api/v1/wilayah/provinces");
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

////////////////////////////////////////////////////
// Fungsi untuk fetch regencies berdasarkan provinsi (WAJIB kirim provinceCode)
export const fetchRegencies = async (provinceCode: string) => {
  if (!provinceCode) {
    throw {
      type: "validation",
      message: "Kode provinsi wajib diisi",
    };
  }

  try {
    const response = await api.get(`/api/v1/wilayah/regencies/${provinceCode}`);
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

////////////////////////////////////////////////////
export const fetchDistricts = async (regencyCode: string) => {
  if (!regencyCode) {
    throw {
      type: "validation",
      message: "Kode kabupaten wajib diisi",
    };
  }

  try {
    const response = await api.get(`/api/v1/wilayah/districts/${regencyCode}`);
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

////////////////////////////////////////////////////
export const fetchVillages = async (districtCode: string) => {
  if (!districtCode) {
    throw {
      type: "validation",
      message: "Kode kecamatan wajib diisi",
    };
  }

  try {
    const response = await api.get(`/api/v1/wilayah/villages/${districtCode}`);
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

////////////////////////////////////////////////////
export const fetchValidate = async (villageCode: string) => {
  if (!villageCode) {
    throw {
      type: "validation",
      message: "Kode desa wajib diisi",
    };
  }

  try {
    const response = await api.get(`/api/v1/wilayah/validate/${villageCode}`);
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
