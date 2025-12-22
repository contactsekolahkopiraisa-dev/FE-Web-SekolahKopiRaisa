import api from "./api";

// Get User Profile
export const getProfile = async () => {
  try {
    const res = await api.get("/api/v1/auth/umkm", {
      headers: { "Cache-Control": "no-store" }
    });
    return res.data.data;
  } catch (error: any) {
    console.error("Gagal mendapatkan profil:", error);

    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server."
    };
  }
};

// Get User Profile by ID
export const getProfileById = async (idUmkm: number) => {
  try {
    const res = await api.get(`/api/v1/auth/umkm/${idUmkm}`, {
      headers: { "Cache-Control": "no-store" }
    });
    return res.data.data;
  } catch (error: any) {
    console.error("Gagal mendapatkan profil by ID:", error);

    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server."
    };
  }
};

// Update User Profile
export const updateProfile = async (formData: {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  namaUmkm?: string;
  ktp?: string;
  addresses?: string; // JSON string format
  sertifikatHalal?: File[];
  media?: File | null;
}) => {
  try {
    const data = new FormData();

    // Append data user
    if (formData.name) data.append("name", formData.name);
    if (formData.email) data.append("email", formData.email);
    if (formData.phone_number)
      data.append("phone_number", formData.phone_number);
    if (formData.password) data.append("password", formData.password);

    // Append data UMKM
    if (formData.namaUmkm) data.append("namaUmkm", formData.namaUmkm);
    if (formData.ktp) data.append("ktp", formData.ktp);
    if (formData.addresses) data.append("addresses", formData.addresses);

    // Append file foto profil
    if (formData.media) {
      data.append("media", formData.media);
    }

    // Append multiple sertifikat halal files
    if (formData.sertifikatHalal && formData.sertifikatHalal.length > 0) {
      formData.sertifikatHalal.forEach((file) => {
        data.append("sertifikatHalal", file);
      });
    }

    const res = await api.put("/api/v1/auth/umkm", data, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data;
  } catch (error: any) {
    console.error("Gagal update profil:", error);

    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!"
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server."
    };
  }
};
